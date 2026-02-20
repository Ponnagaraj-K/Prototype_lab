import express from 'express';
import StudySession from '../models/StudySession.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const sessions = await StudySession.find({ user_id: req.userId })
      .sort({ createdAt: -1 })
      .limit(500);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { subject } = req.body;
    const session = new StudySession({
      user_id: req.userId,
      subject,
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
    const { is_active, end_time, duration_minutes } = req.body;
    const session = await StudySession.findOneAndUpdate(
      { _id: req.params.id, user_id: req.userId },
      { is_active, end_time, duration_minutes },
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
