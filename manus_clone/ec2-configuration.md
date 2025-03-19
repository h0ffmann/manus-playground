# EC2 Configuration and AWS Integration

## AWS Resources Required

### EC2 Instances
- **Instance Type**: t2.medium (recommended minimum for browser automation)
- **AMI**: Amazon Linux 2 or Ubuntu Server 20.04 LTS
- **Storage**: 20GB minimum EBS volume
- **Security Group**: Custom security group with specific inbound/outbound rules

### VPC Configuration
- **VPC**: Dedicated VPC for browser automation instances
- **Subnets**: Public subnets for instances that need internet access
- **Security Groups**: Restrict access to necessary ports only
- **Internet Gateway**: For outbound internet access

### IAM Roles and Policies
- **EC2 Instance Role**: Permissions for EC2 operations and CloudWatch
- **Application Role**: Permissions for EC2 management and other AWS services
- **Custom Policies**: Least privilege access for specific operations

## EC2 Instance Configuration

### System Requirements
- Node.js 18+ runtime
- Chrome/Chromium browser
- Required system libraries for browser automation
- Docker (optional for containerized deployment)

### Network Configuration
- Expose specific ports for API communication
- Configure security groups to allow only necessary traffic
- Set up proper DNS resolution

### Monitoring and Logging
- CloudWatch integration for metrics and logs
- Health check endpoints
- Performance monitoring

## EC2 Instance Management

### Instance Lifecycle
1. **Provisioning**: Launch instances using CloudFormation or AWS SDK
2. **Configuration**: Bootstrap instances with required software and configuration
3. **Registration**: Register instances with the backend service
4. **Operation**: Accept and process browser automation commands
5. **Monitoring**: Track instance health and performance
6. **Termination**: Gracefully shut down and terminate instances when no longer needed

### Auto-scaling Strategy
- **Scale-out Criteria**: High CPU utilization, memory usage, or queue depth
- **Scale-in Criteria**: Low utilization for a specified period
- **Cooldown Periods**: Prevent rapid scaling oscillations
- **Instance Warm-up**: Allow time for new instances to fully initialize

### Cost Optimization
- Use Spot Instances where appropriate
- Implement automatic termination of idle instances
- Right-size instances based on workload
- Schedule scaling based on usage patterns

## AWS SDK Integration

### EC2 Management API
```typescript
// Example EC2 instance management code
import { EC2 } from 'aws-sdk';

export class EC2Manager {
  private ec2: EC2;
  
  constructor(region: string = 'us-east-1') {
    this.ec2 = new EC2({ region });
  }
  
  async launchInstance(
    imageId: string,
    instanceType: string,
    userData: string,
    securityGroupIds: string[],
    subnetId: string
  ): Promise<string> {
    const params = {
      ImageId: imageId,
      InstanceType: instanceType,
      MinCount: 1,
      MaxCount: 1,
      UserData: Buffer.from(userData).toString('base64'),
      SecurityGroupIds: securityGroupIds,
      SubnetId: subnetId,
      TagSpecifications: [
        {
          ResourceType: 'instance',
          Tags: [
            {
              Key: 'Name',
              Value: 'BrowserAutomationInstance'
            },
            {
              Key: 'Service',
              Value: 'Manus-EC2-Browser'
            }
          ]
        }
      ]
    };
    
    const result = await this.ec2.runInstances(params).promise();
    return result.Instances[0].InstanceId;
  }
  
  async terminateInstance(instanceId: string): Promise<void> {
    const params = {
      InstanceIds: [instanceId]
    };
    
    await this.ec2.terminateInstances(params).promise();
  }
  
  async getInstanceStatus(instanceId: string): Promise<string> {
    const params = {
      InstanceIds: [instanceId]
    };
    
    const result = await this.ec2.describeInstanceStatus(params).promise();
    if (result.InstanceStatuses.length === 0) {
      return 'unknown';
    }
    
    return result.InstanceStatuses[0].InstanceState.Name;
  }
  
  async listInstances(filters: { [key: string]: string } = {}): Promise<any[]> {
    const filterParams = Object.entries(filters).map(([key, value]) => ({
      Name: `tag:${key}`,
      Values: [value]
    }));
    
    const params = {
      Filters: filterParams
    };
    
    const result = await this.ec2.describeInstances(params).promise();
    return result.Reservations.flatMap(r => r.Instances);
  }
}
```

### Instance Pool Management
```typescript
// Example instance pool management code
export class InstancePool {
  private ec2Manager: EC2Manager;
  private instances: Map<string, InstanceInfo> = new Map();
  private config: PoolConfig;
  
  constructor(ec2Manager: EC2Manager, config: PoolConfig) {
    this.ec2Manager = ec2Manager;
    this.config = config;
  }
  
  async initialize(): Promise<void> {
    // Load existing instances
    const instances = await this.ec2Manager.listInstances({
      Service: 'Manus-EC2-Browser'
    });
    
    for (const instance of instances) {
      if (instance.State.Name === 'running') {
        this.instances.set(instance.InstanceId, {
          id: instance.InstanceId,
          status: 'available',
          launchTime: instance.LaunchTime,
          lastUsed: new Date(),
          publicDnsName: instance.PublicDnsName
        });
      }
    }
  }
  
  async getAvailableInstance(): Promise<InstanceInfo> {
    // Find an available instance or launch a new one
    for (const [id, info] of this.instances.entries()) {
      if (info.status === 'available') {
        info.status = 'busy';
        info.lastUsed = new Date();
        return info;
      }
    }
    
    // No available instances, launch a new one
    return this.launchNewInstance();
  }
  
  async releaseInstance(instanceId: string): Promise<void> {
    const instance = this.instances.get(instanceId);
    if (instance) {
      instance.status = 'available';
      instance.lastUsed = new Date();
    }
  }
  
  async launchNewInstance(): Promise<InstanceInfo> {
    const userData = this.generateUserData();
    const instanceId = await this.ec2Manager.launchInstance(
      this.config.imageId,
      this.config.instanceType,
      userData,
      this.config.securityGroupIds,
      this.config.subnetId
    );
    
    // Wait for instance to be ready
    let status = 'pending';
    while (status !== 'running') {
      await new Promise(resolve => setTimeout(resolve, 5000));
      status = await this.ec2Manager.getInstanceStatus(instanceId);
    }
    
    // Get instance details
    const instances = await this.ec2Manager.listInstances();
    const instanceDetails = instances.find(i => i.InstanceId === instanceId);
    
    const instanceInfo: InstanceInfo = {
      id: instanceId,
      status: 'initializing',
      launchTime: new Date(),
      lastUsed: new Date(),
      publicDnsName: instanceDetails.PublicDnsName
    };
    
    this.instances.set(instanceId, instanceInfo);
    
    // Wait for browser service to be ready
    await this.waitForServiceReady(instanceInfo.publicDnsName);
    
    instanceInfo.status = 'busy';
    return instanceInfo;
  }
  
  private generateUserData(): string {
    // Generate user data script for instance bootstrapping
    return `#!/bin/bash
# Update and install dependencies
apt-get update
apt-get install -y curl wget gnupg

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install Chrome
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
apt-get update
apt-get install -y google-chrome-stable

# Clone application repository
git clone https://github.com/your-org/manus-ec2-browser.git /opt/browser-service
cd /opt/browser-service

# Install dependencies
npm install

# Start browser service
npm run start-browser-service
`;
  }
  
  private async waitForServiceReady(publicDnsName: string): Promise<void> {
    // Poll the health check endpoint until the service is ready
    const maxAttempts = 30;
    const interval = 5000;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(`http://${publicDnsName}:3000/health`);
        if (response.ok) {
          return;
        }
      } catch (error) {
        // Service not ready yet
      }
      
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    throw new Error('Service failed to start within the expected time');
  }
  
  async cleanupIdleInstances(): Promise<void> {
    const now = new Date();
    const idleThreshold = this.config.idleThresholdMinutes * 60 * 1000;
    
    for (const [id, info] of this.instances.entries()) {
      if (info.status === 'available' && 
          now.getTime() - info.lastUsed.getTime() > idleThreshold) {
        await this.ec2Manager.terminateInstance(id);
        this.instances.delete(id);
      }
    }
  }
}

interface InstanceInfo {
  id: string;
  status: 'initializing' | 'available' | 'busy';
  launchTime: Date;
  lastUsed: Date;
  publicDnsName: string;
}

interface PoolConfig {
  imageId: string;
  instanceType: string;
  securityGroupIds: string[];
  subnetId: string;
  idleThresholdMinutes: number;
}
```

## Security Best Practices

### Network Security
- Use VPC security groups to restrict access
- Implement network ACLs for additional security
- Use private subnets with NAT gateways where possible
- Enable VPC flow logs for network monitoring

### Instance Security
- Use IAM roles instead of hardcoded credentials
- Keep instances updated with security patches
- Use minimal required permissions
- Implement instance metadata service v2 (IMDSv2)

### Data Security
- Encrypt sensitive data at rest and in transit
- Implement proper session management
- Use secure communication protocols (HTTPS, WSS)
- Regularly rotate credentials and keys

## Cost Estimation

### EC2 Instance Costs
- t2.medium: ~$0.0464 per hour (on-demand, us-east-1)
- Estimated monthly cost for 1 instance running 24/7: ~$34
- Spot instance pricing can reduce costs by 70-90%

### Additional AWS Service Costs
- Data transfer: $0.09 per GB (outbound)
- EBS storage: $0.10 per GB-month (gp2)
- CloudWatch: Basic monitoring included, detailed monitoring additional

### Cost Optimization Strategies
- Use Spot Instances for non-critical workloads
- Implement auto-scaling based on demand
- Terminate idle instances
- Use reserved instances for predictable workloads
