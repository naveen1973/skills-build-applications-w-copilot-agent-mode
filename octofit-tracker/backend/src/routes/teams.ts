import { Router } from 'express';
import {
  getAllTeams,
  getTeamById,
  createTeam,
  addTeamMember,
  removeTeamMember,
  deleteTeam,
} from '../controllers/teamController';

const router = Router();

router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.post('/', createTeam);
router.post('/:id/members', addTeamMember);
router.delete('/:id/members', removeTeamMember);
router.delete('/:id', deleteTeam);

export default router;
