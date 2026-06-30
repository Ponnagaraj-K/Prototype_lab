# Setup Completion Fix - Testing Guide

## Issue Fixed
When signing in with an already registered account that has completed academic setup, the system was still showing the setup wizard instead of the dashboard.

## Root Cause
1. User state wasn't being properly updated after signin
2. Dashboard was checking `user.setupCompleted` before the user object was fully loaded
3. Auth page was redirecting before signin completed

## Changes Made

### 1. useAuth.tsx
- Added console logs to track user data flow
- Ensured user state is set immediately after signin/signup

### 2. Auth.tsx
- Changed redirect logic to use `window.location.href` after successful auth
- Added small delay to ensure state updates before redirect
- Improved error handling

### 3. Dashboard.tsx
- Updated `onComplete` callback to fetch fresh user data
- Added proper redirect after setup completion
- Improved logging for debugging

## Testing Steps

### Test 1: New User Signup
1. Open http://localhost:8080
2. Click "Sign up"
3. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
4. Click "Create account"
5. **Expected**: Should redirect to dashboard and show setup wizard
6. Complete all 4 steps of setup wizard
7. **Expected**: Should redirect to dashboard (no setup wizard)

### Test 2: Existing User with Setup Completed
1. Sign out if logged in
2. Sign in with the account you just created:
   - Email: test@example.com
   - Password: password123
3. **Expected**: Should go directly to dashboard (NO setup wizard)
4. **Expected**: Should see your study stats and subjects

### Test 3: Existing User without Setup
1. Create a new account or reset setup for existing account
2. Sign in
3. **Expected**: Should show setup wizard
4. Complete setup
5. Sign out
6. Sign in again
7. **Expected**: Should go directly to dashboard

### Test 4: Setup Completion Flow
1. Create new account
2. Go through setup wizard:
   - Step 1: Add 2-3 subjects with credits
   - Step 2: Set target SGPA (e.g., 8.5)
   - Step 3: Set daily study hours (e.g., 2.5)
   - Step 4: Select exam date (future date)
3. Click "Complete Setup"
4. **Expected**: Should redirect to dashboard
5. **Expected**: Should see subjects in dashboard
6. Sign out and sign in again
7. **Expected**: Should NOT see setup wizard

## Console Logs to Check

### During Signin:
```
SignIn response: { user: { id: "...", email: "...", name: "...", setupCompleted: true/false }, token: "..." }
Setting user data: { id: "...", email: "...", name: "...", setupCompleted: true/false }
Token stored after signin: eyJ...
```

### During Setup Completion:
```
Created subjects: [...]
Required grades: [...]
Subjects with priority: [...]
Updated user data after setup: { id: "...", setupCompleted: true, ... }
```

### After Signin (Dashboard Load):
```
User data loaded: { id: "...", email: "...", name: "...", setupCompleted: true }
```

## Verification Checklist

- [ ] New user signup shows setup wizard
- [ ] Completing setup redirects to dashboard
- [ ] Signing out and back in goes to dashboard (not setup)
- [ ] User with completed setup never sees setup wizard
- [ ] User without setup always sees setup wizard
- [ ] Console shows correct `setupCompleted` value
- [ ] No errors in browser console
- [ ] No errors in backend terminal

## Common Issues

### Issue: Still shows setup wizard after completion
**Debug Steps**:
1. Open browser console (F12)
2. Check for: `Setting user data: { ..., setupCompleted: true }`
3. If `setupCompleted` is false, check backend:
   - Run: `node test-backend.js` to verify setup completion endpoint
   - Check MongoDB to see if user.setupCompleted is true

### Issue: "Cannot read properties of undefined"
**Solution**:
1. Clear browser localStorage
2. Clear browser cache
3. Restart both frontend and backend
4. Try again

### Issue: Redirect loop
**Solution**:
1. Check console for errors
2. Verify token is stored: `localStorage.getItem('token')`
3. Clear localStorage and try again

## Database Verification

To manually check if setup is completed in MongoDB:

1. Go to MongoDB Atlas
2. Browse Collections
3. Find your user in `users` collection
4. Check `setupCompleted` field should be `true`
5. Check `subjects` collection has entries for your user
6. Check `tasks` collection has entries for your user

## Manual Fix (if needed)

If a user is stuck in setup wizard loop:

### Option 1: Reset Setup
```javascript
// In browser console
localStorage.clear();
window.location.href = '/auth';
```

### Option 2: Force Setup Completion (Backend)
```bash
# Use MongoDB Compass or Atlas
# Find user and update:
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { setupCompleted: true } }
)
```

### Option 3: Use Reset Endpoint
```javascript
// In browser console (when logged in)
fetch('http://localhost:5000/api/auth/reset-setup', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
}).then(r => r.json()).then(console.log);
```

## Success Criteria

✅ New users see setup wizard
✅ Setup completion redirects to dashboard
✅ Returning users with completed setup go directly to dashboard
✅ No console errors
✅ User state properly reflects setupCompleted status
✅ Database correctly stores setupCompleted = true

## Rollback

If issues persist, revert these files:
1. `src/hooks/useAuth.tsx`
2. `src/pages/Auth.tsx`
3. `src/pages/Dashboard.tsx`

Use git:
```bash
git checkout HEAD -- src/hooks/useAuth.tsx src/pages/Auth.tsx src/pages/Dashboard.tsx
```
