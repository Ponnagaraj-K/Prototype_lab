import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Task', taskSchema);
