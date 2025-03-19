import { EC2InstanceManager, EC2Instance } from './ec2InstanceManager';
import { Socket } from 'socket.io';
import axios from 'axios';
import { config } from '../config';

export interface BrowserCommand {
  id: string;
  type: 'navigate' | 'click' | 'type' | 'screenshot' | 'execute' | 'scroll';
  params: Record<string, any>;
  instanceId: string;
  userId: string;
  status: 'pending' | 'success' | 'error';
  result?: any;
  errorMessage?: string;
  startTime: Date;
  endTime?: Date;
}

export interface BrowserSession {
  id: string;
  userId: string;
  instanceId: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'closed' | 'error';
  currentUrl?: string;
  commands: BrowserCommand[];
  errorMessage?: string;
}

export class BrowserAutomationService {
  private ec2Manager: EC2InstanceManager;
  private sessions: Map<string, BrowserSession> = new Map();
  private commands: Map<string, BrowserCommand> = new Map();
  private socketConnections: Map<string, Socket> = new Map();
  
  constructor(ec2Manager: EC2InstanceManager) {
    this.ec2Manager = ec2Manager;
  }
  
  /**
   * Register a socket connection for a user
   */
  registerSocket(userId: string, socket: Socket): void {
    this.socketConnections.set(userId, socket);
    
    // Set up socket event handlers
    this.setupSocketEventHandlers(userId, socket);
  }
  
  /**
   * Create a new browser session
   */
  async createSession(userId: string, instanceId: string): Promise<BrowserSession> {
    // Get the EC2 instance
    const instance = this.ec2Manager.getInstance(instanceId);
    
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }
    
    if (instance.status !== 'running') {
      throw new Error(`Instance ${instanceId} is not running`);
    }
    
    // Create a new session
    const session: BrowserSession = {
      id: `session-${Date.now()}`,
      userId,
      instanceId,
      startTime: new Date(),
      status: 'active',
      commands: []
    };
    
    // Store the session
    this.sessions.set(session.id, session);
    
    return session;
  }
  
  /**
   * Close a browser session
   */
  async closeSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    
    session.status = 'closed';
    session.endTime = new Date();
  }
  
  /**
   * Execute a browser command
   */
  async executeCommand(
    userId: string,
    instanceId: string,
    type: BrowserCommand['type'],
    params: Record<string, any>
  ): Promise<BrowserCommand> {
    // Get the EC2 instance
    const instance = this.ec2Manager.getInstance(instanceId);
    
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }
    
    if (instance.status !== 'running') {
      throw new Error(`Instance ${instanceId} is not running`);
    }
    
    // Create a command
    const command: BrowserCommand = {
      id: `cmd-${Date.now()}`,
      type,
      params,
      instanceId,
      userId,
      status: 'pending',
      startTime: new Date()
    };
    
    // Store the command
    this.commands.set(command.id, command);
    
    // Add to active session if exists
    const activeSession = Array.from(this.sessions.values())
      .find(s => s.userId === userId && s.instanceId === instanceId && s.status === 'active');
    
    if (activeSession) {
      activeSession.commands.push(command);
    }
    
    try {
      // Execute the command on the EC2 instance
      const result = await this.sendCommandToInstance(instance, command);
      
      // Update command with result
      command.status = 'success';
      command.result = result;
      command.endTime = new Date();
      
      // Update session if exists
      if (activeSession && type === 'navigate') {
        activeSession.currentUrl = params.url;
      }
      
      return command;
    } catch (error) {
      // Update command with error
      command.status = 'error';
      command.errorMessage = error.message;
      command.endTime = new Date();
      
      throw error;
    }
  }
  
  /**
   * Get all sessions for a user
   */
  getUserSessions(userId: string): BrowserSession[] {
    return Array.from(this.sessions.values())
      .filter(session => session.userId === userId);
  }
  
  /**
   * Get a session by ID
   */
  getSession(sessionId: string): BrowserSession | undefined {
    return this.sessions.get(sessionId);
  }
  
  /**
   * Get a command by ID
   */
  getCommand(commandId: string): BrowserCommand | undefined {
    return this.commands.get(commandId);
  }
  
  /**
   * Send a command to an EC2 instance
   */
  private async sendCommandToInstance(
    instance: EC2Instance,
    command: BrowserCommand
  ): Promise<any> {
    if (!instance.publicIpAddress) {
      throw new Error(`Instance ${instance.instanceId} does not have a public IP address`);
    }
    
    // In a real implementation, this would send the command to the browser service
    // running on the EC2 instance. For now, we'll simulate the response.
    
    // Get the socket for the user
    const socket = this.socketConnections.get(command.userId);
    
    if (!socket) {
      throw new Error(`No socket connection for user ${command.userId}`);
    }
    
    // Return a promise that resolves when the command is executed
    return new Promise((resolve, reject) => {
      // Set a timeout for the command
      const timeout = setTimeout(() => {
        reject(new Error(`Command ${command.id} timed out`));
      }, config.browser.defaultTimeout);
      
      // Handle the result
      const resultHandler = (result: any) => {
        clearTimeout(timeout);
        
        if (result.success) {
          resolve(result);
        } else {
          reject(new Error(result.error || 'Command failed'));
        }
      };
      
      // Set up the result handler based on command type
      switch (command.type) {
        case 'navigate':
          socket.once('navigateResult', resultHandler);
          socket.emit('navigate', command.params);
          break;
        
        case 'click':
          socket.once('clickResult', resultHandler);
          socket.emit('click', command.params);
          break;
        
        case 'type':
          socket.once('typeResult', resultHandler);
          socket.emit('type', command.params);
          break;
        
        case 'screenshot':
          socket.once('screenshotResult', resultHandler);
          socket.emit('screenshot', command.params);
          break;
        
        case 'execute':
          socket.once('executeResult', resultHandler);
          socket.emit('execute', command.params);
          break;
        
        case 'scroll':
          socket.once('scrollResult', resultHandler);
          socket.emit('scroll', command.params);
          break;
        
        default:
          clearTimeout(timeout);
          reject(new Error(`Unsupported command type: ${command.type}`));
      }
    });
  }
  
  /**
   * Set up socket event handlers for a user
   */
  private setupSocketEventHandlers(userId: string, socket: Socket): void {
    // Handle disconnect
    socket.on('disconnect', () => {
      this.socketConnections.delete(userId);
      
      // Close any active sessions for this user
      const activeSessions = Array.from(this.sessions.values())
        .filter(s => s.userId === userId && s.status === 'active');
      
      for (const session of activeSessions) {
        session.status = 'closed';
        session.endTime = new Date();
      }
    });
  }
}
