@echo off
REM OctoFit Tracker - Database Setup Script for Windows
REM This script helps set up and seed the MongoDB database

echo ╔════════════════════════════════════════════════════════════╗
echo ║      🐙 OctoFit Tracker - Database Initialization        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if MongoDB is installed
echo 1. Checking MongoDB installation...
where mongod >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB is not installed or not in PATH
    echo.
    echo Please install MongoDB Community Edition:
    echo   Download: https://www.mongodb.com/try/download/community
    echo   Or: choco install mongodb-community
    echo.
    pause
    exit /b 1
)
echo ✅ MongoDB is installed

REM Check if MongoDB service is running
echo.
echo 2. Checking MongoDB service status...
sc query MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  MongoDB service not found. Attempting to start MongoDB...
    echo.
    echo Note: You may need to run this as Administrator
    echo.
    mongod --version
    echo.
    echo Please start MongoDB manually:
    echo   • Windows Service: net start MongoDB
    echo   • Command: mongod
    echo.
    pause
) else (
    echo ✅ MongoDB service found
    
    REM Try to start the service
    echo.
    echo 3. Starting MongoDB service...
    net start MongoDB >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ MongoDB service started
    ) else (
        echo ℹ️  MongoDB service may already be running
    )
)

REM Give MongoDB time to start
echo.
echo Waiting for MongoDB to be ready...
timeout /t 2 /nobreak

REM Test MongoDB connection
echo.
echo 4. Testing MongoDB connection...
mongosh --eval "db.runCommand('ping')" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Could not connect to MongoDB
    echo.
    echo Ensure MongoDB is running on localhost:27017
    echo.
    pause
    exit /b 1
)
echo ✅ MongoDB is running and accessible

REM Run seed script
echo.
echo 5. Seeding database...
echo.
cd /d "%~dp0"
call npm run seed --prefix octofit-tracker/backend

if %errorlevel% neq 0 (
    echo.
    echo ❌ Database seeding failed
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║        ✅ Database Initialization Complete!               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 🎉 Next steps:
echo.
echo   1. Start the backend API:
echo      npm run dev --prefix octofit-tracker/backend
echo.
echo   2. Start the frontend (in another terminal):
echo      npm run dev --prefix octofit-tracker/frontend
echo.
echo   3. Open browser to: http://localhost:5173
echo.
echo 📊 Verify the database:
echo    mongosh
echo    use octofit_db
echo    show collections
echo    db.users.find().pretty()
echo.
pause
