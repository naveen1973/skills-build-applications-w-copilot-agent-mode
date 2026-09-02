import { Request, Response } from 'express';
import Workout from '../models/Workout';

export const getAllWorkouts = async (req: Request, res: Response) => {
  try {
    const workouts = await Workout.find().populate('user', 'username email firstName lastName');
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workouts', error });
  }
};

export const getUserWorkouts = async (req: Request, res: Response) => {
  try {
    const workouts = await Workout.find({ user: req.params.userId }).populate('user', 'username email firstName lastName');
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user workouts', error });
  }
};

export const getWorkoutById = async (req: Request, res: Response) => {
  try {
    const workout = await Workout.findById(req.params.id).populate('user', 'username email firstName lastName');
    if (!workout) {
      res.status(404).json({ message: 'Workout not found' });
      return;
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workout', error });
  }
};

export const createWorkout = async (req: Request, res: Response) => {
  try {
    const { user, title, type, duration, difficulty, exercises, description } = req.body;

    if (!user || !title || !type || !duration) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const workout = new Workout({
      user,
      title,
      type,
      duration,
      difficulty,
      exercises,
      description,
    });

    await workout.save();
    await workout.populate('user', 'username email firstName lastName');
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Error creating workout', error });
  }
};

export const updateWorkout = async (req: Request, res: Response) => {
  try {
    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('user', 'username email firstName lastName');

    if (!workout) {
      res.status(404).json({ message: 'Workout not found' });
      return;
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Error updating workout', error });
  }
};

export const deleteWorkout = async (req: Request, res: Response) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) {
      res.status(404).json({ message: 'Workout not found' });
      return;
    }
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting workout', error });
  }
};
