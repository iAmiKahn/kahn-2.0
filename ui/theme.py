"""
Theme — dark Nebula aesthetic. Deep navy/black base, purple/cyan accents.
"""

# ─── PALETTE ──────────────────────────────────────────────────────────────────

BG          = "#0A0A0F"      # Near black
SURFACE     = "#12121C"      # Card/panel background
SURFACE2    = "#1A1A28"      # Elevated surface
SURFACE3    = "#222235"      # Hover/selected
BORDER      = "#2A2A40"      # Subtle borders
BORDER2     = "#3A3A55"      # Active borders

ACCENT      = "#7B2FBE"      # Primary purple
ACCENT_LITE = "#9B4FDE"      # Lighter purple
ACCENT_DIM  = "#4A1A7E"      # Dimmed purple

CYAN        = "#00D4FF"      # Highlights / links
CYAN_DIM    = "#007A99"

TEXT        = "#E8E8F0"      # Primary text
TEXT_DIM    = "#9090AA"      # Secondary text
TEXT_MUTED  = "#55556A"      # Disabled/muted

SUCCESS     = "#00C97D"      # Green
SUCCESS_DIM = "#006640"
WARNING     = "#FFB300"      # Amber
WARNING_DIM = "#664800"
ERROR       = "#FF4757"      # Red
ERROR_DIM   = "#661A20"

SCORE_HIGH   = "#00C97D"     # 70+
SCORE_MED    = "#FFB300"     # 50-69
SCORE_LOW    = "#FF4757"     # <50

FONT_FAMILY = "Segoe UI"
FONT_MONO   = "Consolas"


# ─── GLOBAL STYLESHEET ────────────────────────────────────────────────────────

GLOBAL_QSS = f"""
QMainWindow, QDialog, QWidget {{
    background-color: {BG};
    color: {TEXT};
    font-family: "{FONT_FAMILY}";
    font-size: 13px;
}}

QFrame {{
    background-color: transparent;
    border: none;
}}

/* ── SCROLLBARS ── */
QScrollBar:vertical {{
    background: {SURFACE};
    width: 8px;
    border-radius: 4px;
}}
QScrollBar::handle:vertical {{
    background: {BORDER2};
    border-radius: 4px;
    min-height: 30px;
}}
QScrollBar::handle:vertical:hover {{
    background: {ACCENT};
}}
QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {{
    height: 0;
}}
QScrollBar:horizontal {{
    background: {SURFACE};
    height: 8px;
    border-radius: 4px;
}}
QScrollBar::handle:horizontal {{
    background: {BORDER2};
    border-radius: 4px;
    min-width: 30px;
}}
QScrollBar::handle:horizontal:hover {{
    background: {ACCENT};
}}
QScrollBar::add-line:horizontal, QScrollBar::sub-line:horizontal {{
    width: 0;
}}

/* ── BUTTONS ── */
QPushButton {{
    background-color: {SURFACE2};
    color: {TEXT};
    border: 1px solid {BORDER};
    border-radius: 6px;
    padding: 8px 18px;
    font-size: 13px;
    font-weight: 500;
}}
QPushButton:hover {{
    background-color: {SURFACE3};
    border-color: {BORDER2};
}}
QPushButton:pressed {{
    background-color: {ACCENT_DIM};
    border-color: {ACCENT};
}}
QPushButton:disabled {{
    color: {TEXT_MUTED};
    border-color: {BORDER};
}}

QPushButton#primary {{
    background-color: {ACCENT};
    color: white;
    border-color: {ACCENT};
    font-weight: 600;
}}
QPushButton#primary:hover {{
    background-color: {ACCENT_LITE};
    border-color: {ACCENT_LITE};
}}
QPushButton#success {{
    background-color: {SUCCESS_DIM};
    color: {SUCCESS};
    border-color: {SUCCESS};
    font-weight: 600;
}}
QPushButton#success:hover {{
    background-color: {SUCCESS};
    color: {BG};
}}
QPushButton#danger {{
    background-color: {ERROR_DIM};
    color: {ERROR};
    border-color: {ERROR};
}}
QPushButton#danger:hover {{
    background-color: {ERROR};
    color: white;
}}
QPushButton#ghost {{
    background-color: transparent;
    border-color: transparent;
    color: {TEXT_DIM};
}}
QPushButton#ghost:hover {{
    color: {TEXT};
    background-color: {SURFACE2};
}}

/* ── INPUTS ── */
QLineEdit, QTextEdit, QPlainTextEdit {{
    background-color: {SURFACE};
    color: {TEXT};
    border: 1px solid {BORDER};
    border-radius: 6px;
    padding: 8px 12px;
    selection-background-color: {ACCENT};
}}
QLineEdit:focus, QTextEdit:focus, QPlainTextEdit:focus {{
    border-color: {ACCENT};
}}

QComboBox {{
    background-color: {SURFACE};
    color: {TEXT};
    border: 1px solid {BORDER};
    border-radius: 6px;
    padding: 7px 12px;
}}
QComboBox:focus {{
    border-color: {ACCENT};
}}
QComboBox::drop-down {{
    border: none;
    width: 24px;
}}
QComboBox::down-arrow {{
    width: 10px;
    height: 10px;
}}
QComboBox QAbstractItemView {{
    background-color: {SURFACE2};
    color: {TEXT};
    border: 1px solid {BORDER2};
    selection-background-color: {ACCENT};
}}

QSpinBox, QDoubleSpinBox {{
    background-color: {SURFACE};
    color: {TEXT};
    border: 1px solid {BORDER};
    border-radius: 6px;
    padding: 7px 10px;
}}
QSpinBox:focus, QDoubleSpinBox:focus {{
    border-color: {ACCENT};
}}

/* ── TABLES ── */
QTableWidget, QTableView {{
    background-color: {SURFACE};
    color: {TEXT};
    border: 1px solid {BORDER};
    border-radius: 8px;
    gridline-color: {BORDER};
    selection-background-color: {ACCENT_DIM};
    selection-color: {TEXT};
    outline: none;
}}
QHeaderView::section {{
    background-color: {SURFACE2};
    color: {TEXT_DIM};
    border: none;
    border-bottom: 1px solid {BORDER};
    padding: 10px 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}}
QTableWidget::item, QTableView::item {{
    padding: 8px 12px;
    border-bottom: 1px solid {BORDER};
}}
QTableWidget::item:selected, QTableView::item:selected {{
    background-color: {ACCENT_DIM};
}}
QTableWidget::item:hover, QTableView::item:hover {{
    background-color: {SURFACE3};
}}

/* ── LABELS ── */
QLabel#heading {{
    font-size: 22px;
    font-weight: 700;
    color: {TEXT};
}}
QLabel#subheading {{
    font-size: 15px;
    font-weight: 600;
    color: {TEXT};
}}
QLabel#section_label {{
    font-size: 11px;
    font-weight: 700;
    color: {TEXT_MUTED};
    text-transform: uppercase;
    letter-spacing: 1px;
}}
QLabel#muted {{
    color: {TEXT_DIM};
    font-size: 12px;
}}
QLabel#stat_value {{
    font-size: 32px;
    font-weight: 700;
    color: {TEXT};
}}
QLabel#stat_label {{
    font-size: 11px;
    color: {TEXT_DIM};
    text-transform: uppercase;
    letter-spacing: 0.5px;
}}

/* ── MISC ── */
QToolTip {{
    background-color: {SURFACE3};
    color: {TEXT};
    border: 1px solid {BORDER2};
    border-radius: 4px;
    padding: 4px 8px;
}}

QSplitter::handle {{
    background-color: {BORDER};
}}
QSplitter::handle:hover {{
    background-color: {ACCENT};
}}
"""


def score_color(score):
    """Return CSS color string for a score value."""
    if score is None:
        return TEXT_MUTED
    if score >= 70:
        return SCORE_HIGH
    if score >= 50:
        return SCORE_MED
    return SCORE_LOW


def status_color(status):
    """Return (bg, fg) color tuple for an application status badge."""
    mapping = {
        "new": (SURFACE3, TEXT_DIM),
        "scored": (SURFACE3, TEXT_DIM),
        "application_ready": (ACCENT_DIM, ACCENT_LITE),
        "pending_review": (WARNING_DIM, WARNING),
        "approved": (SUCCESS_DIM, SUCCESS),
        "rejected": (ERROR_DIM, ERROR),
        "submitted": (ACCENT_DIM, CYAN),
    }
    return mapping.get(status, (SURFACE3, TEXT_DIM))
