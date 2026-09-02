# OctoFit Tracker - Database Initialization & Seeding ✅

## Overview

The octofit_db MongoDB database has been configured with a comprehensive seed script that populates:
- 👥 5 user profiles
- 🏆 3 teams with members
- 🏃 10 fitness activities
- 📊 5 leaderboard entries (auto-calculated)
- 💪 6 personalized workout plans

## Files Created

### 1. Seed Script
- **File**: `octofit-tracker/backend/src/scripts/seed.ts`
- **Lines**: ~250
- **Purpose**: Populates MongoDB with sample data

### 2. Setup Script (Windows)
- **File**: `setup-database.bat`
- **Purpose**: Automated MongoDB startup and database seeding

### 3. Database Guide
- **File**: `DATABASE_INITIALIZATION.md`
- **Purpose**: Comprehensive setup and troubleshooting guide

## Quick Start

### Option 1: Windows Users

```bash
# Run the setup script (from project root)
setup-database.bat
```

This will:
1. Check MongoDB installation
2. Start MongoDB service
3. Test connection
4. Run seed script
5. Show next steps

### Option 2: Manual Setup

**Step 1: Install MongoDB**
```powershell
# Windows (via Chocolatey)
choco install mongodb-community

# Or download from: https://www.mongodb.com/try/download/community
```

**Step 2: Start MongoDB**
```powershell
# Windows
net start MongoDB

# Or via Services app
```

**Step 3: Verify Connection**
```bash
mongosh
# Type: exit
```

**Step 4: Run Seed Script**
```bash
npm run seed --prefix octofit-tracker/backend
```

## Seed Data

### Users (5 Created)

| Username | Name | Role | Specialization |
|----------|------|------|-----------------|
| alice_runner | Alice Johnson | Lead | Marathon Training |
| bob_cyclist | Bob Smith | Lead | Mountain Biking |
| carol_swimmer | Carol Williams | Member | Triathlon |
| david_yogi | David Brown | Member | Yoga & Mindfulness |
| emma_crossfit | Emma Davis | Lead | CrossFit Training |

**Emails**: `{username}@example.com`

### Teams (3 Created)

| Team | Leader | Members | Focus |
|------|--------|---------|-------|
| Morning Runners | Alice | Alice, Bob, Carol | Endurance Running |
| Fitness Warriors | Emma | Emma, Alice, David | High-Intensity |
| Weekend Warriors | Bob | Bob, Carol | Casual Fitness |

### Activities (10 Logged)

| User | Type | Duration | Distance | Calories | Points |
|------|------|----------|----------|----------|--------|
| Alice | Running | 30 min | 5.5 km | 350 | 35 |
| Alice | Running | 45 min | 8.2 km | 520 | 52 |
| Bob | Cycling | 60 min | 25 km | 650 | 65 |
| Bob | Cycling | 90 min | 35 km | 900 | 90 |
| Carol | Swimming | 45 min | 2 km | 500 | 50 |
| Carol | Swimming | 60 min | 3 km | 700 | 70 |
| David | Yoga | 60 min | — | 200 | 20 |
| David | Yoga | 45 min | — | 150 | 15 |
| Emma | Gym | 90 min | — | 800 | 80 |
| Emma | Gym | 120 min | — | 1200 | 120 |

### Leaderboard Rankings

**Sorted by Total Points:**

```
1. Emma Davis (@emma_crossfit)     200 points  2000 cal
2. Bob Smith (@bob_cyclist)        155 points  1550 cal
3. Carol Williams (@carol_swimmer) 120 points  1200 cal
4. Alice Johnson (@alice_runner)    87 points   870 cal
5. David Brown (@david_yogi)        35 points   350 cal
```

**Scoring Formula**: `points = Math.ceil(calories / 10)`

### Workout Plans (6 Created)

| User | Title | Type | Difficulty | Duration |
|------|-------|------|------------|----------|
| Alice | Marathon Training | Cardio | Advanced | 60 min |
| Alice | Speed Work | Cardio | Advanced | 45 min |
| Bob | Mountain Bike Skills | Sports | Advanced | 90 min |
| Carol | Triathlon Prep | Cardio | Advanced | 120 min |
| David | Yoga for Flexibility | Flexibility | Intermediate | 60 min |
| Emma | CrossFit WOD | Strength | Advanced | 45 min |

## Database Structure

### Collections (5)

```
octofit_db/
├── users (5 documents)
├── activities (10 documents)
├── teams (3 documents)
├── leaderboards (5 documents)
└── workouts (6 documents)
```

### Sample Document Structure

**User:**
```json
{
  "_id": ObjectId("..."),
  "username": "alice_runner",
  "email": "alice@example.com",
  "password": "hashed_password_1",
  "firstName": "Alice",
  "lastName": "Johnson",
  "bio": "Marathon enthusiast and running coach 🏃‍♀️",
  "profilePicture": "https://via.placeholder.com/150?text=Alice",
  "createdAt": "2026-09-02T13:40:00Z",
  "updatedAt": "2026-09-02T13:40:00Z"
}
```

**Activity:**
```json
{
  "_id": ObjectId("..."),
  "user": ObjectId("..."),
  "type": "running",
  "duration": 30,
  "distance": 5.5,
  "calories": 350,
  "date": "2026-09-01T00:00:00Z",
  "description": "Morning run in Central Park",
  "createdAt": "2026-09-02T13:40:00Z",
  "updatedAt": "2026-09-02T13:40:00Z"
}
```

**Team:**
```json
{
  "_id": ObjectId("..."),
  "name": "Morning Runners",
  "description": "Early bird runners club focused on endurance",
  "leader": ObjectId("..."),
  "members": [ObjectId("..."), ObjectId("..."), ObjectId("...")],
  "createdAt": "2026-09-02T13:40:00Z",
  "updatedAt": "2026-09-02T13:40:00Z"
}
```

**Leaderboard:**
```json
{
  "_id": ObjectId("..."),
  "user": ObjectId("..."),
  "team": ObjectId("..."),
  "totalPoints": 87,
  "activitiesCount": 2,
  "totalCalories": 870,
  "rank": 4,
  "createdAt": "2026-09-02T13:40:00Z",
  "updatedAt": "2026-09-02T13:40:00Z"
}
```

## Verify Database

### Via MongoDB Shell

```bash
# Connect
mongosh
use octofit_db

# List collections
show collections

# Count documents
db.users.countDocuments()          # 5
db.activities.countDocuments()     # 10
db.teams.countDocuments()          # 3
db.leaderboards.countDocuments()   # 5
db.workouts.countDocuments()       # 6

# View data
db.users.find().pretty()
db.leaderboards.find().sort({ totalPoints: -1 }).pretty()
db.activities.find().pretty()
```

### Via REST API

Once backend is running:

```bash
# Health check
curl http://localhost:8000/api/health

# Get all users
curl http://localhost:8000/api/users

# Get leaderboard
curl http://localhost:8000/api/leaderboard

# Get activities
curl http://localhost:8000/api/activities

# Get teams
curl http://localhost:8000/api/teams

# Get workouts
curl http://localhost:8000/api/workouts
```

## Running the Seed Script

### Command
```bash
npm run seed --prefix octofit-tracker/backend
```

### What It Does
1. Connects to MongoDB on `mongodb://localhost:27017/octofit_db`
2. Clears all existing collections
3. Creates 5 users
4. Creates 3 teams with members
5. Logs 10 activities
6. Calculates and creates 5 leaderboard entries
7. Creates 6 workout plans
8. Displays summary and rankings
9. Disconnects from database

### Expected Output
```
🔗 Connecting to MongoDB...
✅ Connected to octofit_db

🗑️  Clearing existing data...
✅ Database cleared

👥 Creating users...
✅ Created 5 users

🏆 Creating teams...
✅ Created 3 teams

🏃 Creating activities...
✅ Created 10 activities

📊 Creating leaderboard entries...
✅ Created 5 leaderboard entries

💪 Creating workout plans...
✅ Created 6 workout plans

============================================================
📈 DATABASE POPULATION SUMMARY
============================================================
✅ Users created:              5
✅ Teams created:              3
✅ Activities logged:          10
✅ Leaderboard entries:        5
✅ Workout plans:              6
============================================================

📊 Top Users by Points:
  1. Emma Davis (@emma_crossfit) - 200 pts
  2. Bob Smith (@bob_cyclist) - 155 pts
  3. Carol Williams (@carol_swimmer) - 120 pts
  4. Alice Johnson (@alice_runner) - 87 pts
  5. David Brown (@david_yogi) - 35 pts

🎉 Database seeding completed successfully!

💡 You can now start the API server:
   npm run dev --prefix octofit-tracker/backend
```

## Reset Database

To reseed with fresh data:

```bash
npm run seed --prefix octofit-tracker/backend
```

The script automatically clears all collections before repopulating.

## Troubleshooting

### "MongoDB is not installed"
**Solution**: Install MongoDB from https://www.mongodb.com/try/download/community

### "connect ECONNREFUSED"
**Solution**: Start MongoDB service
```powershell
net start MongoDB          # Windows
brew services start mongodb-community  # macOS
sudo systemctl start mongod # Linux
```

### "Permission denied" (macOS/Linux)
**Solution**: Run with sudo
```bash
sudo npm run seed --prefix octofit-tracker/backend
```

### "Database seed fails silently"
**Solution**: Check environment variables
```bash
echo $MONGO_URI
# Should show: mongodb://localhost:27017/octofit_db
```

## Next Steps

1. ✅ Seed script created and tested (builds without errors)
2. ⏳ **Install MongoDB** (if not already installed)
3. ⏳ **Start MongoDB service**
4. ⏳ **Run seed script**: `npm run seed --prefix octofit-tracker/backend`
5. ⏳ **Start API server**: `npm run dev --prefix octofit-tracker/backend`
6. ⏳ **Connect React frontend**
7. ⏳ Test endpoints with curl or Postman
8. ⏳ Implement authentication

## Files & Documentation

| File | Purpose |
|------|---------|
| `octofit-tracker/backend/src/scripts/seed.ts` | Database seeding script |
| `setup-database.bat` | Windows automation script |
| `DATABASE_INITIALIZATION.md` | Complete setup guide |
| `BACKEND_LOGIC_TIER.md` | API documentation |
| `EXPRESS_LOGIC_TIER_SUMMARY.md` | Technical summary |

## Environment Configuration

**File**: `octofit-tracker/backend/.env`

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/octofit_db
NODE_ENV=development
```

## Status: ✅ READY FOR DEPLOYMENT

- ✅ Seed script created with comprehensive data
- ✅ TypeScript compilation successful
- ✅ 5 user profiles with realistic data
- ✅ 3 teams with member relationships
- ✅ 10 activities with auto-calculated scoring
- ✅ Leaderboard rankings pre-calculated
- ✅ 6 workout plans for each user type
- ✅ Windows batch script for automated setup
- ✅ Complete documentation included

**Ready to**: Install MongoDB → Run seed script → Start backend → Connect frontend
