"""
AI Engine — Ollama-powered job scoring and application generation.
Uses local models via Ollama (http://localhost:11434) — zero API cost.

Scoring:    gemma3:4b   (fast, ~2s per job)
Generation: gpt-oss:20b (quality cover letters, ~90s each)

Revision 2: AI-executable roles, minimal-interaction model, tone calibration.
"""

import json
import logging
import re
from datetime import datetime

import requests

logger = logging.getLogger(__name__)

OLLAMA_BASE = "http://localhost:11434/v1"
SCORE_MODEL    = "gemma3:4b"
GENERATE_MODEL = "gpt-oss:20b"

# ─── DAN'S PROFILE ────────────────────────────────────────────────────────────

DAN_PROFILE = """
Name: Daniel Aaron Kahn
Location: Lake in the Hills, IL (Chicago area) — REMOTE ONLY
Contact: (847) 920-8141 | DanielAaronKahn83@gmail.com

PROFESSIONAL BACKGROUND:
20+ years across real estate technology, operations, AI automation, and security.

SuprAgnt / Compass North Group — Director of Operations & Infrastructure (2022–2026)
- Engineered AI-assisted lead generation to conversion automation for digital-first brokerage
- Built multi-channel workflows: ringless voicemail, VoIP routing, SMS/email nurture, AI qualification
- Produced all documentation, SOPs, training materials, workflow specs for the platform
- Wrote operational reports, agent communications, marketing copy, and system documentation

Keller Williams Success Realty — Team Founder / CTO / President (2018–2022)
- Co-architected KW Command (global CRM) with Gary Keller and development teams
- Led worldwide rollout — wrote training materials, documentation, and communications for 1000s of agents
- Produced all internal reports, compliance documentation, operational analysis
- Drove brokerage to 450+ agents through written recruiting communications and strategic content
- Authored all agent-facing training content, onboarding materials, and operational guides

Real Estate Broker — Re/Max, American Realty Pros (2011–2018)
- Built marketing funnels from scratch including all written copy and content
- Produced listing descriptions, client communications, marketing materials

Security & Operations (2005–2011)
- Loss Prevention Manager, Director of Security, Executive Protection
- Wrote incident reports, investigation documentation, compliance reports, operational procedures

CORE STRENGTHS FOR AI-EXECUTABLE ROLES:
- Produces high-quality written deliverables: reports, documentation, analysis, proposals, copy
- Researches, synthesizes, and structures information clearly and quickly
- Builds systems and workflows that run with minimal ongoing human involvement
- Communicates complex ideas in plain language
- Deeply familiar with AI tools as productivity multipliers

TARGET COMPENSATION: $60K minimum / $80K–$120K+ ideal
WORK STYLE: Remote-only, output-based, minimal synchronous meetings
"""

# ─── CORE FUNCTIONS ───────────────────────────────────────────────────────────

def _ollama_chat(model, messages, max_tokens=1024, temperature=0.3, timeout=300):
    """Call Ollama's OpenAI-compatible chat endpoint."""
    payload = {
        "model": model,
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "stream": False,
    }
    resp = requests.post(
        f"{OLLAMA_BASE}/chat/completions",
        json=payload,
        timeout=timeout,
    )
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]


def _clean_json(text):
    """Extract JSON from model response — handles markdown fences and preamble."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"\s*```\s*$", "", text, flags=re.MULTILINE)
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        text = text[start:end+1]
    return text.strip()


def _safe_json_parse(cleaned):
    """Parse JSON with recovery for truncation."""
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        recovered = cleaned.rstrip()
        if not recovered.endswith("}"):
            recovered = re.sub(r',\s*"[^"]*$', "", recovered)
            recovered = re.sub(r':\s*"[^"]*$', ': ""', recovered)
            if not recovered.endswith("}"):
                recovered = recovered.rstrip(",") + "}"
        return json.loads(recovered)


def check_ollama():
    """Returns True if Ollama is reachable."""
    try:
        return requests.get("http://localhost:11434/api/tags", timeout=3).status_code == 200
    except Exception:
        return False


# ─── SALARY EXTRACTION ────────────────────────────────────────────────────────

_SAL_PATTERN = re.compile(
    r'\$\s*([\d,]+)\s*[kK]?\s*(?:[-–to]+\s*\$?\s*([\d,]+)\s*[kK]?)?'
    r'|(\d{2,3})[kK]\s*[-–to]+\s*(\d{2,3})[kK]'
    r'|(\d{2,3})[kK]\+?',
    re.IGNORECASE
)

def extract_salary_from_text(text):
    """
    Parse salary range from free-form text (job description).
    Returns (salary_min, salary_max, salary_display) or (None, None, None).
    """
    if not text:
        return None, None, None
    text_clean = re.sub(r'<[^>]+>', ' ', text)

    matches = _SAL_PATTERN.findall(text_clean)
    amounts = []
    for m in matches:
        for val in m:
            if val:
                v = val.replace(',', '').lower().replace('k', '')
                try:
                    n = float(v)
                    # Annualize if clearly hourly (< 500)
                    if n < 500:
                        n = n * 1000
                    amounts.append(int(n))
                except ValueError:
                    pass

    # Filter out noise (years like 2024, small numbers)
    amounts = [a for a in amounts if 30000 <= a <= 1000000]
    if not amounts:
        return None, None, None

    sal_min = min(amounts)
    sal_max = max(amounts)
    if sal_min == sal_max:
        display = f"${sal_max:,}"
    else:
        display = f"${sal_min:,} – ${sal_max:,}"
    return sal_min, sal_max, display


# ─── JOB SCORING ──────────────────────────────────────────────────────────────

SCORE_SYSTEM = f"""You are a remote job screener matching listings to a specific candidate.
Score each job 0-100 on realistic fit. Return ONLY valid JSON — no markdown, no explanation.

CANDIDATE PROFILE:
{DAN_PROFILE}

SCORING RULES — CRITICAL:

HIGH SCORE (70–100) — target roles where AI handles daily execution:
- Technical writer / senior technical writer / documentation specialist
- Content strategist / content manager (writing and strategy, not social media)
- Research analyst / senior research analyst / market research
- Business analyst / operations analyst (analysis and reporting focus)
- Data analyst (reporting and insight delivery — NOT data engineering)
- Proposal writer / grant writer / RFP specialist
- Copywriter / senior copywriter / UX writer
- Instructional designer / learning content developer
- AI prompt engineer / AI content specialist / AI workflow specialist
- Knowledge management specialist / knowledge base manager
- Marketing analyst / SEO strategist (analysis and written output)
- Workflow automation specialist / process automation analyst
- Project coordinator (execution-focused deliverables, NOT people management)
- Any role where the PRIMARY daily deliverable is: writing, research, analysis, documentation,
  reports, proposals, or structured content production
- Roles that explicitly mention AI tools in daily work

MEDIUM SCORE (40–69) — roles with some fit but concerns:
- Operations manager roles (only if clearly low-interaction, output-based)
- Sales/account management (only if email/async-heavy, not phone-call intensive)

LOW SCORE (0–39) — automatic disqualifiers:
- People management or team leadership as the primary function
- Executive, C-suite, VP, Director-level roles (high accountability, high meetings)
- Software engineer, DevOps, data scientist, ML engineer (any IC engineering role)
- Customer success or support requiring frequent calls
- Roles where presence, judgment, and relationship management IS the deliverable
- Any role requiring formal engineering/CS degree
- High-interaction roles: daily standups, constant meetings, managing direct reports

INCOME SENSITIVITY:
- Roles with salary $80K+: bonus +10
- Roles with salary $50K–$79K: neutral
- Roles with salary under $40K or clearly minimum wage: score maximum 20
- No salary listed: score normally, note income uncertainty

REMOTE: Non-remote or unclear = score maximum 15."""

SCORE_USER_TEMPLATE = """Score this job. Return ONLY valid JSON, nothing else.

TITLE: {title}
COMPANY: {company}
SALARY: {salary}
TAGS: {tags}
DESCRIPTION: {description}

Return exactly:
{{"score": <0-100>, "fit_summary": "<2 sentences>", "income_potential": "<low|medium|high|very_high>", "interaction_level": "<low|medium|high>", "ai_amplifiable": <true|false>, "daily_output_type": "<writing|analysis|research|mixed|people_management|engineering|other>", "red_flags": ["<flag>"], "green_flags": ["<flag>"]}}

85-100=apply immediately | 70-84=strong | 50-69=marginal | 30-49=weak | 0-29=skip"""


def score_job(title, company, salary, tags, description):
    """Score a single job. Returns (score, notes_json_str)."""
    tags_str = ", ".join(tags) if isinstance(tags, list) else str(tags or "")
    # Use more description for better scoring accuracy
    desc_truncated = (description or "")[:800]

    prompt = SCORE_USER_TEMPLATE.format(
        title=title, company=company,
        salary=salary or "Not listed",
        tags=tags_str, description=desc_truncated,
    )
    try:
        raw = _ollama_chat(
            SCORE_MODEL,
            [{"role": "system", "content": SCORE_SYSTEM},
             {"role": "user", "content": prompt}],
            max_tokens=400, temperature=0.1,
        )
        data = _safe_json_parse(_clean_json(raw))
        score = max(0, min(100, int(data.get("score", 0))))
        notes = json.dumps({
            "fit_summary": data.get("fit_summary", ""),
            "income_potential": data.get("income_potential", ""),
            "interaction_level": data.get("interaction_level", ""),
            "ai_amplifiable": data.get("ai_amplifiable", False),
            "daily_output_type": data.get("daily_output_type", "other"),
            "red_flags": data.get("red_flags", []),
            "green_flags": data.get("green_flags", []),
        })
        return score, notes
    except Exception as e:
        logger.error(f"Score failed for '{title}': {e}")
        return _rule_based_score(title, salary, tags), json.dumps({"error": str(e), "fit_summary": "Rule-based fallback"})


def _rule_based_score(title, salary, tags):
    """Keyword-based scoring fallback if Ollama is unavailable."""
    score = 20
    t = title.lower()
    tags_lower = [x.lower() for x in (tags if isinstance(tags, list) else [])]
    all_text = t + " " + " ".join(tags_lower)

    # Hard disqualifiers
    disqualify = [
        "software engineer", "software developer", "backend engineer", "frontend engineer",
        "full stack", "devops", "site reliability", "data scientist", "ml engineer",
        "machine learning", "mobile developer", "ios developer", "android developer",
        "chief", "coo", "cto", "vp of", "vice president", "director of",
        "head of", "manager of", "people manager", "team lead", "team manager",
    ]
    for kw in disqualify:
        if kw in all_text:
            return 10

    # Target role keywords
    target = [
        "technical writer", "content strategist", "research analyst", "business analyst",
        "data analyst", "proposal writer", "grant writer", "copywriter", "ux writer",
        "instructional designer", "prompt engineer", "ai content", "ai specialist",
        "knowledge management", "documentation", "seo strategist", "marketing analyst",
        "workflow automation", "process analyst", "operations analyst",
    ]
    for kw in target:
        if kw in all_text:
            score += 25

    seniority = ["senior", "lead", "principal", "staff", "specialist", "expert"]
    for kw in seniority:
        if kw in all_text:
            score += 8

    low_tier = ["junior", "intern", "entry level", "associate", "jr."]
    for kw in low_tier:
        if kw in all_text:
            score -= 20

    if salary:
        s = salary.lower()
        if any(x in s for x in ["100", "110", "120", "130", "140", "150"]):
            score += 15
        elif any(x in s for x in ["70", "80", "90"]):
            score += 8
        elif any(x in s for x in ["30", "35", "40"]):
            score -= 15

    return max(0, min(100, score))


# ─── PRE-SCREEN QUALITY GATE ──────────────────────────────────────────────────

PRESCREEN_SYSTEM = """You are a job pre-screener. Given a full job description, quickly determine if this role is a hard disqualifier for the candidate.

The candidate CANNOT do:
- Manage direct reports as primary function
- Attend daily standups or frequent synchronous meetings as core requirement
- Write production code as an IC software engineer
- Roles requiring CS/engineering degree
- Executive/C-suite roles (VP, Director, Head of, COO, CTO)
- Customer-facing phone support or account management requiring frequent calls

The candidate CAN do:
- Produce written deliverables: reports, documentation, analysis, content, proposals
- Research and synthesize information
- Work asynchronously with minimal meetings
- Use AI tools to complete work efficiently

Return ONLY: {"pass": true, "reason": "brief reason"} or {"pass": false, "reason": "specific disqualifier found"}"""

PRESCREEN_USER = """Does this job description pass the pre-screen for our candidate?

TITLE: {title}
DESCRIPTION: {description}

Return ONLY valid JSON: {{"pass": true/false, "reason": "<brief>"}}"""


def prescreen_job(title, description):
    """
    Fast pre-screen of full description before committing to application generation.
    Returns (pass: bool, reason: str).
    """
    if not check_ollama():
        return True, "Ollama unavailable — skipping prescreen"

    prompt = PRESCREEN_USER.format(
        title=title,
        description=(description or "")[:1200],
    )
    try:
        raw = _ollama_chat(
            SCORE_MODEL,
            [{"role": "system", "content": PRESCREEN_SYSTEM},
             {"role": "user", "content": prompt}],
            max_tokens=80, temperature=0.0,
        )
        data = _safe_json_parse(_clean_json(raw))
        return bool(data.get("pass", True)), data.get("reason", "")
    except Exception as e:
        logger.warning(f"Prescreen failed for '{title}', defaulting pass: {e}")
        return True, f"Prescreen error: {e}"


# ─── BATCH SCORING ────────────────────────────────────────────────────────────

# Title-level pre-filter — saves Ollama calls entirely for obvious mismatches
SKIP_TITLE_KEYWORDS = [
    "intern", "junior", "jr.", "entry level", "entry-level",
    # IC engineering
    "software engineer", "software developer", "backend engineer",
    "frontend engineer", "full stack engineer", "full-stack engineer",
    "devops engineer", "site reliability", "sre engineer",
    "data scientist", "machine learning engineer", "ml engineer",
    "ios developer", "android developer", "mobile developer",
    "platform engineer", "infrastructure engineer", "data engineer",
    # High-interaction leadership
    "chief executive", "chief operating", "chief financial",
    "vp of sales", "vp of engineering", "vice president",
    # Clearly irrelevant
    "customer support agent", "customer service rep", "data entry",
    "virtual assistant", "nurse", "therapist", "pharmacist",
    "physician", "clinical", "driver", "delivery",
]


def batch_score_jobs(jobs, log_callback=None):
    """
    Score jobs. Yields (job, score, notes) immediately after each result.
    Filters by title first, then scores with Ollama (or fallback).
    """
    ollama_up = check_ollama()
    if not ollama_up and log_callback:
        log_callback("Ollama not reachable — using rule-based scoring", "warning")

    total = len(jobs)
    for i, job in enumerate(jobs):
        title = job.get("title", "")
        company = job.get("company", "")
        title_lower = title.lower()

        if any(kw in title_lower for kw in SKIP_TITLE_KEYWORDS):
            if log_callback:
                log_callback(f"Skipped (pre-filter): {title} @ {company}")
            continue

        if log_callback:
            log_callback(f"Scoring ({i+1}/{total}): {title} @ {company}")

        if ollama_up:
            score, notes = score_job(
                title=title, company=company,
                salary=job.get("salary_raw", ""),
                tags=job.get("tags", []),
                description=job.get("description", ""),
            )
        else:
            score = _rule_based_score(title, job.get("salary_raw", ""), job.get("tags", []))
            notes = json.dumps({"fit_summary": "Rule-based score (Ollama unavailable)", "error": "ollama_down"})

        yield job, score, notes


# ─── APPLICATION GENERATION ───────────────────────────────────────────────────

APP_SYSTEM_TEMPLATE = """You are a professional ghostwriter producing job application materials.
Write in the candidate's authentic voice — not corporate-speak, not generic templates.
Never open with "I am writing to express my interest." Never use buzzword fluff.
Lead with concrete output: what he produced, what he built, what changed.

ACCURACY RULES:
- Do NOT claim he writes code or does hands-on engineering
- DO emphasize: writing SOPs/training/documentation, AI automation, CRM architecture, operational analysis
- Frame his experience around OUTPUT: he produces documents, systems, analyses — not just leadership

VOICE CALIBRATION:
{voice_sample}

CANDIDATE PROFILE:
{profile}"""

APP_USER_TEMPLATE = """Generate a complete application package for this job. Return ONLY valid JSON.

JOB TITLE: {title}
COMPANY: {company}
SALARY: {salary}
DESCRIPTION:
{description}

Return exactly this JSON (no markdown, no extra text):
{{"cover_letter": "<3-4 paragraphs — open with most relevant deliverable or output, close with confidence>", "resume_summary": "<3-4 sentences tailored to this exact role>", "talking_points": ["<concrete output story 1>", "<concrete output story 2>", "<concrete output story 3>", "<concrete output story 4>", "<concrete output story 5>"], "subject_line": "<email subject>", "customization_notes": "<what was emphasized and why>"}}"""


def generate_application(title, company, salary, description, voice_sample=None, log_callback=None):
    """Generate full application package. Returns dict. Requires tone calibration."""
    if log_callback:
        log_callback(f"Generating application: {title} @ {company}")

    if not check_ollama():
        return {
            "cover_letter": "[Ollama not running. Start Ollama to enable generation.]",
            "resume_summary": "", "talking_points": [],
            "subject_line": "", "customization_notes": "Ollama unavailable",
            "generated_at": datetime.utcnow().isoformat(),
        }

    voice_block = ""
    if voice_sample and voice_sample.strip():
        voice_block = f"Write in a voice that matches this sample from the candidate:\n\"{voice_sample.strip()}\""
    else:
        voice_block = "Write in a direct, confident, output-focused voice. No corporate clichés."

    system_prompt = APP_SYSTEM_TEMPLATE.format(
        voice_sample=voice_block,
        profile=DAN_PROFILE,
    )

    prompt = APP_USER_TEMPLATE.format(
        title=title, company=company,
        salary=salary or "Not listed",
        description=(description or "")[:1800],
    )

    try:
        raw = _ollama_chat(
            GENERATE_MODEL,
            [{"role": "system", "content": system_prompt},
             {"role": "user", "content": prompt}],
            max_tokens=4096, temperature=0.4, timeout=300,
        )
        data = _safe_json_parse(_clean_json(raw))
        return {
            "cover_letter": data.get("cover_letter", ""),
            "resume_summary": data.get("resume_summary", ""),
            "talking_points": data.get("talking_points", []),
            "subject_line": data.get("subject_line", ""),
            "customization_notes": data.get("customization_notes", ""),
            "generated_at": datetime.utcnow().isoformat(),
        }
    except Exception as e:
        logger.error(f"Application generation failed for '{title}': {e}")
        return {
            "cover_letter": f"[Generation failed: {e}]",
            "resume_summary": "", "talking_points": [],
            "subject_line": "", "customization_notes": "",
            "generated_at": datetime.utcnow().isoformat(), "error": str(e),
        }
