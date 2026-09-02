import { Request, Response } from 'express';
import Leaderboard from '../models/Leaderboard';

export const getGlobalLeaderboard = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const leaderboard = await Leaderboard.find()
      .sort({ totalPoints: -1, totalCalories: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username email firstName lastName profilePicture');

    const leaderboardWithRank = leaderboard.map((entry, index) => ({
      ...entry.toObject(),
      rank: skip + index + 1,
    }));

    res.json(leaderboardWithRank);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error });
  }
};

export const getTeamLeaderboard = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const leaderboard = await Leaderboard.find({ team: teamId })
      .sort({ totalPoints: -1, totalCalories: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username email firstName lastName profilePicture');

    const leaderboardWithRank = leaderboard.map((entry, index) => ({
      ...entry.toObject(),
      rank: skip + index + 1,
    }));

    res.json(leaderboardWithRank);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team leaderboard', error });
  }
};

export const getUserRank = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userLeaderboard = await Leaderboard.findOne({ user: userId }).populate(
      'user',
      'username email firstName lastName profilePicture'
    );

    if (!userLeaderboard) {
      res.status(404).json({ message: 'User not found in leaderboard' });
      return;
    }

    const rank =
      (await Leaderboard.countDocuments({
        totalPoints: { $gt: userLeaderboard.totalPoints },
      })) + 1;

    res.json({
      ...userLeaderboard.toObject(),
      rank,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user rank', error });
  }
};
