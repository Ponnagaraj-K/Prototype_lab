import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authMiddleware } from '../middleware/auth.js';
import Book from '../models/Book.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/books';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Get all books for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const books = await Book.find({ userId: req.userId });
    
    // Group by subjectId
    const grouped = books.reduce((acc, book) => {
      const subjectId = book.subjectId.toString();
      if (!acc[subjectId]) acc[subjectId] = [];
      acc[subjectId].push(book);
      return acc;
    }, {});
    
    res.json(grouped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload book
router.post('/upload', authMiddleware, upload.single('pdf'), async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { subjectId } = req.body;
    
    if (!subjectId) {
      return res.status(400).json({ error: 'Subject ID is required' });
    }
    
    const book = await Book.create({
      userId: req.userId,
      subjectId,
      name: req.file.originalname,
      url: `/uploads/books/${req.file.filename}`
    });

    res.status(201).json(book);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete book
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(process.cwd(), book.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await book.deleteOne();
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get books for specific subject
router.get('/subject/:subjectId', authMiddleware, async (req, res) => {
  try {
    const books = await Book.find({
      userId: req.userId,
      subjectId: req.params.subjectId
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
