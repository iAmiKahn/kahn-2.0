"""
Kahn Income System — Entry Point
Remote income acquisition system: searches, scores, and generates job applications.
"""

import sys
import os
import logging

# Ensure the project root is on the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from PySide6.QtWidgets import QApplication
from PySide6.QtCore import Qt
from PySide6.QtGui import QFont

from ui import theme
from ui.main_window import MainWindow

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler(
            open(sys.stdout.fileno(), mode="w", encoding="utf-8", closefd=False)
            if hasattr(sys.stdout, "fileno") else sys.stdout
        ),
    ],
)


def main():
    # High-DPI support
    os.environ.setdefault("QT_ENABLE_HIGHDPI_SCALING", "1")

    app = QApplication(sys.argv)
    app.setApplicationName("Kahn Income System")
    app.setOrganizationName("Kahn")
    app.setStyle("Fusion")

    # Apply global stylesheet
    app.setStyleSheet(theme.GLOBAL_QSS)

    # Default font
    font = QFont("Segoe UI", 10)
    app.setFont(font)

    window = MainWindow()
    window.show()

    sys.exit(app.exec())


if __name__ == "__main__":
    main()
