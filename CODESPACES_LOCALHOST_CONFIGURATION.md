# OctoFit Tracker - API Configuration for Codespaces & Localhost

## Overview

The OctoFit Tracker backend API automatically detects the environment and builds the appropriate base URL for both GitHub Codespaces and localhost development.

## Configuration

### Auto-Detection Logic

The API uses the `$CODESPACE_NAME` environment variable to detect the environment:

**GitHub Codespaces:**
```
$CODESPACE_NAME environment variable is set
↓
Base URL: https://${CODESPACE_NAME}-8000.app.github.dev
↓
API URL: https://${CODESPACE_NAME}-8000.app.github.dev/api
```

**Localhost:**
```
$CODESPACE_NAME is not set
↓
Base URL: http://localhost:8000
↓
API URL: http://localhost:8000/api
```

### Configuration File

**Location**: `octofit-tracker/backend/src/config/api.ts`

```typescript
export const API_CONFIG = {
  port: 8000,
  baseUrl: codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000',
  apiUrl: `${baseUrl}/api`,
  isCodespaces: !!codespaceName,
  isLocalhost: !codespaceName,
  // ... additional methods
};
```

## Environment Variables

### Required
- `PORT` (optional, default: 8000) - API port
- `MONGO_URI` (optional, default: mongodb://localhost:27017/octofit_db) - MongoDB connection

### Auto-Detected
- `CODESPACE_NAME` - Set by GitHub Codespaces, used to build Codespaces URL
- `NODE_ENV` (optional, default: development) - Environment mode

## Health Check Response

The `/api/health` endpoint now returns environment information:

```json
{
  "status": "OK",
  "message": "OctoFit Tracker API is running",
  "timestamp": "2026-09-02T14:16:56.521Z",
  "environment": "development",
  "baseUrl": "http://localhost:8000",
  "isCodespaces": false
}
```

**Codespaces example:**
```json
{
  "status": "OK",
  "message": "OctoFit Tracker API is running",
  "timestamp": "2026-09-02T14:16:56.521Z",
  "environment": "development",
  "baseUrl": "https://my-codespace-8000.app.github.dev",
  "isCodespaces": true
}
```

## Startup Output

### Localhost Mode
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

### Codespaces Mode
```
╔════════════════════════════════════════════════╗
║        🐙 OctoFit Tracker API Configuration    ║
╚════════════════════════════════════════════════╝

Environment: development
Port: 8000

📍 GitHub Codespaces Mode
Codespace Name: my-codespace
Base URL: https://my-codespace-8000.app.github.dev
API URL: https://my-codespace-8000.app.github.dev/api

Example curl commands:
  curl https://my-codespace-8000.app.github.dev/api/health
  curl https://my-codespace-8000.app.github.dev/api/users

✅ OctoFit Tracker API listening on port 8000
```

## API Endpoints

All endpoints are available at `/api/`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check with environment info |
| `/api/users` | GET/POST | User management |
| `/api/activities` | GET/POST | Activity tracking |
| `/api/teams` | GET/POST | Team management |
| `/api/leaderboard` | GET | Leaderboard rankings |
| `/api/workouts` | GET/POST | Workout planning |

## Curl Testing - Localhost

### Health Check
```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "OctoFit Tracker API is running",
  "timestamp": "2026-09-02T14:16:56.521Z",
  "environment": "development",
  "baseUrl": "http://localhost:8000",
  "isCodespaces": false
}
```

### Get All Users
```bash
curl http://localhost:8000/api/users
```

Expected response:
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
  },
  ...
]
```

### Get All Activities
```bash
curl http://localhost:8000/api/activities
```

Expected response:
```json
[
  {
    "_id": "...",
    "user": {
      "_id": "...",
      "username": "alice_runner",
      "email": "alice@example.com"
    },
    "type": "running",
    "duration": 30,
    "distance": 5.5,
    "calories": 350,
    "date": "2026-09-01T00:00:00Z",
    "description": "Morning run in Central Park",
    "createdAt": "2026-09-02T13:40:00Z",
    "updatedAt": "2026-09-02T13:40:00Z"
  },
  ...
]
```

### Get Leaderboard
```bash
curl http://localhost:8000/api/leaderboard?page=1&limit=10
```

Expected response:
```json
[
  {
    "_id": "...",
    "user": {
      "_id": "...",
      "username": "emma_crossfit",
      "email": "emma@example.com",
      "firstName": "Emma",
      "lastName": "Davis",
      "profilePicture": "..."
    },
    "team": "...",
    "totalPoints": 200,
    "activitiesCount": 2,
    "totalCalories": 2000,
    "rank": 1,
    "createdAt": "2026-09-02T13:40:00Z",
    "updatedAt": "2026-09-02T13:40:00Z"
  },
  ...
]
```

## Curl Testing - Codespaces

Replace `${CODESPACE_NAME}` with your actual Codespace name (e.g., `my-codespace`):

### Health Check
```bash
curl https://my-codespace-8000.app.github.dev/api/health
```

### Get Users
```bash
curl https://my-codespace-8000.app.github.dev/api/users
```

### Get Activities
```bash
curl https://my-codespace-8000.app.github.dev/api/activities
```

### Get Leaderboard
```bash
curl https://my-codespace-8000.app.github.dev/api/leaderboard?page=1&limit=10
```

## Testing Script

### Bash/Shell (Linux/macOS)
```bash
#!/bin/bash

# Determine API base URL
if [ -z "$CODESPACE_NAME" ]; then
  BASE_URL="http://localhost:8000/api"
else
  BASE_URL="https://$CODESPACE_NAME-8000.app.github.dev/api"
fi

echo "Testing API at: $BASE_URL"
echo ""

# Test health
echo "1. Health Check:"
curl -s "$BASE_URL/health" | jq .

# Test users
echo -e "\n2. Get Users:"
curl -s "$BASE_URL/users" | jq '.[0]'

# Test activities
echo -e "\n3. Get Activities:"
curl -s "$BASE_URL/activities" | jq '.[0]'

# Test leaderboard
echo -e "\n4. Get Leaderboard:"
curl -s "$BASE_URL/leaderboard?page=1&limit=5" | jq '.[0]'
```

### PowerShell (Windows)
```powershell
# Determine API base URL
if ([string]::IsNullOrEmpty($env:CODESPACE_NAME)) {
    $BASE_URL = "http://localhost:8000/api"
} else {
    $BASE_URL = "https://$($env:CODESPACE_NAME)-8000.app.github.dev/api"
}

Write-Host "Testing API at: $BASE_URL"
Write-Host ""

# Test health
Write-Host "1. Health Check:"
Invoke-WebRequest -Uri "$BASE_URL/health" | ConvertTo-Json | ConvertFrom-Json | Format-List

# Test users
Write-Host "`n2. Get Users:"
Invoke-WebRequest -Uri "$BASE_URL/users" | ConvertFrom-Json | Select-Object -First 1 | Format-List

# Test activities
Write-Host "`n3. Get Activities:"
Invoke-WebRequest -Uri "$BASE_URL/activities" | ConvertFrom-Json | Select-Object -First 1 | Format-List

# Test leaderboard
Write-Host "`n4. Get Leaderboard:"
Invoke-WebRequest -Uri "$BASE_URL/leaderboard?page=1&limit=5" | ConvertFrom-Json | Select-Object -First 1 | Format-List
```

## Running the API

### Localhost
```bash
npm run dev --prefix octofit-tracker/backend
```

Then test with:
```bash
curl http://localhost:8000/api/health
curl http://localhost:8000/api/users
curl http://localhost:8000/api/activities
```

### GitHub Codespaces
1. Open your Codespace
2. In terminal:
```bash
npm run dev --prefix octofit-tracker/backend
```

3. Wait for startup output showing your Codespaces URL
4. In another terminal or curl:
```bash
curl https://YOUR-CODESPACE-8000.app.github.dev/api/health
curl https://YOUR-CODESPACE-8000.app.github.dev/api/users
curl https://YOUR-CODESPACE-8000.app.github.dev/api/activities
```

## Troubleshooting

### "Could not connect to API"
1. Verify backend is running on port 8000
2. Check `CODESPACE_NAME` environment variable
3. Verify CORS is enabled (default: enabled)
4. Try health endpoint first: `/api/health`

### "CORS error when calling from frontend"
1. CORS is enabled by default via `cors()` middleware
2. Frontend can call from any origin
3. If needed, update CORS options in `index.ts`

### "Cannot verify SSL certificate" (Codespaces)
GitHub Codespaces URLs use valid SSL certificates. If you get SSL errors:
1. Use `curl -k` to skip verification (testing only)
2. Ensure you're using `https://` not `http://`

### "Port 8000 already in use"
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8000
kill -9 <PID>
```

## Production Deployment

For production, use environment variables:

```bash
PORT=8000
MONGO_URI=mongodb://your-production-db:27017/octofit_db
NODE_ENV=production
CODESPACE_NAME=<only set in Codespaces>
```

## Key Files

- `src/config/api.ts` - API configuration with Codespaces support
- `src/index.ts` - Main server file using API_CONFIG
- `.env` - Environment variables

## Summary

✅ **Localhost**: `http://localhost:8000/api`  
✅ **Codespaces**: `https://${CODESPACE_NAME}-8000.app.github.dev/api`  
✅ **Auto-detection**: Works seamlessly in both environments  
✅ **Health endpoint**: Returns environment info for debugging  
✅ **CORS enabled**: Frontend integration ready  

API is production-ready for both local development and GitHub Codespaces!
