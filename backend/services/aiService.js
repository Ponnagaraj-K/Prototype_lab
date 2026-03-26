import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let groqInstance = null;

function getGroqClient() {
  if (!groqInstance) {
    groqInstance = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
  return groqInstance;
}

async function generateGenericQuestions(bookName, pageFrom, pageTo, numQuestions) {
  const prompt = `You are an expert educator. Create ${numQuestions} multiple-choice questions for pages ${pageFrom} to ${pageTo} from a book titled "${bookName}".

Create academic-level questions that would typically be covered in these pages.

Return ONLY a valid JSON array:
[
  {
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Explanation"
  }
]`;

  const groq = getGroqClient();
  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 2000,
  });

  const responseText = completion.choices[0]?.message?.content || '';
  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Failed to parse AI response');

  const questions = JSON.parse(jsonMatch[0]);
  return questions.slice(0, numQuestions).map(q => ({
    question: q.question,
    options: q.options.slice(0, 4),
    correctAnswer: Math.min(Math.max(0, q.correctAnswer), 3),
    explanation: q.explanation || 'No explanation provided'
  }));
}

async function extractTextFromPDF(pdfPath, pageFrom, pageTo) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const uint8Array = new Uint8Array(dataBuffer);
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdfDocument = await loadingTask.promise;
  
  const totalPages = pdfDocument.numPages;
  
  if (pageTo > totalPages) {
    throw new Error(`Book only has ${totalPages} pages. You requested pages ${pageFrom}-${pageTo}`);
  }
  
  let fullText = '';
  
  for (let pageNum = pageFrom; pageNum <= pageTo; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + ' ';
  }
  
  console.log(`Extracted ${fullText.length} characters from pages ${pageFrom}-${pageTo}`);
  
  return { text: fullText, totalPages };
}

export async function generateMCQQuestions(book, pageFrom, pageTo, numQuestions) {
  try {
    const pdfPath = path.join(process.cwd(), book.url);
    
    if (!fs.existsSync(pdfPath)) {
      throw new Error('Book file not found');
    }

    const { text: pageText, totalPages } = await extractTextFromPDF(pdfPath, pageFrom, pageTo);
    
    console.log('Extracted text length:', pageText.length);
    console.log('First 200 chars:', pageText.substring(0, 200));
    
    if (!pageText || pageText.trim().length < 20) {
      // If no text extracted, generate questions based on book metadata
      console.log('PDF appears to be image-based, generating generic questions');
      return await generateGenericQuestions(book.name, pageFrom, pageTo, numQuestions);
    }

    // Generate questions using Groq AI
    const prompt = `You are an expert educator creating high-quality multiple-choice questions.

Based on the following text from pages ${pageFrom} to ${pageTo}, generate exactly ${numQuestions} multiple-choice questions.

TEXT:
${pageText.substring(0, 4000)}

REQUIREMENTS:
1. Create ${numQuestions} important and challenging questions
2. Each question must have exactly 4 options (A, B, C, D)
3. Questions should test understanding, not just memorization
4. Include a clear explanation for the correct answer
5. Questions must be directly related to the content in the provided text
6. Make sure questions are based on facts and concepts from the text

Return ONLY a valid JSON array in this exact format:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation of why this is correct"
  }
]

The correctAnswer should be the index (0-3) of the correct option.`;

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 3000,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const questions = JSON.parse(jsonMatch[0]);

    // Validate questions
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No valid questions generated');
    }

    // Ensure we have the requested number of questions
    const validQuestions = questions.slice(0, numQuestions).map(q => ({
      question: q.question,
      options: q.options.slice(0, 4),
      correctAnswer: Math.min(Math.max(0, q.correctAnswer), 3),
      explanation: q.explanation || 'No explanation provided'
    }));

    if (validQuestions.length < numQuestions) {
      throw new Error(`Could only generate ${validQuestions.length} questions from the content`);
    }

    return validQuestions;
  } catch (error) {
    console.error('Error generating MCQ questions:', error);
    throw error;
  }
}
