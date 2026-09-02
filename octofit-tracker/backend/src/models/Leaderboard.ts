import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaderboard extends Document {
  user: mongoose.Types.ObjectId;
  team?: mongoose.Types.ObjectId;
  totalPoints: number;
  activitiesCount: number;
  totalCalories: number;
  rank: number;
  updatedAt: Date;
}

const leaderboardSchema = new Schema<ILeaderboard>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    activitiesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalCalories: {
      type: Number,
      default: 0,
      min: 0,
    },
    rank: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ILeaderboard>('Leaderboard', leaderboardSchema);
