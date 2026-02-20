# StudyMate Pro Backend

Node.js + Express + MongoDB backend for StudyMate Pro

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install MongoDB:
- Download from https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

3. Update `.env` file with your MongoDB connection string

4. Start the server:
```bash
npm run dev
```

Server will run on http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/signin` - Login user
- GET `/api/auth/me` - Get current user

### Study Sessions
- GET `/api/sessions` - Get all sessions
- POST `/api/sessions` - Create new session
- PATCH `/api/sessions/:id` - Update session

### Profile
- GET `/api/profile` - Get user profile
- PATCH `/api/profile` - Update profile
