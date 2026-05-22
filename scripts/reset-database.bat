@echo off
echo ========================================
echo  DATABASE RESET AND RESEED
echo ========================================
echo.

echo [1/5] Stopping any running services...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo.
echo [2/5] Ensuring Docker services are running...
cd /d "%~dp0..\.."
call npm run docker:up
timeout /t 10

echo.
echo [3/5] Resetting database...
cd apps\api
call npx prisma migrate reset --force --skip-seed

echo.
echo [4/5] Running migrations...
call npx prisma migrate deploy

echo.
echo [5/5] Seeding database with demo data...
call npx prisma db seed

echo.
echo ========================================
echo  DATABASE RESET COMPLETE!
echo ========================================
echo.
echo Default Login Credentials:
echo   Email: admin@acme.com
echo   Password: Password123!
echo.
echo Alternative Accounts:
echo   sarah@acme.com / Password123!
echo   marcus@acme.com / Password123!
echo   priya@acme.com / Password123!
echo.
echo Now run: npm run dev
echo.
pause
