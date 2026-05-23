"""
Database engine — SQLite schema and CRUD for the Income System.
Revision 2: outcome tracking, reject reasons, parsed salary, tone calibration config.
"""

import sqlite3
import json
import os
from datetime import datetime
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "jobs.db"


def get_connection():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = get_connection()
    c = conn.cursor()

    c.executescript("""
        CREATE TABLE IF NOT EXISTS jobs (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            source          TEXT NOT NULL,
            external_id     TEXT,
            title           TEXT NOT NULL,
            company         TEXT NOT NULL,
            url             TEXT NOT NULL UNIQUE,
            description     TEXT,
            salary_raw      TEXT,
            salary_min      INTEGER,
            salary_max      INTEGER,
            salary_parsed   TEXT,
            tags            TEXT,
            location        TEXT DEFAULT 'Remote',
            posted_date     TEXT,
            found_date      TEXT NOT NULL,
            status          TEXT NOT NULL DEFAULT 'new',
            score           INTEGER DEFAULT 0,
            score_notes     TEXT,
            UNIQUE(url)
        );

        CREATE TABLE IF NOT EXISTS applications (
            id                  INTEGER PRIMARY KEY AUTOINCREMENT,
            job_id              INTEGER NOT NULL REFERENCES jobs(id),
            cover_letter        TEXT,
            cover_letter_orig   TEXT,
            resume_summary      TEXT,
            resume_summary_orig TEXT,
            talking_points      TEXT,
            generated_date      TEXT NOT NULL,
            reviewed_date       TEXT,
            submitted_date      TEXT,
            status              TEXT NOT NULL DEFAULT 'pending_review',
            reject_reason       TEXT,
            outcome             TEXT DEFAULT 'pending',
            outcome_date        TEXT,
            outcome_notes       TEXT,
            dan_notes           TEXT
        );

        CREATE TABLE IF NOT EXISTS search_runs (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            started_at  TEXT NOT NULL,
            finished_at TEXT,
            source      TEXT NOT NULL,
            jobs_found  INTEGER DEFAULT 0,
            jobs_new    INTEGER DEFAULT 0,
            jobs_scored INTEGER DEFAULT 0,
            error       TEXT
        );

        CREATE TABLE IF NOT EXISTS activity_log (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp   TEXT NOT NULL,
            level       TEXT NOT NULL DEFAULT 'info',
            category    TEXT NOT NULL DEFAULT 'system',
            message     TEXT NOT NULL,
            detail      TEXT
        );

        CREATE TABLE IF NOT EXISTS config (
            key     TEXT PRIMARY KEY,
            value   TEXT NOT NULL,
            updated TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
        CREATE INDEX IF NOT EXISTS idx_jobs_score ON jobs(score DESC);
        CREATE INDEX IF NOT EXISTS idx_jobs_found_date ON jobs(found_date DESC);
        CREATE INDEX IF NOT EXISTS idx_jobs_salary_max ON jobs(salary_max DESC);
        CREATE INDEX IF NOT EXISTS idx_activity_timestamp ON activity_log(timestamp DESC);
    """)

    # Migrate existing tables if columns missing (safe ALTER TABLE)
    _migrate(conn)

    conn.commit()
    conn.close()


def _migrate(conn):
    """Add new columns to existing tables if they don't exist yet."""
    existing_app_cols = {r[1] for r in conn.execute("PRAGMA table_info(applications)").fetchall()}
    existing_job_cols = {r[1] for r in conn.execute("PRAGMA table_info(jobs)").fetchall()}

    app_migrations = [
        ("cover_letter_orig",   "TEXT"),
        ("resume_summary_orig", "TEXT"),
        ("reject_reason",       "TEXT"),
        ("outcome",             "TEXT DEFAULT 'pending'"),
        ("outcome_date",        "TEXT"),
        ("outcome_notes",       "TEXT"),
    ]
    for col, typedef in app_migrations:
        if col not in existing_app_cols:
            conn.execute(f"ALTER TABLE applications ADD COLUMN {col} {typedef}")

    job_migrations = [
        ("salary_parsed", "TEXT"),
    ]
    for col, typedef in job_migrations:
        if col not in existing_job_cols:
            conn.execute(f"ALTER TABLE jobs ADD COLUMN {col} {typedef}")


# ─── JOBS ─────────────────────────────────────────────────────────────────────

def insert_job(source, external_id, title, company, url, description,
               salary_raw, salary_min, salary_max, tags, location, posted_date,
               salary_parsed=None):
    """Insert a job. Returns (job_id, is_new)."""
    conn = get_connection()
    try:
        c = conn.cursor()
        c.execute("""
            INSERT OR IGNORE INTO jobs
                (source, external_id, title, company, url, description,
                 salary_raw, salary_min, salary_max, salary_parsed,
                 tags, location, posted_date, found_date)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """, (source, external_id, title, company, url, description,
              salary_raw, salary_min, salary_max, salary_parsed,
              json.dumps(tags) if isinstance(tags, list) else tags,
              location, posted_date, datetime.utcnow().isoformat()))
        conn.commit()
        if c.rowcount > 0:
            return c.lastrowid, True
        else:
            c.execute("SELECT id FROM jobs WHERE url=?", (url,))
            row = c.fetchone()
            return (row["id"] if row else None), False
    finally:
        conn.close()


def update_job_score(job_id, score, score_notes, salary_parsed=None):
    conn = get_connection()
    try:
        if salary_parsed:
            conn.execute(
                "UPDATE jobs SET score=?, score_notes=?, status='scored', salary_parsed=? WHERE id=?",
                (score, score_notes, salary_parsed, job_id)
            )
        else:
            conn.execute(
                "UPDATE jobs SET score=?, score_notes=?, status='scored' WHERE id=?",
                (score, score_notes, job_id)
            )
        conn.commit()
    finally:
        conn.close()


def update_job_status(job_id, status):
    conn = get_connection()
    try:
        conn.execute("UPDATE jobs SET status=? WHERE id=?", (status, job_id))
        conn.commit()
    finally:
        conn.close()


def get_jobs(status=None, min_score=0, limit=500, offset=0):
    """Return jobs sorted: salary_max DESC, then score DESC."""
    conn = get_connection()
    try:
        if status:
            rows = conn.execute("""
                SELECT * FROM jobs WHERE status=? AND score>=?
                ORDER BY COALESCE(salary_max,0) DESC, score DESC, found_date DESC
                LIMIT ? OFFSET ?
            """, (status, min_score, limit, offset)).fetchall()
        else:
            rows = conn.execute("""
                SELECT * FROM jobs WHERE score>=?
                ORDER BY COALESCE(salary_max,0) DESC, score DESC, found_date DESC
                LIMIT ? OFFSET ?
            """, (min_score, limit, offset)).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def get_job(job_id):
    conn = get_connection()
    try:
        row = conn.execute("SELECT * FROM jobs WHERE id=?", (job_id,)).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def get_salary_stats(min_score=70):
    """Return salary range stats for high-scoring jobs."""
    conn = get_connection()
    try:
        row = conn.execute("""
            SELECT
                MIN(salary_min) as abs_min,
                MAX(salary_max) as abs_max,
                AVG(salary_max) as avg_max,
                COUNT(*) as total,
                SUM(CASE WHEN salary_max IS NOT NULL THEN 1 ELSE 0 END) as with_salary
            FROM jobs WHERE score >= ?
        """, (min_score,)).fetchone()
        return dict(row) if row else {}
    finally:
        conn.close()


def get_stats():
    conn = get_connection()
    try:
        total     = conn.execute("SELECT COUNT(*) FROM jobs").fetchone()[0]
        scored    = conn.execute("SELECT COUNT(*) FROM jobs WHERE status='scored'").fetchone()[0]
        queued    = conn.execute("SELECT COUNT(*) FROM applications WHERE status='pending_review'").fetchone()[0]
        approved  = conn.execute("SELECT COUNT(*) FROM applications WHERE status='approved'").fetchone()[0]
        submitted = conn.execute("SELECT COUNT(*) FROM applications WHERE status='submitted'").fetchone()[0]
        high_score = conn.execute("SELECT COUNT(*) FROM jobs WHERE score>=70").fetchone()[0]
        sal_stats = get_salary_stats()
        return {
            "total_jobs": total,
            "scored_jobs": scored,
            "high_score_jobs": high_score,
            "pending_review": queued,
            "approved": approved,
            "submitted": submitted,
            "salary_stats": sal_stats,
        }
    finally:
        conn.close()


# ─── APPLICATIONS ─────────────────────────────────────────────────────────────

def insert_application(job_id, cover_letter, resume_summary, talking_points):
    """Insert application, saving originals for edit-history feature."""
    conn = get_connection()
    try:
        # Check for duplicate (same job already has an app)
        existing = conn.execute(
            "SELECT id FROM applications WHERE job_id=? AND status NOT IN ('rejected')",
            (job_id,)
        ).fetchone()
        if existing:
            return existing["id"]  # Dedup — don't create second app

        c = conn.cursor()
        tp = json.dumps(talking_points) if isinstance(talking_points, list) else talking_points
        c.execute("""
            INSERT INTO applications
                (job_id, cover_letter, cover_letter_orig, resume_summary, resume_summary_orig,
                 talking_points, generated_date)
            VALUES (?,?,?,?,?,?,?)
        """, (job_id, cover_letter, cover_letter, resume_summary, resume_summary,
              tp, datetime.utcnow().isoformat()))
        conn.execute("UPDATE jobs SET status='application_ready' WHERE id=?", (job_id,))
        conn.commit()
        return c.lastrowid
    finally:
        conn.close()


def get_applications(status=None):
    conn = get_connection()
    try:
        order = "ORDER BY COALESCE(j.salary_max,0) DESC, j.score DESC, a.generated_date DESC"
        if status:
            rows = conn.execute(f"""
                SELECT a.*, j.title, j.company, j.url, j.score, j.salary_raw, j.salary_parsed,
                       j.salary_max, j.description, j.score_notes, j.tags
                FROM applications a
                JOIN jobs j ON j.id = a.job_id
                WHERE a.status=? {order}
            """, (status,)).fetchall()
        else:
            rows = conn.execute(f"""
                SELECT a.*, j.title, j.company, j.url, j.score, j.salary_raw, j.salary_parsed,
                       j.salary_max, j.description, j.score_notes, j.tags
                FROM applications a
                JOIN jobs j ON j.id = a.job_id
                {order}
            """).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def get_application(app_id):
    conn = get_connection()
    try:
        row = conn.execute("""
            SELECT a.*, j.title, j.company, j.url, j.score, j.salary_raw, j.salary_parsed,
                   j.salary_max, j.description, j.score_notes, j.tags, j.source, j.location
            FROM applications a
            JOIN jobs j ON j.id = a.job_id
            WHERE a.id=?
        """, (app_id,)).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def approve_application(app_id, dan_notes=None):
    conn = get_connection()
    try:
        conn.execute("""
            UPDATE applications
            SET status='approved', reviewed_date=?, dan_notes=?
            WHERE id=?
        """, (datetime.utcnow().isoformat(), dan_notes, app_id))
        row = conn.execute("SELECT job_id FROM applications WHERE id=?", (app_id,)).fetchone()
        if row:
            conn.execute("UPDATE jobs SET status='approved' WHERE id=?", (row["job_id"],))
        conn.commit()
    finally:
        conn.close()


def reject_application(app_id, reject_reason=None, dan_notes=None):
    """Reject with optional reason for learning feedback loop."""
    conn = get_connection()
    try:
        conn.execute("""
            UPDATE applications
            SET status='rejected', reviewed_date=?, reject_reason=?, dan_notes=?
            WHERE id=?
        """, (datetime.utcnow().isoformat(), reject_reason, dan_notes, app_id))
        row = conn.execute("SELECT job_id FROM applications WHERE id=?", (app_id,)).fetchone()
        if row:
            conn.execute("UPDATE jobs SET status='rejected' WHERE id=?", (row["job_id"],))
        conn.commit()
    finally:
        conn.close()


def record_outcome(app_id, outcome, outcome_notes=None):
    """
    Record post-submission outcome.
    outcome: 'interview_requested' | 'offer_received' | 'declined' | 'ghosted' | 'rejected_by_company'
    """
    conn = get_connection()
    try:
        conn.execute("""
            UPDATE applications
            SET outcome=?, outcome_date=?, outcome_notes=?
            WHERE id=?
        """, (outcome, datetime.utcnow().isoformat(), outcome_notes, app_id))
        conn.commit()
    finally:
        conn.close()


def mark_submitted(app_id):
    conn = get_connection()
    try:
        conn.execute("""
            UPDATE applications
            SET status='submitted', submitted_date=?, outcome='pending'
            WHERE id=?
        """, (datetime.utcnow().isoformat(), app_id))
        row = conn.execute("SELECT job_id FROM applications WHERE id=?", (app_id,)).fetchone()
        if row:
            conn.execute("UPDATE jobs SET status='submitted' WHERE id=?", (row["job_id"],))
        conn.commit()
    finally:
        conn.close()


def update_application_text(app_id, cover_letter=None, resume_summary=None):
    """Update edited text. Originals preserved in *_orig columns."""
    conn = get_connection()
    try:
        if cover_letter is not None:
            conn.execute("UPDATE applications SET cover_letter=? WHERE id=?", (cover_letter, app_id))
        if resume_summary is not None:
            conn.execute("UPDATE applications SET resume_summary=? WHERE id=?", (resume_summary, app_id))
        conn.commit()
    finally:
        conn.close()


def restore_original_application(app_id):
    """Restore cover letter and resume summary to AI-generated originals."""
    conn = get_connection()
    try:
        conn.execute("""
            UPDATE applications
            SET cover_letter=cover_letter_orig, resume_summary=resume_summary_orig
            WHERE id=?
        """, (app_id,))
        conn.commit()
    finally:
        conn.close()


def get_rejection_reasons():
    """Aggregate rejection reasons for learning feedback loop."""
    conn = get_connection()
    try:
        rows = conn.execute("""
            SELECT reject_reason, COUNT(*) as cnt
            FROM applications
            WHERE status='rejected' AND reject_reason IS NOT NULL
            GROUP BY reject_reason
            ORDER BY cnt DESC
        """).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


def get_outcomes():
    """Summary of all post-submission outcomes."""
    conn = get_connection()
    try:
        rows = conn.execute("""
            SELECT a.outcome, COUNT(*) as cnt,
                   GROUP_CONCAT(j.title || ' @ ' || j.company, ' | ') as roles
            FROM applications a
            JOIN jobs j ON j.id = a.job_id
            WHERE a.status = 'submitted'
            GROUP BY a.outcome
        """).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


# ─── SEARCH RUNS ──────────────────────────────────────────────────────────────

def start_search_run(source):
    conn = get_connection()
    try:
        c = conn.cursor()
        c.execute("INSERT INTO search_runs (started_at, source) VALUES (?,?)",
                  (datetime.utcnow().isoformat(), source))
        conn.commit()
        return c.lastrowid
    finally:
        conn.close()


def finish_search_run(run_id, jobs_found, jobs_new, jobs_scored, error=None):
    conn = get_connection()
    try:
        conn.execute("""
            UPDATE search_runs
            SET finished_at=?, jobs_found=?, jobs_new=?, jobs_scored=?, error=?
            WHERE id=?
        """, (datetime.utcnow().isoformat(), jobs_found, jobs_new, jobs_scored, error, run_id))
        conn.commit()
    finally:
        conn.close()


def get_recent_runs(limit=20):
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT * FROM search_runs ORDER BY started_at DESC LIMIT ?", (limit,)
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


# ─── ACTIVITY LOG ─────────────────────────────────────────────────────────────

def log(message, level="info", category="system", detail=None):
    conn = get_connection()
    try:
        conn.execute(
            "INSERT INTO activity_log (timestamp, level, category, message, detail) VALUES (?,?,?,?,?)",
            (datetime.utcnow().isoformat(), level, category, message, detail)
        )
        conn.commit()
    finally:
        conn.close()


def get_activity(limit=200):
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT * FROM activity_log ORDER BY timestamp DESC LIMIT ?", (limit,)
        ).fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()


# ─── CONFIG ───────────────────────────────────────────────────────────────────

def get_config(key, default=None):
    conn = get_connection()
    try:
        row = conn.execute("SELECT value FROM config WHERE key=?", (key,)).fetchone()
        if row:
            try:
                return json.loads(row["value"])
            except Exception:
                return row["value"]
        return default
    finally:
        conn.close()


def set_config(key, value):
    conn = get_connection()
    try:
        serialized = json.dumps(value) if not isinstance(value, str) else value
        conn.execute("""
            INSERT INTO config (key, value, updated) VALUES (?,?,?)
            ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated=excluded.updated
        """, (key, serialized, datetime.utcnow().isoformat()))
        conn.commit()
    finally:
        conn.close()
