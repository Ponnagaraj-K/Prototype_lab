@echo off
echo Starting StudyMate Pro...
echo.
echo Step 1: Starting MongoDB (requires admin)
net start MongoDB
if %errorlevel% neq 0 (
    echo MongoDB service not started. Starting manually...
    start "MongoDB" "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"
)
echo.
echo Step 2: Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run dev"
timeout /t 3
echo.
echo Step 3: Starting Frontend Server...
start "Frontend" cmd /k "npm run dev"
echo.
echo All services started!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:8080
