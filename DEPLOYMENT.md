# StudyMate Pro - Simple Deployment Guide

## ✅ All Code Files are Ready! Just Follow These Steps:

---

## STEP 1: Create MongoDB Database (5 minutes)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google (easiest)
3. Choose **FREE M0 tier**
4. Click "Create"
5. **Database Access**: 
   - Click "Add New Database User"
   - Username: `studymate`
   - Password: Click "Autogenerate Secure Password" and COPY IT
   - Click "Add User"
6. **Network Access**:
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Click "Confirm"
7. **Get Connection String**:
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - COPY the connection string (looks like: `mongodb+srv://studymate:...`)
   - Replace `<password>` with your password from step 5

**SAVE THIS CONNECTION STRING - YOU'LL NEED IT!**

---

## STEP 2: Deploy Backend on Render (10 minutes)

1. Go to: https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Click "Connect account" → Authorize GitHub
5. Find your repository and click "Connect"
6. Fill in:
   - **Name**: `studymate-backend`
   - **Region**: Choose closest to you
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
7. **Environment Variables** (Click "Add Environment Variable"):
   - `MONGODB_URI` = (paste your MongoDB connection string from Step 1)
   - `JWT_SECRET` = (type any random text like: `mySecretKey12345`)
   - `GROQ_API_KEY` = `your_groq_api_key_from_console_groq_com`
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
8. Click "Create Web Service"
9. Wait 5-10 minutes for deployment
10. **COPY YOUR BACKEND URL** (looks like: `https://studymate-backend-xxxx.onrender.com`)

---

## STEP 3: Deploy Frontend on Vercel (5 minutes)

1. Go to: https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Click "Import" next to your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (leave as is)
   - **Output Directory**: `dist` (leave as is)
6. **Environment Variables** (Click "Add"):
   - **Key**: `VITE_API_URL`
   - **Value**: (paste your Render backend URL from Step 2 + add `/api`)
   - Example: `https://studymate-backend-xxxx.onrender.com/api`
7. Click "Deploy"
8. Wait 3-5 minutes
9. Click on your deployment URL

---

## 🎉 Done! Your App is Live!

Your app will be at: `https://your-project-name.vercel.app`

---

## 📝 Important Notes:

- **Free tier limitations**:
  - Render: Backend sleeps after 15 mins of inactivity (takes 30 seconds to wake up)
  - MongoDB: 512MB storage limit (enough for 1000+ users)
  - Vercel: Unlimited deployments

- **If something goes wrong**:
  - Check Render logs for backend errors
  - Check Vercel logs for frontend errors
  - Make sure environment variables are correct

---

## 🔄 To Update Your App Later:

Just push to GitHub - both Render and Vercel auto-deploy!

```bash
git add .
git commit -m "updates"
git push
```

---

## ⚠️ Before You Deploy:

Make sure you have pushed all code to GitHub:

```bash
cd "f:\New folder\study_Planner\studymate-pro-main"
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

If you don't have a GitHub repo yet:
1. Go to https://github.com/new
2. Create a new repository (name it "studymate-pro")
3. Copy the repository URL
4. Run the commands above with your URL
