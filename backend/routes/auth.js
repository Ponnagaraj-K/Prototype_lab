import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({ email, password, name });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      user: { id: user._id, email: user.email, name: user.name, setupCompleted: user.setupCompleted },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      user: { id: user._id, email: user.email, name: user.name, setupCompleted: user.setupCompleted },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      setupCompleted: user.setupCompleted
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/reset-setup', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { setupCompleted: false });
    const AcademicProfile = (await import('../models/AcademicProfile.js')).default;
    const Subject = (await import('../models/Subject.js')).default;
    await AcademicProfile.deleteOne({ userId: req.userId });
    await Subject.deleteMany({ userId: req.userId });
    res.json({ message: 'Setup reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
