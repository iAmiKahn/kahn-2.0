"""
Dashboard view — stats overview, system status, recent activity.
"""

from datetime import datetime, timezone

from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
    QScrollArea, QFrame, QSizePolicy,
)
from PySide6.QtCore import Qt, QTimer

from ui import theme
from ui.widgets import Card, StatCard, ActivityItem, SectionHeader, Divider, ScoreBadge
from engine import database as db


class StatusIndicator(QFrame):
    STATUS_COLORS = {
        "running":   theme.SUCCESS,
        "waiting":   theme.CYAN,
        "paused":    theme.WARNING,
        "no_ollama": theme.WARNING,
        "stopped":   theme.TEXT_MUTED,
    }
    STATUS_LABELS = {
        "running":   "Searching now",
        "waiting":   "Waiting for next run",
        "paused":    "Paused",
        "no_ollama": "Ollama not running — rule-based scoring only",
        "stopped":  "Stopped",
    }

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setStyleSheet(f"""
            QFrame {{
                background-color: {theme.SURFACE};
                border: 1px solid {theme.BORDER};
                border-radius: 10px;
            }}
        """)
        layout = QHBoxLayout(self)
        layout.setContentsMargins(20, 14, 20, 14)
        layout.setSpacing(12)

        self._dot = QLabel("●")
        self._dot.setStyleSheet(f"color: {theme.TEXT_MUTED}; font-size: 14px;")
        layout.addWidget(self._dot)

        vbox = QVBoxLayout()
        vbox.setSpacing(2)
        self._title = QLabel("System Status")
        self._title.setStyleSheet(f"font-size: 13px; font-weight: 600; color: {theme.TEXT};")
        self._subtitle = QLabel("Initializing...")
        self._subtitle.setStyleSheet(f"font-size: 12px; color: {theme.TEXT_DIM};")
        vbox.addWidget(self._title)
        vbox.addWidget(self._subtitle)
        layout.addLayout(vbox, 1)

        self._next_run_label = QLabel("")
        self._next_run_label.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        self._next_run_label.setStyleSheet(f"font-size: 12px; color: {theme.TEXT_MUTED};")
        layout.addWidget(self._next_run_label)

    def update_status(self, status, next_run_at=None):
        color = self.STATUS_COLORS.get(status, theme.TEXT_MUTED)
        label = self.STATUS_LABELS.get(status, status)
        self._dot.setStyleSheet(f"color: {color}; font-size: 14px;")
        self._subtitle.setText(label)

        if next_run_at and status == "waiting":
            import time
            secs = max(0, int(next_run_at - time.time()))
            h, rem = divmod(secs, 3600)
            m, s = divmod(rem, 60)
            if h > 0:
                self._next_run_label.setText(f"Next run in {h}h {m}m")
            elif m > 0:
                self._next_run_label.setText(f"Next run in {m}m {s}s")
            else:
                self._next_run_label.setText(f"Next run in {s}s")
        else:
            self._next_run_label.setText("")


class RecentJobsList(QFrame):
    """Shows the last N high-score jobs found."""
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setStyleSheet(f"""
            QFrame {{
                background-color: {theme.SURFACE};
                border: 1px solid {theme.BORDER};
                border-radius: 10px;
            }}
        """)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        header = QWidget()
        header.setFixedHeight(46)
        header.setStyleSheet(f"""
            background: {theme.SURFACE2};
            border-radius: 10px 10px 0 0;
            border-bottom: 1px solid {theme.BORDER};
        """)
        hl = QHBoxLayout(header)
        hl.setContentsMargins(16, 0, 16, 0)
        title = QLabel("Top Matches")
        title.setStyleSheet(f"font-size: 13px; font-weight: 600; color: {theme.TEXT};")
        hl.addWidget(title)
        hl.addStretch()
        hint = QLabel("Score ≥ 70")
        hint.setStyleSheet(f"font-size: 11px; color: {theme.TEXT_MUTED};")
        hl.addWidget(hint)
        layout.addWidget(header)

        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setFrameShape(QFrame.NoFrame)
        scroll.setStyleSheet("background: transparent;")
        self._inner = QWidget()
        self._inner_layout = QVBoxLayout(self._inner)
        self._inner_layout.setContentsMargins(0, 0, 0, 0)
        self._inner_layout.setSpacing(0)
        self._inner_layout.addStretch()
        scroll.setWidget(self._inner)
        layout.addWidget(scroll, 1)

    def refresh(self):
        # Clear existing items
        while self._inner_layout.count() > 1:
            item = self._inner_layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()

        jobs = db.get_jobs(min_score=70, limit=12)
        if not jobs:
            empty = QLabel("No high-score matches yet.\nSearches run every 2 hours.")
            empty.setAlignment(Qt.AlignCenter)
            empty.setStyleSheet(f"color: {theme.TEXT_MUTED}; font-size: 13px; padding: 40px;")
            self._inner_layout.insertWidget(0, empty)
            return

        for job in jobs:
            row = self._make_row(job)
            self._inner_layout.insertWidget(self._inner_layout.count() - 1, row)

    def _make_row(self, job):
        row = QFrame()
        row.setStyleSheet(f"""
            QFrame {{
                background: transparent;
                border-bottom: 1px solid {theme.BORDER};
            }}
            QFrame:hover {{
                background: {theme.SURFACE2};
            }}
        """)
        hl = QHBoxLayout(row)
        hl.setContentsMargins(16, 12, 16, 12)
        hl.setSpacing(12)

        score_badge = ScoreBadge(job.get("score"))
        hl.addWidget(score_badge)

        info = QVBoxLayout()
        info.setSpacing(2)
        title = QLabel(job.get("title", ""))
        title.setStyleSheet(f"font-size: 13px; font-weight: 600; color: {theme.TEXT};")
        company = QLabel(f"{job.get('company', '')}  ·  {job.get('source', '')}")
        company.setStyleSheet(f"font-size: 11px; color: {theme.TEXT_DIM};")
        info.addWidget(title)
        info.addWidget(company)
        hl.addLayout(info, 1)

        # Show parsed salary if available, fall back to raw
        salary = job.get("salary_parsed") or job.get("salary_raw") or ""
        if salary:
            sal_lbl = QLabel(salary)
            sal_lbl.setStyleSheet(f"font-size: 12px; color: {theme.SUCCESS}; min-width: 120px;")
            sal_lbl.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
            hl.addWidget(sal_lbl)

        return row


class DashboardView(QWidget):
    def __init__(self, scheduler=None, parent=None):
        super().__init__(parent)
        self._scheduler = scheduler
        self._status = "stopped"
        self._next_run_at = None
        self._setup_ui()

        # Refresh countdown every second
        self._timer = QTimer(self)
        self._timer.timeout.connect(self._tick)
        self._timer.start(1000)

    def _setup_ui(self):
        root = QVBoxLayout(self)
        root.setContentsMargins(28, 24, 28, 24)
        root.setSpacing(20)

        # ── HEADING ──────────────────────────────────────────────────────
        top = QHBoxLayout()
        heading = QLabel("Mission Control")
        heading.setObjectName("heading")
        top.addWidget(heading)
        top.addStretch()

        self._run_btn = QPushButton("▶  Run Now")
        self._run_btn.setObjectName("primary")
        self._run_btn.setFixedHeight(36)
        self._run_btn.clicked.connect(self._trigger_run)
        top.addWidget(self._run_btn)

        self._pause_btn = QPushButton("⏸  Pause")
        self._pause_btn.setFixedHeight(36)
        self._pause_btn.clicked.connect(self._toggle_pause)
        top.addWidget(self._pause_btn)

        root.addLayout(top)

        # ── STATUS INDICATOR ─────────────────────────────────────────────
        self._status_widget = StatusIndicator()
        root.addWidget(self._status_widget)

        # ── STAT CARDS ───────────────────────────────────────────────────
        stats_row = QHBoxLayout()
        stats_row.setSpacing(12)

        self._stat_total    = StatCard("—", "Jobs Found")
        self._stat_matched  = StatCard("—", "High Matches", theme.SUCCESS)
        self._stat_review   = StatCard("—", "Pending Review", theme.WARNING)
        self._stat_applied  = StatCard("—", "Submitted", theme.CYAN)
        self._stat_salary   = StatCard("—", "Salary Range", theme.ACCENT)

        for card in [self._stat_total, self._stat_matched, self._stat_review, self._stat_applied, self._stat_salary]:
            stats_row.addWidget(card)
        root.addLayout(stats_row)

        # ── MAIN CONTENT (jobs + activity) ────────────────────────────────
        content = QHBoxLayout()
        content.setSpacing(16)

        self._jobs_list = RecentJobsList()
        content.addWidget(self._jobs_list, 3)

        self._activity_panel = self._build_activity_panel()
        content.addWidget(self._activity_panel, 2)

        root.addLayout(content, 1)

    def _build_activity_panel(self):
        frame = QFrame()
        frame.setStyleSheet(f"""
            QFrame {{
                background-color: {theme.SURFACE};
                border: 1px solid {theme.BORDER};
                border-radius: 10px;
            }}
        """)
        layout = QVBoxLayout(frame)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        header = QWidget()
        header.setFixedHeight(46)
        header.setStyleSheet(f"""
            background: {theme.SURFACE2};
            border-radius: 10px 10px 0 0;
            border-bottom: 1px solid {theme.BORDER};
        """)
        hl = QHBoxLayout(header)
        hl.setContentsMargins(16, 0, 16, 0)
        title = QLabel("Live Activity")
        title.setStyleSheet(f"font-size: 13px; font-weight: 600; color: {theme.TEXT};")
        hl.addWidget(title)
        layout.addWidget(header)

        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setFrameShape(QFrame.NoFrame)
        scroll.setStyleSheet("background: transparent;")
        self._activity_inner = QWidget()
        self._activity_layout = QVBoxLayout(self._activity_inner)
        self._activity_layout.setContentsMargins(12, 8, 12, 8)
        self._activity_layout.setSpacing(1)
        self._activity_layout.addStretch()
        scroll.setWidget(self._activity_inner)
        self._activity_scroll = scroll
        layout.addWidget(scroll, 1)

        return frame

    def add_activity(self, message, level="info"):
        from datetime import datetime
        ts = datetime.utcnow().isoformat()
        item = ActivityItem(ts, message, level)
        # Insert before the stretch
        count = self._activity_layout.count()
        self._activity_layout.insertWidget(count - 1, item)
        # Scroll to bottom
        QTimer.singleShot(50, lambda: self._activity_scroll.verticalScrollBar().setValue(
            self._activity_scroll.verticalScrollBar().maximum()
        ))
        # Keep max 100 items
        if self._activity_layout.count() > 102:
            item = self._activity_layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()

    def load_recent_activity(self):
        rows = db.get_activity(limit=50)
        rows.reverse()
        for row in rows:
            item = ActivityItem(row["timestamp"], row["message"], row.get("level", "info"))
            count = self._activity_layout.count()
            self._activity_layout.insertWidget(count - 1, item)

    def refresh_stats(self):
        stats = db.get_stats()
        self._stat_total.set_value(stats.get("total_jobs", 0))
        self._stat_matched.set_value(stats.get("high_score_jobs", 0), theme.SUCCESS)
        self._stat_review.set_value(stats.get("pending_review", 0), theme.WARNING)
        self._stat_applied.set_value(stats.get("submitted", 0), theme.CYAN)

        # Salary range card (Improvement 7)
        sal = stats.get("salary_stats", {})
        sal_min = sal.get("abs_min")
        sal_max = sal.get("abs_max")
        with_sal = sal.get("with_salary", 0)
        total_high = sal.get("total", 0)
        if sal_max and sal_min:
            def fmt(v):
                if v >= 1000:
                    return f"${v//1000}K"
                return f"${v:,}"
            sal_display = f"{fmt(sal_min)}–{fmt(sal_max)}"
        elif total_high > 0:
            sal_display = f"—  ({with_sal}/{total_high} listed)"
        else:
            sal_display = "—"
        self._stat_salary.set_value(sal_display, theme.ACCENT)

        self._jobs_list.refresh()

    def update_scheduler_status(self, status):
        self._status = status
        self._status_widget.update_status(status, self._next_run_at)

        if status == "running":
            self._run_btn.setEnabled(False)
            self._run_btn.setText("⟳  Running...")
        else:
            self._run_btn.setEnabled(True)
            self._run_btn.setText("▶  Run Now")

        if status == "paused":
            self._pause_btn.setText("▶  Resume")
        else:
            self._pause_btn.setText("⏸  Pause")

    def set_next_run(self, next_run_at):
        self._next_run_at = next_run_at

    def _tick(self):
        if self._status == "waiting":
            self._status_widget.update_status(self._status, self._next_run_at)

    def _trigger_run(self):
        if self._scheduler:
            self._scheduler.trigger_now()

    def _toggle_pause(self):
        if not self._scheduler:
            return
        if self._status == "paused":
            self._scheduler.resume()
        else:
            self._scheduler.pause()
