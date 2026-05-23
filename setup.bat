@echo off
title Kahn Income System — Setup
echo.
echo  ============================================
echo   KAHN INCOME SYSTEM — SETUP
echo  ============================================
echo.

:: Find Python
set PYTHON=
for %%p in (
    "C:\Users\iAmiK\AppData\Local\Python\pythoncore-3.14-64\python.exe"
    "C:\Python313\python.exe"
    "C:\Python312\python.exe"
    "C:\Python311\python.exe"
    "C:\Python310\python.exe"
) do (
    if exist %%p (
        set PYTHON=%%p
        goto :found_python
    )
)

:: Try PATH
python --version >nul 2>&1
if %errorlevel%==0 (
    set PYTHON=python
    goto :found_python
)

echo  ERROR: Python not found. Install Python 3.10+ from python.org
pause
exit /b 1

:found_python
echo  Python found: %PYTHON%
echo.
echo  Installing dependencies...
%PYTHON% -m pip install -r requirements.txt --quiet
if %errorlevel% neq 0 (
    echo  ERROR: pip install failed.
    pause
    exit /b 1
)

echo.
echo  ============================================
echo   Setup complete! Launching...
echo  ============================================
echo.
%PYTHON% main.py
