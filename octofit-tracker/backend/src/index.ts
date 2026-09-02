import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Routes
import userRoutes from './routes/users';
import activityRoutes from './routes/activities';
import teamRoutes from './routes/teams';
import leaderboardRoutes from './routes/leaderboard';
import workoutRoutes from './routes/workouts';

const app: Express = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB().catch((error) => {
  console.error('Failed to connect to MongoDB:', error);
  process.exit(1);
});

// Base route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'OctoFit Tracker API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/workouts', workoutRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║      🐙 OctoFit Tracker API Server Running    ║
║  Port: ${PORT}
║  Database: octofit_db
║  Environment: ${process.env.NODE_ENV || 'development'}
╚════════════════════════════════════════════════╝
  `);
});

export default app;