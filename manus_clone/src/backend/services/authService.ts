import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  passwordHash: string;
}

export class AuthService {
  // In a real application, this would use a database
  private users: Map<string, User> = new Map();
  
  constructor() {
    // Add a demo user for testing
    this.createUser({
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      password: 'password123'
    });
  }
  
  /**
   * Create a new user
   */
  async createUser(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<User> {
    // Check if user already exists
    const existingUser = Array.from(this.users.values())
      .find(user => user.email === userData.email);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 10);
    
    // Create user
    const user: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      passwordHash
    };
    
    // Store user
    this.users.set(user.id, user);
    
    return user;
  }
  
  /**
   * Authenticate a user
   */
  async authenticate(email: string, password: string): Promise<{ user: User; token: string }> {
    // Find user by email
    const user = Array.from(this.users.values())
      .find(user => user.email === email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    
    if (!passwordMatch) {
      throw new Error('Invalid email or password');
    }
    
    // Generate JWT token
    const token = this.generateToken(user);
    
    return { user, token };
  }
  
  /**
   * Verify a JWT token
   */
  verifyToken(token: string): User {
    try {
      const decoded = jwt.verify(token, config.auth.jwtSecret) as { userId: string };
      
      const user = this.users.get(decoded.userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
  
  /**
   * Generate a JWT token for a user
   */
  private generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email
    };
    
    return jwt.sign(payload, config.auth.jwtSecret, {
      expiresIn: config.auth.tokenExpiration
    });
  }
  
  /**
   * Get a user by ID
   */
  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }
  
  /**
   * Update a user
   */
  async updateUser(userId: string, userData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }): Promise<User> {
    const user = this.users.get(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update user data
    if (userData.firstName !== undefined) {
      user.firstName = userData.firstName;
    }
    
    if (userData.lastName !== undefined) {
      user.lastName = userData.lastName;
    }
    
    if (userData.email !== undefined) {
      // Check if email is already in use
      const existingUser = Array.from(this.users.values())
        .find(u => u.email === userData.email && u.id !== userId);
      
      if (existingUser) {
        throw new Error('Email already in use');
      }
      
      user.email = userData.email;
    }
    
    if (userData.password) {
      user.passwordHash = await bcrypt.hash(userData.password, 10);
    }
    
    return user;
  }
}
