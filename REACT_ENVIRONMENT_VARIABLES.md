# OctoFit Tracker React Frontend - Environment Variables

## Overview

The React frontend uses Vite environment variables to configure API endpoints for both GitHub Codespaces and localhost environments.

## Configuration

### Vite Environment Variables

Create a `.env.local` file in `octofit-tracker/frontend/` with the following:

```env
# GitHub Codespaces Configuration
# Set to your Codespace name (e.g., "my-codespace")
VITE_CODESPACE_NAME=your-codespace-name

# Leave empty or omit for localhost development
# VITE_CODESPACE_NAME=
```

### For Localhost Development

If using `VITE_CODESPACE_NAME=` (empty) or omitting it entirely, the API client will automatically fall back to:
```
http://localhost:8000/api
```

### For GitHub Codespaces

Set `VITE_CODESPACE_NAME` to your Codespace name (e.g., "octofit-dev"), and the API client will use:
```
https://octofit-dev-8000.app.github.dev/api
```

## File Location

```
octofit-tracker/
├── frontend/
│   ├── .env.local          ← Create this file
│   ├── .env.local.example  ← Reference file
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── api.js          ← API configuration
│   │   └── components/
│   └── vite.config.js
```

## Finding Your Codespace Name

In GitHub Codespaces:

1. **In VS Code**:
   - Open terminal
   - Run: `echo $CODESPACE_NAME`
   - Or check the Codespace URL in the browser

2. **In Browser**:
   - URL format: `https://codespaces.new/user/repo/tree/branch?ref=...`
   - Or look in Codespaces dashboard on github.com/codespaces

3. **Example**:
   - If Codespace URL is: `https://my-project-1a2b3c4d.github.dev/`
   - Your `CODESPACE_NAME` is: `my-project-1a2b3c4d`

## Environment Configuration Flow

```
Application Start
  ↓
Check import.meta.env.VITE_CODESPACE_NAME
  ↓
  ├─ If set (GitHub Codespaces)
  │  └─ API_BASE_URL = https://{VITE_CODESPACE_NAME}-8000.app.github.dev
  │  └─ Shown in navbar: "Codespaces: {VITE_CODESPACE_NAME}"
  │
  └─ If not set (localhost)
     └─ API_BASE_URL = http://localhost:8000
     └─ Shown in navbar: "(Localhost)"
```

## API Configuration Details

**File**: `octofit-tracker/frontend/src/api.js`

```javascript
// Get base URL from Vite environment variables
const getBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }

  // Fallback to localhost
  return 'http://localhost:8000';
};

export const API_BASE_URL = getBaseUrl();
export const API_URL = `${API_BASE_URL}/api`;
```

## Endpoints Available

All endpoints are accessible via the configured `API_URL`:

```javascript
// Examples for localhost
GET  http://localhost:8000/api/health
GET  http://localhost:8000/api/users
POST http://localhost:8000/api/users
GET  http://localhost:8000/api/activities
POST http://localhost:8000/api/activities
GET  http://localhost:8000/api/leaderboard
GET  http://localhost:8000/api/teams
POST http://localhost:8000/api/teams
GET  http://localhost:8000/api/workouts
POST http://localhost:8000/api/workouts

// Automatically work in Codespaces by replacing the base URL
GET  https://{CODESPACE_NAME}-8000.app.github.dev/api/health
GET  https://{CODESPACE_NAME}-8000.app.github.dev/api/users
// ... etc
```

## Components Using API

All React components use the centralized `api.js` module:

- **Users.jsx** - User management (CRUD)
- **Activities.jsx** - Activity logging
- **Leaderboard.jsx** - Rankings and scores
- **Teams.jsx** - Team management
- **Workouts.jsx** - Workout planning

Example usage in a component:

```javascript
import api from '../api';

const fetchUsers = async () => {
  const data = await api.users.getAll();
  setUsers(Array.isArray(data) ? data : data.data || []);
};
```

## Error Handling

If `VITE_CODESPACE_NAME` is undefined and you're in Codespaces, the app will:

1. Show a warning alert in the navbar
2. Fall back to `http://localhost:8000`
3. Connections will fail (expected)
4. Guide users to set `VITE_CODESPACE_NAME` in `.env.local`

**Alert Message**:
```
⚠️ Configuration Issue: VITE_CODESPACE_NAME is not set.
For Codespaces: Add VITE_CODESPACE_NAME=your-codespace-name to .env.local
For localhost: Using fallback URL http://localhost:8000
```

## Setup Instructions

### Step 1: Create .env.local

**Localhost Development**:
```bash
# Create .env.local in octofit-tracker/frontend/
cd octofit-tracker/frontend
echo "# Configuration goes here" > .env.local
```

**GitHub Codespaces**:
```bash
cd octofit-tracker/frontend
echo "VITE_CODESPACE_NAME=$(echo $CODESPACE_NAME)" > .env.local
# Verify it was set correctly
cat .env.local
```

### Step 2: Run Development Server

```bash
npm run dev --prefix octofit-tracker/frontend
```

**Expected Output**:
```
  VITE v6.x.x  build 0.00s

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### Step 3: Access the Application

Open: `http://localhost:5173/` (localhost) or Codespaces forwarded URL

## Troubleshooting

### API Returns 404 or Connection Error

1. **Check if backend is running**:
   ```bash
   curl http://localhost:8000/api/health
   ```

2. **Verify API configuration**:
   - Check browser console (F12) for network errors
   - Look at navbar for API base URL display
   - Ensure `VITE_CODESPACE_NAME` is correct in `.env.local`

3. **For Codespaces**:
   - Run: `echo $CODESPACE_NAME`
   - Add to `.env.local`: `VITE_CODESPACE_NAME={output from above}`

### CORS Error

If you get CORS errors, ensure:
1. Backend has CORS enabled (default: enabled)
2. API is running on port 8000
3. Frontend is using correct API URL from navbar

### "undefined-8000.app.github.dev" in URL

This means `VITE_CODESPACE_NAME` is not set:
1. Create `.env.local` with: `VITE_CODESPACE_NAME=your-name`
2. Restart dev server: `npm run dev`
3. Hard refresh browser: Ctrl+Shift+R

## Security Notes

- `.env.local` is automatically added to `.gitignore`
- Never commit `.env.local` to git
- `VITE_CODESPACE_NAME` is injected at build time
- Only `VITE_*` prefixed variables are exposed to browser

## Summary

✅ **Localhost**: Set no VITE_CODESPACE_NAME, uses `http://localhost:8000`  
✅ **Codespaces**: Set VITE_CODESPACE_NAME to your Codespace name  
✅ **Auto-detection**: Application automatically uses correct API URL  
✅ **Error Handling**: Clear warnings if configuration is missing  

Frontend is ready for both development and Codespaces deployment!
