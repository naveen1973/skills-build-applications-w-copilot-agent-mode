#!/bin/bash
# OctoFit Tracker - API Testing Script for Codespaces & Localhost
# Usage: bash test-api.sh

set -e

# Detect environment and set API base URL
if [ -z "$CODESPACE_NAME" ]; then
  BASE_URL="http://localhost:8000/api"
  echo "🖥️  Testing Localhost API"
else
  BASE_URL="https://$CODESPACE_NAME-8000.app.github.dev/api"
  echo "📍 Testing GitHub Codespaces API (Codespace: $CODESPACE_NAME)"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "API Base URL: $BASE_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Counter for passed/failed tests
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test endpoint
test_endpoint() {
  local method=$1
  local endpoint=$2
  local description=$3
  local expected_status=${4:-200}
  
  echo -n "Testing: $description ... "
  
  response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint")
  status=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)
  
  if [ "$status" = "$expected_status" ]; then
    echo "✅ PASS (Status: $status)"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    
    # Pretty print JSON if available
    if command -v jq &> /dev/null; then
      echo "$body" | jq '.' 2>/dev/null | head -20 || echo "$body"
    else
      echo "$body" | head -5
    fi
  else
    echo "❌ FAIL (Expected: $expected_status, Got: $status)"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo "Response: $body"
  fi
  
  echo ""
}

# Run tests
echo "1️⃣  HEALTH CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint GET "/health" "Health endpoint"
echo ""

echo "2️⃣  USER ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint GET "/users" "Get all users"
test_endpoint GET "/users/1" "Get user by ID (may 404 if not seeded)"
echo ""

echo "3️⃣  ACTIVITY ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint GET "/activities" "Get all activities"
echo ""

echo "4️⃣  LEADERBOARD ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint GET "/leaderboard" "Get leaderboard"
echo ""

echo "5️⃣  TEAM ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint GET "/teams" "Get all teams"
echo ""

echo "6️⃣  WORKOUT ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint GET "/workouts" "Get all workouts"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST RESULTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Passed: $TESTS_PASSED"
echo "❌ Failed: $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo "🎉 All tests passed!"
  exit 0
else
  echo "⚠️  Some tests failed"
  exit 1
fi
