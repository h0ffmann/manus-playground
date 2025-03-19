import { Router } from 'express';
import { BrowserAutomationService } from '../services/browserAutomationService';

export function createBrowserRoutes(browserService: BrowserAutomationService) {
  const router = Router();

  // Get all sessions for the authenticated user
  router.get('/sessions', (req, res) => {
    try {
      const userId = req.user.id;
      const sessions = browserService.getUserSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get a specific session
  router.get('/sessions/:id', (req, res) => {
    try {
      const session = browserService.getSession(req.params.id);
      
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      
      // Check if the session belongs to the user
      if (session.userId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create a new session
  router.post('/sessions', async (req, res) => {
    try {
      const userId = req.user.id;
      const { instanceId } = req.body;
      
      if (!instanceId) {
        return res.status(400).json({ error: 'Instance ID is required' });
      }
      
      const session = await browserService.createSession(userId, instanceId);
      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Close a session
  router.post('/sessions/:id/close', async (req, res) => {
    try {
      const session = browserService.getSession(req.params.id);
      
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      
      // Check if the session belongs to the user
      if (session.userId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      await browserService.closeSession(req.params.id);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Execute a browser command
  router.post('/commands', async (req, res) => {
    try {
      const userId = req.user.id;
      const { instanceId, type, params } = req.body;
      
      if (!instanceId || !type || !params) {
        return res.status(400).json({ error: 'Instance ID, command type, and parameters are required' });
      }
      
      const command = await browserService.executeCommand(userId, instanceId, type, params);
      res.status(200).json(command);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get a specific command
  router.get('/commands/:id', (req, res) => {
    try {
      const command = browserService.getCommand(req.params.id);
      
      if (!command) {
        return res.status(404).json({ error: 'Command not found' });
      }
      
      // Check if the command belongs to the user
      if (command.userId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      res.json(command);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
