import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkout extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: string;
  duration: number;
  difficulty: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const workoutSchema = new Schema<IWorkout>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['strength', 'cardio', 'flexibility', 'balance', 'sports'],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    exercises: [
      {
        name: {
          type: String,
          required: true,
        },
        sets: {
          type: Number,
          required: true,
          min: 1,
        },
        reps: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IWorkout>('Workout', workoutSchema);
