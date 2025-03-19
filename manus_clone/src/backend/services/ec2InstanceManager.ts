import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { readFileSync } from 'fs';
import path from 'path';

export interface EC2Instance {
  id: string;
  instanceId: string;
  status: 'provisioning' | 'running' | 'stopping' | 'terminated' | 'error';
  publicDnsName?: string;
  publicIpAddress?: string;
  privateIpAddress?: string;
  region: string;
  launchTime: Date;
  lastActivityTime: Date;
  instanceType: string;
  tags: Record<string, string>;
  healthStatus?: 'healthy' | 'unhealthy';
  errorMessage?: string;
  assignedToUserId?: string;
}

export class EC2InstanceManager {
  private ec2: AWS.EC2;
  private instances: Map<string, EC2Instance> = new Map();
  
  constructor() {
    // Configure AWS SDK
    AWS.config.update({
      region: config.aws.region,
      accessKeyId: config.aws.accessKeyId,
      secretAccessKey: config.aws.secretAccessKey
    });
    
    this.ec2 = new AWS.EC2();
  }
  
  /**
   * Launch a new EC2 instance
   */
  async launchInstance(
    userId: string,
    instanceType: string = config.aws.defaultInstanceType,
    region: string = config.aws.region
  ): Promise<EC2Instance> {
    try {
      // Read user data script for instance initialization
      const userDataScript = this.getUserDataScript();
      
      // Launch parameters
      const params: AWS.EC2.RunInstancesRequest = {
        ImageId: config.aws.amiId,
        InstanceType: instanceType,
        MinCount: 1,
        MaxCount: 1,
        UserData: Buffer.from(userDataScript).toString('base64'),
        SecurityGroupIds: config.aws.securityGroupId ? [config.aws.securityGroupId] : undefined,
        SubnetId: config.aws.subnetId,
        KeyName: config.aws.keyName,
        BlockDeviceMappings: [
          {
            DeviceName: '/dev/sda1',
            Ebs: {
              VolumeSize: 20,
              VolumeType: 'gp2',
              DeleteOnTermination: true
            }
          }
        ],
        TagSpecifications: [
          {
            ResourceType: 'instance',
            Tags: [
              {
                Key: 'Name',
                Value: `BrowserAutomation-${userId}`
              },
              {
                Key: 'Service',
                Value: 'Manus-EC2-Browser'
              },
              {
                Key: 'UserId',
                Value: userId
              }
            ]
          }
        ]
      };
      
      // Launch the instance
      const result = await this.ec2.runInstances(params).promise();
      const awsInstance = result.Instances?.[0];
      
      if (!awsInstance || !awsInstance.InstanceId) {
        throw new Error('Failed to launch EC2 instance');
      }
      
      // Create instance record
      const instance: EC2Instance = {
        id: uuidv4(),
        instanceId: awsInstance.InstanceId,
        status: 'provisioning',
        region,
        launchTime: awsInstance.LaunchTime || new Date(),
        lastActivityTime: new Date(),
        instanceType,
        tags: {
          Name: `BrowserAutomation-${userId}`,
          Service: 'Manus-EC2-Browser',
          UserId: userId
        },
        assignedToUserId: userId
      };
      
      // Store instance
      this.instances.set(instance.id, instance);
      
      // Wait for instance to be running and update its details
      this.waitForInstanceRunning(instance.id);
      
      return instance;
    } catch (error) {
      console.error('Error launching EC2 instance:', error);
      throw error;
    }
  }
  
  /**
   * Terminate an EC2 instance
   */
  async terminateInstance(instanceId: string): Promise<void> {
    const instance = this.instances.get(instanceId);
    
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }
    
    try {
      await this.ec2.terminateInstances({
        InstanceIds: [instance.instanceId]
      }).promise();
      
      // Update instance status
      instance.status = 'terminating';
      instance.lastActivityTime = new Date();
      
      // Wait for instance to be terminated
      this.waitForInstanceTerminated(instanceId);
    } catch (error) {
      console.error(`Error terminating instance ${instanceId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get all instances
   */
  getAllInstances(): EC2Instance[] {
    return Array.from(this.instances.values());
  }
  
  /**
   * Get instances for a specific user
   */
  getUserInstances(userId: string): EC2Instance[] {
    return Array.from(this.instances.values())
      .filter(instance => instance.assignedToUserId === userId);
  }
  
  /**
   * Get instance by ID
   */
  getInstance(instanceId: string): EC2Instance | undefined {
    return this.instances.get(instanceId);
  }
  
  /**
   * Check instance health
   */
  async checkInstanceHealth(instanceId: string): Promise<boolean> {
    const instance = this.instances.get(instanceId);
    
    if (!instance) {
      return false;
    }
    
    try {
      // Check EC2 instance status
      const statusResult = await this.ec2.describeInstanceStatus({
        InstanceIds: [instance.instanceId]
      }).promise();
      
      if (!statusResult.InstanceStatuses || statusResult.InstanceStatuses.length === 0) {
        instance.healthStatus = 'unhealthy';
        return false;
      }
      
      const instanceStatus = statusResult.InstanceStatuses[0];
      
      if (instanceStatus.InstanceState?.Name !== 'running') {
        instance.healthStatus = 'unhealthy';
        return false;
      }
      
      if (instanceStatus.InstanceStatus?.Status !== 'ok' || 
          instanceStatus.SystemStatus?.Status !== 'ok') {
        instance.healthStatus = 'unhealthy';
        return false;
      }
      
      // If we get here, instance is healthy
      instance.healthStatus = 'healthy';
      return true;
    } catch (error) {
      console.error(`Error checking health for instance ${instanceId}:`, error);
      instance.healthStatus = 'unhealthy';
      return false;
    }
  }
  
  /**
   * Wait for instance to be in running state and update its details
   */
  private async waitForInstanceRunning(instanceId: string): Promise<void> {
    const instance = this.instances.get(instanceId);
    
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }
    
    try {
      // Wait for instance to be running
      await this.ec2.waitFor('instanceRunning', {
        InstanceIds: [instance.instanceId]
      }).promise();
      
      // Get instance details
      const describeResult = await this.ec2.describeInstances({
        InstanceIds: [instance.instanceId]
      }).promise();
      
      const awsInstance = describeResult.Reservations?.[0]?.Instances?.[0];
      
      if (!awsInstance) {
        throw new Error(`Failed to get details for instance ${instance.instanceId}`);
      }
      
      // Update instance details
      instance.status = 'running';
      instance.publicDnsName = awsInstance.PublicDnsName;
      instance.publicIpAddress = awsInstance.PublicIpAddress;
      instance.privateIpAddress = awsInstance.PrivateIpAddress;
      instance.lastActivityTime = new Date();
      
      // Check instance health
      await this.checkInstanceHealth(instanceId);
    } catch (error) {
      console.error(`Error waiting for instance ${instanceId} to be running:`, error);
      instance.status = 'error';
      instance.errorMessage = error.message;
    }
  }
  
  /**
   * Wait for instance to be terminated
   */
  private async waitForInstanceTerminated(instanceId: string): Promise<void> {
    const instance = this.instances.get(instanceId);
    
    if (!instance) {
      throw new Error(`Instance ${instanceId} not found`);
    }
    
    try {
      // Wait for instance to be terminated
      await this.ec2.waitFor('instanceTerminated', {
        InstanceIds: [instance.instanceId]
      }).promise();
      
      // Update instance status
      instance.status = 'terminated';
      instance.lastActivityTime = new Date();
    } catch (error) {
      console.error(`Error waiting for instance ${instanceId} to be terminated:`, error);
      instance.status = 'error';
      instance.errorMessage = error.message;
    }
  }
  
  /**
   * Get user data script for instance initialization
   */
  private getUserDataScript(): string {
    try {
      // In a real implementation, this would read from a file
      // For now, we'll return a simple script
      return `#!/bin/bash
echo "Starting EC2 instance bootstrapping process..."

# Update system packages
apt-get update
apt-get upgrade -y

# Install system dependencies
apt-get install -y \\
    curl \\
    wget \\
    gnupg \\
    ca-certificates \\
    fonts-liberation \\
    libasound2 \\
    libatk-bridge2.0-0 \\
    libatk1.0-0 \\
    libc6 \\
    libcairo2 \\
    libcups2 \\
    libdbus-1-3 \\
    libexpat1 \\
    libfontconfig1 \\
    libgbm1 \\
    libgcc1 \\
    libglib2.0-0 \\
    libgtk-3-0 \\
    libnspr4 \\
    libnss3 \\
    libpango-1.0-0 \\
    libpangocairo-1.0-0 \\
    libstdc++6 \\
    libx11-6 \\
    libx11-xcb1 \\
    libxcb1 \\
    libxcomposite1 \\
    libxcursor1 \\
    libxdamage1 \\
    libxext6 \\
    libxfixes3 \\
    libxi6 \\
    libxrandr2 \\
    libxrender1 \\
    libxss1 \\
    libxtst6 \\
    lsb-release \\
    xdg-utils \\
    git

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install Chrome
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
apt-get update
apt-get install -y google-chrome-stable

# Create application directory
mkdir -p /opt/browser-service

# Install Puppeteer and Express
cd /opt/browser-service
npm init -y
npm install puppeteer express socket.io cors

# Create browser service script
cat > /opt/browser-service/server.js << EOF
const express = require('express');
const puppeteer = require('puppeteer');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

let browser;
let page;

// Initialize browser
async function initBrowser() {
  browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  });
  
  page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log('Browser initialized');
}

// API routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Socket.IO handlers
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('navigate', async (data) => {
    try {
      if (!browser || !page) {
        await initBrowser();
      }
      
      await page.goto(data.url, { waitUntil: 'networkidle2' });
      
      const screenshot = await page.screenshot({ encoding: 'base64' });
      const content = await page.content();
      
      socket.emit('navigateResult', {
        success: true,
        screenshot: 'data:image/png;base64,' + screenshot,
        content,
        url: data.url
      });
    } catch (error) {
      socket.emit('navigateResult', {
        success: false,
        error: error.message
      });
    }
  });
  
  socket.on('click', async (data) => {
    try {
      if (!browser || !page) {
        throw new Error('Browser not initialized');
      }
      
      if (data.selector) {
        await page.click(data.selector);
      } else if (data.x !== undefined && data.y !== undefined) {
        await page.mouse.click(data.x, data.y);
      }
      
      await page.waitForTimeout(1000);
      
      const screenshot = await page.screenshot({ encoding: 'base64' });
      const content = await page.content();
      
      socket.emit('clickResult', {
        success: true,
        screenshot: 'data:image/png;base64,' + screenshot,
        content
      });
    } catch (error) {
      socket.emit('clickResult', {
        success: false,
        error: error.message
      });
    }
  });
  
  socket.on('type', async (data) => {
    try {
      if (!browser || !page) {
        throw new Error('Browser not initialized');
      }
      
      if (data.selector) {
        await page.type(data.selector, data.text);
      }
      
      if (data.pressEnter) {
        await page.keyboard.press('Enter');
      }
      
      await page.waitForTimeout(500);
      
      const screenshot = await page.screenshot({ encoding: 'base64' });
      const content = await page.content();
      
      socket.emit('typeResult', {
        success: true,
        screenshot: 'data:image/png;base64,' + screenshot,
        content
      });
    } catch (error) {
      socket.emit('typeResult', {
        success: false,
        error: error.message
      });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Initialize and start server
async function start() {
  try {
    await initBrowser();
    
    server.listen(3000, '0.0.0.0', () => {
      console.log('Browser service running on port 3000');
    });
  } catch (error) {
    console.error('Failed to start browser service:', error);
    process.exit(1);
  }
}

start();

// Handle shutdown
process.on('SIGINT', async () => {
  if (browser) {
    await browser.close();
  }
  process.exit();
});
EOF

# Create systemd service
cat > /etc/systemd/system/browser-service.service << EOF
[Unit]
Description=Browser Automation Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/browser-service
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=browser-service
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
systemctl daemon-reload
systemctl enable browser-service
systemctl start browser-service

# Register with backend
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
PUBLIC_DNS=$(curl -s http://169.254.169.254/latest/meta-data/public-hostname)

echo "EC2 instance bootstrapping completed successfully!"
`;
    } catch (error) {
      console.error('Error reading user data script:', error);
      throw error;
    }
  }
}
