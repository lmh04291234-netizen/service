@echo off
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"
echo Starting Matjam at http://localhost:3000
echo Keep this window open while using the site.
npm run dev
pause
