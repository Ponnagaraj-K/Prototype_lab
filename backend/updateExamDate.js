import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const updateExamDate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = (await import('./models/User.js')).default;
    const AcademicProfile = (await import('./models/AcademicProfile.js')).default;

    // Find jj user - try different email patterns
    let user = await User.findOne({ email: 'ponnagaraj1@gmail.com' });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    console.log('Found user:', user.email);

    // Update exam date to March 2, 2025
    const examDate = new Date('2025-03-02');
    let result = await AcademicProfile.findOneAndUpdate(
      { userId: user._id },
      { semesterExamDate: examDate },
      { new: true }
    );

    if (!result) {
      // Create academic profile if it doesn't exist
      result = await AcademicProfile.create({
        userId: user._id,
        subjects: [],
        currentCGPA: 0,
        targetCGPA: 0,
        semesterExamDate: examDate,
        setupCompleted: false
      });
      console.log('✅ Academic profile created with exam date:', result.semesterExamDate);
    } else {
      console.log('✅ Exam date updated to:', result.semesterExamDate);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateExamDate();
