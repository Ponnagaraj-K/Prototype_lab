# REFACTORED BACKEND ARCHITECTURE

## ✅ COMPLETE RESET & REBUILD

### Database Reset
```bash
cd backend
node resetDB.js
```

---

## NEW SCHEMA ARCHITECTURE

### 1. User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  points: Number (default: 0),
  currentStreak: Number (default: 0),
  lastStudyDate: Date
}
```

### 2. Subject Model
```javascript
{
  userId: ObjectId (ref: User, required, indexed),
  name: String (required),
  credits: Number (1-4, required),
  targetGrade: String (required),
  examDate: Date (required)
}
```

### 3. Task Model
```javascript
{
  userId: ObjectId (ref: User, required, indexed),
  subjectId: ObjectId (ref: Subject, required),
  duration: Number (required),
  status: Enum['pending', 'completed'] (default: 'pending'),
  date: Date (required, indexed)
}
```

### 4. StudySession Model
```javascript
{
  userId: ObjectId (ref: User, required, indexed),
  subjectId: ObjectId (ref: Subject, required),
  duration: Number (required),
  points: Number (required),
  date: Date (default: now, indexed)
}
```

---

## API ENDPOINTS

### Authentication
```
POST /api/auth/signup
POST /api/auth/signin
GET /api/auth/me
```

### Subjects
```
GET /api/subjects
POST /api/subjects
Body: { name, credits (1-4), targetGrade, examDate }
```

### Tasks
```
GET /api/tasks - Get all user's tasks
GET /api/tasks/today - Get today's tasks only
POST /api/tasks/generate - Generate tasks for today
PATCH /api/tasks/:id/complete - Complete task
Body: { duration } // actual minutes studied
```

### Leaderboard
```
GET /api/leaderboard
Response: { leaderboard: [{ userId, userName, points, rank }], myRank }
```

### Stats
```
GET /api/stats
Response: { todayMinutes, weekMinutes, streak }

GET /api/stats/weekly
Response: [{ date, duration }] // 7 days
```

### CGPA Planner
```
GET /api/cgpa-planner
Response: { subjects: [{ name, credits, creditWeight, recommendedHours }] }
```

---

## KEY FIXES IMPLEMENTED

### ✅ 1. User Isolation
- Every model has `userId` field
- All queries filter by `req.userId`
- No shared data between users

### ✅ 2. Task Generation
- Checks if tasks exist for today
- Prevents duplication
- One task per subject per day
- User-specific only

### ✅ 3. Task Completion
- Verifies task ownership: `Task.findOne({ _id, userId })`
- Returns 403 if unauthorized
- Calculates points: `floor(minutes / 3)`
- Updates only that user's points
- Creates StudySession
- Updates streak

### ✅ 4. Leaderboard
- Queries ALL users
- Sorts by points descending
- Independent points per user
- Shows user's rank

### ✅ 5. Credits Validation
- Max 4 credits enforced in schema
- Validation on subject creation
- Prevents division by zero in CGPA planner

### ✅ 6. Popup Points
- Calculates: `Math.floor(duration / 3)`
- Returns actual earned points
- No hardcoded values

### ✅ 7. Streak System
- Updates on task completion
- Consecutive days: increment
- Gap > 1 day: reset to 1
- Same day: no change

### ✅ 8. No Duplication
- Checks existing tasks before generation
- Returns error if tasks exist for today
- Prevents regeneration after completion

---

## DATA FLOW

### User Registration
1. POST /api/auth/signup
2. User created with points=0, streak=0
3. Returns JWT token

### Add Subjects
1. POST /api/subjects (multiple times)
2. Each subject linked to userId
3. Credits validated (1-4)

### Generate Tasks
1. POST /api/tasks/generate
2. Fetches user's subjects
3. Checks if tasks exist for today
4. Creates one task per subject
5. All tasks have userId

### Complete Task
1. PATCH /api/tasks/:id/complete { duration: 45 }
2. Verify task belongs to user
3. Calculate points: floor(45/3) = 15
4. Update User.points += 15
5. Mark task completed
6. Create StudySession
7. Update streak
8. Return { task, points: 15 }

### View Leaderboard
1. GET /api/leaderboard
2. Query all users
3. Sort by points
4. Return ranked list

---

## TESTING MULTI-USER

### User A
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"usera@test.com","password":"123456","name":"User A"}'

# Get token, then add subjects
curl -X POST http://localhost:5000/api/subjects \
  -H "Authorization: Bearer TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"name":"Math","credits":4,"targetGrade":"A","examDate":"2025-06-01"}'

# Generate tasks
curl -X POST http://localhost:5000/api/tasks/generate \
  -H "Authorization: Bearer TOKEN_A"

# Get tasks
curl http://localhost:5000/api/tasks/today \
  -H "Authorization: Bearer TOKEN_A"
# Should show Math task only

# Complete task
curl -X PATCH http://localhost:5000/api/tasks/TASK_ID/complete \
  -H "Authorization: Bearer TOKEN_A" \
  -H "Content-Type: application/json" \
  -d '{"duration":60}'
# Returns: { task, points: 20 }
```

### User B
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"userb@test.com","password":"123456","name":"User B"}'

# Add different subject
curl -X POST http://localhost:5000/api/subjects \
  -H "Authorization: Bearer TOKEN_B" \
  -H "Content-Type: application/json" \
  -d '{"name":"Physics","credits":3,"targetGrade":"B","examDate":"2025-06-01"}'

# Generate tasks
curl -X POST http://localhost:5000/api/tasks/generate \
  -H "Authorization: Bearer TOKEN_B"

# Get tasks
curl http://localhost:5000/api/tasks/today \
  -H "Authorization: Bearer TOKEN_B"
# Should show Physics task only (NOT Math)
```

### Verify Isolation
```bash
# Leaderboard
curl http://localhost:5000/api/leaderboard \
  -H "Authorization: Bearer TOKEN_A"
# Should show:
# User A: 20 points (rank 1)
# User B: 0 points (rank 2)
```

---

## VERIFICATION CHECKLIST

- [x] Database reset script created
- [x] User model simplified (no weekly/monthly)
- [x] Subject model with userId + credits max 4
- [x] Task model with userId + subjectId references
- [x] StudySession model with userId + subjectId
- [x] All routes use authMiddleware
- [x] Tasks filtered by userId
- [x] Task generation checks duplicates
- [x] Task completion verifies ownership
- [x] Points calculation: floor(minutes/3)
- [x] Leaderboard queries all users
- [x] Weekly stats with zeros for missing days
- [x] Streak logic implemented
- [x] CGPA planner with error handling
- [x] Credits validation (1-4)
- [x] No hardcoded users
- [x] No shared data

---

## START BACKEND

```bash
# Reset database first
cd backend
node resetDB.js

# Start server
npm run dev
```

---

## EXPECTED BEHAVIOR

1. **Different Users → Different Subjects**
   - User A adds Math, Physics
   - User B adds Chemistry
   - Each sees only their subjects

2. **Different Tasks**
   - User A gets Math, Physics tasks
   - User B gets Chemistry tasks
   - No overlap

3. **Independent Points**
   - User A completes task → User A points increase
   - User B points unchanged
   - Leaderboard shows both with different points

4. **No Duplication**
   - Generate tasks once per day
   - Completing task doesn't regenerate it
   - Error if trying to generate again same day

5. **Correct Points**
   - 30 min = 10 points
   - 45 min = 15 points
   - 60 min = 20 points
   - Popup shows actual calculated value

6. **Competitive Leaderboard**
   - All users visible
   - Sorted by points
   - Real-time ranking

---

## ARCHITECTURE COMPLETE ✅

Backend is now properly refactored with:
- Complete user isolation
- No shared data
- Proper validation
- Correct points calculation
- Multi-user support
- Clean schema design
