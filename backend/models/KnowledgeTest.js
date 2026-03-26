import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, required: true }
});

const knowledgeTestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  pageFrom: { type: Number, required: true },
  pageTo: { type: Number, required: true },
  questions: [questionSchema],
  completed: { type: Boolean, default: false },
  score: { type: Number },
  totalQuestions: { type: Number },
  percentage: { type: Number },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('KnowledgeTest', knowledgeTestSchema);
