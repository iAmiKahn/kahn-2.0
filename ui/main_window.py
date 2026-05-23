"""
Main application window — sidebar nav, stacked content panels, system tray.
Revision 2: generation_blocked / tone_calibrated signal wiring, collapsible sidebar.
"""

from PySide6.QtWidgets import (
    QMainWindow, QWidget, QHBoxLayout, QVBoxLayout, QLabel,
    QPushButton, QStackedWidget, QFrame, QSizePolicy,
    QSystemTrayIcon, QMenu,
)
from PySide6.QtCore import Qt, QTimer, QSize, QPropertyAnimation, QEasingCurve
from PySide6.QtGui import QIcon, QFont, QPixmap, QColor, QPainter, QBrush

from ui import theme
from ui.widgets import NavButton, SectionHeader, Divider
from ui.dashboard import DashboardView
from ui.jobs_view import JobsView
from ui.review_view import ReviewView
from ui.settings_view import SettingsView
from engine import database as db
from engine.scheduler import SchedulerEngine


def _make_icon(color_hex="#7B2FBE", size=32):
    """Generate a simple colored circle icon (no external files needed)."""
    px = QPixmap(size, size)
    px.fill(Qt.transparent)
    painter = QPainter(px)
    painter.setRenderHint(QPainter.Antialiasing)
    painter.setBrush(QBrush(QColor(color_hex)))
    painter.setPen(Qt.NoPen)
    painter.drawEllipse(2, 2, size - 4, size - 4)
    painter.end()
    return QIcon(px)


class Sidebar(QFrame):
    """Left navigation panel — collapsible."""

    NAV_ITEMS = [
        ("⬡", "Dashboard",    0),
        ("◈", "Jobs",         1),
        ("◉", "Review",       2),
        ("⚙", "Settings",     3),
    ]

    EXPANDED_WIDTH = 210
    COLLAPSED_WIDTH = 56

    def __init__(self, parent=None):
        super().__init__(parent)
        self._expanded = True
        self.setFixedWidth(self.EXPANDED_WIDTH)
        self.setStyleSheet(f"""
            QFrame {{
                background-color: {theme.SURFACE};
                border-right: 1px solid {theme.BORDER};
                border-radius: 0px;
            }}
        """)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        # Logo / title area
        logo_area = QWidget()
        logo_area.setFixedHeight(68)
        logo_area.setStyleSheet(f"background: {theme.SURFACE2}; border-bottom: 1px solid {theme.BORDER};")
        ll = QHBoxLayout(logo_area)
        ll.setContentsMargins(16, 0, 8, 0)
        ll.setSpacing(10)

        self._dot = QLabel("◈")
        self._dot.setStyleSheet(f"color: {theme.ACCENT}; font-size: 22px;")
        ll.addWidget(self._dot)

        self._title_vbox = QWidget()
        tv = QVBoxLayout(self._title_vbox)
        tv.setContentsMargins(0, 0, 0, 0)
        tv.setSpacing(0)
        title = QLabel("KAHN")
        title.setStyleSheet(f"color: {theme.TEXT}; font-size: 15px; font-weight: 700; letter-spacing: 2px;")
        sub = QLabel("Income System")
        sub.setStyleSheet(f"color: {theme.TEXT_MUTED}; font-size: 10px; letter-spacing: 1px;")
        tv.addWidget(title)
        tv.addWidget(sub)
        ll.addWidget(self._title_vbox, 1)

        # Collapse toggle
        self._toggle_btn = QPushButton("‹")
        self._toggle_btn.setFixedSize(24, 24)
        self._toggle_btn.setStyleSheet(f"""
            QPushButton {{
                background: transparent;
                color: {theme.TEXT_MUTED};
                border: none;
                font-size: 16px;
                font-weight: 700;
            }}
            QPushButton:hover {{ color: {theme.TEXT}; }}
        """)
        self._toggle_btn.setToolTip("Collapse sidebar")
        self._toggle_btn.clicked.connect(self.toggle_collapse)
        ll.addWidget(self._toggle_btn)

        layout.addWidget(logo_area)
        layout.addSpacing(8)

        # Nav buttons
        self._nav_buttons = {}
        for icon, label, idx in self.NAV_ITEMS:
            btn = NavButton(icon, label)
            btn.setFixedHeight(48)
            btn.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Fixed)
            btn.clicked.connect(lambda checked, i=idx: self._nav_clicked(i))
            self._nav_buttons[idx] = btn
            layout.addWidget(btn)

        layout.addStretch()

        # Bottom status
        self._status_dot = QLabel("● Initializing")
        self._status_dot.setStyleSheet(f"color: {theme.TEXT_MUTED}; font-size: 11px; padding: 12px 16px;")
        layout.addWidget(self._status_dot)

        self._active_idx = 0
        self._nav_buttons[0].set_active(True)
        self._callback = None

    def toggle_collapse(self):
        self._expanded = not self._expanded
        if self._expanded:
            self.setFixedWidth(self.EXPANDED_WIDTH)
            self._title_vbox.setVisible(True)
            self._toggle_btn.setText("‹")
            self._toggle_btn.setToolTip("Collapse sidebar")
            self._status_dot.setVisible(True)
            for btn in self._nav_buttons.values():
                btn.set_label_visible(True)
        else:
            self.setFixedWidth(self.COLLAPSED_WIDTH)
            self._title_vbox.setVisible(False)
            self._toggle_btn.setText("›")
            self._toggle_btn.setToolTip("Expand sidebar")
            self._status_dot.setVisible(False)
            for btn in self._nav_buttons.values():
                btn.set_label_visible(False)

    def set_nav_callback(self, callback):
        self._callback = callback

    def _nav_clicked(self, idx):
        for i, btn in self._nav_buttons.items():
            btn.set_active(i == idx)
        self._active_idx = idx
        if self._callback:
            self._callback(idx)

    def navigate_to(self, idx):
        """Programmatically activate a nav item and switch page."""
        self._nav_clicked(idx)

    def set_badge(self, page_idx, count):
        btn = self._nav_buttons.get(page_idx)
        if btn:
            btn.set_badge(count)

    def set_status(self, status):
        colors = {
            "running":   theme.SUCCESS,
            "waiting":   theme.CYAN,
            "paused":    theme.WARNING,
            "no_ollama": theme.WARNING,
            "stopped":   theme.TEXT_MUTED,
        }
        labels = {
            "running":   "● Searching",
            "waiting":   "● Waiting",
            "paused":    "● Paused",
            "no_ollama": "● No Ollama",
            "stopped":   "● Stopped",
        }
        color = colors.get(status, theme.TEXT_MUTED)
        label = labels.get(status, "●")
        self._status_dot.setText(label)
        self._status_dot.setStyleSheet(f"color: {color}; font-size: 11px; padding: 12px 16px;")


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Kahn Income System")
        self.setMinimumSize(1024, 680)
        self.resize(1400, 860)
        self.setWindowIcon(_make_icon(theme.ACCENT))

        # Init DB
        db.init_db()

        # ── CENTRAL WIDGET ───────────────────────────────────────────────
        central = QWidget()
        central.setStyleSheet(f"background: {theme.BG};")
        self.setCentralWidget(central)

        root = QHBoxLayout(central)
        root.setContentsMargins(0, 0, 0, 0)
        root.setSpacing(0)

        # Sidebar
        self._sidebar = Sidebar()
        self._sidebar.set_nav_callback(self._navigate)
        root.addWidget(self._sidebar)

        # Stacked pages
        self._stack = QStackedWidget()
        self._stack.setStyleSheet(f"background: {theme.BG};")
        root.addWidget(self._stack, 1)

        # ── SCHEDULER ────────────────────────────────────────────────────
        self._scheduler = SchedulerEngine(self)
        self._scheduler.log_signal.connect(self._on_log)
        self._scheduler.stats_updated.connect(self._on_stats_updated)
        self._scheduler.status_changed.connect(self._on_status_changed)
        self._scheduler.run_complete.connect(self._on_run_complete)

        # ── PAGES ────────────────────────────────────────────────────────
        self._dashboard = DashboardView(scheduler=self._scheduler)
        self._jobs = JobsView()
        self._review = ReviewView()
        self._settings = SettingsView()

        self._stack.addWidget(self._dashboard)
        self._stack.addWidget(self._jobs)
        self._stack.addWidget(self._review)
        self._stack.addWidget(self._settings)

        self._settings.settings_saved.connect(self._on_settings_saved)

        # ── SYSTEM TRAY ──────────────────────────────────────────────────
        self._setup_tray()

        # ── INITIAL LOAD ─────────────────────────────────────────────────
        self._dashboard.load_recent_activity()
        self._dashboard.refresh_stats()
        self._update_review_badge()

        # Start scheduler
        self._scheduler.start()

        # Periodic badge refresh every 30s
        self._badge_timer = QTimer(self)
        self._badge_timer.timeout.connect(self._update_review_badge)
        self._badge_timer.start(30_000)

    # ── NAVIGATION ───────────────────────────────────────────────────────

    def _navigate(self, idx):
        self._stack.setCurrentIndex(idx)
        if idx == 1:
            self._jobs.refresh()
        elif idx == 2:
            self._review.refresh()

    def _navigate_to(self, idx):
        """Navigate programmatically (updates both sidebar highlight and stack)."""
        self._sidebar.navigate_to(idx)
        self._navigate(idx)

    # ── SCHEDULER SIGNAL HANDLERS ────────────────────────────────────────

    def _on_log(self, message, level):
        self._dashboard.add_activity(message, level)

    def _on_stats_updated(self):
        self._dashboard.refresh_stats()
        self._update_review_badge()

    def _on_status_changed(self, status):
        self._sidebar.set_status(status)
        self._dashboard.update_scheduler_status(status)

    def _on_run_complete(self, summary):
        apps_gen = summary.get("apps_generated", 0)
        self._update_review_badge()
        if apps_gen > 0:
            self._show_tray_notification(
                f"{apps_gen} new application{'s' if apps_gen > 1 else ''} ready for review"
            )

    # ── SETTINGS SIGNAL HANDLERS ─────────────────────────────────────────

    def _on_settings_saved(self):
        self._dashboard.add_activity("Settings saved", "info")

    # ── BADGE ────────────────────────────────────────────────────────────

    def _update_review_badge(self):
        count = self._review.pending_count()
        self._sidebar.set_badge(2, count)

    # ── SYSTEM TRAY ──────────────────────────────────────────────────────

    def _setup_tray(self):
        self._tray = QSystemTrayIcon(self)
        self._tray.setIcon(_make_icon(theme.ACCENT))
        self._tray.setToolTip("Kahn Income System")

        tray_menu = QMenu()
        tray_menu.setStyleSheet(f"""
            QMenu {{
                background: {theme.SURFACE2};
                color: {theme.TEXT};
                border: 1px solid {theme.BORDER};
                border-radius: 6px;
                padding: 4px;
            }}
            QMenu::item:selected {{
                background: {theme.ACCENT_DIM};
            }}
        """)
        show_action = tray_menu.addAction("Show Window")
        show_action.triggered.connect(self.showNormal)
        run_action = tray_menu.addAction("Run Search Now")
        run_action.triggered.connect(self._scheduler.trigger_now)
        tray_menu.addSeparator()
        quit_action = tray_menu.addAction("Quit")
        quit_action.triggered.connect(self._quit)

        self._tray.setContextMenu(tray_menu)
        self._tray.activated.connect(self._tray_activated)
        self._tray.show()

    def _show_tray_notification(self, message):
        self._tray.showMessage("Kahn Income System", message, QSystemTrayIcon.Information, 4000)

    def _tray_activated(self, reason):
        if reason == QSystemTrayIcon.DoubleClick:
            self.showNormal()
            self.activateWindow()

    def _quit(self):
        self._scheduler.stop()
        self._tray.hide()
        self.close()

    def closeEvent(self, event):
        # Minimize to tray instead of closing
        event.ignore()
        self.hide()
        self._tray.showMessage(
            "Kahn Income System",
            "Still running in the background. Right-click tray icon to quit.",
            QSystemTrayIcon.Information,
            3000,
        )
