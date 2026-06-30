# StudyMate Pro - Localhost Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Verify `.env` file has correct settings:
```
PORT=5000
MONGODB_URI=mongodb+srv://ponnagaraj18_db_user:ponnagaraj%40123@cluster0.ufbtdxz.mongodb.net/studymate?retryWrites=true&w=majority&ssl=true
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key_here
```

4. Start backend server:
```bash
npm run dev
```

Backend will run on: **http://localhost:5000**

## Frontend Setup

1. Navigate to root directory (from backend, go back):
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Verify `.env` file has correct settings:
```
VITE_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on: **http://localhost:8080**

## Access the Application

Open your browser and go to: **http://localhost:8080**

## Troubleshooting

### Backend Issues

1. **MongoDB Connection Error**:
   - Check if MongoDB URI is correct in `backend/.env`
   - Ensure your IP is whitelisted in MongoDB Atlas

2. **Port 5000 already in use**:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

### Frontend Issues

1. **Port 8080 already in use**:
   - Change port in `vite.config.ts`
   - Update `VITE_API_URL` if needed

2. **Cannot connect to backend**:
   - Ensure backend is running on port 5000
   - Check browser console for errors
   - Verify `.env` has correct API URL

### Setup Wizard Issues

1. **"Cannot read properties of undefined"**:
   - Clear browser localStorage
   - Restart both frontend and backend
   - Check browser console for detailed error logs

2. **"Setup failed"**:
   - Open browser console (F12)
   - Look for red error messages
   - Check which API call is failing
   - Verify backend logs for errors

## Development Notes

- Backend runs on: `http://localhost:5000`
- Frontend runs on: `http://localhost:8080`
- API endpoints: `http://localhost:5000/api/*`
- CORS is configured for localhost only
- All data is stored in MongoDB Atlas

## Features

- Study Timer with session tracking
- AI-Powered Knowledge Check (MCQ generation from PDFs)
- Book Management (PDF uploads)
- Dashboard with Analytics
- Weekly Progress Charts
- Streak Tracking
- Academic Setup Wizard

## Important Files

- `backend/.env` - Backend environment variables
- `.env` - Frontend environment variables
- `backend/server.js` - Backend entry point
- `src/main.tsx` - Frontend entry point
- `src/components/SetupWizard.tsx` - Academic setup component
