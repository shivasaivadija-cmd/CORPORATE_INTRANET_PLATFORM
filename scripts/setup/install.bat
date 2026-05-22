@echo off
title 2coms - Initial Setup
color 0B

cls
echo.
echo ============================================================
echo  2COMS INTRANET - INITIAL SETUP
echo ============================================================
echo.
echo This will:
echo   1. Install all dependencies
echo   2. Setup environment files
echo   3. Start Docker services
echo   4. Setup database
echo   5. Seed initial data
echo.
echo ============================================================
echo.
pause

set PATH=E:\;%PATH%

echo.
echo [1/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/5] Setting up environment...
if not exist ".env" (
    copy .env.example .env
    echo [OK] Created .env file
    echo [ACTION REQUIRED] Please edit .env with your configuration
    pause
) else (
    echo [OK] .env file already exists
)

echo.
echo [3/5] Starting Docker services...
docker-compose up -d postgres redis
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start Docker services
    echo Make sure Docker Desktop is running
    pause
    exit /b 1
)
echo [OK] Docker services started
echo Waiting 15 seconds for services to be ready...
ping 127.0.0.1 -n 16 >nul

echo.
echo [4/5] Setting up database...
cd apps\api
call npx prisma generate
call npx prisma migrate deploy
cd ..\..
echo [OK] Database setup complete

echo.
echo [5/5] Seeding database...
cd apps\api
call npx ts-node prisma\seed.ts
cd ..\..
echo [OK] Database seeded

echo.
echo ============================================================
echo  SETUP COMPLETE!
echo ============================================================
echo.
echo  Next steps:
echo    1. Review and update .env file
echo    2. Start development: scripts\dev\start.bat
echo    3. Access web: http://localhost:3000
echo    4. Login: admin@acme.com / Password123!
echo.
echo ============================================================
pause
