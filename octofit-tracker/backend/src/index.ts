import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import API_CONFIG from './config/api';

// Routes
import userRoutes from './routes/users';
import activityRoutes from './routes/activities';
import teamRoutes from './routes/teams';
import leaderboardRoutes from './routes/leaderboard';
import workoutRoutes from './routes/workouts';

const app: Express = express();
const PORT = API_CONFIG.port;

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
    environment: API_CONFIG.environment,
    baseUrl: API_CONFIG.baseUrl,
    isCodespaces: API_CONFIG.isCodespaces,
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
  API_CONFIG.logConfig();
  console.log(`✅ OctoFit Tracker API listening on port ${PORT}`);
});

export default app;