@echo off
title Corporate Intranet - Full Startup
color 0A

cls
echo.
echo ============================================================
echo  CORPORATE INTRANET PLATFORM - FULL STARTUP
echo ============================================================
echo.
echo This will:
echo   1. Check Docker services
echo   2. Setup database (migrate + seed)
echo   3. Start API server (port 4000)
echo   4. Start Web server (port 3000)
echo   5. Open browser
echo.
echo ============================================================
echo.

REM Set Node path
set PATH=E:\;%PATH%

REM Check Docker
echo [1/5] Checking Docker services...
docker ps | findstr "intranet_postgres" >nul
if %errorlevel% neq 0 (
    echo [ERROR] PostgreSQL container not running!
    echo Run: docker-compose up -d postgres redis
    pause
    exit /b 1
)
echo [OK] Docker services running
echo.

REM Setup database
echo [2/5] Setting up database...
cd apps\api

echo   - Generating Prisma client...
call npx prisma generate

echo   - Running migrations...
call npx prisma migrate deploy

echo   - Seeding database...
call npx ts-node prisma/seed.ts

cd ..\..
echo [OK] Database ready
echo.

REM Start API server
echo [3/5] Starting API server...
start "Corporate Intranet - API Server" cmd /k "title API Server (Port 4000) && cd apps\api && npm run start:dev"
echo [OK] API server starting...
echo Waiting 20 seconds for API to initialize...
ping 127.0.0.1 -n 21 >nul
echo.

REM Start Web server
echo [4/5] Starting Web server...
start "Corporate Intranet - Web Server" cmd /k "title Web Server (Port 3000) && cd apps\web && npm run dev"
echo [OK] Web server starting...
echo Waiting 15 seconds for Web to initialize...
ping 127.0.0.1 -n 16 >nul
echo.

REM Open browser
echo [5/5] Opening browser...
start http://localhost:3000
echo.

echo ============================================================
echo  APPLICATION STARTED SUCCESSFULLY!
echo ============================================================
echo.
echo  Frontend:  http://localhost:3000
echo  API:       http://localhost:4000/api
echo  Swagger:   http://localhost:4000/api/docs
echo.
echo  Login Credentials:
echo    Email:    admin@acme.com
echo    Password: Password123!
echo.
echo  Two windows opened:
echo    - API Server (Port 4000)
echo    - Web Server (Port 3000)
echo.
echo  Keep those windows open!
echo  Close this window when done reading.
echo.
echo ============================================================
pause
