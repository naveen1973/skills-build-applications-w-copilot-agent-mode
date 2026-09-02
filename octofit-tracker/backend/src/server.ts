/**
 * OctoFit Tracker API Server
 * 
 * Configures the Express server with support for both GitHub Codespaces and localhost.
 * 
 * Codespaces URL Format:
 * - Environment: process.env.CODESPACE_NAME
 * - URL Pattern: https://{CODESPACE_NAME}-8000.app.github.dev
 * 
 * Localhost URL Format:
 * - URL: http://localhost:8000
 * 
 * This server automatically detects the environment and builds the appropriate API base URL
 * for seamless development in both local and Codespaces environments.
 */

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

/**
 * Health Check Endpoint
 * 
 * Returns server status and configuration information, including:
 * - Current environment (Codespaces or localhost)
 * - Base URL for API calls
 * - Codespaces status
 * 
 * Response includes the full base URL with the configured port,
 * supporting both Codespaces format (https://{CODESPACE_NAME}-8000.app.github.dev)
 * and localhost format (http://localhost:8000)
 */
app.get('/api/health', (req: Request, res: Response) => {
  // Codespaces detection using CODESPACE_NAME environment variable
  const codespaceName = process.env.CODESPACE_NAME;
  
  // Build the appropriate base URL
  let baseUrl = 'http://localhost:8000';
  if (codespaceName) {
    baseUrl = `https://${codespaceName}-8000.app.github.dev`;
  }
  
  res.json({
    status: 'OK',
    message: 'OctoFit Tracker API is running',
    timestamp: new Date().toISOString(),
    environment: API_CONFIG.environment,
    baseUrl: baseUrl,
    isCodespaces: !!codespaceName,
    codespaceName: codespaceName || 'N/A',
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
