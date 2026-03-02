import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  targetGrade: {
    type: String,
    required: true
  },
  examDate: {
    type: Date,
    required: true
  },
  priorityScore: {
    type: Number,
    default: 50
  }
}, {
  timestamps: true
});

export default mongoose.model('Subject', subjectSchema);
