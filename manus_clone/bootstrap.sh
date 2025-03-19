#!/bin/bash
# EC2 Instance Bootstrap Script for Browser Automation
# This script installs all dependencies required for running browser automation on EC2

# Log setup
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
echo "Starting EC2 instance bootstrapping process..."

# Update system packages
apt-get update
apt-get upgrade -y

# Install system dependencies
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

echo "System dependencies installed successfully"

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
echo "Node.js installed: $(node --version)"
echo "NPM installed: $(npm --version)"

# Install Chrome
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
apt-get update
apt-get install -y google-chrome-stable
echo "Google Chrome installed: $(google-chrome --version)"

# Create application directory
mkdir -p /opt/browser-service
echo "Created application directory at /opt/browser-service"

# Install Puppeteer and Express
cd /opt/browser-service
npm init -y
npm install puppeteer express socket.io cors
echo "Installed Node.js dependencies"

# Create browser service script
cat > /opt/browser-service/server.js << 'EOF'
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
  console.log('Initializing browser...');
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
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.IO handlers
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('navigate', async (data) => {
    try {
      console.log(`Navigating to: ${data.url}`);
      if (!browser || !page) {
        await initBrowser();
      }
      
      await page.goto(data.url, { waitUntil: 'networkidle2' });
      
      const screenshot = await page.screenshot({ encoding: 'base64' });
      const content = await page.content();
      
      // Get all clickable elements
      const elements = await page.evaluate(() => {
        const clickableElements = Array.from(document.querySelectorAll('a, button, input, select, [role="button"]'));
        return clickableElements.map((el, index) => {
          const rect = el.getBoundingClientRect();
          return {
            id: index,
            tag: el.tagName.toLowerCase(),
            text: el.textContent || el.value || '',
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
          };
        });
      });
      
      socket.emit('navigateResult', {
        success: true,
        screenshot: 'data:image/png;base64,' + screenshot,
        content,
        url: data.url,
        elements
      });
    } catch (error) {
      console.error('Navigation error:', error);
      socket.emit('navigateResult', {
        success: false,
        error: error.message
      });
    }
  });
  
  socket.on('click', async (data) => {
    try {
      console.log(`Clicking element: ${data.selector || `at (${data.x}, ${data.y})`}`);
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
      
      // Get all clickable elements
      const elements = await page.evaluate(() => {
        const clickableElements = Array.from(document.querySelectorAll('a, button, input, select, [role="button"]'));
        return clickableElements.map((el, index) => {
          const rect = el.getBoundingClientRect();
          return {
            id: index,
            tag: el.tagName.toLowerCase(),
            text: el.textContent || el.value || '',
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
          };
        });
      });
      
      socket.emit('clickResult', {
        success: true,
        screenshot: 'data:image/png;base64,' + screenshot,
        content,
        elements
      });
    } catch (error) {
      console.error('Click error:', error);
      socket.emit('clickResult', {
        success: false,
        error: error.message
      });
    }
  });
  
  socket.on('type', async (data) => {
    try {
      console.log(`Typing text in ${data.selector}: ${data.text}`);
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
      console.error('Type error:', error);
      socket.emit('typeResult', {
        success: false,
        error: error.message
      });
    }
  });
  
  socket.on('screenshot', async (data) => {
    try {
      console.log('Taking screenshot');
      if (!browser || !page) {
        throw new Error('Browser not initialized');
      }
      
      const screenshot = await page.screenshot({ encoding: 'base64' });
      
      socket.emit('screenshotResult', {
        success: true,
        screenshot: 'data:image/png;base64,' + screenshot
      });
    } catch (error) {
      console.error('Screenshot error:', error);
      socket.emit('screenshotResult', {
        success: false,
        error: error.message
      });
    }
  });
  
  socket.on('execute', async (data) => {
    try {
      console.log('Executing JavaScript');
      if (!browser || !page) {
        throw new Error('Browser not initialized');
      }
      
      const result = await page.evaluate(data.script);
      
      socket.emit('executeResult', {
        success: true,
        result
      });
    } catch (error) {
      console.error('Execute error:', error);
      socket.emit('executeResult', {
        success: false,
        error: error.message
      });
    }
  });
  
  socket.on('scroll', async (data) => {
    try {
      console.log(`Scrolling ${data.direction} by ${data.amount}`);
      if (!browser || !page) {
        throw new Error('Browser not initialized');
      }
      
      const scrollAmount = data.direction === 'up' ? -data.amount : data.amount;
      
      await page.evaluate((amount) => {
        window.scrollBy(0, amount);
      }, scrollAmount);
      
      await page.waitForTimeout(500);
      
      const screenshot = await page.screenshot({ encoding: 'base64' });
      const content = await page.content();
      
      socket.emit('scrollResult', {
        success: true,
        screenshot: 'data:image/png;base64,' + screenshot,
        content
      });
    } catch (error) {
      console.error('Scroll error:', error);
      socket.emit('scrollResult', {
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
    
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Browser service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start browser service:', error);
    process.exit(1);
  }
}

start();

// Handle shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  if (browser) {
    await browser.close();
  }
  process.exit();
});
EOF

echo "Created browser service script"

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

echo "Created systemd service file"

# Enable and start service
systemctl daemon-reload
systemctl enable browser-service
systemctl start browser-service
echo "Browser service enabled and started"

# Register with backend (if applicable)
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
PUBLIC_DNS=$(curl -s http://169.254.169.254/latest/meta-data/public-hostname)

echo "Instance metadata:"
echo "Instance ID: $INSTANCE_ID"
echo "Public IP: $PUBLIC_IP"
echo "Public DNS: $PUBLIC_DNS"

# Add security measures
# Set up firewall to only allow necessary ports
apt-get install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 3000/tcp
ufw --force enable
echo "Firewall configured and enabled"

# Create a status endpoint for health checks
cat > /opt/browser-service/status.js << EOF
const http = require('http');
const os = require('os');

const server = http.createServer((req, res) => {
  if (req.url === '/status') {
    const status = {
      timestamp: new Date().toISOString(),
      uptime: os.uptime(),
      hostname: os.hostname(),
      instance_id: '$INSTANCE_ID',
      public_ip: '$PUBLIC_IP',
      public_dns: '$PUBLIC_DNS',
      memory: {
        total: os.totalmem(),
        free: os.freemem()
      },
      cpu_load: os.loadavg(),
      browser_service: 'running'
    };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(status, null, 2));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3001, '0.0.0.0', () => {
  console.log('Status server running on port 3001');
});
EOF

# Create systemd service for status endpoint
cat > /etc/systemd/system/status-service.service << EOF
[Unit]
Description=Browser Automation Status Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/browser-service
ExecStart=/usr/bin/node status.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=status-service
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Enable and start status service
systemctl daemon-reload
systemctl enable status-service
systemctl start status-service
echo "Status service enabled and started"

# Allow status service port in firewall
ufw allow 3001/tcp
echo "Opened firewall for status service"

echo "EC2 instance bootstrapping completed successfully!"
