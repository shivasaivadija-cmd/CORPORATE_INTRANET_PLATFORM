@echo off
echo ========================================
echo  TESTING LOGIN CREDENTIALS
echo ========================================
echo.

cd /d "%~dp0..\..\apps\api"

echo Testing admin@acme.com login...
echo.

curl -X POST http://localhost:4000/api/v1/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@acme.com\",\"password\":\"Password123!\"}"

echo.
echo.
echo ========================================
echo If you see an accessToken above, login works!
echo If you see an error, run: npm run db:reset
echo ========================================
echo.
pause
