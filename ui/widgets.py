"""
Shared UI widgets — reusable components used across views.
"""

from PySide6.QtWidgets import (
    QFrame, QLabel, QVBoxLayout, QHBoxLayout, QWidget,
    QPushButton, QGraphicsDropShadowEffect,
)
from PySide6.QtCore import Qt, Signal, QTimer
from PySide6.QtGui import QColor, QFont

from ui import theme


class Card(QFrame):
    """Elevated surface card with optional title."""
    def __init__(self, parent=None, padding=16):
        super().__init__(parent)
        self.setStyleSheet(f"""
            QFrame {{
                background-color: {theme.SURFACE};
                border: 1px solid {theme.BORDER};
                border-radius: 10px;
            }}
        """)
        self._layout = QVBoxLayout(self)
        self._layout.setContentsMargins(padding, padding, padding, padding)
        self._layout.setSpacing(10)

    def layout(self):
        return self._layout


class StatCard(QFrame):
    """Big number stat card."""
    def __init__(self, value, label, color=None, parent=None):
        super().__init__(parent)
        self.setFixedHeight(100)
        self.setStyleSheet(f"""
            QFrame {{
                background-color: {theme.SURFACE};
                border: 1px solid {theme.BORDER};
                border-radius: 10px;
            }}
        """)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 14, 20, 14)
        layout.setSpacing(4)

        self._value_label = QLabel(str(value))
        self._value_label.setObjectName("stat_value")
        if color:
            self._value_label.setStyleSheet(f"color: {color}; font-size: 32px; font-weight: 700;")

        self._desc_label = QLabel(label)
        self._desc_label.setObjectName("stat_label")

        layout.addWidget(self._value_label)
        layout.addWidget(self._desc_label)

    def set_value(self, value, color=None):
        self._value_label.setText(str(value))
        if color:
            self._value_label.setStyleSheet(f"color: {color}; font-size: 32px; font-weight: 700;")


class ScoreBadge(QLabel):
    """Colored score pill."""
    def __init__(self, score=None, parent=None):
        super().__init__(parent)
        self.setAlignment(Qt.AlignCenter)
        self.setFixedSize(48, 24)
        self.set_score(score)

    def set_score(self, score):
        if score is None:
            self.setText("—")
            self.setStyleSheet(f"""
                background: {theme.SURFACE3};
                color: {theme.TEXT_MUTED};
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;
                padding: 2px 6px;
            """)
            return
        color = theme.score_color(score)
        self.setText(str(score))
        self.setStyleSheet(f"""
            background: transparent;
            color: {color};
            border: 1px solid {color};
            border-radius: 4px;
            font-size: 12px;
            font-weight: 700;
            padding: 2px 6px;
        """)


class StatusBadge(QLabel):
    """Colored status pill."""
    STATUS_LABELS = {
        "new": "NEW",
        "scored": "SCORED",
        "application_ready": "READY",
        "pending_review": "REVIEW",
        "approved": "APPROVED",
        "rejected": "REJECTED",
        "submitted": "SUBMITTED",
    }

    def __init__(self, status="new", parent=None):
        super().__init__(parent)
        self.setAlignment(Qt.AlignCenter)
        self.setFixedHeight(22)
        self.set_status(status)

    def set_status(self, status):
        bg, fg = theme.status_color(status)
        label = self.STATUS_LABELS.get(status, status.upper())
        self.setText(label)
        self.setStyleSheet(f"""
            background: {bg};
            color: {fg};
            border-radius: 4px;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.5px;
            padding: 0px 8px;
        """)


class ActivityItem(QFrame):
    """Single activity log entry."""
    LEVEL_COLORS = {
        "info":    theme.TEXT_DIM,
        "success": theme.SUCCESS,
        "warning": theme.WARNING,
        "error":   theme.ERROR,
    }
    LEVEL_ICONS = {
        "info":    "●",
        "success": "✓",
        "warning": "⚠",
        "error":   "✕",
    }

    def __init__(self, timestamp, message, level="info", parent=None):
        super().__init__(parent)
        self.setStyleSheet("QFrame { background: transparent; border: none; }")
        layout = QHBoxLayout(self)
        layout.setContentsMargins(0, 2, 0, 2)
        layout.setSpacing(8)

        color = self.LEVEL_COLORS.get(level, theme.TEXT_DIM)
        icon = self.LEVEL_ICONS.get(level, "●")

        dot = QLabel(icon)
        dot.setFixedWidth(14)
        dot.setStyleSheet(f"color: {color}; font-size: 10px;")
        layout.addWidget(dot)

        # Parse time from ISO string
        try:
            from datetime import datetime
            dt = datetime.fromisoformat(timestamp)
            time_str = dt.strftime("%H:%M:%S")
        except Exception:
            time_str = timestamp[:8] if len(timestamp) >= 8 else timestamp

        time_lbl = QLabel(time_str)
        time_lbl.setFixedWidth(60)
        time_lbl.setStyleSheet(f"color: {theme.TEXT_MUTED}; font-size: 11px; font-family: Consolas;")
        layout.addWidget(time_lbl)

        msg_lbl = QLabel(message)
        msg_lbl.setStyleSheet(f"color: {color}; font-size: 12px;")
        msg_lbl.setWordWrap(True)
        layout.addWidget(msg_lbl, 1)


class SectionHeader(QLabel):
    """Uppercase section divider label."""
    def __init__(self, text, parent=None):
        super().__init__(text.upper(), parent)
        self.setObjectName("section_label")
        self.setStyleSheet(f"""
            color: {theme.TEXT_MUTED};
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1.5px;
            padding: 8px 0px 4px 0px;
        """)


class NavButton(QPushButton):
    """Left sidebar navigation button — supports collapsed (icon-only) mode."""
    def __init__(self, icon, label, badge_count=0, parent=None):
        super().__init__(parent)
        self._icon_char = icon
        self._label = label
        self._badge = badge_count
        self._active = False
        self._label_visible = True
        self._render()

    def _render(self):
        if self._label_visible:
            badge_html = (
                f' <span style="background:{theme.ACCENT};color:white;'
                f'border-radius:8px;padding:1px 6px;font-size:10px;">{self._badge}</span>'
                if self._badge > 0 else ""
            )
            self.setText(f"{self._icon_char}  {self._label}{badge_html}")
        else:
            # Collapsed: icon only, badge as superscript dot if non-zero
            dot = (
                f'<sup style="color:{theme.ACCENT};font-size:8px;">●</sup>'
                if self._badge > 0 else ""
            )
            self.setText(f"{self._icon_char}{dot}")
        self._apply_style()

    def _apply_style(self):
        align = "center" if not self._label_visible else "left"
        padding = "12px 4px" if not self._label_visible else "12px 16px"
        if self._active:
            self.setStyleSheet(f"""
                QPushButton {{
                    background-color: {theme.ACCENT_DIM};
                    color: {theme.TEXT};
                    border: none;
                    border-left: 3px solid {theme.ACCENT};
                    border-radius: 0px;
                    text-align: {align};
                    padding: {padding};
                    font-size: 14px;
                    font-weight: 600;
                }}
            """)
        else:
            self.setStyleSheet(f"""
                QPushButton {{
                    background-color: transparent;
                    color: {theme.TEXT_DIM};
                    border: none;
                    border-left: 3px solid transparent;
                    border-radius: 0px;
                    text-align: {align};
                    padding: {padding};
                    font-size: 14px;
                }}
                QPushButton:hover {{
                    background-color: {theme.SURFACE2};
                    color: {theme.TEXT};
                }}
            """)

    def set_active(self, active):
        self._active = active
        self._apply_style()

    def set_badge(self, count):
        self._badge = count
        self._render()

    def set_label_visible(self, visible):
        """Toggle between full label and icon-only collapsed mode."""
        self._label_visible = visible
        self._render()


class Divider(QFrame):
    """Horizontal rule."""
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setFrameShape(QFrame.HLine)
        self.setFixedHeight(1)
        self.setStyleSheet(f"background-color: {theme.BORDER}; border: none;")
