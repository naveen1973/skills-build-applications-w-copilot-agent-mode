import { Router } from 'express';
import {
  getAllWorkouts,
  getUserWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from '../controllers/workoutController';

const router = Router();

router.get('/', getAllWorkouts);
router.get('/user/:userId', getUserWorkouts);
router.get('/:id', getWorkoutById);
router.post('/', createWorkout);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

export default router;
