# Manus EC2 Browser Automation Project

<div align="center">
  <img src="https://via.placeholder.com/200x200?text=Manus+EC2" alt="Manus EC2 Logo" width="200"/>
  <h3>Browser Automation on EC2 Instances</h3>
  <p>Replicating the UX of Manus.im with EC2-based browser automation</p>
</div>

<div align="center">
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#ci-cd-workflows">CI/CD</a> •
  <a href="#ai-replication-guide">AI Replication</a>
</div>

## Overview

This project replicates the UX of [Manus.im](https://manus.im/app) while implementing browser automation on EC2 instances instead of using local browser drivers. The application provides a seamless experience for users while leveraging the scalability and power of AWS EC2 instances for browser automation tasks.

## Features

- **React-based Frontend**: Replicates the Manus.im UX with responsive design
- **EC2-based Browser Automation**: Uses EC2 instances instead of local browser drivers
- **Real-time Communication**: WebSocket-based communication between frontend and EC2 instances
- **AWS Infrastructure**: CloudFormation templates for infrastructure deployment
- **Comprehensive CI/CD**: GitHub Actions workflows for testing and deployment
- **Scalable Architecture**: Supports multiple concurrent browser sessions across EC2 instances

## Architecture

The application follows a distributed architecture with these main components:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│   Frontend  │────▶│   Backend   │────▶│  EC2 Instances  │
│  (React.js) │◀────│  (Node.js)  │◀────│ (Browser Auto)  │
└─────────────┘     └─────────────┘     └─────────────────┘
       │                   │                     │
       │                   │                     │
       ▼                   ▼                     ▼
┌─────────────────────────────────────────────────────────┐
│                     AWS Services                         │
│  (S3, CloudFront, EC2, CloudFormation, IAM, Security)   │
└─────────────────────────────────────────────────────────┘
```

### Key Components:

1. **Frontend**: React application with Redux for state management
2. **Backend**: Node.js/Express API with Socket.IO for real-time communication
3. **EC2 Instances**: Run browser automation using Puppeteer
4. **Infrastructure**: AWS CloudFormation for provisioning and management

## Project Structure

```
manus-ec2-project/
├── frontend/           # React frontend application
├── backend/            # Node.js/Express backend API
├── infrastructure/     # AWS infrastructure scripts and templates
├── docs/               # Project documentation
├── scripts/            # Utility scripts
├── tests/              # Test files
├── .github/workflows/  # CI/CD workflows
├── justfile            # Command runner for development tasks
└── .gitignore          # Git ignore file
```

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 8.x or later
- AWS CLI configured with appropriate credentials
- [Just](https://github.com/casey/just) command runner (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/manus-ec2-project.git
   cd manus-ec2-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   
   Or using Just:
   ```bash
   just install
   ```

### Development

Start the development servers:

```bash
just dev
```

This will start both the frontend and backend development servers.

## Deployment

### Using CI/CD

The project includes GitHub Actions workflows for CI/CD:

1. Push to the `develop` branch to deploy to staging
2. Push to the `main` branch to deploy to production
3. Use the EC2 management workflow to launch or terminate EC2 instances
4. Use the CloudFormation workflow to deploy the entire infrastructure stack

### Manual Deployment

Deploy the application manually:

```bash
just deploy
```

Launch a new EC2 instance:

```bash
just launch-ec2 t2.medium us-east-1
```

## EC2 Browser Automation

This project uses EC2 instances to run browser automation instead of local browser drivers. The EC2 instances are bootstrapped with all necessary dependencies and run a browser automation service that communicates with the frontend via WebSockets.

### How It Works

1. The frontend sends browser commands to the backend
2. The backend forwards these commands to the appropriate EC2 instance
3. The EC2 instance executes the commands using Puppeteer
4. Results are sent back to the frontend in real-time

## CI/CD Workflows

The project includes three GitHub Actions workflows:

1. **CI/CD Pipeline** (.github/workflows/ci-cd.yml)
   - Lints and tests the code
   - Builds the frontend and backend
   - Deploys to staging (develop branch) or production (main branch)

2. **EC2 Instance Management** (.github/workflows/ec2-management.yml)
   - Launches new EC2 instances
   - Terminates existing instances
   - Lists all running instances

3. **CloudFormation Deployment** (.github/workflows/deploy-cloudformation.yml)
   - Deploys the entire infrastructure using CloudFormation

## Available Commands

The project includes a comprehensive justfile with commands for all aspects of development, testing, and deployment:

```bash
# Display all available commands
just

# Install dependencies
just install

# Start development servers
just dev

# Build the project
just build

# Run tests
just test

# Deploy the application
just deploy

# Launch a new EC2 instance
just launch-ec2 t2.medium us-east-1

# List all running EC2 instances
just list-ec2

# Terminate an EC2 instance
just terminate-ec2 i-1234567890abcdef0
```

## AI Replication Guide

This section provides crafted prompts for AI systems to replicate this project. Each prompt is designed to guide the AI through a specific aspect of the implementation. For a more comprehensive set of prompts and a detailed action plan, see the [action_plan.md](action_plan.md) file.

### 1. Project Overview and Architecture Design

```
Create a JavaScript application that replicates the UX of https://manus.im/app with similar source code to the OpenManus repository (https://github.com/mannaandpoem/OpenManus). 

The key difference is that instead of using a local browser instance with a browser driver directly, this version should launch EC2 instances and run browser automation in a VM. 

Design an architecture that includes:
1. A React frontend that matches the Manus.im UX
2. A Node.js backend that manages EC2 instances
3. EC2 instances that run browser automation using Puppeteer
4. Real-time communication between frontend and EC2 instances
5. Scripts for launching and bootstrapping EC2 machines with required dependencies

The architecture should support scalability, security, and cost optimization.
```

### 2. Frontend Implementation

```
Implement the frontend components for a browser automation application similar to Manus.im. The frontend should:

1. Use React with TypeScript
2. Implement Redux for state management with slices for authentication, browser automation, and EC2 instance management
3. Create components for:
   - Authentication (login, registration)
   - Browser control panel (URL input, navigation buttons, etc.)
   - Browser display area (showing screenshots or live view)
   - EC2 instance management (launch, terminate, monitor)
4. Implement real-time communication with the backend using Socket.IO
5. Match the styling and UX of Manus.im

Focus on creating a responsive, intuitive interface that allows users to control browser instances running on EC2.
```

### 3. Backend and Communication Layer

```
Implement a Node.js backend for a browser automation application that uses EC2 instances instead of local browser drivers. The backend should:

1. Use Express for the REST API
2. Implement Socket.IO for real-time communication
3. Create services for:
   - EC2 instance management (launching, terminating, monitoring)
   - Browser automation command execution
   - Authentication and user management
4. Implement secure communication between frontend and EC2 instances
5. Handle error scenarios and provide appropriate feedback

The backend should act as a bridge between the frontend and EC2 instances, managing the lifecycle of instances and routing browser automation commands.
```

### 4. EC2 Bootstrapping Scripts

```
Create scripts for bootstrapping EC2 instances with all required dependencies for browser automation. The scripts should:

1. Install system dependencies (Node.js, Chrome, etc.)
2. Set up Puppeteer for browser automation
3. Create a service that listens for commands via WebSockets
4. Configure security measures (firewall, etc.)
5. Set up monitoring and health checks
6. Register the instance with the backend

The scripts should be designed to work with CloudFormation or as user data scripts when launching EC2 instances. They should ensure that the instances are fully configured and ready to perform browser automation tasks.
```

### 5. CI/CD Workflow Setup

```
Set up GitHub Actions workflows for a browser automation application that uses EC2 instances. Create workflows for:

1. CI/CD Pipeline:
   - Lint and test code
   - Build frontend and backend
   - Deploy to staging (develop branch) and production (main branch)

2. EC2 Instance Management:
   - Launch new EC2 instances
   - Terminate existing instances
   - List running instances

3. CloudFormation Deployment:
   - Deploy the entire infrastructure stack

The workflows should be configured with appropriate secrets and environment variables, and should include proper error handling and notifications.
```

### 6. Project Structure and Configuration

```
Create a well-organized project structure for a browser automation application that uses EC2 instances. Include:

1. A justfile with commands for all development, testing, and deployment tasks
2. Proper directory structure (frontend, backend, infrastructure, docs, scripts, tests)
3. Configuration files (.gitignore, package.json, tsconfig.json, etc.)
4. Documentation (README.md, CONTRIBUTING.md, LICENSE, etc.)

The project should follow best practices for code organization and should be easy for developers to understand and contribute to.
```

## Implementation Details

### Frontend

The frontend is built with React and TypeScript, using Redux for state management. It includes components for authentication, browser control, and EC2 instance management. The UI is designed to match the look and feel of Manus.im.

Key frontend features:
- Real-time browser control and feedback
- EC2 instance management interface
- Authentication and user management
- Responsive design for various screen sizes

### Backend

The backend is built with Node.js and Express, using Socket.IO for real-time communication. It includes services for EC2 instance management, browser automation, and authentication.

Key backend features:
- RESTful API for resource management
- WebSocket server for real-time communication
- EC2 instance lifecycle management
- Secure communication with EC2 instances

### EC2 Browser Automation

The EC2 instances run a browser automation service built with Puppeteer. The service listens for commands via WebSockets and executes them in a headless Chrome browser.

Key EC2 features:
- Headless Chrome browser for automation
- WebSocket server for command reception
- Screenshot and DOM capture capabilities
- Health monitoring and reporting

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Manus.im](https://manus.im) for inspiration
- [OpenManus](https://github.com/mannaandpoem/OpenManus) for reference implementation
- AWS for cloud infrastructure
- Puppeteer for browser automation
