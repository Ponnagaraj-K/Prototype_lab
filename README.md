# StudyMate Pro

Smart Study Planner & Productivity Tracker

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Framer Motion

**Backend:**
- Node.js + Express
- MongoDB
- JWT Authentication

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```sh
cd backend
```

2. Install dependencies:
```sh
npm install
```

3. Install MongoDB:
- Download from https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud)

4. Update `.env` file with your MongoDB URI

5. Start backend server:
```sh
npm run dev
```
Backend runs on http://localhost:5000

### Frontend Setup

1. Navigate to root directory

2. Install dependencies:
```sh
npm install
```

3. Start development server:
```sh
npm run dev
```
Frontend runs on http://localhost:8080

## Features

- Study timer with pause/resume
- Dashboard with analytics
- Weekly progress charts
- AI-powered productivity insights
- Goal setting and tracking
- Streak counter
- Session history

## API Endpoints

- `POST /api/auth/signup` - Register
- `POST /api/auth/signin` - Login
- `GET /api/sessions` - Get study sessions
- `POST /api/sessions` - Create session
- `PATCH /api/sessions/:id` - Update session
- `GET /api/profile` - Get profile
- `PATCH /api/profile` - Update profile
