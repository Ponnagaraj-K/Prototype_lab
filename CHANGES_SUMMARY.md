# Changes Made to Fix Academic Setup Issue

## Date: January 3, 2025

## Problem
Academic Setup Wizard was failing with error: "Cannot read properties of undefined (reading 'credits')"

## Root Cause
1. API response structure mismatch - backend returns `_id` but frontend expected `id`
2. Subject data not properly mapped from API response
3. Port forwarding configuration causing confusion
4. Missing proper error handling and logging

## Changes Made

### 1. SetupWizard.tsx
**File**: `src/components/SetupWizard.tsx`

**Changes**:
- Fixed API response mapping to include both `id` and `_id` fields
- Added proper subject data structure with all required fields
- Added console.log statements for debugging
- Improved error handling with specific error messages
- Fixed endpoint path from `/tasks/generate` to `/academic/tasks/generate`
- Made task generation non-blocking (won't fail entire setup)

**Key Fix**:
```typescript
const mappedSubject = {
  id: response._id,
  _id: response._id,
  name: response.name,
  credits: response.credits,
  targetGrade: response.targetGrade,
  examDate: response.examDate,
  priorityScore: response.priorityScore || 50,
  requiredGrade: 0
};
```

### 2. apiClient.ts
**File**: `src/lib/apiClient.ts`

**Changes**:
- Added detailed console logging for all requests
- Added response status logging
- Improved error message parsing
- Better error handling for failed requests

**Benefits**:
- Easy debugging of API calls
- Clear visibility of request/response flow
- Better error messages for users

### 3. Backend Server Configuration
**File**: `backend/server.js`

**Changes**:
- Changed CORS from `origin: '*'` to specific localhost origins
- Changed server binding from `0.0.0.0` to `localhost`
- Updated console log to show full URL

**Before**:
```javascript
app.use(cors({ origin: '*' }));
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

**After**:
```javascript
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'http://127.0.0.1:8080', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.listen(PORT, 'localhost', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 4. Vite Configuration
**File**: `vite.config.ts`

**Changes**:
- Changed host from `::` to `localhost`

**Before**:
```typescript
server: {
  host: "::",
  port: 8080,
}
```

**After**:
```typescript
server: {
  host: "localhost",
  port: 8080,
}
```

### 5. Environment Configuration
**File**: `.env`

**Changes**:
- Changed API URL from Dev Tunnel to localhost

**Before**:
```
VITE_API_URL=https://l8fvhns3-5000.inc1.devtunnels.ms/api
```

**After**:
```
VITE_API_URL=http://localhost:5000/api
```

## Testing Instructions

1. **Stop all running servers**

2. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```
   Should see: `Server running on http://localhost:5000`

3. **Start Frontend** (new terminal):
   ```bash
   npm run dev
   ```
   Should see: `Local: http://localhost:8080`

4. **Test Setup Wizard**:
   - Open browser to http://localhost:8080
   - Sign up or sign in
   - Go through Academic Setup
   - Open browser console (F12) to see detailed logs
   - Check for any errors in console

5. **Expected Console Output**:
   ```
   Making request to: http://localhost:5000/api/subjects
   Response status: 201
   Response data: { _id: "...", name: "...", credits: 3, ... }
   Created subjects: [...]
   Required grades: [...]
   Subjects with priority: [...]
   ```

## Verification Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:8080
- [ ] Can sign up/sign in
- [ ] Setup wizard loads
- [ ] Can add subjects
- [ ] Can complete all 4 steps
- [ ] Setup completes successfully
- [ ] Redirects to dashboard after setup
- [ ] No errors in browser console
- [ ] No errors in backend terminal

## Common Issues & Solutions

### Issue: "Cannot connect to server"
**Solution**: 
- Ensure backend is running on port 5000
- Check `.env` has `VITE_API_URL=http://localhost:5000/api`

### Issue: "Cannot read properties of undefined"
**Solution**:
- Clear browser localStorage
- Restart both servers
- Check console logs for which field is undefined

### Issue: "Setup failed"
**Solution**:
- Open browser console (F12)
- Look for red error messages
- Check which API endpoint is failing
- Verify backend logs

### Issue: CORS errors
**Solution**:
- Ensure frontend is on http://localhost:8080
- Check backend CORS configuration
- Restart backend server

## Files Modified

1. `src/components/SetupWizard.tsx` - Fixed subject mapping
2. `src/lib/apiClient.ts` - Added logging
3. `backend/server.js` - Localhost configuration
4. `vite.config.ts` - Localhost configuration
5. `.env` - Localhost API URL

## Files Created

1. `LOCALHOST_SETUP.md` - Setup instructions
2. `CHANGES_SUMMARY.md` - This file

## Next Steps

If setup still fails:
1. Share browser console logs
2. Share backend terminal output
3. Share the exact error message
4. Share which step is failing (1, 2, 3, or 4)

## Rollback Instructions

If you need to revert to port forwarding:

1. `.env`:
   ```
   VITE_API_URL=https://l8fvhns3-5000.inc1.devtunnels.ms/api
   ```

2. `backend/server.js`:
   ```javascript
   app.use(cors({ origin: '*' }));
   app.listen(PORT, '0.0.0.0', ...);
   ```

3. `vite.config.ts`:
   ```typescript
   server: { host: "::", port: 8080 }
   ```
