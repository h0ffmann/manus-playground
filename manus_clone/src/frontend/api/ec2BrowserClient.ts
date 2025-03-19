import { Socket } from 'socket.io-client';
import { EC2Instance } from '../store/ec2Slice';

// Define the API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// WebSocket connection
let socket: Socket | null = null;

// API client for EC2 browser automation
export class EC2BrowserClient {
  private token: string | null = null;

  /**
   * Set the authentication token
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Clear the authentication token
   */
  clearToken(): void {
    this.token = null;
  }

  /**
   * Connect to WebSocket
   */
  connectWebSocket(token: string, onConnect: () => void, onError: (error: Error) => void): Socket {
    if (socket) {
      socket.disconnect();
    }

    // Import socket.io-client dynamically to avoid SSR issues
    import('socket.io-client').then(({ io }) => {
      socket = io(API_BASE_URL.replace('/api', ''), {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on('connect', () => {
        console.log('WebSocket connected');
        onConnect();
      });

      socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        onError(error);
      });

      socket.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason);
      });
    });

    return socket;
  }

  /**
   * Disconnect WebSocket
   */
  disconnectWebSocket(): void {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  }

  /**
   * Make authenticated API request
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'API request failed');
    }

    return responseData;
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<{ user: any; token: string }> {
    const result = await this.request<{ user: any; token: string }>(
      'POST',
      '/auth/login',
      { email, password }
    );
    this.setToken(result.token);
    return result;
  }

  /**
   * Register user
   */
  async register(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<{ user: any; token: string }> {
    const result = await this.request<{ user: any; token: string }>(
      'POST',
      '/auth/register',
      userData
    );
    this.setToken(result.token);
    return result;
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<any> {
    return this.request<any>('GET', '/auth/me');
  }

  /**
   * Get all EC2 instances
   */
  async getInstances(): Promise<EC2Instance[]> {
    return this.request<EC2Instance[]>('GET', '/ec2/instances');
  }

  /**
   * Launch a new EC2 instance
   */
  async launchInstance(
    instanceType: string,
    region: string
  ): Promise<EC2Instance> {
    return this.request<EC2Instance>(
      'POST',
      '/ec2/instances',
      { instanceType, region }
    );
  }

  /**
   * Terminate an EC2 instance
   */
  async terminateInstance(instanceId: string): Promise<void> {
    return this.request<void>('DELETE', `/ec2/instances/${instanceId}`);
  }

  /**
   * Check instance health
   */
  async checkInstanceHealth(instanceId: string): Promise<{
    instanceId: string;
    healthy: boolean;
    status: string;
    healthStatus: string;
  }> {
    return this.request<any>('GET', `/ec2/instances/${instanceId}/health`);
  }

  /**
   * Create a browser session
   */
  createBrowserSession(
    instanceId: string,
    callback: (result: any) => void
  ): void {
    if (!socket) {
      throw new Error('WebSocket not connected');
    }

    socket.emit('createSession', { instanceId }, callback);
  }

  /**
   * Close a browser session
   */
  closeBrowserSession(
    sessionId: string,
    callback: (result: any) => void
  ): void {
    if (!socket) {
      throw new Error('WebSocket not connected');
    }

    socket.emit('closeSession', { sessionId }, callback);
  }

  /**
   * Execute a browser command
   */
  executeBrowserCommand(
    instanceId: string,
    type: string,
    params: any,
    callback: (result: any) => void
  ): void {
    if (!socket) {
      throw new Error('WebSocket not connected');
    }

    socket.emit('executeCommand', { instanceId, type, params }, callback);
  }

  /**
   * Navigate to URL
   */
  navigateTo(
    instanceId: string,
    url: string,
    callback: (result: any) => void
  ): void {
    this.executeBrowserCommand(
      instanceId,
      'navigate',
      { url },
      callback
    );
  }

  /**
   * Click element
   */
  clickElement(
    instanceId: string,
    selector: string | null,
    x?: number,
    y?: number,
    callback?: (result: any) => void
  ): void {
    this.executeBrowserCommand(
      instanceId,
      'click',
      { selector, x, y },
      callback || ((result) => console.log('Click result:', result))
    );
  }

  /**
   * Type text
   */
  typeText(
    instanceId: string,
    selector: string,
    text: string,
    pressEnter: boolean = false,
    callback?: (result: any) => void
  ): void {
    this.executeBrowserCommand(
      instanceId,
      'type',
      { selector, text, pressEnter },
      callback || ((result) => console.log('Type result:', result))
    );
  }

  /**
   * Take screenshot
   */
  takeScreenshot(
    instanceId: string,
    callback?: (result: any) => void
  ): void {
    this.executeBrowserCommand(
      instanceId,
      'screenshot',
      {},
      callback || ((result) => console.log('Screenshot result:', result))
    );
  }

  /**
   * Execute JavaScript
   */
  executeJavaScript(
    instanceId: string,
    script: string,
    callback?: (result: any) => void
  ): void {
    this.executeBrowserCommand(
      instanceId,
      'execute',
      { script },
      callback || ((result) => console.log('Execute result:', result))
    );
  }

  /**
   * Scroll page
   */
  scrollPage(
    instanceId: string,
    direction: 'up' | 'down',
    amount: number,
    callback?: (result: any) => void
  ): void {
    this.executeBrowserCommand(
      instanceId,
      'scroll',
      { direction, amount },
      callback || ((result) => console.log('Scroll result:', result))
    );
  }
}

// Create and export a singleton instance
export const ec2BrowserClient = new EC2BrowserClient();
