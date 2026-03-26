import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from './models/Subject.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const subjects = await Subject.find({});
    
    if (subjects.length === 0) {
      console.log('No subjects found');
    } else {
      subjects.forEach(subject => {
        const examDate = new Date(subject.examDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        console.log(`\nSubject: ${subject.name}`);
        console.log(`Exam Date: ${examDate.toDateString()}`);
        console.log(`Today: ${today.toDateString()}`);
        console.log(`Has Passed: ${examDate < today ? 'YES' : 'NO'}`);
      });
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
