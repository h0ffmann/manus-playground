export interface Config {
  port: number;
  corsOrigins: string[];
  aws: {
    region: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    instanceTypes: string[];
    defaultInstanceType: string;
    securityGroupId?: string;
    subnetId?: string;
    keyName?: string;
    amiId: string;
  };
  auth: {
    jwtSecret: string;
    tokenExpiration: string;
  };
  browser: {
    defaultViewport: {
      width: number;
      height: number;
    };
    defaultUserAgent: string;
    defaultTimeout: number;
  };
}

// Default configuration
export const config: Config = {
  port: parseInt(process.env.PORT || '3001'),
  corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    instanceTypes: ['t2.micro', 't2.small', 't2.medium', 't2.large'],
    defaultInstanceType: 't2.medium',
    securityGroupId: process.env.AWS_SECURITY_GROUP_ID,
    subnetId: process.env.AWS_SUBNET_ID,
    keyName: process.env.AWS_KEY_NAME,
    amiId: process.env.AWS_AMI_ID || 'ami-0c55b159cbfafe1f0' // Ubuntu 20.04 LTS
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    tokenExpiration: '24h'
  },
  browser: {
    defaultViewport: {
      width: 1280,
      height: 800
    },
    defaultUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    defaultTimeout: 30000 // 30 seconds
  }
};
