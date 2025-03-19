# Backend Implementation Plan

## Overview

This document outlines the implementation plan for the backend components of our EC2-based browser automation application. The backend will manage EC2 instances, handle browser automation requests, and provide APIs for the frontend to interact with.

## Component Structure

### Core Components

1. **API Server**
   - Express.js application
   - RESTful API endpoints
   - Authentication middleware
   - Request validation

2. **EC2 Instance Manager**
   - Instance provisioning
   - Instance lifecycle management
   - Instance pool management
   - Health monitoring

3. **Browser Automation Controller**
   - Command processing
   - Result formatting
   - Screenshot handling
   - Error management

4. **WebSocket Server**
   - Real-time communication
   - Browser state updates
   - Command streaming
   - Connection management

5. **Authentication Service**
   - User management
   - Token generation and validation
   - Session management
   - OAuth integration

### Supporting Components

1. **Configuration Manager**
   - Environment-specific settings
   - AWS credentials management
   - Application parameters
   - Feature flags

2. **Logging Service**
   - Structured logging
   - Log rotation
   - Error tracking
   - Performance monitoring

3. **Database Access Layer**
   - User data storage
   - Session persistence
   - Command history
   - Instance metadata

## API Endpoints

### Authentication Endpoints

```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Browser Automation Endpoints

```
POST /api/browser/navigate
POST /api/browser/click
POST /api/browser/type
POST /api/browser/screenshot
POST /api/browser/execute
GET /api/browser/state
POST /api/browser/scroll
```

### EC2 Management Endpoints

```
GET /api/ec2/instances
POST /api/ec2/instances
DELETE /api/ec2/instances/:id
GET /api/ec2/instances/:id/status
POST /api/ec2/instances/:id/restart
```

### User Management Endpoints

```
GET /api/users/me
PUT /api/users/me
GET /api/users/settings
PUT /api/users/settings
```

## Database Schema

### Users Collection

```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  settings: UserSettings;
}

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  browserPreferences: {
    defaultUserAgent?: string;
    defaultViewport?: {
      width: number;
      height: number;
    };
    defaultTimeout?: number;
  };
  ec2Preferences?: {
    preferredRegion?: string;
    instanceType?: string;
    terminateWhenIdle?: boolean;
    idleTimeoutMinutes?: number;
  };
}
```

### Sessions Collection

```typescript
interface Session {
  id: string;
  userId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  lastActivityAt: Date;
  ipAddress?: string;
  userAgent?: string;
}
```

### EC2Instances Collection

```typescript
interface EC2Instance {
  id: string;
  instanceId: string;
  region: string;
  status: 'provisioning' | 'running' | 'stopping' | 'terminated' | 'error';
  publicDnsName?: string;
  publicIpAddress?: string;
  privateIpAddress?: string;
  launchTime: Date;
  lastActivityTime: Date;
  instanceType: string;
  tags: Record<string, string>;
  healthStatus?: 'healthy' | 'unhealthy';
  errorMessage?: string;
  assignedToUserId?: string;
}
```

### BrowserSessions Collection

```typescript
interface BrowserSession {
  id: string;
  userId: string;
  instanceId: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'closed' | 'error';
  commands: BrowserCommand[];
  currentUrl?: string;
  currentTitle?: string;
  errorMessage?: string;
}

interface BrowserCommand {
  id: string;
  sessionId: string;
  type: 'navigate' | 'click' | 'type' | 'screenshot' | 'execute' | 'scroll';
  params: Record<string, any>;
  startTime: Date;
  endTime?: Date;
  status: 'pending' | 'success' | 'error';
  result?: any;
  errorMessage?: string;
}
```

## Implementation Phases

### Phase 1: Core API Server and Authentication

1. Set up Express.js application with TypeScript
2. Implement authentication endpoints
3. Create middleware for authentication and authorization
4. Set up database connection and user schema
5. Implement token generation and validation

### Phase 2: EC2 Instance Management

1. Implement AWS SDK integration
2. Create EC2 instance provisioning logic
3. Develop instance pool management
4. Implement instance health monitoring
5. Create EC2 management API endpoints

### Phase 3: Browser Automation Controller

1. Implement browser command processing
2. Create result formatting utilities
3. Develop screenshot handling
4. Implement error management
5. Create browser automation API endpoints

### Phase 4: WebSocket Server

1. Set up Socket.io server
2. Implement connection management
3. Create message handlers for browser commands
4. Develop real-time state updates
5. Implement authentication for WebSocket connections

### Phase 5: Integration and Testing

1. Integrate all components
2. Implement comprehensive error handling
3. Add logging and monitoring
4. Create automated tests
5. Optimize performance

## File Structure

```
src/
├── backend/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── browserController.ts
│   │   ├── ec2Controller.ts
│   │   └── userController.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── browserRoutes.ts
│   │   ├── ec2Routes.ts
│   │   └── userRoutes.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── browserService.ts
│   │   ├── ec2Service.ts
│   │   ├── userService.ts
│   │   └── websocketService.ts
│   ├── models/
│   │   ├── userModel.ts
│   │   ├── sessionModel.ts
│   │   ├── ec2InstanceModel.ts
│   │   └── browserSessionModel.ts
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   ├── errorMiddleware.ts
│   │   ├── loggingMiddleware.ts
│   │   └── validationMiddleware.ts
│   ├── utils/
│   │   ├── awsConfig.ts
│   │   ├── logger.ts
│   │   ├── errorHandler.ts
│   │   └── validators.ts
│   ├── websocket/
│   │   ├── server.ts
│   │   ├── handlers.ts
│   │   ├── events.ts
│   │   └── auth.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── aws.ts
│   │   ├── app.ts
│   │   └── environment.ts
│   └── app.ts
```

## Next Steps

1. Implement the core API server structure
2. Set up authentication and user management
3. Develop EC2 instance management functionality
4. Create browser automation controller
5. Implement WebSocket server for real-time communication

Once the sandbox environment becomes available again, we'll begin implementing these components according to the phases outlined above.
