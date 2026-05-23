"""
Job sources engine — fetches remote jobs from free APIs and RSS feeds.
All sources return a normalized list of job dicts.
"""

import re
import json
import time
import hashlib
import logging
from datetime import datetime, timezone

try:
    import requests
except ImportError:
    requests = None

try:
    import feedparser
except ImportError:
    feedparser = None

logger = logging.getLogger(__name__)

# ─── SALARY PARSING ───────────────────────────────────────────────────────────

_SALARY_RE = re.compile(
    r"\$?([\d,]+)k?\s*[-–to]+\s*\$?([\d,]+)k?|\$?([\d,]+)k?\+?",
    re.IGNORECASE
)


def parse_salary(text):
    """Return (min, max) integers in USD/year or (None, None)."""
    if not text:
        return None, None
    text = text.replace(",", "")
    m = _SALARY_RE.search(text)
    if not m:
        return None, None
    try:
        if m.group(1) and m.group(2):
            lo = float(m.group(1))
            hi = float(m.group(2))
        elif m.group(3):
            lo = hi = float(m.group(3))
        else:
            return None, None
        # Convert K notation
        if "k" in text.lower():
            lo *= 1000
            hi *= 1000
        # Convert hourly to annual (rough)
        if "hour" in text.lower() or "/hr" in text.lower():
            lo *= 2080
            hi *= 2080
        return int(lo), int(hi)
    except Exception:
        return None, None


def _make_id(url):
    return hashlib.md5(url.encode()).hexdigest()[:16]


def _get(url, timeout=15, headers=None):
    if not requests:
        raise RuntimeError("requests not installed")
    h = {"User-Agent": "Mozilla/5.0 (compatible; KahnJobBot/1.0)"}
    if headers:
        h.update(headers)
    resp = requests.get(url, headers=h, timeout=timeout)
    resp.raise_for_status()
    return resp


# ─── REMOTEOK ─────────────────────────────────────────────────────────────────

def fetch_remoteok():
    """Returns list of normalized job dicts from RemoteOK."""
    jobs = []
    try:
        resp = _get("https://remoteok.com/api", headers={"Accept": "application/json"})
        data = resp.json()
        # First element is a legal notice dict
        for item in data[1:]:
            if not isinstance(item, dict):
                continue
            tags = item.get("tags", [])
            salary_raw = ""
            sal_min = item.get("salary_min")
            sal_max = item.get("salary_max")
            if sal_min:
                salary_raw = f"${sal_min:,} - ${sal_max:,}" if sal_max else f"${sal_min:,}+"
            jobs.append({
                "source": "RemoteOK",
                "external_id": str(item.get("id", "")),
                "title": item.get("position", ""),
                "company": item.get("company", ""),
                "url": item.get("url", ""),
                "description": item.get("description", ""),
                "salary_raw": salary_raw,
                "salary_min": sal_min,
                "salary_max": sal_max,
                "tags": tags,
                "location": "Remote",
                "posted_date": item.get("date", ""),
            })
    except Exception as e:
        logger.error(f"RemoteOK fetch failed: {e}")
    return jobs


# ─── REMOTIVE ─────────────────────────────────────────────────────────────────

_REMOTIVE_CATEGORIES = [
    "software-dev",
    "product",
    "sales",
    "business-exec",
    "management-finance",
    "customer-service",
    "data",
]


def fetch_remotive():
    jobs = []
    seen = set()
    for cat in _REMOTIVE_CATEGORIES:
        try:
            resp = _get(f"https://remotive.com/api/remote-jobs?category={cat}&limit=50")
            data = resp.json()
            for item in data.get("jobs", []):
                url = item.get("url", "")
                if url in seen:
                    continue
                seen.add(url)
                sal_raw = item.get("salary", "")
                sal_min, sal_max = parse_salary(sal_raw)
                jobs.append({
                    "source": "Remotive",
                    "external_id": str(item.get("id", "")),
                    "title": item.get("title", ""),
                    "company": item.get("company_name", ""),
                    "url": url,
                    "description": item.get("description", ""),
                    "salary_raw": sal_raw,
                    "salary_min": sal_min,
                    "salary_max": sal_max,
                    "tags": item.get("tags", []),
                    "location": item.get("candidate_required_location", "Worldwide"),
                    "posted_date": item.get("publication_date", ""),
                })
            time.sleep(0.3)
        except Exception as e:
            logger.error(f"Remotive/{cat} fetch failed: {e}")
    return jobs


# ─── JOBICY ───────────────────────────────────────────────────────────────────

def fetch_jobicy():
    jobs = []
    try:
        resp = _get("https://jobicy.com/api/v2/remote-jobs?count=50&geo=worldwide&industry=it")
        data = resp.json()
        for item in data.get("jobs", []):
            sal_raw = item.get("jobSalary", "")
            sal_min, sal_max = parse_salary(sal_raw)
            tags = item.get("jobIndustry", [])
            if isinstance(tags, str):
                tags = [tags]
            jobs.append({
                "source": "Jobicy",
                "external_id": str(item.get("id", "")),
                "title": item.get("jobTitle", ""),
                "company": item.get("companyName", ""),
                "url": item.get("url", ""),
                "description": item.get("jobDescription", ""),
                "salary_raw": sal_raw,
                "salary_min": sal_min,
                "salary_max": sal_max,
                "tags": tags,
                "location": item.get("jobGeo", "Remote"),
                "posted_date": item.get("pubDate", ""),
            })
    except Exception as e:
        logger.error(f"Jobicy fetch failed: {e}")
    return jobs


# ─── WE WORK REMOTELY ─────────────────────────────────────────────────────────

_WWR_FEEDS = [
    ("https://weworkremotely.com/categories/remote-management-and-finance-jobs.rss", "Management/Finance"),
    ("https://weworkremotely.com/categories/remote-sales-and-marketing-jobs.rss", "Sales/Marketing"),
    ("https://weworkremotely.com/categories/remote-product-jobs.rss", "Product"),
    ("https://weworkremotely.com/categories/remote-devops-sysadmin-jobs.rss", "DevOps"),
    ("https://weworkremotely.com/categories/remote-full-stack-programming-jobs.rss", "Full-Stack"),
]


def _parse_feed_with_timeout(url, timeout=8):
    """Fetch RSS/Atom feed using requests (with timeout) then parse with feedparser."""
    resp = _get(url, timeout=timeout)
    return feedparser.parse(resp.content)


def fetch_weworkremotely():
    if not feedparser:
        logger.warning("feedparser not installed — skipping WWR")
        return []
    jobs = []
    seen = set()
    for feed_url, category in _WWR_FEEDS:
        try:
            feed = _parse_feed_with_timeout(feed_url)
            for entry in feed.entries:
                url = entry.get("link", "")
                if not url or url in seen:
                    continue
                seen.add(url)
                title = entry.get("title", "")
                # WWR titles often: "Company: Job Title"
                parts = title.split(":", 1)
                company = parts[0].strip() if len(parts) > 1 else ""
                job_title = parts[1].strip() if len(parts) > 1 else title
                desc = entry.get("summary", "")
                jobs.append({
                    "source": "WeWorkRemotely",
                    "external_id": _make_id(url),
                    "title": job_title,
                    "company": company,
                    "url": url,
                    "description": desc,
                    "salary_raw": "",
                    "salary_min": None,
                    "salary_max": None,
                    "tags": [category],
                    "location": "Remote",
                    "posted_date": entry.get("published", ""),
                })
            time.sleep(0.2)
        except Exception as e:
            logger.error(f"WWR/{category} fetch failed: {e}")
    return jobs


# ─── REMOTE.CO ────────────────────────────────────────────────────────────────

_REMOTECO_FEEDS = [
    "https://remote.co/remote-jobs/executive/feed/",
    "https://remote.co/remote-jobs/project-management/feed/",
    "https://remote.co/remote-jobs/sales/feed/",
    "https://remote.co/remote-jobs/business-development/feed/",
    "https://remote.co/remote-jobs/consulting/feed/",
]


def fetch_remoteco():
    if not feedparser:
        return []
    jobs = []
    seen = set()
    for feed_url in _REMOTECO_FEEDS:
        try:
            feed = _parse_feed_with_timeout(feed_url)
            for entry in feed.entries:
                url = entry.get("link", "")
                if not url or url in seen:
                    continue
                seen.add(url)
                jobs.append({
                    "source": "Remote.co",
                    "external_id": _make_id(url),
                    "title": entry.get("title", ""),
                    "company": entry.get("author", ""),
                    "url": url,
                    "description": entry.get("summary", ""),
                    "salary_raw": "",
                    "salary_min": None,
                    "salary_max": None,
                    "tags": [],
                    "location": "Remote",
                    "posted_date": entry.get("published", ""),
                })
            time.sleep(0.2)
        except Exception as e:
            logger.error(f"Remote.co feed failed: {e}")
    return jobs


# ─── MAIN FETCH ───────────────────────────────────────────────────────────────

ALL_SOURCES = {
    "remoteok": fetch_remoteok,
    "remotive": fetch_remotive,
    "jobicy": fetch_jobicy,
    "weworkremotely": fetch_weworkremotely,
    "remoteco": fetch_remoteco,
}


DEFAULT_SOURCES = ["remoteok", "remotive", "jobicy", "weworkremotely"]


def fetch_all(enabled_sources=None):
    """
    Fetch from all enabled sources. Returns list of job dicts.
    enabled_sources: list of source keys, or None for defaults.
    """
    if enabled_sources is None:
        enabled_sources = DEFAULT_SOURCES

    results = []
    for key in enabled_sources:
        fetcher = ALL_SOURCES.get(key)
        if fetcher:
            logger.info(f"Fetching from {key}...")
            batch = fetcher()
            logger.info(f"  -> {len(batch)} jobs from {key}")
            results.extend(batch)
        time.sleep(0.5)

    # Deduplicate by URL
    seen_urls = set()
    unique = []
    for job in results:
        url = job.get("url", "")
        if url and url not in seen_urls:
            seen_urls.add(url)
            unique.append(job)

    return unique
