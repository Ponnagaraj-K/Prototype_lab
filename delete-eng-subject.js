// Script to delete "eng" subject for ponnagaraj188@gmail.com
// Run with: node delete-eng-subject.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  setupCompleted: Boolean
});

const subjectSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  credits: Number,
  targetGrade: String,
  examDate: Date,
  priorityScore: Number
});

const academicProfileSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  subjects: [{
    name: String,
    credits: Number,
    requiredGrade: Number,
    priorityScore: Number
  }],
  currentCGPA: Number,
  targetCGPA: Number,
  semesterExamDate: Date,
  setupCompleted: Boolean
});

const User = mongoose.model('User', userSchema);
const Subject = mongoose.model('Subject', subjectSchema);
const AcademicProfile = mongoose.model('AcademicProfile', academicProfileSchema);

async function deleteEngSubject() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!\n');

    const user = await User.findOne({ email: 'ponnagaraj188@gmail.com' });
    
    if (!user) {
      console.log('User not found!');
      return;
    }

    console.log(`Found user: ${user.name} (${user._id})\n`);

    // Delete from Subject collection
    const deleteResult = await Subject.deleteMany({ 
      userId: user._id,
      name: { $regex: /^eng$/i }
    });
    console.log(`Deleted ${deleteResult.deletedCount} subject(s) from Subject collection`);

    // Update Academic Profile
    const profile = await AcademicProfile.findOne({ userId: user._id });
    if (profile) {
      profile.subjects = profile.subjects.filter(s => s.name.toLowerCase() !== 'eng');
      await profile.save();
      console.log('Removed "eng" from Academic Profile');
    }

    // Show remaining subjects
    const remaining = await Subject.find({ userId: user._id });
    console.log(`\nRemaining subjects (${remaining.length}):`);
    remaining.forEach(s => console.log(`  - ${s.name}`));

    console.log('\nDone!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

deleteEngSubject();
