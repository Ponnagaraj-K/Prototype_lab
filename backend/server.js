import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import sessionRoutes from './routes/sessions.js';
import profileRoutes from './routes/profile.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'StudyMate Pro API' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Share this URL with your team: http://<YOUR_IP>:${PORT}`);
});
