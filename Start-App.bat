@echo off
title Bilan Modern Workshop App Launcher
echo ========================================================
echo   BILAN MODERN WORKSHOP - APPLICATION LAUNCHER
echo   Aluminium, PVC & Qurxinta Casriga ah ee Muqdisho
echo   WhatsApp / Phone: +252 61 800 4826
echo ========================================================
echo.
echo Application-ka ayaa hadda furmaya... Fadlan sug wax yar.

set APP_PATH=%~dp0index.html

:: Try Edge in Standalone App Mode
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app="file:///%APP_PATH%"
    exit
)
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app="file:///%APP_PATH%"
    exit
)

:: Try Google Chrome in Standalone App Mode
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app="file:///%APP_PATH%"
    exit
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app="file:///%APP_PATH%"
    exit
)

:: Fallback to default browser
start "" "%APP_PATH%"
exit
