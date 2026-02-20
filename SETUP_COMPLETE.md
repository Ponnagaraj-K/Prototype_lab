# StudyMate Pro - Quick Start

## ✅ Installation Complete!

MongoDB, backend, and frontend dependencies are installed.

## 🚀 Start the Application

### Option 1: Automatic (Recommended)
Double-click `start.bat` to launch all services

### Option 2: Manual

**Terminal 1 - MongoDB:**
```cmd
mongod
```

**Terminal 2 - Backend:**
```cmd
cd backend
npm run dev
```

**Terminal 3 - Frontend:**
```cmd
npm run dev
```

## 📍 Access Points

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:5000
- **MongoDB:** mongodb://localhost:27017

## 🔧 Fixed Issues

1. ✅ MongoDB installed (v8.2.5)
2. ✅ Backend dependencies installed
3. ✅ Frontend dependencies installed
4. ✅ Fixed /auth/me endpoint (id vs _id)

## 📝 First Time Setup

1. Run `start.bat` (or start services manually)
2. Open http://localhost:8080
3. Sign up with email/password
4. Start tracking your study sessions!

## ⚠️ Troubleshooting

**MongoDB won't start:**
- Run Command Prompt as Administrator
- Execute: `net start MongoDB`
- Or manually: `mongod --dbpath C:\data\db`

**Port already in use:**
- Backend (5000): Change PORT in backend/.env
- Frontend (8080): Change port in vite.config.ts

**Connection errors:**
- Ensure MongoDB is running
- Check backend/.env has correct MONGODB_URI
- Verify backend is running on port 5000
