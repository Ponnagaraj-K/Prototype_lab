import express from 'express';
import StudySession from '../models/StudySession.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const sessions = await StudySession.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(500);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { subject, duration_minutes, points } = req.body;
    
    // If duration_minutes provided, create completed session
    if (duration_minutes) {
      const now = new Date();
      const session = new StudySession({
        userId: req.userId,
        subject,
        date: now,
        start_time: now,
        end_time: now,
        duration_minutes,
        points: points || 0,
        is_active: false
      });
      await session.save();
      
      // Update user points
      const User = (await import('../models/User.js')).default;
      await User.findByIdAndUpdate(req.userId, {
        $inc: { points: points || 0 }
      });
      
      return res.status(201).json(session);
    }
    
    // Otherwise create active session
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const session = new StudySession({
      userId: req.userId,
      subject,
      date: today,
      start_time: new Date(),
      is_active: true
    });
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { isActive, endTime, duration } = req.body;
    const session = await StudySession.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isActive, endTime, duration },
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
