import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  credits: { type: Number, required: true },
  requiredGrade: { type: Number, default: 0 },
  priorityScore: { type: Number, default: 0 }
});

const academicProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  subjects: [subjectSchema],
  currentCGPA: { type: Number, required: true },
  targetCGPA: { type: Number, required: true },
  semesterExamDate: { type: Date, required: true },
  setupCompleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model('AcademicProfile', academicProfileSchema);
