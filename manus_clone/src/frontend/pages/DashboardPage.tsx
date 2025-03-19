import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { instances } = useSelector((state: RootState) => state.ec2);
  
  // Calculate some stats for the dashboard
  const runningInstances = instances.filter(instance => instance.status === 'running').length;
  const totalInstances = instances.length;
  
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.firstName || 'User'}</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{runningInstances}</div>
          <div className="stat-label">Running Instances</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{totalInstances}</div>
          <div className="stat-label">Total Instances</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">0</div>
          <div className="stat-label">Active Sessions</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">0</div>
          <div className="stat-label">Completed Tasks</div>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <div className="action-card">
          <h3>Browser Automation</h3>
          <p>Control browser instances running on EC2</p>
          <a href="/browser" className="btn btn-primary">Go to Browser</a>
        </div>
        
        <div className="action-card">
          <h3>EC2 Management</h3>
          <p>Manage your EC2 instances</p>
          <a href="/browser#ec2" className="btn btn-primary">Manage Instances</a>
        </div>
        
        <div className="action-card">
          <h3>Settings</h3>
          <p>Configure your account and preferences</p>
          <a href="/settings" className="btn btn-secondary">Go to Settings</a>
        </div>
      </div>
      
      <div className="dashboard-recent">
        <h2>Recent Activity</h2>
        {instances.length > 0 ? (
          <div className="recent-instances">
            <h3>EC2 Instances</h3>
            <table className="recent-table">
              <thead>
                <tr>
                  <th>Instance ID</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Launch Time</th>
                </tr>
              </thead>
              <tbody>
                {instances.slice(0, 5).map(instance => (
                  <tr key={instance.id}>
                    <td>{instance.instanceId}</td>
                    <td>
                      <span className={`status-indicator status-${instance.status}`}>
                        {instance.status}
                      </span>
                    </td>
                    <td>{instance.instanceType}</td>
                    <td>{new Date(instance.launchTime).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-activity">
            <p>No recent activity</p>
            <p>Launch an EC2 instance to get started</p>
            <a href="/browser" className="btn btn-primary">Go to Browser</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
