"""
Review view — application approval queue.
Revision 2: batch reject, edit history (View Original), reject reasons.
"""

import json
import webbrowser

from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
    QTextEdit, QFrame, QSplitter, QScrollArea, QListWidget,
    QListWidgetItem, QSizePolicy, QApplication, QComboBox,
    QCheckBox, QAbstractItemView,
)
from PySide6.QtCore import Qt, Signal
from PySide6.QtGui import QColor, QFont

from ui import theme
from ui.widgets import ScoreBadge, StatusBadge, SectionHeader, Divider
from engine import database as db


REJECT_REASONS = [
    "Select reason...",
    "Wrong role type",
    "Too much people management",
    "Too many meetings / high interaction",
    "Wrong domain / industry",
    "Compensation too low",
    "Requires degree I don't have",
    "Company / culture not a fit",
    "Duplicate / similar to another",
    "Other",
]


class ApplicationCard(QListWidgetItem):
    def __init__(self, app):
        super().__init__()
        self.app = app
        self.app_id = app.get("id")
        score = app.get("score") or 0
        title = app.get("title", "")
        company = app.get("company", "")
        salary = app.get("salary_parsed") or app.get("salary_raw") or ""
        sal_str = f"  {salary}" if salary else ""
        self.setText(f"{score:3}  {title}\n      {company}{sal_str}")
        color = theme.score_color(score)
        self.setForeground(QColor(color))
        f = QFont("Segoe UI", 12)
        self.setFont(f)
        self.setSizeHint(__import__('PySide6.QtCore', fromlist=['QSize']).QSize(300, 62))
        self.setCheckState(Qt.Unchecked)


class ApplicationDetailPanel(QWidget):
    approved  = Signal(int)
    rejected  = Signal(int, str)   # (app_id, reason)
    submitted = Signal(int)

    def __init__(self, parent=None):
        super().__init__(parent)
        self._current_app_id = None
        self._original_cover = ""
        self._original_resume = ""
        self._setup_ui()

    def _setup_ui(self):
        root = QVBoxLayout(self)
        root.setContentsMargins(0, 0, 0, 0)
        root.setSpacing(0)

        # Header
        header = QFrame()
        header.setFixedHeight(64)
        header.setStyleSheet(f"background: {theme.SURFACE2}; border-bottom: 1px solid {theme.BORDER};")
        hl = QHBoxLayout(header)
        hl.setContentsMargins(20, 0, 20, 0)
        hl.setSpacing(12)

        self._title_lbl = QLabel("No application selected")
        self._title_lbl.setStyleSheet(f"font-size: 16px; font-weight: 700; color: {theme.TEXT};")
        hl.addWidget(self._title_lbl, 1)

        self._score_badge = ScoreBadge(None)
        hl.addWidget(self._score_badge)
        self._status_badge = StatusBadge("pending_review")
        hl.addWidget(self._status_badge)
        root.addWidget(header)

        # Scroll content
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setFrameShape(QFrame.NoFrame)
        scroll.setStyleSheet(f"background: {theme.BG};")

        inner = QWidget()
        inner.setStyleSheet(f"background: {theme.BG};")
        ivl = QVBoxLayout(inner)
        ivl.setContentsMargins(20, 20, 20, 20)
        ivl.setSpacing(16)

        # Salary / meta row
        meta_row = QHBoxLayout()
        self._company_lbl = QLabel("")
        self._company_lbl.setStyleSheet(f"color: {theme.TEXT_DIM}; font-size: 13px;")
        meta_row.addWidget(self._company_lbl)
        self._salary_lbl = QLabel("")
        self._salary_lbl.setStyleSheet(f"color: {theme.CYAN}; font-size: 13px; font-weight: 600;")
        meta_row.addWidget(self._salary_lbl)
        meta_row.addStretch()
        self._url_btn = QPushButton("Open Job Posting")
        self._url_btn.setObjectName("ghost")
        self._url_btn.setFixedHeight(30)
        self._url_btn.clicked.connect(self._open_url)
        meta_row.addWidget(self._url_btn)
        ivl.addLayout(meta_row)

        # AI assessment
        ivl.addWidget(SectionHeader("AI Match Assessment"))
        self._fit_lbl = QLabel("")
        self._fit_lbl.setWordWrap(True)
        self._fit_lbl.setStyleSheet(f"color: {theme.TEXT_DIM}; font-size: 13px; line-height: 1.5;")
        ivl.addWidget(self._fit_lbl)

        # Cover letter with edit history toggle
        cl_header = QHBoxLayout()
        cl_header.addWidget(SectionHeader("Cover Letter"))
        cl_header.addStretch()
        self._restore_btn = QPushButton("Restore Original")
        self._restore_btn.setObjectName("ghost")
        self._restore_btn.setFixedHeight(26)
        self._restore_btn.setToolTip("Restore the AI-generated original cover letter")
        self._restore_btn.clicked.connect(self._restore_original)
        self._restore_btn.setVisible(False)
        cl_header.addWidget(self._restore_btn)
        copy_cl_btn = QPushButton("Copy")
        copy_cl_btn.setObjectName("ghost")
        copy_cl_btn.setFixedHeight(26)
        copy_cl_btn.clicked.connect(self._copy_cover_letter)
        cl_header.addWidget(copy_cl_btn)
        ivl.addLayout(cl_header)

        self._cover_letter = QTextEdit()
        self._cover_letter.setMinimumHeight(200)
        self._cover_letter.setStyleSheet(f"""
            background: {theme.SURFACE};
            color: {theme.TEXT};
            border: 1px solid {theme.BORDER};
            border-radius: 8px;
            font-size: 13px;
            padding: 14px;
        """)
        self._cover_letter.textChanged.connect(self._on_cover_edited)
        ivl.addWidget(self._cover_letter)

        # Resume summary
        rs_header = QHBoxLayout()
        rs_header.addWidget(SectionHeader("Resume Summary"))
        rs_header.addStretch()
        self._restore_rs_btn = QPushButton("Restore Original")
        self._restore_rs_btn.setObjectName("ghost")
        self._restore_rs_btn.setFixedHeight(26)
        self._restore_rs_btn.clicked.connect(self._restore_original_rs)
        self._restore_rs_btn.setVisible(False)
        rs_header.addWidget(self._restore_rs_btn)
        copy_rs_btn = QPushButton("Copy")
        copy_rs_btn.setObjectName("ghost")
        copy_rs_btn.setFixedHeight(26)
        copy_rs_btn.clicked.connect(self._copy_resume_summary)
        rs_header.addWidget(copy_rs_btn)
        ivl.addLayout(rs_header)

        self._resume_summary = QTextEdit()
        self._resume_summary.setFixedHeight(120)
        self._resume_summary.setStyleSheet(f"""
            background: {theme.SURFACE};
            color: {theme.TEXT};
            border: 1px solid {theme.BORDER};
            border-radius: 8px;
            font-size: 13px;
            padding: 14px;
        """)
        self._resume_summary.textChanged.connect(self._on_resume_edited)
        ivl.addWidget(self._resume_summary)

        # Talking points
        ivl.addWidget(SectionHeader("Talking Points"))
        self._talking_points = QLabel("")
        self._talking_points.setWordWrap(True)
        self._talking_points.setStyleSheet(f"""
            color: {theme.TEXT_DIM};
            font-size: 13px;
            background: {theme.SURFACE};
            border: 1px solid {theme.BORDER};
            border-radius: 8px;
            padding: 14px;
            line-height: 1.6;
        """)
        ivl.addWidget(self._talking_points)

        # Subject line
        sl_row = QHBoxLayout()
        sl_row.addWidget(QLabel("Subject:"))
        self._subject_lbl = QLabel("")
        self._subject_lbl.setStyleSheet(f"color: {theme.TEXT}; font-size: 12px; font-style: italic;")
        sl_row.addWidget(self._subject_lbl, 1)
        ivl.addLayout(sl_row)

        ivl.addStretch()
        scroll.setWidget(inner)
        root.addWidget(scroll, 1)

        # Action bar
        action_bar = QFrame()
        action_bar.setFixedHeight(72)
        action_bar.setStyleSheet(f"background: {theme.SURFACE2}; border-top: 1px solid {theme.BORDER};")
        al = QHBoxLayout(action_bar)
        al.setContentsMargins(20, 0, 20, 0)
        al.setSpacing(10)

        # Reject with reason
        self._reject_reason = QComboBox()
        self._reject_reason.addItems(REJECT_REASONS)
        self._reject_reason.setFixedWidth(200)
        self._reject_reason.setStyleSheet(f"""
            QComboBox {{
                background: {theme.SURFACE};
                color: {theme.TEXT};
                border: 1px solid {theme.BORDER};
                border-radius: 6px;
                padding: 6px 10px;
                font-size: 12px;
            }}
            QComboBox::drop-down {{ border: none; }}
            QComboBox QAbstractItemView {{
                background: {theme.SURFACE};
                color: {theme.TEXT};
                selection-background-color: {theme.ACCENT};
            }}
        """)
        al.addWidget(self._reject_reason)

        reject_btn = QPushButton("Reject")
        reject_btn.setObjectName("danger")
        reject_btn.setFixedSize(90, 44)
        reject_btn.clicked.connect(self._reject)
        al.addWidget(reject_btn)

        al.addStretch()

        approve_btn = QPushButton("Approve")
        approve_btn.setObjectName("primary")
        approve_btn.setFixedSize(110, 44)
        approve_btn.clicked.connect(self._approve)
        al.addWidget(approve_btn)

        submitted_btn = QPushButton("Mark Submitted")
        submitted_btn.setObjectName("ghost")
        submitted_btn.setFixedSize(140, 44)
        submitted_btn.clicked.connect(self._mark_submitted)
        al.addWidget(submitted_btn)

        root.addWidget(action_bar)

    def load_application(self, app):
        if not app:
            return
        self._current_app_id = app.get("id")

        title = app.get("title", "")
        company = app.get("company", "")
        self._title_lbl.setText(title)
        self._company_lbl.setText(f"{company}  •")

        sal = app.get("salary_parsed") or app.get("salary_raw") or ""
        self._salary_lbl.setText(sal)

        self._score_badge.set_score(app.get("score"))
        self._status_badge.set_status(app.get("status", "pending_review"))

        notes = {}
        try:
            notes = json.loads(app.get("score_notes") or "{}")
        except Exception:
            pass
        fit = notes.get("fit_summary", "")
        green = notes.get("green_flags", [])
        red = notes.get("red_flags", [])
        parts = []
        if fit:
            parts.append(fit)
        if green:
            parts.append("✓ " + "  ✓ ".join(str(g) for g in green))
        if red:
            parts.append("⚠ " + "  ⚠ ".join(str(r) for r in red))
        self._fit_lbl.setText("\n".join(parts))

        # Cover letter — track original for restore
        cover = app.get("cover_letter", "")
        orig_cover = app.get("cover_letter_orig", "") or cover
        self._original_cover = orig_cover
        self._cover_letter.blockSignals(True)
        self._cover_letter.setPlainText(cover)
        self._cover_letter.blockSignals(False)
        self._restore_btn.setVisible(cover != orig_cover and bool(orig_cover))

        # Resume summary
        resume = app.get("resume_summary", "")
        orig_resume = app.get("resume_summary_orig", "") or resume
        self._original_resume = orig_resume
        self._resume_summary.blockSignals(True)
        self._resume_summary.setPlainText(resume)
        self._resume_summary.blockSignals(False)
        self._restore_rs_btn.setVisible(resume != orig_resume and bool(orig_resume))

        # Talking points
        tp_raw = app.get("talking_points", "[]")
        try:
            tp = json.loads(tp_raw) if isinstance(tp_raw, str) else tp_raw
        except Exception:
            tp = []
        if tp:
            formatted = "\n".join(f"  {i+1}. {p}" for i, p in enumerate(tp))
        else:
            formatted = "(No talking points generated)"
        self._talking_points.setText(formatted)

        subject = ""
        try:
            # subject line may be stored in dan_notes or as part of app data
            subject = app.get("subject_line", "") or ""
        except Exception:
            pass
        self._subject_lbl.setText(subject)

        self._url = app.get("url", "")
        self._reject_reason.setCurrentIndex(0)

    def _on_cover_edited(self):
        if not self._current_app_id:
            return
        current = self._cover_letter.toPlainText()
        db.update_application_text(self._current_app_id, cover_letter=current)
        self._restore_btn.setVisible(current != self._original_cover and bool(self._original_cover))

    def _on_resume_edited(self):
        if not self._current_app_id:
            return
        current = self._resume_summary.toPlainText()
        db.update_application_text(self._current_app_id, resume_summary=current)
        self._restore_rs_btn.setVisible(current != self._original_resume and bool(self._original_resume))

    def _restore_original(self):
        if not self._current_app_id or not self._original_cover:
            return
        db.restore_original_application(self._current_app_id)
        self._cover_letter.blockSignals(True)
        self._cover_letter.setPlainText(self._original_cover)
        self._cover_letter.blockSignals(False)
        self._restore_btn.setVisible(False)

    def _restore_original_rs(self):
        if not self._current_app_id or not self._original_resume:
            return
        db.restore_original_application(self._current_app_id)
        self._resume_summary.blockSignals(True)
        self._resume_summary.setPlainText(self._original_resume)
        self._resume_summary.blockSignals(False)
        self._restore_rs_btn.setVisible(False)

    def _open_url(self):
        if hasattr(self, '_url') and self._url:
            webbrowser.open(self._url)

    def _copy_cover_letter(self):
        QApplication.clipboard().setText(self._cover_letter.toPlainText())

    def _copy_resume_summary(self):
        QApplication.clipboard().setText(self._resume_summary.toPlainText())

    def _approve(self):
        if self._current_app_id:
            self.approved.emit(self._current_app_id)

    def _reject(self):
        if self._current_app_id:
            idx = self._reject_reason.currentIndex()
            reason = self._reject_reason.currentText() if idx > 0 else None
            self.rejected.emit(self._current_app_id, reason or "")

    def _mark_submitted(self):
        if self._current_app_id:
            self.submitted.emit(self._current_app_id)


class ReviewView(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self._setup_ui()
        self.refresh()

    def _setup_ui(self):
        root = QVBoxLayout(self)
        root.setContentsMargins(0, 0, 0, 0)
        root.setSpacing(0)

        # Header
        header = QFrame()
        header.setFixedHeight(68)
        header.setStyleSheet(f"background: {theme.BG}; border-bottom: 1px solid {theme.BORDER};")
        hl = QHBoxLayout(header)
        hl.setContentsMargins(28, 0, 28, 0)
        hl.setSpacing(14)

        heading = QLabel("Review Queue")
        heading.setObjectName("heading")
        hl.addWidget(heading)

        self._count_badge = QLabel("0 pending")
        self._count_badge.setStyleSheet(f"""
            background: {theme.SURFACE2}; color: {theme.TEXT_DIM};
            border-radius: 10px; font-size: 11px; padding: 3px 12px;
        """)
        hl.addWidget(self._count_badge)

        hl.addStretch()

        # Batch reject button
        self._batch_reject_btn = QPushButton("Batch Reject Selected")
        self._batch_reject_btn.setObjectName("danger")
        self._batch_reject_btn.setFixedHeight(34)
        self._batch_reject_btn.setVisible(False)
        self._batch_reject_btn.clicked.connect(self._batch_reject)
        hl.addWidget(self._batch_reject_btn)

        self._batch_reason = QComboBox()
        self._batch_reason.addItems(REJECT_REASONS)
        self._batch_reason.setFixedWidth(190)
        self._batch_reason.setVisible(False)
        self._batch_reason.setStyleSheet(f"""
            QComboBox {{
                background: {theme.SURFACE}; color: {theme.TEXT};
                border: 1px solid {theme.BORDER}; border-radius: 6px;
                padding: 6px 10px; font-size: 12px;
            }}
            QComboBox::drop-down {{ border: none; }}
            QComboBox QAbstractItemView {{
                background: {theme.SURFACE}; color: {theme.TEXT};
                selection-background-color: {theme.ACCENT};
            }}
        """)
        hl.addWidget(self._batch_reason)

        select_all_btn = QPushButton("Select All")
        select_all_btn.setObjectName("ghost")
        select_all_btn.setFixedHeight(34)
        select_all_btn.clicked.connect(self._select_all)
        hl.addWidget(select_all_btn)

        clear_btn = QPushButton("Clear")
        clear_btn.setObjectName("ghost")
        clear_btn.setFixedHeight(34)
        clear_btn.clicked.connect(self._clear_selection)
        hl.addWidget(clear_btn)

        root.addWidget(header)

        # Main split: list | detail
        splitter = QSplitter(Qt.Horizontal)
        splitter.setHandleWidth(1)
        splitter.setStyleSheet(f"QSplitter::handle {{ background: {theme.BORDER}; }}")

        # Left: application list
        left = QWidget()
        left.setMinimumWidth(280)
        left.setMaximumWidth(400)
        left.setStyleSheet(f"background: {theme.SURFACE};")
        lv = QVBoxLayout(left)
        lv.setContentsMargins(0, 0, 0, 0)
        lv.setSpacing(0)

        list_header = QFrame()
        list_header.setFixedHeight(40)
        list_header.setStyleSheet(f"background: {theme.SURFACE2}; border-bottom: 1px solid {theme.BORDER};")
        lhl = QHBoxLayout(list_header)
        lhl.setContentsMargins(12, 0, 12, 0)
        lhl.addWidget(QLabel("Applications — sorted by pay then score"))
        lv.addWidget(list_header)

        self._app_list = QListWidget()
        self._app_list.setSpacing(2)
        self._app_list.setStyleSheet(f"""
            QListWidget {{
                background: {theme.SURFACE};
                border: none;
                outline: none;
            }}
            QListWidget::item {{
                padding: 8px 12px;
                border-bottom: 1px solid {theme.BORDER};
            }}
            QListWidget::item:selected {{
                background: {theme.ACCENT_DIM};
                border-left: 3px solid {theme.ACCENT};
            }}
            QListWidget::item:hover {{
                background: {theme.SURFACE3};
            }}
        """)
        self._app_list.currentItemChanged.connect(self._on_item_selected)
        self._app_list.itemChanged.connect(self._on_check_changed)
        lv.addWidget(self._app_list, 1)

        splitter.addWidget(left)

        # Right: detail panel
        self._detail = ApplicationDetailPanel()
        self._detail.approved.connect(self._on_approved)
        self._detail.rejected.connect(self._on_rejected)
        self._detail.submitted.connect(self._on_submitted)
        splitter.addWidget(self._detail)

        splitter.setStretchFactor(0, 0)
        splitter.setStretchFactor(1, 1)
        splitter.setSizes([320, 800])

        root.addWidget(splitter, 1)

    def refresh(self):
        apps = db.get_applications(status="pending_review")
        self._app_list.blockSignals(True)
        self._app_list.clear()
        for app in apps:
            item = ApplicationCard(app)
            self._app_list.addItem(item)
        self._app_list.blockSignals(False)

        count = len(apps)
        self._count_badge.setText(f"{count} pending")
        if count > 0:
            self._app_list.setCurrentRow(0)
            self._load_first()

    def _load_first(self):
        item = self._app_list.currentItem()
        if item and isinstance(item, ApplicationCard):
            app = db.get_application(item.app_id)
            if app:
                self._detail.load_application(app)

    def _on_item_selected(self, current, previous):
        if current and isinstance(current, ApplicationCard):
            app = db.get_application(current.app_id)
            if app:
                self._detail.load_application(app)

    def _on_check_changed(self, item):
        checked_count = sum(
            1 for i in range(self._app_list.count())
            if self._app_list.item(i).checkState() == Qt.Checked
        )
        self._batch_reject_btn.setVisible(checked_count > 0)
        self._batch_reason.setVisible(checked_count > 0)

    def _select_all(self):
        for i in range(self._app_list.count()):
            self._app_list.item(i).setCheckState(Qt.Checked)

    def _clear_selection(self):
        for i in range(self._app_list.count()):
            self._app_list.item(i).setCheckState(Qt.Unchecked)
        self._batch_reject_btn.setVisible(False)
        self._batch_reason.setVisible(False)

    def _batch_reject(self):
        idx = self._batch_reason.currentIndex()
        reason = self._batch_reason.currentText() if idx > 0 else None
        to_reject = []
        for i in range(self._app_list.count()):
            item = self._app_list.item(i)
            if item.checkState() == Qt.Checked and isinstance(item, ApplicationCard):
                to_reject.append(item.app_id)
        for app_id in to_reject:
            db.reject_application(app_id, reject_reason=reason)
        self.refresh()

    def _on_approved(self, app_id):
        db.approve_application(app_id)
        self.refresh()

    def _on_rejected(self, app_id, reason):
        db.reject_application(app_id, reject_reason=reason if reason else None)
        self.refresh()

    def _on_submitted(self, app_id):
        db.mark_submitted(app_id)
        self.refresh()

    def pending_count(self):
        """Return the number of applications currently awaiting review."""
        return len(db.get_applications(status="pending_review"))
