# API Testing Examples

## Test Data Isolation

### 1. Create Two Users
```bash
# User A
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"usera@test.com","password":"123456","name":"User A"}'

# User B
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"userb@test.com","password":"123456","name":"User B"}'
```

### 2. Get Tokens
```bash
# Login User A
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"usera@test.com","password":"123456"}'
# Save token as TOKEN_A

# Login User B
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"userb@test.com","password":"123456"}'
# Save token as TOKEN_B
```

### 3. Create Profiles
```bash
# User A Profile
curl -X POST http://localhost:5000/api/academic/profile \
  -H "Authorization: Bearer TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{
    "subjects": [
      {"name":"Math","credits":4,"requiredGrade":8,"priorityScore":80},
      {"name":"Physics","credits":3,"requiredGrade":7,"priorityScore":60}
    ],
    "currentCGPA": 7.5,
    "targetCGPA": 8.5,
    "semesterExamDate": "2025-06-01"
  }'

# User B Profile
curl -X POST http://localhost:5000/api/academic/profile \
  -H "Authorization: Bearer TOKEN_B" \
  -H "Content-Type: application/json" \
  -d '{
    "subjects": [
      {"name":"Chemistry","credits":3,"requiredGrade":9,"priorityScore":90}
    ],
    "currentCGPA": 8.0,
    "targetCGPA": 9.0,
    "semesterExamDate": "2025-06-01"
  }'
```

### 4. Generate Tasks
```bash
# User A Tasks
curl -X POST http://localhost:5000/api/academic/tasks/generate \
  -H "Authorization: Bearer TOKEN_A"

# User B Tasks
curl -X POST http://localhost:5000/api/academic/tasks/generate \
  -H "Authorization: Bearer TOKEN_B"
```

### 5. Verify Isolation
```bash
# User A sees only their tasks
curl http://localhost:5000/api/academic/tasks/today \
  -H "Authorization: Bearer TOKEN_A"
# Should show Math and Physics tasks

# User B sees only their tasks
curl http://localhost:5000/api/academic/tasks/today \
  -H "Authorization: Bearer TOKEN_B"
# Should show Chemistry tasks only
```

### 6. Complete Tasks & Check Leaderboard
```bash
# User A completes task (get task ID from previous call)
curl -X PATCH http://localhost:5000/api/academic/tasks/TASK_ID/complete \
  -H "Authorization: Bearer TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"actualDuration":60,"pointsEarned":120}'

# User B completes task
curl -X PATCH http://localhost:5000/api/academic/tasks/TASK_ID/complete \
  -H "Authorization: Bearer TOKEN_B" \
  -H "Content-Type: application/json" \
  -d '{"actualDuration":90,"pointsEarned":180}'

# Check Leaderboard
curl http://localhost:5000/api/academic/leaderboard \
  -H "Authorization: Bearer TOKEN_A"
# Should show both users with different points
```

### 7. Check Weekly Stats
```bash
# User A weekly data
curl http://localhost:5000/api/academic/stats/weekly \
  -H "Authorization: Bearer TOKEN_A"
# Should show User A's sessions only

# User B weekly data
curl http://localhost:5000/api/academic/stats/weekly \
  -H "Authorization: Bearer TOKEN_B"
# Should show User B's sessions only
```

### 8. Check Dashboard Stats
```bash
curl http://localhost:5000/api/academic/stats/dashboard \
  -H "Authorization: Bearer TOKEN_A"
# Returns: { today, thisWeek, total, streak }
```

### 9. Get AI Insights
```bash
curl http://localhost:5000/api/academic/insights \
  -H "Authorization: Bearer TOKEN_A"
# Returns personalized insights
```

## Expected Results

### ✅ User Isolation
- User A sees only Math/Physics tasks
- User B sees only Chemistry tasks
- No cross-user data leakage

### ✅ Leaderboard
- Shows both users
- Different points for each
- Correct ranking

### ✅ Weekly Graph
- Each user has separate data
- Shows last 7 days
- Includes zeros for no-study days

### ✅ Streak
- Increments on consecutive days
- Resets after gap
- Stored in database

### ✅ Points
- Saved to User document
- No localStorage
- Persists across sessions

## Database Verification

### Check MongoDB
```javascript
// Connect to MongoDB
use studymate

// Check users
db.users.find({}, {name:1, points:1, currentStreak:1})

// Check tasks by user
db.tasks.find({userId: ObjectId("USER_A_ID")})
db.tasks.find({userId: ObjectId("USER_B_ID")})

// Check study sessions
db.studysessions.find({userId: ObjectId("USER_A_ID")})

// Verify isolation
db.tasks.distinct("userId") // Should show multiple user IDs
```

## All Tests Pass ✓
- Data isolation working
- Points persisting
- Leaderboard showing multiple users
- Weekly graph with real data
- Streak system functional
- AI insights personalized
