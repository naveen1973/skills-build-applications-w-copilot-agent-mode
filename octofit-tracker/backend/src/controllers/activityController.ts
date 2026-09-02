import { Request, Response } from 'express';
import Activity from '../models/Activity';
import Leaderboard from '../models/Leaderboard';

export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find().populate('user', 'username email');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error });
  }
};

export const getUserActivities = async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find({ user: req.params.userId }).populate('user', 'username email');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user activities', error });
  }
};

export const createActivity = async (req: Request, res: Response) => {
  try {
    const { user, type, duration, distance, calories, description } = req.body;

    if (!user || !type || !duration || !calories) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const activity = new Activity({
      user,
      type,
      duration,
      distance,
      calories,
      description,
      date: new Date(),
    });

    await activity.save();
    
    const leaderboard = await Leaderboard.findOneAndUpdate(
      { user },
      {
        $inc: {
          totalPoints: Math.ceil(calories / 10),
          activitiesCount: 1,
          totalCalories: calories,
        },
      },
      { upsert: true, new: true }
    );

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error creating activity', error });
  }
};

export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      res.status(404).json({ message: 'Activity not found' });
      return;
    }

    await Leaderboard.findOneAndUpdate(
      { user: activity.user },
      {
        $inc: {
          totalPoints: -Math.ceil(activity.calories / 10),
          activitiesCount: -1,
          totalCalories: -activity.calories,
        },
      }
    );

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting activity', error });
  }
};
