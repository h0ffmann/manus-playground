import { Router } from 'express';
import { AuthService } from '../services/authService';

export function createAuthRoutes(authService: AuthService) {
  const router = Router();

  // Login
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      const { user, token } = await authService.authenticate(email, password);
      
      // Return user data without password hash
      const { passwordHash, ...userData } = user;
      
      res.json({
        user: userData,
        token
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  });

  // Register
  router.post('/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      const user = await authService.createUser({
        email,
        password,
        firstName,
        lastName
      });
      
      // Generate token
      const { token } = await authService.authenticate(email, password);
      
      // Return user data without password hash
      const { passwordHash, ...userData } = user;
      
      res.status(201).json({
        user: userData,
        token
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get current user
  router.get('/me', (req, res) => {
    try {
      const user = authService.getUser(req.user.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Return user data without password hash
      const { passwordHash, ...userData } = user;
      
      res.json(userData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update user
  router.put('/me', async (req, res) => {
    try {
      const { firstName, lastName, email, currentPassword, newPassword } = req.body;
      
      // If changing password, verify current password
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ error: 'Current password is required to set a new password' });
        }
        
        // Verify current password
        try {
          await authService.authenticate(req.user.email, currentPassword);
        } catch (error) {
          return res.status(401).json({ error: 'Current password is incorrect' });
        }
      }
      
      const user = await authService.updateUser(req.user.id, {
        firstName,
        lastName,
        email,
        password: newPassword
      });
      
      // Return user data without password hash
      const { passwordHash, ...userData } = user;
      
      res.json(userData);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
}
