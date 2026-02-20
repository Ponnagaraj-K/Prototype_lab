import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  duration_minutes: {
    type: Number,
    default: 0
  },
  start_time: {
    type: Date,
    required: true
  },
  end_time: {
    type: Date,
    default: null
  },
  is_active: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('StudySession', studySessionSchema);
