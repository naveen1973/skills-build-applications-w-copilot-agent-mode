import { Router } from 'express';
import {
  getAllActivities,
  getUserActivities,
  createActivity,
  deleteActivity,
} from '../controllers/activityController';

const router = Router();

router.get('/', getAllActivities);
router.get('/user/:userId', getUserActivities);
router.post('/', createActivity);
router.delete('/:id', deleteActivity);

export default router;
