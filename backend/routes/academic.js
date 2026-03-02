import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import AcademicProfile from '../models/AcademicProfile.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import StudySession from '../models/StudySession.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get academic profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    let profile = await AcademicProfile.findOne({ userId: req.userId });
    
    if (!profile) {
      profile = {
        userId: req.userId,
        subjects: [],
        currentCGPA: 0,
        targetCGPA: 0,
        semesterExamDate: new Date(),
        setupCompleted: false
      };
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create/Update academic profile
router.post('/profile', authMiddleware, async (req, res) => {
  try {
    const profile = await AcademicProfile.findOneAndUpdate(
      { userId: req.userId },
      { ...req.body, userId: req.userId },
      { new: true, upsert: true }
    );
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate tasks
router.post('/tasks/generate', authMiddleware, async (req, res) => {
  try {
    const profile = await AcademicProfile.findOne({ userId: req.userId });
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    await Task.deleteMany({ userId: req.userId });

    const tasks = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const examDate = new Date(profile.semesterExamDate);
    const daysUntilExam = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    
    for (let day = 0; day < Math.min(daysUntilExam, 60); day++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + day);
      
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0) continue;

      profile.subjects.forEach(subject => {
        const taskTypes = ['study', 'practice', 'revision'];
        const taskType = taskTypes[day % 3];
        
        tasks.push({
          userId: req.userId,
          subjectId: subject._id.toString(),
          subjectName: subject.name,
          type: taskType,
          title: `${taskType.charAt(0).toUpperCase() + taskType.slice(1)} - ${subject.name}`,
          duration: Math.round(30 + (subject.priorityScore / 100) * 60),
          scheduledDate: currentDate,
          priority: subject.priorityScore >= 70 ? 'high' : subject.priorityScore >= 40 ? 'medium' : 'low'
        });
      });
    }

    await Task.insertMany(tasks);
    res.json({ message: 'Tasks generated', count: tasks.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's tasks
router.get('/tasks/today', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Task.find({
      userId: req.userId,
      scheduledDate: { $gte: today, $lt: tomorrow }
    }).sort({ priority: -1, duration: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete task
router.patch('/tasks/:id/complete', authMiddleware, async (req, res) => {
  try {
    const { actualDuration, pointsEarned } = req.body;
    
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { completed: true, pointsEarned },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await User.findByIdAndUpdate(req.userId, {
      $inc: { 
        points: pointsEarned,
        weeklyPoints: pointsEarned,
        monthlyPoints: pointsEarned
      }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await StudySession.create({
      userId: req.userId,
      subject: task.subjectName,
      duration: actualDuration || task.duration,
      points: pointsEarned,
      date: today,
      startTime: new Date(),
      endTime: new Date(),
      isActive: false
    });

    const user = await User.findById(req.userId);
    const lastStudy = user.lastStudyDate ? new Date(user.lastStudyDate) : null;
    
    if (lastStudy) {
      lastStudy.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        await User.findByIdAndUpdate(req.userId, {
          $inc: { currentStreak: 1 },
          lastStudyDate: new Date()
        });
      } else if (daysDiff > 1) {
        await User.findByIdAndUpdate(req.userId, {
          currentStreak: 1,
          lastStudyDate: new Date()
        });
      }
    } else {
      await User.findByIdAndUpdate(req.userId, {
        currentStreak: 1,
        lastStudyDate: new Date()
      });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leaderboard
router.get('/leaderboard', authMiddleware, async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    
    let pointsField = 'points';
    if (period === 'weekly') pointsField = 'weeklyPoints';
    if (period === 'monthly') pointsField = 'monthlyPoints';

    const users = await User.find()
      .select(`name ${pointsField}`)
      .sort({ [pointsField]: -1 })
      .limit(50);

    const leaderboard = users.map((user, index) => ({
      userId: user._id,
      userName: user.name || user.email,
      points: user[pointsField],
      rank: index + 1
    }));

    const myRank = leaderboard.findIndex(entry => entry.userId.toString() === req.userId) + 1;

    res.json({ leaderboard, myRank: myRank || null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Weekly stats
router.get('/stats/weekly', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);

    const sessions = await StudySession.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
          date: { $gte: weekAgo, $lte: today }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalDuration: { $sum: '$duration' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const weeklyData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekAgo);
      date.setDate(weekAgo.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const session = sessions.find(s => s._id === dateStr);
      weeklyData.push({
        date: dateStr,
        duration: session ? session.totalDuration : 0
      });
    }

    res.json(weeklyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard stats
router.get('/stats/dashboard', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);

    const todaySessions = await StudySession.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId), date: today } },
      { $group: { _id: null, total: { $sum: '$duration' } } }
    ]);

    const weekSessions = await StudySession.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId), date: { $gte: weekAgo } } },
      { $group: { _id: null, total: { $sum: '$duration' } } }
    ]);

    const totalSessions = await StudySession.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
      { $group: { _id: null, total: { $sum: '$duration' } } }
    ]);

    const user = await User.findById(req.userId);

    res.json({
      today: todaySessions[0]?.total || 0,
      thisWeek: weekSessions[0]?.total || 0,
      total: totalSessions[0]?.total || 0,
      streak: user.currentStreak || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Insights
router.get('/insights', authMiddleware, async (req, res) => {
  try {
    const profile = await AcademicProfile.findOne({ userId: req.userId });
    const user = await User.findById(req.userId);
    
    if (!profile) {
      return res.json({ insights: [] });
    }

    const sessions = await StudySession.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
      { $group: { _id: '$subject', totalTime: { $sum: '$duration' } } },
      { $sort: { totalTime: 1 } }
    ]);

    const insights = [];

    if (sessions.length > 0) {
      const weakest = sessions[0];
      insights.push({
        type: 'warning',
        message: `${weakest._id} needs more attention. Only ${Math.round(weakest.totalTime)} minutes studied.`
      });
    }

    const daysLeft = Math.ceil((new Date(profile.semesterExamDate) - new Date()) / (1000 * 60 * 60 * 24));
    const cgpaGap = profile.targetCGPA - profile.currentCGPA;
    const requiredDaily = Math.round((cgpaGap * 120) / Math.max(daysLeft, 1));
    
    insights.push({
      type: 'info',
      message: `Study ${requiredDaily} minutes daily to reach ${profile.targetCGPA} CGPA target.`
    });

    if (daysLeft < 30 && requiredDaily > 180) {
      insights.push({
        type: 'danger',
        message: `⚠️ High risk! Only ${daysLeft} days left. Increase study time immediately.`
      });
    }

    if (user.currentStreak >= 3) {
      insights.push({
        type: 'success',
        message: `🔥 ${user.currentStreak}-day streak! Keep the momentum going!`
      });
    }

    res.json({ insights });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
