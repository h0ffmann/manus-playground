import React from 'react';
import BrowserControls from '../components/browser/BrowserControls';
import BrowserDisplay from '../components/browser/BrowserDisplay';
import EC2InstanceManager from '../components/ec2/EC2InstanceManager';
import './BrowserPage.css';

const BrowserPage: React.FC = () => {
  return (
    <div className="browser-page">
      <div className="browser-page-header">
        <h1>Browser Automation</h1>
        <p>Control browser instances running on EC2</p>
      </div>
      
      <div className="browser-page-content">
        <div className="browser-section">
          <BrowserControls />
          <BrowserDisplay />
        </div>
        
        <div className="ec2-section">
          <EC2InstanceManager />
        </div>
      </div>
    </div>
  );
};

export default BrowserPage;
