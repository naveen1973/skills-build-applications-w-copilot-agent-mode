import { Router } from 'express';
import {
  getGlobalLeaderboard,
  getTeamLeaderboard,
  getUserRank,
} from '../controllers/leaderboardController';

const router = Router();

router.get('/', getGlobalLeaderboard);
router.get('/teams/:teamId', getTeamLeaderboard);
router.get('/user/:userId', getUserRank);

export default router;
