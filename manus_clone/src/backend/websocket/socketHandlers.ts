import { Socket, Server as SocketIOServer } from 'socket.io';
import { BrowserAutomationService } from '../services/browserAutomationService';
import { AuthService } from '../services/authService';

export function setupSocketHandlers(
  io: SocketIOServer,
  browserAutomationService: BrowserAutomationService,
  authService: AuthService
): void {
  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication required'));
    }
    
    try {
      const user = authService.verifyToken(token);
      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Invalid or expired token'));
    }
  });
  
  io.on('connection', (socket: Socket) => {
    const userId = socket.data.user.id;
    console.log(`User ${userId} connected via WebSocket`);
    
    // Register socket with browser automation service
    browserAutomationService.registerSocket(userId, socket);
    
    // Handle session creation
    socket.on('createSession', async (data, callback) => {
      try {
        const session = await browserAutomationService.createSession(userId, data.instanceId);
        callback({ success: true, session });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });
    
    // Handle session closing
    socket.on('closeSession', async (data, callback) => {
      try {
        await browserAutomationService.closeSession(data.sessionId);
        callback({ success: true });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });
    
    // Handle browser commands
    socket.on('executeCommand', async (data, callback) => {
      try {
        const command = await browserAutomationService.executeCommand(
          userId,
          data.instanceId,
          data.type,
          data.params
        );
        callback({ success: true, command });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
    });
  });
}
