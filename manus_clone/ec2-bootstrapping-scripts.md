# EC2 Bootstrapping Scripts

## Overview

This document outlines the EC2 bootstrapping scripts needed to set up and configure EC2 instances for browser automation. These scripts will be used to automate the installation of dependencies, configuration of the environment, and deployment of the browser automation service.

## User Data Script

The following user data script will be executed when an EC2 instance is launched:

```bash
#!/bin/bash

# Log all output
exec > >(tee /var/log/user-data.log) 2>&1

echo "Starting EC2 instance bootstrapping process..."

# Update system packages
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install system dependencies
echo "Installing system dependencies..."
apt-get install -y \
    curl \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    git

# Install Node.js
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Verify Node.js installation
node --version
npm --version

# Install Chrome
echo "Installing Chrome..."
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
apt-get update
apt-get install -y google-chrome-stable

# Verify Chrome installation
google-chrome --version

# Create application directory
echo "Creating application directory..."
mkdir -p /opt/browser-service

# Clone application repository or download application package
echo "Downloading application code..."
# Option 1: Clone from repository
# git clone https://github.com/your-org/manus-ec2-browser.git /opt/browser-service

# Option 2: Download and extract package
wget -O /tmp/browser-service.tar.gz https://your-storage-bucket.s3.amazonaws.com/browser-service.tar.gz
tar -xzf /tmp/browser-service.tar.gz -C /opt/browser-service
rm /tmp/browser-service.tar.gz

# Set permissions
chown -R ubuntu:ubuntu /opt/browser-service

# Install application dependencies
echo "Installing application dependencies..."
cd /opt/browser-service
npm install

# Create configuration file
echo "Creating configuration file..."
cat > /opt/browser-service/config.json << EOF
{
  "server": {
    "port": 3000,
    "host": "0.0.0.0"
  },
  "browser": {
    "headless": true,
    "defaultViewport": {
      "width": 1280,
      "height": 800
    },
    "args": [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu"
    ]
  },
  "aws": {
    "region": "us-east-1",
    "instanceId": "$(curl -s http://169.254.169.254/latest/meta-data/instance-id)"
  },
  "backend": {
    "url": "https://api.your-domain.com",
    "apiKey": "YOUR_API_KEY"
  }
}
EOF

# Create systemd service
echo "Creating systemd service..."
cat > /etc/systemd/system/browser-service.service << EOF
[Unit]
Description=Browser Automation Service
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/browser-service
ExecStart=/usr/bin/npm start
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
echo "Enabling and starting service..."
systemctl daemon-reload
systemctl enable browser-service
systemctl start browser-service

# Set up log rotation
echo "Setting up log rotation..."
cat > /etc/logrotate.d/browser-service << EOF
/var/log/browser-service.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 640 ubuntu ubuntu
}
EOF

# Set up health check script
echo "Setting up health check script..."
cat > /opt/browser-service/health-check.sh << EOF
#!/bin/bash

# Check if service is running
if ! systemctl is-active --quiet browser-service; then
  echo "Browser service is not running"
  exit 1
fi

# Check if API is responding
if ! curl -s http://localhost:3000/health | grep -q "ok"; then
  echo "Browser service API is not responding"
  exit 1
fi

# All checks passed
echo "Browser service is healthy"
exit 0
EOF

chmod +x /opt/browser-service/health-check.sh

# Set up cron job for health check
echo "Setting up cron job for health check..."
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/browser-service/health-check.sh > /var/log/health-check.log 2>&1") | crontab -

# Register instance with backend
echo "Registering instance with backend..."
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
PUBLIC_DNS=$(curl -s http://169.254.169.254/latest/meta-data/public-hostname)

curl -X POST -H "Content-Type: application/json" -d "{
  \"instanceId\": \"$INSTANCE_ID\",
  \"publicIp\": \"$PUBLIC_IP\",
  \"publicDns\": \"$PUBLIC_DNS\",
  \"apiPort\": 3000,
  \"status\": \"ready\"
}" https://api.your-domain.com/instances/register

echo "EC2 instance bootstrapping completed successfully!"
```

## CloudFormation Template

The following CloudFormation template can be used to launch EC2 instances with the bootstrapping script:

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'EC2 Browser Automation Instance'

Parameters:
  InstanceType:
    Description: EC2 instance type
    Type: String
    Default: t2.medium
    AllowedValues:
      - t2.medium
      - t2.large
      - t3.medium
      - t3.large
    ConstraintDescription: must be a valid EC2 instance type.

  KeyName:
    Description: Name of an existing EC2 KeyPair to enable SSH access
    Type: AWS::EC2::KeyPair::KeyName
    ConstraintDescription: must be the name of an existing EC2 KeyPair.

  VpcId:
    Description: VPC ID
    Type: AWS::EC2::VPC::Id

  SubnetId:
    Description: Subnet ID
    Type: AWS::EC2::Subnet::Id

  SSHLocation:
    Description: The IP address range that can SSH to the EC2 instance
    Type: String
    Default: 0.0.0.0/0
    AllowedPattern: (\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/(\d{1,2})
    ConstraintDescription: must be a valid IP CIDR range of the form x.x.x.x/x.

Resources:
  BrowserInstanceSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Enable SSH and browser service access
      VpcId: !Ref VpcId
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: !Ref SSHLocation
        - IpProtocol: tcp
          FromPort: 3000
          ToPort: 3000
          CidrIp: 0.0.0.0/0

  BrowserInstance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: !Ref InstanceType
      SecurityGroupIds:
        - !GetAtt BrowserInstanceSecurityGroup.GroupId
      KeyName: !Ref KeyName
      SubnetId: !Ref SubnetId
      ImageId: ami-0c55b159cbfafe1f0  # Ubuntu 20.04 LTS (replace with appropriate AMI for your region)
      BlockDeviceMappings:
        - DeviceName: /dev/sda1
          Ebs:
            VolumeSize: 20
            VolumeType: gp2
            DeleteOnTermination: true
      UserData:
        Fn::Base64: !Sub |
          #!/bin/bash
          # User data script content goes here
          # Copy the entire script from above
      Tags:
        - Key: Name
          Value: BrowserAutomationInstance
        - Key: Service
          Value: Manus-EC2-Browser

  BrowserInstanceEIP:
    Type: AWS::EC2::EIP
    Properties:
      Domain: vpc
      InstanceId: !Ref BrowserInstance

Outputs:
  InstanceId:
    Description: ID of the EC2 instance
    Value: !Ref BrowserInstance

  PublicIP:
    Description: Public IP address of the EC2 instance
    Value: !GetAtt BrowserInstance.PublicIp

  PublicDNS:
    Description: Public DNS name of the EC2 instance
    Value: !GetAtt BrowserInstance.PublicDnsName

  BrowserServiceURL:
    Description: URL for the browser service API
    Value: !Sub http://${BrowserInstanceEIP.PublicIp}:3000
```

## Instance Initialization Script

This script will be executed on the backend server to initialize a new EC2 instance:

```typescript
import { EC2 } from 'aws-sdk';
import fs from 'fs';
import path from 'path';

export async function launchBrowserInstance(
  region: string = 'us-east-1',
  instanceType: string = 't2.medium',
  keyName: string = 'browser-automation-key',
  securityGroupId: string,
  subnetId: string
): Promise<string> {
  // Initialize AWS SDK
  const ec2 = new EC2({ region });
  
  // Read user data script
  const userDataScript = fs.readFileSync(
    path.join(__dirname, '../scripts/user-data.sh'),
    'utf8'
  );
  
  // Launch instance
  const params = {
    ImageId: 'ami-0c55b159cbfafe1f0', // Ubuntu 20.04 LTS (replace with appropriate AMI for your region)
    InstanceType: instanceType,
    KeyName: keyName,
    MinCount: 1,
    MaxCount: 1,
    UserData: Buffer.from(userDataScript).toString('base64'),
    SecurityGroupIds: [securityGroupId],
    SubnetId: subnetId,
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
            Value: `BrowserAutomation-${new Date().toISOString()}`
          },
          {
            Key: 'Service',
            Value: 'Manus-EC2-Browser'
          },
          {
            Key: 'CreatedBy',
            Value: 'BrowserAutomationService'
          }
        ]
      }
    ]
  };
  
  try {
    const result = await ec2.runInstances(params).promise();
    const instanceId = result.Instances[0].InstanceId;
    
    console.log(`Launched instance ${instanceId}`);
    
    // Wait for instance to be running
    await ec2.waitFor('instanceRunning', {
      InstanceIds: [instanceId]
    }).promise();
    
    console.log(`Instance ${instanceId} is now running`);
    
    // Get instance details
    const describeResult = await ec2.describeInstances({
      InstanceIds: [instanceId]
    }).promise();
    
    const instance = describeResult.Reservations[0].Instances[0];
    
    console.log(`Instance public DNS: ${instance.PublicDnsName}`);
    console.log(`Instance public IP: ${instance.PublicIpAddress}`);
    
    return instanceId;
  } catch (error) {
    console.error('Error launching instance:', error);
    throw error;
  }
}

export async function terminateBrowserInstance(
  instanceId: string,
  region: string = 'us-east-1'
): Promise<void> {
  // Initialize AWS SDK
  const ec2 = new EC2({ region });
  
  try {
    await ec2.terminateInstances({
      InstanceIds: [instanceId]
    }).promise();
    
    console.log(`Terminated instance ${instanceId}`);
  } catch (error) {
    console.error(`Error terminating instance ${instanceId}:`, error);
    throw error;
  }
}
```

## Instance Health Check Script

This script will be used to check the health of EC2 instances:

```typescript
import axios from 'axios';
import { EC2 } from 'aws-sdk';

export async function checkInstanceHealth(
  instanceId: string,
  publicDns: string,
  apiPort: number = 3000,
  region: string = 'us-east-1'
): Promise<boolean> {
  // Initialize AWS SDK
  const ec2 = new EC2({ region });
  
  try {
    // Check EC2 instance status
    const statusResult = await ec2.describeInstanceStatus({
      InstanceIds: [instanceId]
    }).promise();
    
    if (statusResult.InstanceStatuses.length === 0) {
      console.error(`Instance ${instanceId} not found`);
      return false;
    }
    
    const instanceStatus = statusResult.InstanceStatuses[0];
    
    if (instanceStatus.InstanceState.Name !== 'running') {
      console.error(`Instance ${instanceId} is not running (${instanceStatus.InstanceState.Name})`);
      return false;
    }
    
    if (instanceStatus.InstanceStatus.Status !== 'ok' || 
        instanceStatus.SystemStatus.Status !== 'ok') {
      console.error(`Instance ${instanceId} status checks failed`);
      return false;
    }
    
    // Check browser service API
    try {
      const response = await axios.get(`http://${publicDns}:${apiPort}/health`, {
        timeout: 5000
      });
      
      if (response.status !== 200 || response.data.status !== 'ok') {
        console.error(`Browser service API health check failed for instance ${instanceId}`);
        return false;
      }
    } catch (error) {
      console.error(`Error connecting to browser service API for instance ${instanceId}:`, error);
      return false;
    }
    
    // All checks passed
    return true;
  } catch (error) {
    console.error(`Error checking health for instance ${instanceId}:`, error);
    return false;
  }
}
```

## Instance Monitoring Script

This script will be used to monitor and manage the pool of EC2 instances:

```typescript
import { EC2 } from 'aws-sdk';
import { checkInstanceHealth } from './health-check';
import { terminateBrowserInstance, launchBrowserInstance } from './instance-manager';
import { getInstancesFromDatabase, updateInstanceInDatabase } from '../services/database';

export async function monitorInstancePool(
  region: string = 'us-east-1',
  securityGroupId: string,
  subnetId: string,
  minInstances: number = 1,
  maxInstances: number = 10,
  idleThresholdMinutes: number = 30
): Promise<void> {
  console.log('Starting instance pool monitoring...');
  
  try {
    // Get instances from database
    const instances = await getInstancesFromDatabase();
    
    // Check health of each instance
    for (const instance of instances) {
      const isHealthy = await checkInstanceHealth(
        instance.instanceId,
        instance.publicDns,
        instance.apiPort,
        region
      );
      
      if (!isHealthy) {
        console.log(`Instance ${instance.instanceId} is unhealthy, replacing...`);
        
        // Terminate unhealthy instance
        await terminateBrowserInstance(instance.instanceId, region);
        
        // Update instance status in database
        await updateInstanceInDatabase(instance.id, {
          status: 'terminated',
          terminatedAt: new Date()
        });
        
        // Launch replacement instance
        const newInstanceId = await launchBrowserInstance(
          region,
          instance.instanceType,
          'browser-automation-key',
          securityGroupId,
          subnetId
        );
        
        console.log(`Launched replacement instance ${newInstanceId}`);
      } else {
        // Check if instance is idle
        const now = new Date();
        const lastActivity = new Date(instance.lastActivityAt);
        const idleTimeMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60);
        
        if (idleTimeMinutes > idleThresholdMinutes && instances.length > minInstances) {
          console.log(`Instance ${instance.instanceId} has been idle for ${idleTimeMinutes.toFixed(2)} minutes, terminating...`);
          
          // Terminate idle instance
          await terminateBrowserInstance(instance.instanceId, region);
          
          // Update instance status in database
          await updateInstanceInDatabase(instance.id, {
            status: 'terminated',
            terminatedAt: new Date()
          });
        }
      }
    }
    
    // Check if we need to launch more instances
    const activeInstances = instances.filter(i => i.status === 'running');
    
    if (activeInstances.length < minInstances) {
      const instancesToLaunch = minInstances - activeInstances.length;
      console.log(`Launching ${instancesToLaunch} new instances to maintain minimum pool size...`);
      
      for (let i = 0; i < instancesToLaunch; i++) {
        const newInstanceId = await launchBrowserInstance(
          region,
          't2.medium',
          'browser-automation-key',
          securityGroupId,
          subnetId
        );
        
        console.log(`Launched new instance ${newInstanceId}`);
      }
    }
    
    console.log('Instance pool monitoring completed');
  } catch (error) {
    console.error('Error monitoring instance pool:', error);
  }
}
```

These scripts provide a comprehensive solution for bootstrapping, monitoring, and managing EC2 instances for browser automation. They can be integrated into the backend services to automate the EC2 instance lifecycle management.
