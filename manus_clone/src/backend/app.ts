import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createEC2InstanceRoutes } from './routes/ec2Routes';
import { createBrowserRoutes } from './routes/browserRoutes';
import { createAuthRoutes } from './routes/authRoutes';
import { setupSocketHandlers } from './websocket/socketHandlers';
import { EC2InstanceManager } from './services/ec2InstanceManager';
import { BrowserAutomationService } from './services/browserAutomationService';
import { AuthService } from './services/authService';
import { config } from './config';

// Initialize services
const ec2InstanceManager = new EC2InstanceManager();
const browserAutomationService = new BrowserAutomationService(ec2InstanceManager);
const authService = new AuthService();

// Create Express app
const app = express();
const server = http.createServer(app);

// Set up Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: config.corsOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: config.corsOrigins,
  credentials: true
}));
app.use(bodyParser.json());

// Authentication middleware
app.use((req, res, next) => {
  // Skip auth for login and register routes
  if (req.path === '/api/auth/login' || req.path === '/api/auth/register') {
    return next();
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const user = authService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// Routes
app.use('/api/auth', createAuthRoutes(authService));
app.use('/api/ec2', createEC2InstanceRoutes(ec2InstanceManager));
app.use('/api/browser', createBrowserRoutes(browserAutomationService));

// Set up Socket.IO handlers
setupSocketHandlers(io, browserAutomationService, authService);

// Start server
server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export { app, server, io };
