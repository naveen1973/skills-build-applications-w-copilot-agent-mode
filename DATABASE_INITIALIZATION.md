# Database Initialization Guide - octofit_db

## Prerequisites

### 1. Install MongoDB

**Windows (using Chocolatey):**
```powershell
choco install mongodb-community
```

**Windows (Manual):**
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the installation wizard
3. MongoDB will be installed as a service

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list
apt-get update
apt-get install -y mongodb-org
```

### 2. Start MongoDB Service

**Windows:**
```powershell
# Start MongoDB service
net start MongoDB
# Or via Services app
```

**macOS/Linux:**
```bash
# Start MongoDB
brew services start mongodb-community
# Or
sudo systemctl start mongod
```

### 3. Verify MongoDB Connection

```bash
mongosh
# You should see the MongoDB shell prompt: >
# Type: exit to quit
```

---

## Populate Database

Once MongoDB is running, execute the seed script:

```bash
npm run seed --prefix octofit-tracker/backend
```

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

---

## Seed Data Overview

### Users (5 created)
1. **Alice Johnson** (@alice_runner) - Marathon runner
2. **Bob Smith** (@bob_cyclist) - Cycling enthusiast
3. **Carol Williams** (@carol_swimmer) - Triathlon athlete
4. **David Brown** (@david_yogi) - Yoga instructor
5. **Emma Davis** (@emma_crossfit) - CrossFit trainer

### Teams (3 created)
1. **Morning Runners** - Led by Alice
   - Members: Alice, Bob, Carol
2. **Fitness Warriors** - Led by Emma
   - Members: Emma, Alice, David
3. **Weekend Warriors** - Led by Bob
   - Members: Bob, Carol

### Activities (10 logged)
- Running: 2
- Cycling: 2
- Swimming: 2
- Yoga: 2
- Gym/CrossFit: 2

### Leaderboard Rankings
Sorted by points (calculated as calories / 10):
1. Emma Davis - 200 points
2. Bob Smith - 155 points
3. Carol Williams - 120 points
4. Alice Johnson - 87 points
5. David Brown - 35 points

### Workout Plans (6 created)
- Marathon Training
- Speed Work
- Mountain Bike Skills
- Triathlon Preparation
- Yoga for Flexibility
- CrossFit WOD

---

## Verify Data in MongoDB

### Connect to MongoDB Shell

```bash
mongosh
use octofit_db
```

### View Collections

```javascript
// List all collections
show collections

// View users
db.users.find().pretty()

// View activities
db.activities.find().pretty()

// View leaderboard
db.leaderboards.find().sort({ totalPoints: -1 }).pretty()

// Count documents
db.users.countDocuments()
db.activities.countDocuments()
db.teams.countDocuments()
db.leaderboards.countDocuments()
db.workouts.countDocuments()
```

---

## Test API Endpoints

After seeding and starting the backend server:

```bash
npm run dev --prefix octofit-tracker/backend
```

### Health Check
```bash
curl http://localhost:8000/api/health
```

### Get All Users
```bash
curl http://localhost:8000/api/users
```

### Get Global Leaderboard
```bash
curl http://localhost:8000/api/leaderboard?page=1&limit=10
```

### Get Activities
```bash
curl http://localhost:8000/api/activities
```

### Get Teams
```bash
curl http://localhost:8000/api/teams
```

### Get Workouts
```bash
curl http://localhost:8000/api/workouts
```

---

## Reset Database

If you need to reset and reseed:

```bash
npm run seed --prefix octofit-tracker/backend
```

This will:
1. Clear all existing collections
2. Repopulate with fresh seed data

---

## Troubleshooting

### MongoDB Connection Failed

```
❌ Error seeding database: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
1. Verify MongoDB is running
2. Check if port 27017 is not blocked by firewall
3. Ensure correct MONGO_URI in `.env`

### Permission Denied on macOS/Linux

```
Error: permission denied
```

**Solution:**
```bash
sudo npm run seed --prefix octofit-tracker/backend
```

### Database Already Exists

**Note:** The seed script automatically clears existing data before repopulating.

---

## Database Schema

### User
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String,
  firstName: String,
  lastName: String,
  profilePicture: String,
  bio: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Activity
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  type: String (running|cycling|swimming|walking|gym|yoga|other),
  duration: Number (minutes),
  distance: Number (km),
  calories: Number,
  date: Date,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Team
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  leader: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Leaderboard
```javascript
{
  _id: ObjectId,
  user: ObjectId (unique, ref: User),
  team: ObjectId (ref: Team),
  totalPoints: Number,
  activitiesCount: Number,
  totalCalories: Number,
  rank: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Workout
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  title: String,
  description: String,
  type: String (strength|cardio|flexibility|balance|sports),
  duration: Number (minutes),
  difficulty: String (beginner|intermediate|advanced),
  exercises: [{
    name: String,
    sets: Number,
    reps: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## Next Steps

1. ✅ Install MongoDB
2. ✅ Start MongoDB service
3. ✅ Run seed script: `npm run seed --prefix octofit-tracker/backend`
4. ✅ Start API server: `npm run dev --prefix octofit-tracker/backend`
5. ⏳ Connect React frontend to API
6. ⏳ Test endpoints with curl or Postman
7. ⏳ Implement authentication
8. ⏳ Deploy to production

---

## Quick Reference

```bash
# Start MongoDB (after installation)
net start MongoDB              # Windows
brew services start mongodb-community  # macOS
sudo systemctl start mongod    # Linux

# Seed database
npm run seed --prefix octofit-tracker/backend

# Start backend API
npm run dev --prefix octofit-tracker/backend

# Connect to MongoDB
mongosh
use octofit_db
show collections
```

---

## Support

For more information:
- MongoDB: https://docs.mongodb.com/
- Mongoose: https://mongoosejs.com/
- Backend API: See BACKEND_LOGIC_TIER.md
