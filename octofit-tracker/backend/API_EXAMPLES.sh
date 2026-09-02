#!/bin/bash
# OctoFit Tracker API Testing Examples
# Save as: octofit-tracker/backend/API_EXAMPLES.sh
# Usage: bash API_EXAMPLES.sh

BASE_URL="http://localhost:8000/api"

echo "🐙 OctoFit Tracker API Examples"
echo "================================\n"

# Health Check
echo "1️⃣  Health Check"
echo "GET $BASE_URL/health"
curl -X GET "$BASE_URL/health" | jq .
echo "\n"

# Create Users
echo "2️⃣  Create Users"
USER1=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice_runner",
    "email": "alice@example.com",
    "password": "secure123",
    "firstName": "Alice",
    "lastName": "Runner"
  }' | jq -r '._id')

USER2=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "bob_cyclist",
    "email": "bob@example.com",
    "password": "secure123",
    "firstName": "Bob",
    "lastName": "Cyclist"
  }' | jq -r '._id')

echo "Created User 1: $USER1"
echo "Created User 2: $USER2"
echo "\n"

# Get All Users
echo "3️⃣  Get All Users"
echo "GET $BASE_URL/users"
curl -s -X GET "$BASE_URL/users" | jq .
echo "\n"

# Get User by ID
echo "4️⃣  Get User by ID"
echo "GET $BASE_URL/users/$USER1"
curl -s -X GET "$BASE_URL/users/$USER1" | jq .
echo "\n"

# Create Activities
echo "5️⃣  Log Activities"
ACTIVITY1=$(curl -s -X POST "$BASE_URL/activities" \
  -H "Content-Type: application/json" \
  -d "{
    \"user\": \"$USER1\",
    \"type\": \"running\",
    \"duration\": 30,
    \"distance\": 5.5,
    \"calories\": 350,
    \"description\": \"Morning run in the park\"
  }" | jq -r '._id')

ACTIVITY2=$(curl -s -X POST "$BASE_URL/activities" \
  -H "Content-Type: application/json" \
  -d "{
    \"user\": \"$USER2\",
    \"type\": \"cycling\",
    \"duration\": 45,
    \"distance\": 20,
    \"calories\": 500,
    \"description\": \"Long bike ride\"
  }" | jq -r '._id')

echo "Created Activity 1: $ACTIVITY1"
echo "Created Activity 2: $ACTIVITY2"
echo "\n"

# Get All Activities
echo "6️⃣  Get All Activities"
echo "GET $BASE_URL/activities"
curl -s -X GET "$BASE_URL/activities" | jq .
echo "\n"

# Get User Activities
echo "7️⃣  Get User Activities"
echo "GET $BASE_URL/activities/user/$USER1"
curl -s -X GET "$BASE_URL/activities/user/$USER1" | jq .
echo "\n"

# Create Team
echo "8️⃣  Create Team"
TEAM=$(curl -s -X POST "$BASE_URL/teams" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Morning Runners\",
    \"description\": \"Early bird runners club\",
    \"leader\": \"$USER1\"
  }" | jq -r '._id')

echo "Created Team: $TEAM"
echo "\n"

# Add Team Member
echo "9️⃣  Add Team Member"
echo "POST $BASE_URL/teams/$TEAM/members"
curl -s -X POST "$BASE_URL/teams/$TEAM/members" \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"$USER2\"}" | jq .
echo "\n"

# Get All Teams
echo "🔟 Get All Teams"
echo "GET $BASE_URL/teams"
curl -s -X GET "$BASE_URL/teams" | jq .
echo "\n"

# Get Global Leaderboard
echo "1️⃣1️⃣  Global Leaderboard"
echo "GET $BASE_URL/leaderboard"
curl -s -X GET "$BASE_URL/leaderboard?page=1&limit=10" | jq .
echo "\n"

# Get User Rank
echo "1️⃣2️⃣  Get User Rank"
echo "GET $BASE_URL/leaderboard/user/$USER1"
curl -s -X GET "$BASE_URL/leaderboard/user/$USER1" | jq .
echo "\n"

# Create Workouts
echo "1️⃣3️⃣  Create Workout"
WORKOUT=$(curl -s -X POST "$BASE_URL/workouts" \
  -H "Content-Type: application/json" \
  -d "{
    \"user\": \"$USER1\",
    \"title\": \"Upper Body Strength\",
    \"description\": \"Focus on arms and chest\",
    \"type\": \"strength\",
    \"duration\": 60,
    \"difficulty\": \"intermediate\",
    \"exercises\": [
      {\"name\": \"Bench Press\", \"sets\": 4, \"reps\": 8},
      {\"name\": \"Dumbbell Rows\", \"sets\": 4, \"reps\": 10},
      {\"name\": \"Bicep Curls\", \"sets\": 3, \"reps\": 12}
    ]
  }" | jq -r '._id')

echo "Created Workout: $WORKOUT"
echo "\n"

# Get All Workouts
echo "1️⃣4️⃣  Get All Workouts"
echo "GET $BASE_URL/workouts"
curl -s -X GET "$BASE_URL/workouts" | jq .
echo "\n"

# Get User Workouts
echo "1️⃣5️⃣  Get User Workouts"
echo "GET $BASE_URL/workouts/user/$USER1"
curl -s -X GET "$BASE_URL/workouts/user/$USER1" | jq .
echo "\n"

# Update User
echo "1️⃣6️⃣  Update User"
echo "PUT $BASE_URL/users/$USER1"
curl -s -X PUT "$BASE_URL/users/$USER1" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "I love running and fitness! 🏃"
  }' | jq .
echo "\n"

echo "✅ All API tests completed!"
echo "================================"
