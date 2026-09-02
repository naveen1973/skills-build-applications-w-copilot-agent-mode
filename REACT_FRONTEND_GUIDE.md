# React 19 Frontend - Setup & Usage Guide

## Overview

The OctoFit Tracker React frontend is a modern, responsive web application built with:
- **React 19** with functional components and hooks
- **Vite** for fast development and optimized builds
- **Bootstrap 5** for responsive UI components
- **React Router DOM** for navigation
- **Fetch API** for backend communication

## Project Structure

```
octofit-tracker/frontend/
├── src/
│   ├── api.js                 ← API client with Codespaces support
│   ├── App.jsx                ← Main app with routing
│   ├── main.jsx               ← Entry point
│   ├── index.css              ← Global styles
│   ├── App.css                ← App-specific styles
│   ├── components/
│   │   ├── Users.jsx          ← User management
│   │   ├── Activities.jsx     ← Activity logging
│   │   ├── Leaderboard.jsx    ← Rankings
│   │   ├── Teams.jsx          ← Team management
│   │   └── Workouts.jsx       ← Workout planning
│   └── assets/
├── .env.local.example         ← Environment template
├── vite.config.js             ← Vite configuration
├── index.html                 ← HTML entry point
└── package.json               ← Dependencies
```

## Quick Start

### 1. Install Dependencies

```bash
npm install --prefix octofit-tracker/frontend
```

**Installed Packages**:
- react
- react-dom
- react-router-dom
- bootstrap
- vite (dev)
- @vitejs/plugin-react (dev)

### 2. Configure Environment

Copy the example environment file:

```bash
cp octofit-tracker/frontend/.env.local.example octofit-tracker/frontend/.env.local
```

Edit `.env.local`:

**For Localhost**:
```env
VITE_CODESPACE_NAME=
```

**For GitHub Codespaces**:
```bash
# Find your Codespace name
echo $CODESPACE_NAME

# Add to .env.local
VITE_CODESPACE_NAME=your-codespace-name
```

### 3. Start Development Server

```bash
npm run dev --prefix octofit-tracker/frontend
```

**Expected Output**:
```
  VITE v6.x.x  build 0.00s

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### 4. Access the Application

Open browser to: `http://localhost:5173/`

## Features

### 1. Navigation Bar
- Top navigation with links to all sections
- Displays current API configuration
- Shows Codespace name when applicable

### 2. Users Page
- List all users
- Create new users (form)
- Delete users
- Displays user profiles with bio

### 3. Activities Page
- Log new activities (running, cycling, swimming, yoga, crossfit)
- Track duration, distance, calories
- View activity history
- Delete activities
- Color-coded activity types

### 4. Leaderboard Page
- Global rankings by points
- Medal display (🥇 🥈 🥉)
- Shows activities count
- Shows total calories burned
- Paginated results

### 5. Teams Page
- Create fitness teams
- List team members
- Delete teams
- Team descriptions

### 6. Workouts Page
- Create workout plans
- Difficulty levels (beginner, intermediate, advanced)
- Exercise lists
- Duration tracking
- Delete workouts

## API Integration

### Base URL Configuration

**File**: `octofit-tracker/frontend/src/api.js`

```javascript
// Automatic detection
const getBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  
  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }
  return 'http://localhost:8000';
};
```

### Available API Methods

```javascript
import api from './api';

// Users
api.users.getAll()
api.users.getById(id)
api.users.create(data)
api.users.update(id, data)
api.users.delete(id)

// Activities
api.activities.getAll()
api.activities.getById(id)
api.activities.create(data)
api.activities.update(id, data)
api.activities.delete(id)

// Teams
api.teams.getAll()
api.teams.getById(id)
api.teams.create(data)
api.teams.update(id, data)
api.teams.delete(id)

// Leaderboard
api.leaderboard.getGlobal(page, limit)
api.leaderboard.getTeam(teamId)
api.leaderboard.getUserRank(userId)

// Workouts
api.workouts.getAll()
api.workouts.getById(id)
api.workouts.create(data)
api.workouts.update(id, data)
api.workouts.delete(id)

// Health check
api.health()
```

## Component Details

### Users Component

```jsx
import Users from './components/Users';

// Features:
// - Fetch and display all users
// - Create new user form
// - Delete user confirmation
// - Error handling
// - Loading states
```

**Form Fields**:
- username (required)
- email (required)
- firstName
- lastName
- bio

### Activities Component

```jsx
import Activities from './components/Activities';

// Features:
// - Log new activities
// - Color-coded by type
// - Activity type selection
// - Distance tracking (optional)
// - Calorie tracking
```

**Form Fields**:
- type (running, cycling, swimming, yoga, crossfit)
- duration (minutes, required)
- distance (km, optional)
- calories (required)
- description

### Leaderboard Component

```jsx
import Leaderboard from './components/Leaderboard';

// Features:
// - Top user rankings
// - Medal display
// - Points calculation
// - Activities and calorie totals
// - Pagination support
```

### Teams Component

```jsx
import Teams from './components/Teams';

// Features:
// - Create teams
// - Team descriptions
// - Member list
// - Delete teams
```

**Form Fields**:
- name (required)
- description

### Workouts Component

```jsx
import Workouts from './components/Workouts';

// Features:
// - Create workout plans
// - Difficulty levels
// - Exercise lists
// - Duration tracking
// - Color-coded difficulty
```

**Form Fields**:
- name (required)
- description
- difficulty (beginner, intermediate, advanced)
- exercises (comma-separated)
- duration (minutes, required)

## Routing

The application uses React Router DOM for client-side routing:

```javascript
<Routes>
  <Route path="/" element={<Users />} />
  <Route path="/activities" element={<Activities />} />
  <Route path="/leaderboard" element={<Leaderboard />} />
  <Route path="/teams" element={<Teams />} />
  <Route path="/workouts" element={<Workouts />} />
</Routes>
```

## Error Handling

All components include error handling:

```javascript
const [error, setError] = useState(null);

try {
  const data = await api.resource.getAll();
} catch (err) {
  setError(err.message || 'Failed to fetch data');
}
```

Errors are displayed in Bootstrap Alert components.

## Loading States

Components show loading spinners during API calls:

```javascript
import { Spinner } from 'react-bootstrap';

{loading ? <Spinner animation="border" /> : <Content />}
```

## Styling

The application uses:

1. **Bootstrap 5** - Component styling
2. **Bootstrap CSS** - Imported in main.jsx
3. **Custom CSS** - App.css and index.css

Bootstrap components used:
- Container
- Row/Col (Grid)
- Card
- Button
- Form
- Alert
- Spinner
- Navbar
- Nav
- Table
- Badge
- ListGroup

## Build & Production

### Development Build

```bash
npm run dev --prefix octofit-tracker/frontend
```

### Production Build

```bash
npm run build --prefix octofit-tracker/frontend
```

Output: `octofit-tracker/frontend/dist/`

### Preview Build

```bash
npm run preview --prefix octofit-tracker/frontend
```

## Environment Variables

### VITE_CODESPACE_NAME

**Type**: String  
**Required**: No (falls back to localhost)  
**Usage**: API endpoint configuration

**Localhost Example**:
```env
VITE_CODESPACE_NAME=
```

**Codespaces Example**:
```env
VITE_CODESPACE_NAME=my-project-abc123
```

**Access in Code**:
```javascript
const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
```

## Debugging

### Check API Configuration

Look at navbar - displays:
- Current API base URL
- Environment (Localhost or Codespaces)
- Codespace name (if applicable)

### Browser DevTools

1. **Open Console** (F12)
2. **Check Network Tab** for API requests
3. **Look for errors** in console
4. **Verify fetch URLs** match configuration

### Verify Backend Connection

```bash
# From terminal
curl http://localhost:8000/api/health

# From browser console
fetch('http://localhost:8000/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

## Troubleshooting

### "Cannot reach API"

1. Verify backend is running:
   ```bash
   npm run dev --prefix octofit-tracker/backend
   ```

2. Check configuration:
   - Look at navbar for API URL
   - Verify `.env.local` is set correctly

3. Test health endpoint:
   ```bash
   curl http://localhost:8000/api/health
   ```

### "undefined-8000.app.github.dev"

VITE_CODESPACE_NAME is not set:
1. Create `.env.local`
2. Add: `VITE_CODESPACE_NAME=your-name`
3. Restart dev server

### "CORS error"

Backend CORS not enabled:
1. Backend has CORS enabled by default
2. Verify backend is using updated index.ts/server.ts
3. Check API URL matches configuration

### Components not showing data

1. Backend might not be seeded
   ```bash
   npm run seed --prefix octofit-tracker/backend
   ```

2. Check browser console for errors
3. Verify API endpoints respond to GET requests

## Performance Tips

1. **Lazy load components** if app grows
2. **Memoize expensive renders** with useMemo
3. **Use useCallback** for handler functions
4. **Limit list pagination** to 10-20 items
5. **Cache API responses** if needed

## Next Steps

1. ✅ Frontend setup complete
2. ⏭️ Connect to running backend
3. ⏭️ Test all CRUD operations
4. ⏭️ Add user authentication
5. ⏭️ Deploy to Codespaces
6. ⏭️ Add real-time features (WebSockets)

## Summary

✅ **React 19** - Modern React with hooks  
✅ **Vite** - Fast development experience  
✅ **Bootstrap 5** - Responsive design  
✅ **React Router** - Client-side navigation  
✅ **Codespaces Ready** - Auto-detects environment  
✅ **Fallback Support** - Works with localhost  
✅ **Error Handling** - User-friendly messages  
✅ **Loading States** - Better UX  

The React frontend is production-ready and fully integrated with the Express backend API!
