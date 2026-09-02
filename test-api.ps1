# OctoFit Tracker - API Testing Script for Codespaces & Localhost
# Usage: PowerShell .\test-api.ps1

$ErrorActionPreference = "Stop"

# Detect environment and set API base URL
if ([string]::IsNullOrEmpty($env:CODESPACE_NAME)) {
  $BASE_URL = "http://localhost:8000/api"
  Write-Host "🖥️  Testing Localhost API" -ForegroundColor Cyan
} else {
  $BASE_URL = "https://$($env:CODESPACE_NAME)-8000.app.github.dev/api"
  Write-Host "📍 Testing GitHub Codespaces API (Codespace: $($env:CODESPACE_NAME))" -ForegroundColor Cyan
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "API Base URL: $BASE_URL" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Counters
$script:testsPassed = 0
$script:testsFailed = 0

# Function to test endpoint
function Test-Endpoint {
  param(
    [string]$Method,
    [string]$Endpoint,
    [string]$Description,
    [int]$ExpectedStatus = 200
  )
  
  Write-Host -NoNewline "Testing: $Description ... "
  
  try {
    $response = Invoke-WebRequest -Uri "$BASE_URL$Endpoint" -Method $Method -ErrorAction Continue
    $status = $response.StatusCode
    $body = $response.Content
    
    if ($status -eq $ExpectedStatus) {
      Write-Host "✅ PASS (Status: $status)" -ForegroundColor Green
      $script:testsPassed++
      
      # Pretty print JSON if possible
      try {
        $json = $body | ConvertFrom-Json
        Write-Host ($json | ConvertTo-Json -Depth 2 | Select-Object -First 20)
      } catch {
        Write-Host $body.Substring(0, [Math]::Min(500, $body.Length))
      }
    } else {
      Write-Host "❌ FAIL (Expected: $ExpectedStatus, Got: $status)" -ForegroundColor Red
      $script:testsFailed++
      Write-Host "Response: $body"
    }
  } catch {
    $status = $_.Exception.Response.StatusCode.Value__
    $body = $_.Exception.Response.Content.ReadAsStringAsync().Result
    
    if ($null -eq $status) {
      Write-Host "❌ FAIL (Connection error)" -ForegroundColor Red
      $script:testsFailed++
      Write-Host "Error: $($_.Exception.Message)"
    } elseif ($status -eq $ExpectedStatus) {
      Write-Host "✅ PASS (Status: $status)" -ForegroundColor Green
      $script:testsPassed++
      Write-Host $body.Substring(0, [Math]::Min(500, $body.Length))
    } else {
      Write-Host "❌ FAIL (Expected: $ExpectedStatus, Got: $status)" -ForegroundColor Red
      $script:testsFailed++
      Write-Host "Response: $body"
    }
  }
  
  Write-Host ""
}

# Run tests
Write-Host "1️⃣  HEALTH CHECK" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Test-Endpoint -Method "GET" -Endpoint "/health" -Description "Health endpoint"
Write-Host ""

Write-Host "2️⃣  USER ENDPOINTS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Test-Endpoint -Method "GET" -Endpoint "/users" -Description "Get all users"
Test-Endpoint -Method "GET" -Endpoint "/users/1" -Description "Get user by ID (may 404 if not seeded)" -ExpectedStatus 404
Write-Host ""

Write-Host "3️⃣  ACTIVITY ENDPOINTS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Test-Endpoint -Method "GET" -Endpoint "/activities" -Description "Get all activities"
Write-Host ""

Write-Host "4️⃣  LEADERBOARD ENDPOINTS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Test-Endpoint -Method "GET" -Endpoint "/leaderboard" -Description "Get leaderboard"
Write-Host ""

Write-Host "5️⃣  TEAM ENDPOINTS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Test-Endpoint -Method "GET" -Endpoint "/teams" -Description "Get all teams"
Write-Host ""

Write-Host "6️⃣  WORKOUT ENDPOINTS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Test-Endpoint -Method "GET" -Endpoint "/workouts" -Description "Get all workouts"
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "TEST RESULTS" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "✅ Passed: $($script:testsPassed)" -ForegroundColor Green
Write-Host "❌ Failed: $($script:testsFailed)" -ForegroundColor Red
Write-Host ""

if ($script:testsFailed -eq 0) {
  Write-Host "🎉 All tests passed!" -ForegroundColor Green
  exit 0
} else {
  Write-Host "⚠️  Some tests failed" -ForegroundColor Yellow
  exit 1
}
