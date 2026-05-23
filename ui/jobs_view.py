"""
Jobs CRM view — full searchable/filterable table of all discovered jobs.
"""

import json
import webbrowser

from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
    QTableWidget, QTableWidgetItem, QHeaderView, QComboBox,
    QLineEdit, QFrame, QAbstractItemView, QSizePolicy, QTextBrowser,
    QSplitter,
)
from PySide6.QtCore import Qt, Signal, QTimer
from PySide6.QtGui import QColor, QFont

from ui import theme
from ui.widgets import ScoreBadge, StatusBadge, SectionHeader
from engine import database as db


class JobDetailPanel(QFrame):
    """Right-side detail view when a job is selected."""

    def __init__(self, parent=None):
        super().__init__(parent)
        self.setMinimumWidth(340)
        self.setStyleSheet(f"""
            QFrame {{
                background-color: {theme.SURFACE};
                border: 1px solid {theme.BORDER};
                border-radius: 10px;
            }}
        """)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(12)

        self._title = QLabel("Select a job to view details")
        self._title.setStyleSheet(f"font-size: 16px; font-weight: 700; color: {theme.TEXT};")
        self._title.setWordWrap(True)
        layout.addWidget(self._title)

        self._company = QLabel("")
        self._company.setStyleSheet(f"font-size: 13px; color: {theme.TEXT_DIM};")
        layout.addWidget(self._company)

        row = QHBoxLayout()
        row.setSpacing(8)
        self._score_badge = ScoreBadge(None)
        row.addWidget(self._score_badge)
        self._status_badge = StatusBadge("new")
        row.addWidget(self._status_badge)
        row.addStretch()
        layout.addLayout(row)

        self._salary = QLabel("")
        self._salary.setStyleSheet(f"font-size: 13px; color: {theme.SUCCESS}; font-weight: 600;")
        layout.addWidget(self._salary)

        self._source = QLabel("")
        self._source.setStyleSheet(f"font-size: 11px; color: {theme.TEXT_MUTED};")
        layout.addWidget(self._source)

        # Outcome tracking (Improvement 11)
        self._outcome_section = SectionHeader("Application Outcome")
        layout.addWidget(self._outcome_section)
        self._outcome_section.setVisible(False)

        outcome_row = QHBoxLayout()
        self._outcome_combo = QComboBox()
        self._outcome_combo.addItems([
            "pending",
            "interview_requested",
            "offer_received",
            "declined",
            "ghosted",
            "rejected_by_company",
        ])
        self._outcome_combo.setStyleSheet(f"""
            QComboBox {{
                background: {theme.SURFACE2}; color: {theme.TEXT};
                border: 1px solid {theme.BORDER}; border-radius: 6px;
                padding: 5px 10px; font-size: 12px;
            }}
            QComboBox::drop-down {{ border: none; }}
            QComboBox QAbstractItemView {{
                background: {theme.SURFACE2}; color: {theme.TEXT};
                selection-background-color: {theme.ACCENT};
            }}
        """)
        outcome_row.addWidget(self._outcome_combo, 1)
        self._save_outcome_btn = QPushButton("Save Outcome")
        self._save_outcome_btn.setObjectName("ghost")
        self._save_outcome_btn.setFixedHeight(32)
        self._save_outcome_btn.clicked.connect(self._save_outcome)
        outcome_row.addWidget(self._save_outcome_btn)
        layout.addLayout(outcome_row)
        self._outcome_combo.setVisible(False)
        self._save_outcome_btn.setVisible(False)
        self._current_app_id = None

        # Score notes
        self._fit_label = SectionHeader("AI Assessment")
        layout.addWidget(self._fit_label)
        self._fit_text = QLabel("")
        self._fit_text.setWordWrap(True)
        self._fit_text.setStyleSheet(f"""
            color: {theme.TEXT_DIM};
            font-size: 12px;
            background: {theme.SURFACE2};
            border-radius: 6px;
            padding: 10px;
        """)
        layout.addWidget(self._fit_text)

        # Description
        self._desc_label = SectionHeader("Description")
        layout.addWidget(self._desc_label)
        self._desc = QTextBrowser()
        self._desc.setStyleSheet(f"""
            QTextBrowser {{
                background: {theme.SURFACE2};
                color: {theme.TEXT_DIM};
                border: none;
                border-radius: 6px;
                font-size: 12px;
                padding: 10px;
            }}
        """)
        self._desc.setOpenExternalLinks(True)
        layout.addWidget(self._desc, 1)

        # Action buttons
        btn_row = QHBoxLayout()
        btn_row.setSpacing(8)
        self._open_btn = QPushButton("Open Job Posting")
        self._open_btn.setObjectName("primary")
        self._open_btn.clicked.connect(self._open_url)
        self._open_btn.setEnabled(False)
        btn_row.addWidget(self._open_btn, 1)
        layout.addLayout(btn_row)

        self._current_url = ""
        self._current_job = None

    def show_job(self, job):
        self._current_job = job
        self._current_url = job.get("url", "")

        self._title.setText(job.get("title", ""))
        self._company.setText(job.get("company", ""))
        self._score_badge.set_score(job.get("score"))
        self._status_badge.set_status(job.get("status", "new"))
        sal = job.get("salary_parsed") or job.get("salary_raw") or "Salary not listed"
        self._salary.setText(sal)
        self._source.setText(f"Source: {job.get('source', '')}  ·  Found: {job.get('found_date', '')[:10]}")

        # Show outcome tracking for submitted jobs
        status = job.get("status", "")
        if status == "submitted":
            self._outcome_section.setVisible(True)
            self._outcome_combo.setVisible(True)
            self._save_outcome_btn.setVisible(True)
            # Find matching application
            conn = __import__('sqlite3').connect(str(__import__('pathlib').Path(__file__).parent.parent / "data" / "jobs.db"))
            conn.row_factory = __import__('sqlite3').Row
            app_row = conn.execute(
                "SELECT id, outcome FROM applications WHERE job_id=? AND status='submitted' LIMIT 1",
                (job.get("id"),)
            ).fetchone()
            conn.close()
            if app_row:
                self._current_app_id = app_row["id"]
                outcome = app_row["outcome"] or "pending"
                idx = self._outcome_combo.findText(outcome)
                if idx >= 0:
                    self._outcome_combo.setCurrentIndex(idx)
            else:
                self._current_app_id = None
        else:
            self._outcome_section.setVisible(False)
            self._outcome_combo.setVisible(False)
            self._save_outcome_btn.setVisible(False)
            self._current_app_id = None

        # AI notes
        notes_raw = job.get("score_notes", "")
        if notes_raw:
            try:
                notes = json.loads(notes_raw)
                fit = notes.get("fit_summary", "")
                greens = notes.get("green_flags", [])
                reds = notes.get("red_flags", [])
                parts = [fit]
                if greens:
                    parts.append("✓ " + "  ✓ ".join(greens))
                if reds:
                    parts.append("✕ " + "  ✕ ".join(reds))
                self._fit_text.setText("\n".join(p for p in parts if p))
            except Exception:
                self._fit_text.setText(notes_raw[:200])
        else:
            self._fit_text.setText("Not yet scored.")

        # Description (strip HTML for display)
        desc = job.get("description", "")
        if "<" in desc:
            self._desc.setHtml(desc)
        else:
            self._desc.setPlainText(desc)

        self._open_btn.setEnabled(bool(self._current_url))

    def _open_url(self):
        if self._current_url:
            webbrowser.open(self._current_url)

    def _save_outcome(self):
        if self._current_app_id:
            outcome = self._outcome_combo.currentText()
            db.record_outcome(self._current_app_id, outcome)


class JobsView(QWidget):
    """Full CRM table of all jobs with search, filter, and detail panel."""

    def __init__(self, parent=None):
        super().__init__(parent)
        self._jobs = []
        self._setup_ui()

    def _setup_ui(self):
        root = QVBoxLayout(self)
        root.setContentsMargins(28, 24, 28, 24)
        root.setSpacing(16)

        # ── HEADING + CONTROLS ───────────────────────────────────────────
        top = QHBoxLayout()
        heading = QLabel("Jobs Database")
        heading.setObjectName("heading")
        top.addWidget(heading)
        top.addStretch()

        self._search = QLineEdit()
        self._search.setPlaceholderText("Search title, company...")
        self._search.setFixedWidth(220)
        self._search.textChanged.connect(self._apply_filters)
        top.addWidget(self._search)

        self._status_filter = QComboBox()
        self._status_filter.addItems(["All Status", "new", "scored", "application_ready",
                                       "pending_review", "approved", "submitted", "rejected"])
        self._status_filter.currentTextChanged.connect(self._apply_filters)
        top.addWidget(self._status_filter)

        self._score_filter = QComboBox()
        self._score_filter.addItems(["All Scores", "70+ (Strong)", "50+ (Decent)", "0+ (All)"])
        self._score_filter.currentTextChanged.connect(self._apply_filters)
        top.addWidget(self._score_filter)

        refresh_btn = QPushButton("↻")
        refresh_btn.setFixedSize(36, 36)
        refresh_btn.setObjectName("ghost")
        refresh_btn.setToolTip("Refresh list")
        refresh_btn.clicked.connect(self.refresh)
        top.addWidget(refresh_btn)

        root.addLayout(top)

        # ── COUNT LABEL ──────────────────────────────────────────────────
        self._count_label = QLabel("0 jobs")
        self._count_label.setStyleSheet(f"color: {theme.TEXT_MUTED}; font-size: 12px;")
        root.addWidget(self._count_label)

        # ── SPLITTER: TABLE + DETAIL ─────────────────────────────────────
        splitter = QSplitter(Qt.Horizontal)

        self._table = self._build_table()
        splitter.addWidget(self._table)

        self._detail = JobDetailPanel()
        splitter.addWidget(self._detail)
        splitter.setSizes([700, 380])

        root.addWidget(splitter, 1)

    def _build_table(self):
        cols = ["Score", "Title", "Company", "Salary", "Source", "Status", "Found"]
        t = QTableWidget(0, len(cols))
        t.setHorizontalHeaderLabels(cols)
        t.setSelectionBehavior(QAbstractItemView.SelectRows)
        t.setSelectionMode(QAbstractItemView.SingleSelection)
        t.setEditTriggers(QAbstractItemView.NoEditTriggers)
        t.setAlternatingRowColors(False)
        t.verticalHeader().setVisible(False)
        t.setShowGrid(False)

        hh = t.horizontalHeader()
        hh.setSectionResizeMode(0, QHeaderView.Fixed)
        hh.setSectionResizeMode(1, QHeaderView.Stretch)
        hh.setSectionResizeMode(2, QHeaderView.ResizeToContents)
        hh.setSectionResizeMode(3, QHeaderView.ResizeToContents)
        hh.setSectionResizeMode(4, QHeaderView.ResizeToContents)
        hh.setSectionResizeMode(5, QHeaderView.Fixed)
        hh.setSectionResizeMode(6, QHeaderView.Fixed)
        t.setColumnWidth(0, 64)
        t.setColumnWidth(5, 100)
        t.setColumnWidth(6, 90)

        t.setStyleSheet(f"""
            QTableWidget {{
                background-color: {theme.SURFACE};
                border: 1px solid {theme.BORDER};
                border-radius: 10px;
                gridline-color: transparent;
                outline: none;
            }}
            QTableWidget::item {{
                padding: 10px 12px;
                border-bottom: 1px solid {theme.BORDER};
            }}
            QTableWidget::item:selected {{
                background-color: {theme.ACCENT_DIM};
                color: {theme.TEXT};
            }}
        """)
        t.itemSelectionChanged.connect(self._on_selection)
        return t

    def refresh(self):
        self._jobs = db.get_jobs(limit=1000)
        self._apply_filters()

    def _apply_filters(self):
        query = self._search.text().lower()
        status_sel = self._status_filter.currentText()
        score_sel = self._score_filter.currentText()

        min_score = 0
        if "70+" in score_sel:
            min_score = 70
        elif "50+" in score_sel:
            min_score = 50

        filtered = []
        for job in self._jobs:
            if status_sel != "All Status" and job.get("status") != status_sel:
                continue
            if (job.get("score") or 0) < min_score:
                continue
            if query:
                haystack = (job.get("title", "") + job.get("company", "")).lower()
                if query not in haystack:
                    continue
            filtered.append(job)

        self._populate_table(filtered)
        self._count_label.setText(f"{len(filtered)} jobs")

    def _populate_table(self, jobs):
        self._table.setRowCount(0)
        self._table.setRowCount(len(jobs))
        for row, job in enumerate(jobs):
            self._table.setRowHeight(row, 46)

            score = job.get("score")
            score_item = QTableWidgetItem(str(score) if score else "—")
            score_item.setTextAlignment(Qt.AlignCenter)
            color = theme.score_color(score)
            score_item.setForeground(QColor(color))
            f = QFont()
            f.setBold(True)
            score_item.setFont(f)
            self._table.setItem(row, 0, score_item)

            title_item = QTableWidgetItem(job.get("title", ""))
            title_item.setData(Qt.UserRole, job)
            self._table.setItem(row, 1, title_item)

            self._table.setItem(row, 2, QTableWidgetItem(job.get("company", "")))

            salary = job.get("salary_raw", "") or "—"
            sal_item = QTableWidgetItem(salary)
            if salary != "—":
                sal_item.setForeground(QColor(theme.SUCCESS))
            self._table.setItem(row, 3, sal_item)

            self._table.setItem(row, 4, QTableWidgetItem(job.get("source", "")))

            status = job.get("status", "new")
            bg, fg = theme.status_color(status)
            status_item = QTableWidgetItem(status.replace("_", " ").upper())
            status_item.setTextAlignment(Qt.AlignCenter)
            status_item.setForeground(QColor(fg))
            self._table.setItem(row, 5, status_item)

            found = (job.get("found_date") or "")[:10]
            self._table.setItem(row, 6, QTableWidgetItem(found))

    def _on_selection(self):
        rows = self._table.selectedItems()
        if not rows:
            return
        job = self._table.item(rows[0].row(), 1)
        if job:
            data = job.data(Qt.UserRole)
            if data:
                self._detail.show_job(data)
