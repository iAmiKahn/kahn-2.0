"""
Scheduler — background QThread running the full search/score/generate pipeline.
Revision 2: pre-screen gate, deduplication, salary parsing.
"""

import json
import logging
import time
from datetime import datetime

from PySide6.QtCore import QThread, Signal

from engine import database as db
from engine import job_sources
from engine import ai_engine

logger = logging.getLogger(__name__)


class SearchWorker(QThread):
    log_signal    = Signal(str, str)   # (message, level)
    stats_updated = Signal()
    run_complete  = Signal(dict)

    def __init__(self, enabled_sources, score_threshold, parent=None):
        super().__init__(parent)
        self.enabled_sources = enabled_sources
        self.score_threshold = score_threshold

    def log(self, msg, level="info"):
        db.log(msg, level=level, category="search")
        self.log_signal.emit(msg, level)
        level_int = logging.getLevelName(level.upper())
        if not isinstance(level_int, int):
            level_int = logging.INFO
        logger.log(level_int, msg)

    def run(self):
        summary = {
            "started": datetime.utcnow().isoformat(),
            "jobs_fetched": 0,
            "jobs_new": 0,
            "jobs_scored": 0,
            "apps_generated": 0,
            "apps_prescreened_out": 0,
            "apps_deduped": 0,
            "errors": [],
        }

        self.log("Search run started")
        run_id = db.start_search_run("all")

        # ── FETCH ──────────────────────────────────────────────────────────
        try:
            self.log("Fetching jobs from sources...")
            raw_jobs = job_sources.fetch_all(self.enabled_sources)
            summary["jobs_fetched"] = len(raw_jobs)
            self.log(f"Fetched {len(raw_jobs)} total listings")
        except Exception as e:
            msg = f"Fetch error: {e}"
            self.log(msg, "error")
            summary["errors"].append(msg)
            db.finish_search_run(run_id, 0, 0, 0, str(e))
            self.run_complete.emit(summary)
            return

        # ── STORE NEW JOBS with salary parsing ─────────────────────────────
        new_jobs = []
        for job in raw_jobs:
            if not job.get("url") or not job.get("title"):
                continue

            # Improvement 1: parse salary from description if not in structured field
            sal_min = job.get("salary_min")
            sal_max = job.get("salary_max")
            sal_display = job.get("salary_parsed")
            if not sal_max and job.get("description"):
                p_min, p_max, p_display = ai_engine.extract_salary_from_text(job["description"])
                if p_max:
                    sal_min = p_min
                    sal_max = p_max
                    sal_display = p_display

            job_id, is_new = db.insert_job(
                source=job["source"],
                external_id=job.get("external_id", ""),
                title=job["title"],
                company=job.get("company", ""),
                url=job["url"],
                description=job.get("description", ""),
                salary_raw=job.get("salary_raw", ""),
                salary_min=sal_min,
                salary_max=sal_max,
                tags=job.get("tags", []),
                location=job.get("location", "Remote"),
                posted_date=job.get("posted_date", ""),
                salary_parsed=sal_display,
            )
            if is_new and job_id:
                job["_db_id"] = job_id
                job["salary_min"] = sal_min
                job["salary_max"] = sal_max
                new_jobs.append(job)

        summary["jobs_new"] = len(new_jobs)
        self.log(f"{len(new_jobs)} new jobs added to database")
        self.stats_updated.emit()

        # Pick up any previously-unscored jobs from interrupted runs
        unscored = db.get_jobs(status="new", limit=500)
        for uj in unscored:
            if not any(j.get("_db_id") == uj["id"] for j in new_jobs):
                uj["_db_id"] = uj["id"]
                new_jobs.append(uj)

        if not new_jobs:
            self.log("No new jobs to score — run complete")
            db.finish_search_run(run_id, len(raw_jobs), 0, 0)
            self.run_complete.emit(summary)
            return

        catchup = len(new_jobs) - summary["jobs_new"]
        if catchup > 0:
            self.log(f"Catching up: {catchup} previously-unscored jobs queued")

        # ── SCORE ──────────────────────────────────────────────────────────
        ollama_up = ai_engine.check_ollama()
        if not ollama_up:
            self.log("Ollama not running — using rule-based scoring (free fallback)", "warning")
        else:
            self.log(f"Scoring {len(new_jobs)} jobs with local AI...")

        def score_log(msg, level="info"):
            self.log(msg, level)

        high_value_raw = []
        scored_count = 0
        for job, score, notes in ai_engine.batch_score_jobs(new_jobs, log_callback=score_log):
            job_id = job.get("_db_id")
            if job_id:
                # Also parse salary from description during scoring if not already done
                sal_parsed = None
                if not job.get("salary_max") and job.get("description"):
                    _, _, sal_display = ai_engine.extract_salary_from_text(job["description"])
                    sal_parsed = sal_display
                db.update_job_score(job_id, score, notes, salary_parsed=sal_parsed)
                scored_count += 1
                if score >= self.score_threshold:
                    high_value_raw.append((job, score, job_id))
                self.stats_updated.emit()

        summary["jobs_scored"] = scored_count
        self.log(f"Scored {scored_count} jobs — {len(high_value_raw)} above threshold ({self.score_threshold})")

        # ── DEDUPLICATION: same company+similar title ───────────────────────
        # Improvement 6: group by company, keep only highest-scoring per company
        company_map = {}
        for job, score, job_id in high_value_raw:
            company = (job.get("company") or "").lower().strip()
            if company not in company_map:
                company_map[company] = []
            company_map[company].append((job, score, job_id))

        high_value = []
        deduped_count = 0
        for company, entries in company_map.items():
            if len(entries) == 1:
                high_value.extend(entries)
            else:
                # Keep top scorer, skip rest
                entries_sorted = sorted(entries, key=lambda x: -x[1])
                high_value.append(entries_sorted[0])
                deduped_count += len(entries) - 1
                skipped_titles = [e[0].get("title","") for e in entries_sorted[1:]]
                self.log(f"Deduped {company}: kept top, skipped {skipped_titles}")

        if deduped_count:
            self.log(f"Deduplication removed {deduped_count} duplicate company entries")
        summary["apps_deduped"] = deduped_count

        # ── PRE-SCREEN + GENERATE APPLICATIONS ────────────────────────────
        if high_value and ollama_up:
            self.log(f"Pre-screening + generating applications for {len(high_value)} jobs...")
            for job, score, job_id in high_value:
                title = job.get("title", "")
                company_name = job.get("company", "")
                description = job.get("description", "")

                # Pre-screen full description before committing to generation
                try:
                    passes, reason = ai_engine.prescreen_job(title, description)
                    if not passes:
                        self.log(f"Pre-screen failed: {title} @ {company_name} — {reason}", "warning")
                        summary["apps_prescreened_out"] += 1
                        continue
                except Exception as e:
                    self.log(f"Pre-screen error for {title}: {e} — proceeding", "warning")

                try:
                    app_data = ai_engine.generate_application(
                        title=title,
                        company=company_name,
                        salary=job.get("salary_raw", ""),
                        description=description,
                        log_callback=score_log,
                    )
                    talking_points = app_data.get("talking_points", [])
                    db.insert_application(
                        job_id=job_id,
                        cover_letter=app_data.get("cover_letter", ""),
                        resume_summary=app_data.get("resume_summary", ""),
                        talking_points=json.dumps(talking_points),
                    )
                    summary["apps_generated"] += 1
                    self.log(
                        f"Application ready: {title} @ {company_name} (score: {score})",
                        "success"
                    )
                    self.stats_updated.emit()
                except Exception as e:
                    msg = f"App gen error for {title}: {e}"
                    self.log(msg, "error")
                    summary["errors"].append(msg)

        elif high_value and not ollama_up:
            self.log(
                f"{len(high_value)} high-value jobs found — start Ollama to generate applications",
                "warning"
            )

        db.finish_search_run(
            run_id,
            summary["jobs_fetched"],
            summary["jobs_new"],
            summary["jobs_scored"],
        )

        prescreened_msg = f" | Pre-screened out: {summary['apps_prescreened_out']}" if summary["apps_prescreened_out"] else ""
        deduped_msg = f" | Deduped: {summary['apps_deduped']}" if summary["apps_deduped"] else ""
        self.log(
            f"Run complete. New: {summary['jobs_new']} | Scored: {summary['jobs_scored']} | "
            f"Apps: {summary['apps_generated']}{prescreened_msg}{deduped_msg}"
        )
        self.run_complete.emit(summary)


class SchedulerEngine(QThread):
    log_signal     = Signal(str, str)
    stats_updated  = Signal()
    run_started    = Signal()
    run_complete   = Signal(dict)
    status_changed = Signal(str)      # "running" | "waiting" | "paused" | "no_ollama"

    def __init__(self, parent=None):
        super().__init__(parent)
        self._running = True
        self._paused = False
        self._current_worker = None
        self._next_run_at = None

    def stop(self):
        self._running = False
        if self._current_worker:
            self._current_worker.quit()

    def pause(self):
        self._paused = True
        self.status_changed.emit("paused")

    def resume(self):
        self._paused = False
        self.status_changed.emit("waiting")

    def trigger_now(self):
        self._next_run_at = 0

    def next_run_at(self):
        return self._next_run_at

    def run(self):
        self.status_changed.emit("waiting")
        while self._running:
            if self._paused:
                time.sleep(5)
                continue

            interval_hours = db.get_config("search_interval_hours", 2)
            interval_secs = int(float(interval_hours) * 3600)
            enabled_sources = db.get_config("enabled_sources", job_sources.DEFAULT_SOURCES)
            score_threshold = db.get_config("score_threshold", 70)

            self._next_run_at = None
            self.status_changed.emit("running")
            self.run_started.emit()

            worker = SearchWorker(enabled_sources, score_threshold)
            worker.log_signal.connect(self.log_signal)
            worker.stats_updated.connect(self.stats_updated)
            worker.run_complete.connect(self._on_worker_complete)
            self._current_worker = worker

            worker.start()
            worker.wait()

            self._current_worker = None
            self._next_run_at = time.time() + interval_secs
            self.status_changed.emit("waiting")

            while self._running and time.time() < self._next_run_at:
                if self._paused:
                    break
                if self._next_run_at == 0:
                    break
                time.sleep(1)

    def _on_worker_complete(self, summary):
        self.run_complete.emit(summary)
