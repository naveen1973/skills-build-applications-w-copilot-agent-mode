# OctoFit Tracker - Express Logic Tier 🚀

## Overview
Complete Express.js + TypeScript + Mongoose backend API for the OctoFit Tracker multi-tier application.

## Architecture

### Directory Structure
```
octofit-tracker/backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection configuration
│   ├── controllers/             # Business logic for each domain
│   │   ├── userController.ts
│   │   ├── activityController.ts
│   │   ├── teamController.ts
│   │   ├── leaderboardController.ts
│   │   └── workoutController.ts
│   ├── middleware/
│   │   └── errorHandler.ts      # Global error handling
│   ├── models/                  # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Activity.ts
│   │   ├── Team.ts
│   │   ├── Leaderboard.ts
│   │   └── Workout.ts
│   ├── routes/                  # API route definitions
│   │   ├── users.ts
│   │   ├── activities.ts
│   │   ├── teams.ts
│   │   ├── leaderboard.ts
│   │   └── workouts.ts
│   └── index.ts                 # Main Express app
├── dist/                        # Compiled JavaScript
├── package.json
├── tsconfig.json
└── .env
```

## API Endpoints

### Health Check
- `GET /api/health` - Server status and timestamp

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Activities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activities` | Get all activities |
| GET | `/api/activities/user/:userId` | Get user's activities |
| POST | `/api/activities` | Log new activity |
| DELETE | `/api/activities/:id` | Delete activity |

**Auto-updates leaderboard on activity creation/deletion**

### Teams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams` | Get all teams |
| GET | `/api/teams/:id` | Get team by ID |
| POST | `/api/teams` | Create team |
| POST | `/api/teams/:id/members` | Add member to team |
| DELETE | `/api/teams/:id/members` | Remove member from team |
| DELETE | `/api/teams/:id` | Delete team |

### Leaderboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaderboard` | Global leaderboard (paginated) |
| GET | `/api/leaderboard/teams/:teamId` | Team leaderboard (paginated) |
| GET | `/api/leaderboard/user/:userId` | User's rank and stats |

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Workouts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workouts` | Get all workouts |
| GET | `/api/workouts/user/:userId` | Get user's workouts |
| GET | `/api/workouts/:id` | Get workout by ID |
| POST | `/api/workouts` | Create workout |
| PUT | `/api/workouts/:id` | Update workout |
| DELETE | `/api/workouts/:id` | Delete workout |

## Data Models

### User
```typescript
{
  username: string (unique, 3+ chars)
  email: string (unique, valid email)
  password: string (6+ chars)
  firstName: string
  lastName: string
  profilePicture?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}
```

### Activity
```typescript
{
  user: ObjectId (ref: User)
  type: 'running' | 'cycling' | 'swimming' | 'walking' | 'gym' | 'yoga' | 'other'
  duration: number (minutes, min: 1)
  distance?: number (optional, km)
  calories: number (min: 0)
  date: Date (default: now)
  description?: string
  createdAt: Date
  updatedAt: Date
}
```

### Team
```typescript
{
  name: string
  description: string
  leader: ObjectId (ref: User)
  members: [ObjectId] (ref: User)
  createdAt: Date
  updatedAt: Date
}
```

### Leaderboard
```typescript
{
  user: ObjectId (unique, ref: User)
  team?: ObjectId (ref: Team)
  totalPoints: number (calculated from activities)
  activitiesCount: number
  totalCalories: number
  rank: number (calculated)
  updatedAt: Date
}
```

### Workout
```typescript
{
  user: ObjectId (ref: User)
  title: string
  description: string
  type: 'strength' | 'cardio' | 'flexibility' | 'balance' | 'sports'
  duration: number (minutes, min: 1)
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  exercises: [{
    name: string
    sets: number (min: 1)
    reps: number (min: 1)
  }]
  createdAt: Date
  updatedAt: Date
}
```

## Scoring & Leaderboard Logic

- **Points Calculation**: `Math.ceil(calories / 10)`
- **Sorting**: By total points (desc), then total calories (desc)
- **Rank**: Automatically calculated based on position

## Database Connection

**MongoDB URI**: `mongodb://localhost:27017/octofit_db`

Configured via:
```
MONGO_URI=mongodb://localhost:27017/octofit_db
```

## Middleware

### CORS
- Enabled for cross-origin requests from frontend

### Error Handler
- Global error handling with environment-aware responses
- 404 handler for undefined routes

## Environment Variables

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/octofit_db
NODE_ENV=development
CODESPACE_NAME=<optional-for-github-codespaces>
```

## Codespaces Support

For GitHub Codespaces, use environment-aware URLs:

```typescript
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';
```

## Quick Start

### Development
```bash
npm install --prefix octofit-tracker/backend
npm run dev --prefix octofit-tracker/backend
```

### Production Build
```bash
npm run build --prefix octofit-tracker/backend
npm start --prefix octofit-tracker/backend
```

### Build Only
```bash
npm run build --prefix octofit-tracker/backend
```

## API Testing with curl

### Create User
```bash
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","email":"john@example.com","password":"password123","firstName":"John","lastName":"Doe"}'
```

### Log Activity
```bash
curl -X POST http://localhost:8000/api/activities \
  -H "Content-Type: application/json" \
  -d '{"user":"USER_ID","type":"running","duration":30,"calories":300,"distance":5}'
```

### Create Team
```bash
curl -X POST http://localhost:8000/api/teams \
  -H "Content-Type: application/json" \
  -d '{"name":"Team A","description":"Running team","leader":"USER_ID"}'
```

### Get Leaderboard
```bash
curl http://localhost:8000/api/leaderboard?page=1&limit=10
```

### Health Check
```bash
curl http://localhost:8000/api/health
```

## Features

✅ **User Management** - Create, read, update, delete user profiles
✅ **Activity Tracking** - Log fitness activities with automatic leaderboard updates
✅ **Team Management** - Create teams and manage members
✅ **Leaderboard** - Global and team-based rankings with automatic scoring
✅ **Workout Suggestions** - Save and manage personalized workout plans
✅ **Automatic Scoring** - Activities automatically update leaderboard points
✅ **Error Handling** - Comprehensive error handling middleware
✅ **CORS Support** - Cross-origin requests enabled
✅ **TypeScript** - Full type safety with strict mode
✅ **MongoDB** - Persistent data storage with Mongoose ODM

## Dependencies

### Production
- **express** (4.18.2) - Web framework
- **mongoose** (8.0.0) - MongoDB ODM
- **cors** (2.x) - Cross-Origin Resource Sharing
- **dotenv** (16.3.1) - Environment variables

### Development
- **typescript** (5.2.2) - Type checking
- **ts-node** (10.9.1) - Run TypeScript directly
- **@types/express** - Type definitions
- **@types/node** - Type definitions
- **@types/cors** - Type definitions

## Next Steps

1. ✅ Backend logic tier created
2. ⏳ Connect frontend React app to backend API
3. ⏳ Add authentication (JWT)
4. ⏳ Add input validation
5. ⏳ Add database seeding script
6. ⏳ Add comprehensive tests
7. ⏳ Deploy to production

## Status

✅ **Complete** - Express logic tier fully implemented with:
- 5 Mongoose models
- 5 comprehensive controllers
- 5 API route modules
- Error handling middleware
- Database configuration
- TypeScript compilation
- CORS support
- Ready for frontend integration
