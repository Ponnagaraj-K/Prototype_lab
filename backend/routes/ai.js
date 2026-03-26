import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import Book from '../models/Book.js';
import Groq from 'groq-sdk';

const router = express.Router();

const searchYouTube = async (query) => {
  const searchQuery = encodeURIComponent(query);
  return [
    `https://www.youtube.com/results?search_query=${searchQuery}`,
    `https://www.youtube.com/results?search_query=${searchQuery}+tutorial`,
    `https://www.youtube.com/results?search_query=${searchQuery}+explained`
  ];
};

router.get('/pdf-status/:subjectId', authMiddleware, async (req, res) => {
  try {
    const books = await Book.find({ userId: req.userId, subjectId: req.params.subjectId });
    res.json({ hasPDF: books.length > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/chat-history/:subjectId', authMiddleware, async (req, res) => {
  try {
    res.json({ messages: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { subjectId, message, history } = req.body;

    const books = await Book.find({ userId: req.userId, subjectId });
    const bookContext = books.length > 0 
      ? `The student has uploaded ${books.length} book(s) for this subject.`
      : '';

    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey || apiKey === 'paste_groq_key_here') {
      const youtubeLinks = await searchYouTube(message);
      return res.json({
        answer: `API key not configured. Get FREE key from https://console.groq.com/keys and add to backend/.env`,
        youtubeLinks
      });
    }

    const groq = new Groq({ apiKey });

    const messages = [
      {
        role: 'system',
        content: `You are an expert study tutor. ${bookContext} Provide clear explanations using bullet points and numbered lists. Break down complex topics into simple points. Use examples. Be concise and structured.`
      },
      ...history.slice(-4).map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 1000
    });

    const aiAnswer = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    let youtubeLinks = [];
    if (message.toLowerCase().includes('video') || message.toLowerCase().includes('youtube')) {
      youtubeLinks = await searchYouTube(message);
    }

    res.json({ answer: aiAnswer, youtubeLinks });
  } catch (error) {
    console.error('AI error:', error.message);
    const youtubeLinks = await searchYouTube(req.body.message);
    res.json({
      answer: `Error: ${error.message}\n\nCheck backend console for details.`,
      youtubeLinks
    });
  }
});

export default router;
