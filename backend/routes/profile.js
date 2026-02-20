import express from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      daily_goal_minutes: user.daily_goal_minutes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/', authMiddleware, async (req, res) => {
  try {
    const { daily_goal_minutes, name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { daily_goal_minutes, name },
      { new: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      daily_goal_minutes: user.daily_goal_minutes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
