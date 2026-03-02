import mongoose from 'mongoose';

const studyTaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subjectId: { type: String, required: true },
  subjectName: { type: String, required: true },
  type: { type: String, enum: ['study', 'practice', 'revision'], required: true },
  title: { type: String, required: true },
  duration: { type: Number, required: true },
  remainingTime: { type: Number, default: function() { return this.duration; } },
  scheduledDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['not_started', 'in_progress', 'paused', 'completed'], 
    default: 'not_started' 
  },
  pointsAwarded: { type: Boolean, default: false },
  pointsEarned: { type: Number, default: 0 },
  priority: { type: String, enum: ['high', 'medium', 'low'], required: true },
  completedTime: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('StudyTask', studyTaskSchema);