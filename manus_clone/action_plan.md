# Action Plan for Creating a Manus EC2 Browser Automation Application

This document provides a comprehensive set of AI prompts that can be used to generate a browser automation application similar to this project. These prompts are designed to guide an AI through the entire development process, from initial planning to final deployment.

## 1. Initial Project Planning and Analysis

```
Analyze the Manus.im website (https://manus.im/app) and the OpenManus repository (https://github.com/mannaandpoem/OpenManus) to understand their functionality and architecture. Create a detailed analysis document that:

1. Identifies the key components and features of Manus.im
2. Examines how the current browser automation works in OpenManus
3. Outlines the differences between local browser automation and EC2-based browser automation
4. Identifies the technical challenges in moving from local to EC2-based browser automation
5. Proposes a high-level architecture for the new application

Focus on understanding how the current browser agent uses a browser driver locally, and how this would need to change to launch EC2 instances and run browser automation in a VM instead.
```

## 2. Architecture Design

```
Design a comprehensive architecture for a browser automation application that replicates the UX of Manus.im but uses EC2 instances for browser automation instead of local browser drivers. The architecture should include:

1. Component diagrams showing the structure of:
   - Frontend (React-based UI)
   - Backend (Node.js API and WebSocket server)
   - EC2 instances (Browser automation service)
   - AWS infrastructure (EC2, networking, security)

2. Sequence diagrams for key processes:
   - User authentication flow
   - Browser session creation and management
   - Command execution and result handling
   - EC2 instance lifecycle management

3. Data flow diagrams showing:
   - Communication between frontend and backend
   - Communication between backend and EC2 instances
   - Data storage and retrieval

4. Security considerations:
   - Authentication and authorization
   - Secure communication between components
   - EC2 instance security

5. Scalability and performance considerations:
   - Handling multiple concurrent users
   - EC2 instance scaling strategies
   - Performance optimization techniques

The architecture should be modular, scalable, and secure, with clear separation of concerns between components.
```

## 3. Development Environment Setup

```
Set up a development environment for a browser automation application that uses EC2 instances. The environment should include:

1. Node.js project structure with:
   - TypeScript configuration
   - Package.json with appropriate dependencies
   - Directory structure for frontend, backend, and infrastructure code

2. Frontend development setup:
   - React with TypeScript
   - Redux for state management
   - Socket.IO client for real-time communication
   - CSS/SCSS for styling

3. Backend development setup:
   - Express for REST API
   - Socket.IO for WebSocket server
   - AWS SDK for EC2 management
   - Authentication middleware

4. Infrastructure setup:
   - AWS CLI configuration
   - CloudFormation templates
   - EC2 bootstrapping scripts

5. Development tools:
   - ESLint and Prettier for code quality
   - Jest for testing
   - Webpack for bundling
   - Hot reloading for development

Create a justfile or package.json scripts for common development tasks like starting development servers, building, testing, and deploying.
```

## 4. Frontend Implementation

```
Implement a React-based frontend for a browser automation application that replicates the UX of Manus.im. The frontend should:

1. Use React with TypeScript and follow a component-based architecture
2. Implement Redux for state management with the following slices:
   - Authentication state (user, token, login status)
   - Browser state (current URL, page content, screenshots)
   - EC2 instance state (available instances, status)
   - UI state (loading indicators, notifications)

3. Create the following components:
   - Authentication components (LoginForm, RegisterForm)
   - Layout components (Header, Footer, Sidebar)
   - Browser components (BrowserControls, BrowserDisplay, ElementInspector)
   - EC2 management components (InstanceList, InstanceControls)
   - Common components (Button, Input, Modal, Notification)

4. Implement real-time communication with the backend using Socket.IO for:
   - Receiving browser screenshots and DOM updates
   - Sending browser commands (navigate, click, type, etc.)
   - Monitoring EC2 instance status

5. Style the components to match the Manus.im UX using:
   - CSS modules or styled-components
   - Responsive design for different screen sizes
   - Consistent color scheme and typography

The frontend should provide an intuitive and responsive user interface for controlling browser instances running on EC2.
```

## 5. Backend Implementation

```
Implement a Node.js backend for a browser automation application that manages EC2 instances and routes browser commands. The backend should:

1. Use Express for the REST API with the following endpoints:
   - Authentication endpoints (login, register, verify)
   - EC2 instance endpoints (list, create, terminate, status)
   - User management endpoints (profile, settings)

2. Implement Socket.IO for real-time communication with:
   - Connection authentication and session management
   - Event handlers for browser commands
   - Event emitters for browser results and status updates

3. Create services for:
   - EC2InstanceManager: Handles launching, terminating, and monitoring EC2 instances
   - BrowserAutomationService: Routes commands to appropriate EC2 instances
   - AuthService: Handles user authentication and authorization
   - WebSocketManager: Manages WebSocket connections and message routing

4. Implement middleware for:
   - Authentication and authorization
   - Request validation
   - Error handling
   - Logging

5. Set up database integration for:
   - User data storage
   - Session management
   - EC2 instance tracking

The backend should be scalable, secure, and provide a reliable bridge between the frontend and EC2 instances.
```

## 6. EC2 Browser Automation Implementation

```
Implement the EC2-based browser automation functionality for a browser automation application. This should include:

1. EC2 instance management using AWS SDK:
   - Instance launching with appropriate AMI and instance type
   - Security group configuration for required ports
   - Instance monitoring and health checking
   - Instance termination and cleanup

2. Browser automation service that:
   - Runs on EC2 instances
   - Uses Puppeteer for browser automation
   - Exposes a WebSocket server for command reception
   - Captures screenshots and DOM information
   - Executes browser commands (navigate, click, type, etc.)

3. Communication layer between backend and EC2 instances:
   - Secure WebSocket connections
   - Command serialization and deserialization
   - Result handling and forwarding to frontend
   - Error handling and recovery

4. Security measures:
   - Authentication for WebSocket connections
   - Encryption for data in transit
   - Isolation of browser instances
   - Secure handling of credentials

The implementation should be reliable, secure, and provide a seamless experience for users controlling browser instances from the frontend.
```

## 7. EC2 Bootstrapping Scripts

```
Create comprehensive bootstrapping scripts for EC2 instances that will run browser automation. The scripts should:

1. Install system dependencies:
   - Node.js and npm
   - Chrome or Chromium browser
   - Required system libraries for Puppeteer
   - Monitoring and logging tools

2. Set up the browser automation service:
   - Clone or download the service code
   - Install Node.js dependencies
   - Configure the service with appropriate settings
   - Set up systemd service for automatic startup

3. Configure security:
   - Set up firewall rules to allow only necessary traffic
   - Configure user permissions and access controls
   - Set up SSH key-based authentication
   - Disable unnecessary services

4. Implement monitoring and logging:
   - Set up CloudWatch agent for metrics and logs
   - Configure log rotation and retention
   - Create health check endpoints
   - Set up automatic recovery procedures

5. Register with backend:
   - Send instance metadata to backend on startup
   - Establish persistent connection for command reception
   - Implement heartbeat mechanism for health monitoring

The scripts should be idempotent, robust, and ensure that EC2 instances are fully configured and ready to perform browser automation tasks.
```

## 8. Project Structure and Git Organization

```
Restructure the project files for better Git organization and create a comprehensive justfile with all available commands. The restructuring should:

1. Organize the project into the following directories:
   - frontend/: React frontend application
   - backend/: Node.js backend API
   - infrastructure/: AWS infrastructure scripts and templates
   - docs/: Project documentation
   - scripts/: Utility scripts
   - tests/: Test files

2. Create appropriate configuration files:
   - .gitignore for excluding unnecessary files
   - package.json for project metadata and scripts
   - tsconfig.json for TypeScript configuration
   - .eslintrc and .prettierrc for code quality

3. Create a justfile with commands for:
   - Development tasks (install, dev, build, test)
   - Deployment tasks (deploy, launch-ec2, terminate-ec2)
   - Utility tasks (clean, format, lint)
   - AWS operations (list-ec2, setup-aws)

4. Ensure all components work together seamlessly:
   - Frontend can communicate with backend
   - Backend can manage EC2 instances
   - EC2 instances can run browser automation
   - All commands in justfile work as expected

The restructured project should follow best practices for code organization and be easy for developers to understand and contribute to.
```

## 9. CI/CD Workflows Setup

```
Set up comprehensive CI/CD workflows using GitHub Actions for a browser automation application. Create the following workflows:

1. CI/CD Pipeline (.github/workflows/ci-cd.yml):
   - Trigger on push to main/develop branches and pull requests
   - Lint and test code
   - Build frontend and backend
   - Deploy to staging (develop branch) and production (main branch)
   - Include appropriate environment variables and secrets

2. EC2 Instance Management (.github/workflows/ec2-management.yml):
   - Trigger manually with input parameters
   - Support launching new EC2 instances
   - Support terminating existing instances
   - Support listing all running instances
   - Include appropriate AWS credentials and configuration

3. CloudFormation Deployment (.github/workflows/deploy-cloudformation.yml):
   - Trigger manually with input parameters
   - Deploy the entire infrastructure using CloudFormation
   - Output stack creation results
   - Include appropriate AWS credentials and configuration

4. GitHub Pages Deployment (.github/workflows/deploy-github-pages.yml):
   - Trigger on push to main branch
   - Build and deploy frontend to GitHub Pages
   - Configure GitHub Pages settings
   - Include appropriate permissions and settings

The workflows should be well-documented, secure, and provide a complete CI/CD solution for the application.
```

## 10. Documentation and Delivery

```
Create comprehensive documentation for a browser automation application that uses EC2 instances. The documentation should include:

1. README.md with:
   - Project overview and features
   - Architecture diagram and explanation
   - Installation and setup instructions
   - Usage examples and screenshots
   - Deployment instructions
   - Contributing guidelines
   - License information
   - AI replication guide with crafted prompts

2. Additional documentation files:
   - CONTRIBUTING.md with contribution guidelines
   - LICENSE with appropriate license text
   - CODE_OF_CONDUCT.md with code of conduct
   - action_plan.md with ideal AI prompts for replication

3. Code documentation:
   - JSDoc comments for functions and classes
   - README files in key directories
   - Architecture and design documentation
   - API documentation

4. User documentation:
   - User guide with screenshots
   - Troubleshooting guide
   - FAQ section

The documentation should be clear, comprehensive, and provide all necessary information for developers to understand, use, and contribute to the project.
```

## Actual Prompts Used in This Project

The following prompts were used to create this project:

1. Initial request:
```
create a javascript application that will same the UX as https://manus.im/app and a similar source code in this repo to achieve all functionalities. https://github.com/mannaandpoem/OpenManus ... Currently the browser agent uses a new browser instance using a browser driver directly locally, instead, for this version, we want to launch a ec2 instance and run the browser automation like running in a VM. The repository should contain scripts for launching and bootstraping the EC2 machines with all required dependencies
```

2. Follow-up requests:
```
deploy this app to the internet
```

```
Communication layer between frontend and EC2 instances
```

```
create a justfile with all available commands, create CICD workflows for deploying the website, rescructure the files to be uploaded in git, so everything needs to work together
```

```
setup cicd workflows using GHA, add a nice github READme with all specification about this project, including crafting prompts or resumed crafted prompted (if another IA tries to replicate this application)
```

```
Enhance GitHub README with used prompts, and ideal AI prompts to generate an app like this (action_plan.md)
```

## Ideal Prompt for Generating This Application

If you want to generate a similar application in one comprehensive prompt, you could use:

```
Create a JavaScript application that replicates the UX of Manus.im (https://manus.im/app) with similar functionality to the OpenManus repository (https://github.com/mannaandpoem/OpenManus). The key difference is that instead of using a local browser instance with a browser driver directly, this version should launch EC2 instances and run browser automation in a VM.

The application should include:

1. A React frontend that matches the Manus.im UX with:
   - Authentication components
   - Browser control panel
   - Real-time display of browser automation results
   - EC2 instance management interface

2. A Node.js backend that:
   - Manages EC2 instances (launching, terminating, monitoring)
   - Routes browser automation commands to EC2 instances
   - Handles user authentication and authorization
   - Provides real-time communication via WebSockets

3. EC2 bootstrapping scripts that:
   - Install all required dependencies (Node.js, Chrome, etc.)
   - Set up Puppeteer for browser automation
   - Create a service that listens for commands
   - Configure security measures

4. Project organization:
   - Well-structured directories (frontend, backend, infrastructure, etc.)
   - A justfile with all available commands
   - Comprehensive documentation
   - CI/CD workflows using GitHub Actions

5. Documentation:
   - Detailed README with project specifications
   - Architecture diagrams and explanations
   - Setup and usage instructions
   - AI replication guide with crafted prompts

The repository should be well-organized for Git, with appropriate configuration files, and everything should work together seamlessly. The CI/CD workflows should handle testing, building, and deploying the application to both staging and production environments.
```

This comprehensive prompt covers all aspects of the application and should guide an AI through the entire development process.
