"""
Settings view — search config, Ollama status, source toggles.
"""

from PySide6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
    QFrame, QScrollArea, QSpinBox, QCheckBox, QDoubleSpinBox, QTextEdit,
)
from PySide6.QtCore import Qt, Signal, QTimer
from PySide6.QtGui import QFont

from ui import theme
from ui.widgets import Card, SectionHeader, Divider
from engine import database as db
from engine import job_sources
from engine import ai_engine


class OllamaStatusWidget(QFrame):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setStyleSheet(f"""
            QFrame {{
                background: {theme.SURFACE};
                border: 1px solid {theme.BORDER};
                border-radius: 10px;
            }}
        """)
        layout = QHBoxLayout(self)
        layout.setContentsMargins(20, 16, 20, 16)
        layout.setSpacing(14)

        self._dot = QLabel("●")
        self._dot.setFixedWidth(16)
        layout.addWidget(self._dot)

        info = QVBoxLayout()
        info.setSpacing(3)
        self._title = QLabel("Ollama Status")
        self._title.setStyleSheet(f"font-size: 13px; font-weight: 600; color: {theme.TEXT};")
        self._subtitle = QLabel("Checking...")
        self._subtitle.setStyleSheet(f"font-size: 12px; color: {theme.TEXT_DIM};")
        info.addWidget(self._title)
        info.addWidget(self._subtitle)
        layout.addLayout(info, 1)

        self._models_label = QLabel("")
        self._models_label.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
        self._models_label.setStyleSheet(f"font-size: 11px; color: {theme.TEXT_MUTED};")
        layout.addWidget(self._models_label)

        check_btn = QPushButton("Check")
        check_btn.setObjectName("ghost")
        check_btn.setFixedSize(60, 32)
        check_btn.clicked.connect(self.refresh)
        layout.addWidget(check_btn)

    def refresh(self):
        up = ai_engine.check_ollama()
        if up:
            self._dot.setStyleSheet(f"color: {theme.SUCCESS}; font-size: 14px;")
            self._subtitle.setText("Running — scoring and generation active")
            self._models_label.setText(
                f"Scoring: {ai_engine.SCORE_MODEL}   Generation: {ai_engine.GENERATE_MODEL}"
            )
        else:
            self._dot.setStyleSheet(f"color: {theme.ERROR}; font-size: 14px;")
            self._subtitle.setText("Not running — rule-based scoring only, no generation")
            self._models_label.setText("Start Ollama to enable full AI features")


class SettingsView(QWidget):
    settings_saved = Signal()

    def __init__(self, parent=None):
        super().__init__(parent)
        self._setup_ui()
        self._load()
        QTimer.singleShot(500, self._ollama_widget.refresh)

    def _setup_ui(self):
        root = QVBoxLayout(self)
        root.setContentsMargins(0, 0, 0, 0)
        root.setSpacing(0)

        # Header bar
        heading_bar = QFrame()
        heading_bar.setFixedHeight(68)
        heading_bar.setStyleSheet(f"background: {theme.BG}; border-bottom: 1px solid {theme.BORDER};")
        hl = QHBoxLayout(heading_bar)
        hl.setContentsMargins(28, 0, 28, 0)
        heading = QLabel("Settings")
        heading.setObjectName("heading")
        hl.addWidget(heading)
        free_badge = QLabel("FREE — zero API costs")
        free_badge.setStyleSheet(f"""
            background: {theme.SUCCESS_DIM}; color: {theme.SUCCESS};
            border-radius: 8px; font-size: 11px; font-weight: 600; padding: 3px 12px;
        """)
        hl.addWidget(free_badge)
        root.addWidget(heading_bar)

        # Scroll content
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setFrameShape(QFrame.NoFrame)
        scroll.setStyleSheet("background: transparent;")

        content = QWidget()
        content.setStyleSheet(f"background: {theme.BG};")
        layout = QVBoxLayout(content)
        layout.setContentsMargins(28, 24, 28, 40)
        layout.setSpacing(24)

        # ── OLLAMA STATUS ─────────────────────────────────────────────────
        layout.addWidget(SectionHeader("AI Engine (Local — Zero Cost)"))
        self._ollama_widget = OllamaStatusWidget()
        layout.addWidget(self._ollama_widget)

        info = QLabel(
            f"Scoring: {ai_engine.SCORE_MODEL} (~2s/job)   |   "
            f"Generation: {ai_engine.GENERATE_MODEL} (~90s/application)\n"
            "All processing is local on your GPU. No internet calls. No charges."
        )
        info.setStyleSheet(f"color: {theme.TEXT_MUTED}; font-size: 11px;")
        info.setWordWrap(True)
        layout.addWidget(info)

        # ── SEARCH SCHEDULE ──────────────────────────────────────────────
        layout.addWidget(SectionHeader("Search Schedule"))
        sched_frame = self._build_card()
        sched_layout = QVBoxLayout(sched_frame)
        sched_layout.setContentsMargins(20, 18, 20, 18)
        sched_layout.setSpacing(14)

        interval_row = QHBoxLayout()
        interval_row.addWidget(QLabel("Search every"))
        self._interval_spin = QDoubleSpinBox()
        self._interval_spin.setRange(0.25, 24)
        self._interval_spin.setSingleStep(0.5)
        self._interval_spin.setValue(2.0)
        self._interval_spin.setSuffix(" hours")
        self._interval_spin.setFixedWidth(130)
        interval_row.addWidget(self._interval_spin)
        interval_row.addStretch()
        sched_layout.addLayout(interval_row)

        threshold_row = QHBoxLayout()
        threshold_row.addWidget(QLabel("Generate applications for jobs scoring >="))
        self._threshold_spin = QSpinBox()
        self._threshold_spin.setRange(0, 100)
        self._threshold_spin.setValue(70)
        self._threshold_spin.setSuffix(" / 100")
        self._threshold_spin.setFixedWidth(100)
        threshold_row.addWidget(self._threshold_spin)
        threshold_row.addStretch()
        sched_layout.addLayout(threshold_row)
        layout.addWidget(sched_frame)

        # ── JOB SOURCES ──────────────────────────────────────────────────
        layout.addWidget(SectionHeader("Job Sources"))
        sources_frame = self._build_card()
        sources_layout = QVBoxLayout(sources_frame)
        sources_layout.setContentsMargins(20, 18, 20, 18)
        sources_layout.setSpacing(10)

        self._source_checks = {}
        source_labels = {
            "remoteok":       ("RemoteOK — Curated remote tech/ops jobs (JSON API)", True),
            "remotive":       ("Remotive — Remote jobs across writing, product, ops (JSON API)", True),
            "jobicy":         ("Jobicy — Remote jobs (JSON API)", True),
            "weworkremotely": ("We Work Remotely — Writing, design, product, mgmt (RSS)", True),
            "remoteco":       ("Remote.co — Executive, consulting (RSS) [currently slow]", False),
        }
        for key, (label, default_on) in source_labels.items():
            cb = QCheckBox(label)
            cb.setChecked(default_on)
            cb.setStyleSheet(f"""
                QCheckBox {{ color: {theme.TEXT}; font-size: 13px; spacing: 10px; }}
                QCheckBox::indicator {{
                    width: 18px; height: 18px;
                    border: 1px solid {theme.BORDER2}; border-radius: 4px;
                    background: {theme.SURFACE2};
                }}
                QCheckBox::indicator:checked {{
                    background: {theme.ACCENT}; border-color: {theme.ACCENT};
                }}
            """)
            self._source_checks[key] = cb
            sources_layout.addWidget(cb)
        layout.addWidget(sources_frame)

        # ── ADDITIONAL NOTES ─────────────────────────────────────────────
        layout.addWidget(SectionHeader("Additional Context for Applications"))
        bio_frame = self._build_card()
        bio_layout = QVBoxLayout(bio_frame)
        bio_layout.setContentsMargins(20, 18, 20, 18)
        bio_layout.setSpacing(8)

        bio_hint = QLabel(
            "Your full professional profile is built-in. Add any current context to supplement."
        )
        bio_hint.setStyleSheet(f"color: {theme.TEXT_DIM}; font-size: 12px;")
        bio_hint.setWordWrap(True)
        bio_layout.addWidget(bio_hint)

        self._bio_extra = QTextEdit()
        self._bio_extra.setPlaceholderText(
            "e.g. 'Available immediately. Open to 1099 or W2.'\n"
            "     'Target $100K+ base. Equity a plus.'"
        )
        self._bio_extra.setFixedHeight(90)
        self._bio_extra.setStyleSheet(f"""
            background: {theme.SURFACE2}; color: {theme.TEXT};
            border: 1px solid {theme.BORDER}; border-radius: 6px;
            font-size: 12px; padding: 10px;
        """)
        bio_layout.addWidget(self._bio_extra)
        layout.addWidget(bio_frame)

        layout.addStretch()
        scroll.setWidget(content)
        root.addWidget(scroll, 1)

        # Save bar
        save_bar = QFrame()
        save_bar.setFixedHeight(64)
        save_bar.setStyleSheet(f"background: {theme.SURFACE2}; border-top: 1px solid {theme.BORDER};")
        sl = QHBoxLayout(save_bar)
        sl.setContentsMargins(28, 0, 28, 0)
        sl.setSpacing(12)

        self._save_status = QLabel("")
        self._save_status.setStyleSheet(f"color: {theme.SUCCESS}; font-size: 12px;")
        sl.addWidget(self._save_status, 1)

        save_btn = QPushButton("Save Settings")
        save_btn.setObjectName("primary")
        save_btn.setFixedHeight(40)
        save_btn.setFixedWidth(160)
        save_btn.clicked.connect(self._save)
        sl.addWidget(save_btn)

        root.addWidget(save_bar)

    def _build_card(self):
        frame = QFrame()
        frame.setStyleSheet(f"""
            QFrame {{
                background: {theme.SURFACE};
                border: 1px solid {theme.BORDER};
                border-radius: 10px;
            }}
        """)
        return frame

    def _load(self):
        interval = db.get_config("search_interval_hours", 2.0)
        self._interval_spin.setValue(float(interval))

        threshold = db.get_config("score_threshold", 70)
        self._threshold_spin.setValue(int(threshold))

        enabled = db.get_config("enabled_sources", list(job_sources.ALL_SOURCES.keys()))
        for key, cb in self._source_checks.items():
            cb.setChecked(key in enabled)

        bio_extra = db.get_config("bio_extra", "")
        self._bio_extra.setPlainText(bio_extra or "")

    def _save(self):
        db.set_config("search_interval_hours", self._interval_spin.value())
        db.set_config("score_threshold", self._threshold_spin.value())

        enabled = [k for k, cb in self._source_checks.items() if cb.isChecked()]
        db.set_config("enabled_sources", enabled)
        db.set_config("bio_extra", self._bio_extra.toPlainText())

        self._save_status.setText("Saved")
        QTimer.singleShot(3000, lambda: self._save_status.setText(""))
        self.settings_saved.emit()
