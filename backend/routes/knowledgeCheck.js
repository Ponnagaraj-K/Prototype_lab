import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import Book from '../models/Book.js';
import KnowledgeTest from '../models/KnowledgeTest.js';
import { generateMCQQuestions } from '../services/aiService.js';

const router = express.Router();

// Generate MCQ questions from book pages
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { bookId, pageFrom, pageTo, numQuestions } = req.body;

    if (!bookId || !pageFrom || !pageTo || !numQuestions) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const from = parseInt(pageFrom);
    const to = parseInt(pageTo);
    const numQ = parseInt(numQuestions);

    if (from > to) {
      return res.status(400).json({ error: 'From page must be less than or equal to To page' });
    }

    if (numQ < 1 || numQ > 20) {
      return res.status(400).json({ error: 'Number of questions must be between 1 and 20' });
    }

    // Get book details
    const book = await Book.findOne({ _id: bookId, userId: req.userId });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Generate questions using AI
    const questions = await generateMCQQuestions(book, from, to, numQ);

    // Save test record
    const test = await KnowledgeTest.create({
      userId: req.userId,
      bookId,
      pageFrom: from,
      pageTo: to,
      questions: questions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      }))
    });

    res.json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: error.message || 'Failed to generate questions' });
  }
});

// Submit test and get results
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { testId, answers } = req.body;

    const test = await KnowledgeTest.findOne({ _id: testId, userId: req.userId });
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    let score = 0;
    const results = answers.map((answer, index) => {
      const correct = answer === test.questions[index].correctAnswer;
      if (correct) score++;
      return { correct, userAnswer: answer, correctAnswer: test.questions[index].correctAnswer };
    });

    const percentage = (score / test.questions.length) * 100;

    test.completed = true;
    test.score = score;
    test.totalQuestions = test.questions.length;
    test.percentage = percentage;
    test.completedAt = new Date();
    await test.save();

    res.json({ score, total: test.questions.length, percentage, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get test history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const tests = await KnowledgeTest.find({ userId: req.userId, completed: true })
      .populate('bookId', 'name')
      .sort({ completedAt: -1 })
      .limit(20);

    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
