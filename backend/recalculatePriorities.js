import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const recalculatePriorities = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const AcademicProfile = (await import('./models/AcademicProfile.js')).default;
    const profiles = await AcademicProfile.find();

    for (const profile of profiles) {
      if (profile.subjects && profile.subjects.length > 0) {
        const examDate = new Date(profile.semesterExamDate);
        const daysLeft = Math.max(1, Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

        profile.subjects = profile.subjects.map(subject => {
          // New credit weight: 1-2 credits = low, 3 credits = medium, 4 credits = high
          let creditWeight;
          if (subject.credits >= 4) creditWeight = 40;
          else if (subject.credits === 3) creditWeight = 25;
          else creditWeight = 15;
          
          const gradeWeight = (subject.requiredGrade / 10) * 40;
          const urgencyWeight = (1 / daysLeft) * 20;
          const priorityScore = Number((creditWeight + gradeWeight + urgencyWeight).toFixed(2));

          return { ...subject, priorityScore };
        });

        await profile.save();
        console.log(`Updated profile for user ${profile.userId}`);
      }
    }

    console.log('✅ Priority scores recalculated');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

recalculatePriorities();
