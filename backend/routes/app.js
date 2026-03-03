import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import Subject from '../models/Subject.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import StudySession from '../models/StudySession.js';
import mongoose from 'mongoose';

const router = express.Router();

// ============================================
// SUBJECT ROUTES
// ============================================

// Get user's subjects
router.get('/subjects', authMiddleware, async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.userId });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create subject
router.post('/subjects', authMiddleware, async (req, res) => {
  try {
    const { name, credits, targetGrade, examDate, priorityScore } = req.body;

    // Validate credits
    if (credits < 1 || credits > 4) {
      return res.status(400).json({ error: 'Credits must be between 1 and 4' });
    }

    const subject = await Subject.create({
      userId: req.userId,
      name,
      credits,
      targetGrade,
      examDate,
      priorityScore: priorityScore || 50
    });

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update subject
router.patch('/subjects/:id', authMiddleware, async (req, res) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete setup
router.post('/setup/complete', authMiddleware, async (req, res) => {
  try {
    const { dailyStudyHours } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { 
        setupCompleted: true,
        dailyStudyHours: dailyStudyHours || 2.5
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// TASK ROUTES
// ============================================

// Get user's tasks
router.get('/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId })
      .populate('subjectId', 'name')
      .sort({ date: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get today's tasks
router.get('/tasks/today', authMiddleware, async (req, res) => {
  try {
    // Check if exam date has passed
    const subjects = await Subject.find({ userId: req.userId });
    if (subjects.length > 0) {
      const examDate = new Date(subjects[0].examDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (examDate < today) {
        // Reset setup if exam date passed
        await User.findByIdAndUpdate(req.userId, { setupCompleted: false });
        await Subject.deleteMany({ userId: req.userId });
        await Task.deleteMany({ userId: req.userId });
        return res.status(403).json({ error: 'Setup expired. Please complete setup again.' });
      }
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Auto-generate tasks if none exist for today
    const existingCount = await Task.countDocuments({
      userId: req.userId,
      date: { $gte: today, $lt: tomorrow }
    });

    if (existingCount === 0) {
      const subjects = await Subject.find({ userId: req.userId });
      
      if (subjects.length > 0) {
        // Delete old pending tasks
        await Task.deleteMany({
          userId: req.userId,
          status: 'pending',
          date: { $lt: today }
        });

        // Generate new tasks
        const tasks = subjects.map(subject => ({
          userId: req.userId,
          subjectId: subject._id,
          duration: 30,
          date: today,
          status: 'pending'
        }));
        
        await Task.insertMany(tasks);
      }
    }

    const tasks = await Task.find({
      userId: req.userId,
      date: { $gte: today, $lt: tomorrow }
    }).populate('subjectId', 'name credits priorityScore');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate tasks for user
router.post('/tasks/generate', authMiddleware, async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.userId });

    if (subjects.length === 0) {
      return res.status(400).json({ error: 'No subjects found. Add subjects first.' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if tasks already exist for today
    const existingTasks = await Task.countDocuments({
      userId: req.userId,
      date: today
    });

    if (existingTasks > 0) {
      return res.status(400).json({ error: 'Tasks already generated for today' });
    }

    // Delete old pending tasks from previous days
    await Task.deleteMany({
      userId: req.userId,
      status: 'pending',
      date: { $lt: today }
    });

    const tasks = [];
    
    for (const subject of subjects) {
      // Generate one task per subject for today
      tasks.push({
        userId: req.userId,
        subjectId: subject._id,
        duration: 30, // Default 30 minutes
        date: today,
        status: 'pending'
      });
    }

    await Task.insertMany(tasks);
    res.json({ message: 'Tasks generated successfully', count: tasks.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete task
router.patch('/tasks/:id/complete', authMiddleware, async (req, res) => {
  try {
    const { duration } = req.body; // Actual duration studied in minutes

    // Find task and verify ownership
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!task) {
      return res.status(403).json({ error: 'Task not found or unauthorized' });
    }

    if (task.status === 'completed') {
      return res.status(400).json({ error: 'Task already completed' });
    }

    // Calculate points: 1 point per 3 minutes
    const points = Math.floor(duration / 3);

    // Update task
    task.status = 'completed';
    task.pointsEarned = points;
    await task.save();

    // Update user points
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $inc: { points } },
      { new: true }
    );

    // Create study session
    await StudySession.create({
      userId: req.userId,
      subjectId: task.subjectId,
      duration,
      points,
      date: new Date()
    });

    // Update streak
    await updateStreak(req.userId);

    res.json({ 
      success: true,
      task: task.toObject(), 
      points,
      totalPoints: updatedUser.points
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// LEADERBOARD
// ============================================

router.get('/leaderboard', authMiddleware, async (req, res) => {
  try {
    const users = await User.find()
      .select('name points')
      .sort({ points: -1 })
      .limit(50);

    const leaderboard = users.map((user, index) => ({
      userId: user._id,
      userName: user.name,
      points: user.points,
      rank: index + 1
    }));

    const myRank = leaderboard.findIndex(u => u.userId.toString() === req.userId) + 1;

    res.json({ leaderboard, myRank: myRank || null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// STATS
// ============================================

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);

    // Today's minutes
    const todaySessions = await StudySession.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId), date: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$duration' } } }
    ]);

    // This week's minutes
    const weekSessions = await StudySession.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.userId), date: { $gte: weekAgo } } },
      { $group: { _id: null, total: { $sum: '$duration' } } }
    ]);

    // Get user streak
    const user = await User.findById(req.userId);

    res.json({
      todayMinutes: todaySessions[0]?.total || 0,
      weekMinutes: weekSessions[0]?.total || 0,
      streak: user.currentStreak || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Weekly chart data
router.get('/stats/weekly', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);
    weekAgo.setHours(0, 0, 0, 0);

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
      { $sort: { _id: 1 } }
    ]);

    // Fill missing days with zeros
    const weeklyData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - i));
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

// Recent sessions
router.get('/sessions/recent', authMiddleware, async (req, res) => {
  try {
    const sessions = await StudySession.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(10);

    const formattedSessions = sessions.map(s => ({
      _id: s._id,
      subject: s.subject,
      start_time: s.start_time || s.date,
      duration_minutes: s.duration_minutes,
      is_active: s.is_active || false
    }));

    res.json(formattedSessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CGPA PLANNER
// ============================================

router.get('/cgpa-planner', authMiddleware, async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.userId });

    if (subjects.length === 0) {
      return res.json({ subjects: [], message: 'No subjects found' });
    }

    // Calculate required study time per subject
    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);

    if (totalCredits === 0) {
      return res.status(400).json({ error: 'Total credits cannot be zero' });
    }

    const plannerData = subjects.map(subject => {
      const creditWeight = subject.credits / totalCredits;
      const recommendedHours = Math.round(creditWeight * 20); // 20 hours per week base

      return {
        ...subject.toObject(),
        creditWeight: (creditWeight * 100).toFixed(1) + '%',
        recommendedHours
      };
    });

    res.json({ subjects: plannerData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

async function updateStreak(userId) {
  try {
    const user = await User.findById(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!user.lastStudyDate) {
      // First study session
      user.currentStreak = 1;
      user.lastStudyDate = today;
    } else {
      const lastStudy = new Date(user.lastStudyDate);
      lastStudy.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        // Same day, no change
        return;
      } else if (daysDiff === 1) {
        // Consecutive day
        user.currentStreak += 1;
        user.lastStudyDate = today;
      } else {
        // Gap detected, reset
        user.currentStreak = 1;
        user.lastStudyDate = today;
      }
    }

    await user.save();
  } catch (error) {
    console.error('Error updating streak:', error);
  }
}

export default router;
