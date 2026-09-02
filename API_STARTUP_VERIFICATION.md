# OctoFit Tracker - API Startup & Verification Guide

## Quick Start

### 1. Prerequisites

**Required:**
- Node.js LTS (v20+ recommended)
- MongoDB (`mongodb-org` on Windows)
- npm v10+

**Installed dependencies:**
```bash
npm install --prefix octofit-tracker/backend
```

### 2. Start MongoDB (Windows)

```powershell
# Check if mongod is running
ps aux | grep mongod

# If not running, start MongoDB
mongod --dbpath C:\data\db

# OR if using Windows Service
net start MongoDB
```

### 3. Seed Database

```bash
npm run seed --prefix octofit-tracker/backend
```

Expected output:
```
✅ Seeding OctoFit database...
📊 Creating test data:
  - 5 users
  - 3 teams
  - 10 activities
  - 5 leaderboard entries
  - 6 workout plans
✅ Database seeded successfully!
```

### 4. Start API Server

```bash
npm run dev --prefix octofit-tracker/backend
```

Expected output:
```
╔════════════════════════════════════════════════╗
║        🐙 OctoFit Tracker API Configuration    ║
╚════════════════════════════════════════════════╝

Environment: development
Port: 8000

💻 Localhost Mode
Base URL: http://localhost:8000
API URL: http://localhost:8000/api

Example curl commands:
  curl http://localhost:8000/api/health
  curl http://localhost:8000/api/users

✅ OctoFit Tracker API listening on port 8000
```

### 5. Verify API (In another terminal)

#### Option A: Using test script
```bash
# Linux/macOS
bash test-api.sh

# Windows PowerShell
.\test-api.ps1
```

#### Option B: Manual curl commands
```bash
# Health check
curl http://localhost:8000/api/health

# Get users
curl http://localhost:8000/api/users

# Get activities
curl http://localhost:8000/api/activities

# Get leaderboard
curl http://localhost:8000/api/leaderboard
```

## Environment Detection

The API automatically detects where it's running:

### Localhost (Local Development)
```
Environment: development
Port: 8000
Base URL: http://localhost:8000
API URL: http://localhost:8000/api
```

### GitHub Codespaces
```
Environment: development
Port: 8000
Base URL: https://{CODESPACE_NAME}-8000.app.github.dev
API URL: https://{CODESPACE_NAME}-8000.app.github.dev/api
```

## Testing Endpoints

### Before Seeding (Empty Database)
- `GET /api/health` → 200 OK (always works)
- `GET /api/users` → 200 OK (empty array)
- `GET /api/activities` → 200 OK (empty array)
- `GET /api/leaderboard` → 200 OK (empty array)

### After Seeding (Populated Database)
- `GET /api/health` → 200 OK with full info
- `GET /api/users` → 200 OK with 5 users
- `GET /api/activities` → 200 OK with 10 activities
- `GET /api/leaderboard` → 200 OK with 5 entries
- `GET /api/teams` → 200 OK with 3 teams
- `GET /api/workouts` → 200 OK with 6 workouts

## Troubleshooting

### Port Already in Use
```powershell
# Check what's using port 8000
netstat -ano | findstr :8000

# Kill the process
taskkill /PID <PID> /F
```

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Fix:**
1. Install MongoDB: `choco install mongodb-org`
2. Start MongoDB: `mongod --dbpath C:\data\db`
3. Or: `net start MongoDB`
4. Verify: `mongosh`

### API Not Responding
1. Check if backend is running: `curl http://localhost:8000/api/health`
2. Check logs for errors
3. Verify MongoDB is running: `mongosh`
4. Check port 8000 is available

## API Endpoints Reference

| Resource | Method | Endpoint | Returns |
|----------|--------|----------|---------|
| Health | GET | `/api/health` | Server status & config |
| Users | GET | `/api/users` | All users |
| Users | GET | `/api/users/:id` | Single user |
| Users | POST | `/api/users` | Create user |
| Activities | GET | `/api/activities` | All activities |
| Activities | POST | `/api/activities` | Create activity |
| Leaderboard | GET | `/api/leaderboard` | Rankings |
| Teams | GET | `/api/teams` | All teams |
| Workouts | GET | `/api/workouts` | All workouts |

## Complete Workflow

### Setup (One Time)
```bash
# 1. Navigate to project
cd octofit-tracker/backend

# 2. Install dependencies
npm install

# 3. Seed database
npm run seed

# 4. Verify seed completed
npm run dev
# Check output shows seed data created
```

### Daily Development
```bash
# Terminal 1: Start MongoDB
mongod --dbpath C:\data\db

# Terminal 2: Start API
npm run dev --prefix octofit-tracker/backend

# Terminal 3: Test API
bash test-api.sh  # or .\test-api.ps1 on Windows

# Terminal 4: Frontend (later)
npm run dev --prefix octofit-tracker/frontend
```

## Sample Curl Commands

### Health Check
```bash
curl -X GET http://localhost:8000/api/health
```

Response:
```json
{
  "status": "OK",
  "message": "OctoFit Tracker API is running",
  "timestamp": "2026-09-02T14:25:30.123Z",
  "environment": "development",
  "baseUrl": "http://localhost:8000",
  "isCodespaces": false
}
```

### Get All Users
```bash
curl -X GET http://localhost:8000/api/users | jq .
```

Response:
```json
[
  {
    "_id": "...",
    "username": "alice_runner",
    "email": "alice@example.com",
    "firstName": "Alice",
    "lastName": "Johnson",
    "bio": "Marathon enthusiast and running coach 🏃‍♀️",
    "profilePicture": "https://via.placeholder.com/150?text=Alice",
    "createdAt": "2026-09-02T13:40:00Z",
    "updatedAt": "2026-09-02T13:40:00Z"
  }
]
```

### Get Activities
```bash
curl -X GET http://localhost:8000/api/activities | jq .
```

### Get Leaderboard
```bash
curl -X GET "http://localhost:8000/api/leaderboard?page=1&limit=10" | jq .
```

Response:
```json
[
  {
    "_id": "...",
    "user": {
      "_id": "...",
      "username": "emma_crossfit",
      "firstName": "Emma",
      "lastName": "Davis"
    },
    "totalPoints": 200,
    "activitiesCount": 2,
    "totalCalories": 2000,
    "rank": 1
  }
]
```

## Codespaces Testing

In GitHub Codespaces terminal:

```bash
# 1. Start MongoDB (if available)
mongod --dbpath /tmp/mongodb

# 2. Seed database
npm run seed --prefix octofit-tracker/backend

# 3. Start API
npm run dev --prefix octofit-tracker/backend

# 4. In another terminal, test API (auto-detects Codespaces)
bash test-api.sh
```

The test script automatically uses the Codespaces URL format:
```
https://{CODESPACE_NAME}-8000.app.github.dev/api
```

## Environment Variables

Create or update `.env` in `octofit-tracker/backend/`:

```env
# Port configuration
PORT=8000

# MongoDB configuration
MONGO_URI=mongodb://localhost:27017/octofit_db

# Environment mode
NODE_ENV=development

# Codespaces (auto-detected, no need to set)
# CODESPACE_NAME=my-codespace
```

## Next Steps

After verifying API works:

1. ✅ API server running on port 8000
2. ✅ Database seeded with test data
3. ✅ Health endpoint responding
4. ✅ User/Activity/Leaderboard endpoints working
5. ⏭️ Connect React frontend to API
6. ⏭️ Implement authentication
7. ⏭️ Deploy to Codespaces

## Files Modified

- `src/config/api.ts` - NEW: Codespaces detection and URL building
- `src/index.ts` - Updated to use API_CONFIG and show env info
- `.env` - Existing environment configuration
- Root: New `test-api.sh` and `test-api.ps1` for testing

## API Configuration Logic

```typescript
// Pseudo-code for environment detection
if (process.env.CODESPACE_NAME) {
  baseUrl = `https://${CODESPACE_NAME}-8000.app.github.dev`
  mode = "GitHub Codespaces"
} else {
  baseUrl = `http://localhost:8000`
  mode = "Localhost"
}
```

The configuration is printed at startup and returned in `/api/health` response.

---

✅ **API is now ready for testing!**

Start with:
```bash
npm run dev --prefix octofit-tracker/backend
```

Then test:
```bash
bash test-api.sh  # or .\test-api.ps1
```
