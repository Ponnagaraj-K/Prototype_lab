import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import appRoutes from './routes/app.js';
import academicRoutes from './routes/academic.js';
import sessionRoutes from './routes/sessions.js';
import bookRoutes from './routes/books.js';
import aiRoutes from './routes/ai.js';
import knowledgeCheckRoutes from './routes/knowledgeCheck.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'http://127.0.0.1:8080', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api', appRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/knowledge-check', knowledgeCheckRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'StudyMate Pro API - Refactored' });
});

app.listen(PORT, 'localhost', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
