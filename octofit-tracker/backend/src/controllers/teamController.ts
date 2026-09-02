import { Request, Response } from 'express';
import Team from '../models/Team';

export const getAllTeams = async (req: Request, res: Response) => {
  try {
    const teams = await Team.find()
      .populate('leader', 'username email firstName lastName')
      .populate('members', 'username email firstName lastName');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error });
  }
};

export const getTeamById = async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader', 'username email firstName lastName')
      .populate('members', 'username email firstName lastName');
    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team', error });
  }
};

export const createTeam = async (req: Request, res: Response) => {
  try {
    const { name, description, leader } = req.body;

    if (!name || !leader) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const team = new Team({
      name,
      description,
      leader,
      members: [leader],
    });

    await team.save();
    await team.populate('leader', 'username email firstName lastName');
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error creating team', error });
  }
};

export const addTeamMember = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ message: 'Missing user ID' });
      return;
    }

    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: userId } },
      { new: true }
    )
      .populate('leader', 'username email firstName lastName')
      .populate('members', 'username email firstName lastName');

    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error adding team member', error });
  }
};

export const removeTeamMember = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ message: 'Missing user ID' });
      return;
    }

    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { $pull: { members: userId } },
      { new: true }
    )
      .populate('leader', 'username email firstName lastName')
      .populate('members', 'username email firstName lastName');

    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Error removing team member', error });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting team', error });
  }
};
