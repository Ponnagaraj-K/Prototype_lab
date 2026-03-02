import mongoose from 'mongoose';

const userPointsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalPoints: { type: Number, default: 0 },
  weeklyPoints: { type: Number, default: 0 },
  monthlyPoints: { type: Number, default: 0 },
  lastWeekReset: { type: Date, default: Date.now },
  lastMonthReset: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('UserPoints', userPointsSchema);