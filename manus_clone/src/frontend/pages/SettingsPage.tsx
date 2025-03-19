import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { toggleDarkMode } from '../../store/uiSlice';
import { addNotification } from '../../store/uiSlice';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { darkMode } = useSelector((state: RootState) => state.ui);
  
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [defaultRegion, setDefaultRegion] = useState('us-east-1');
  const [defaultInstanceType, setDefaultInstanceType] = useState('t2.medium');
  const [terminateWhenIdle, setTerminateWhenIdle] = useState(true);
  const [idleTimeout, setIdleTimeout] = useState(30);
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would dispatch an action that makes an API call
    // For now, we'll just show a notification
    dispatch(addNotification({
      type: 'success',
      message: 'Profile settings saved successfully',
      autoClose: true,
      duration: 3000
    }));
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      dispatch(addNotification({
        type: 'error',
        message: 'New passwords do not match',
        autoClose: true,
        duration: 5000
      }));
      return;
    }
    
    // In a real app, this would dispatch an action that makes an API call
    // For now, we'll just show a notification
    dispatch(addNotification({
      type: 'success',
      message: 'Password changed successfully',
      autoClose: true,
      duration: 3000
    }));
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  const handleSaveEC2Settings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would dispatch an action that makes an API call
    // For now, we'll just show a notification
    dispatch(addNotification({
      type: 'success',
      message: 'EC2 settings saved successfully',
      autoClose: true,
      duration: 3000
    }));
  };
  
  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account and application preferences</p>
      </div>
      
      <div className="settings-content">
        <div className="settings-sidebar">
          <ul className="settings-nav">
            <li className="active"><a href="#profile">Profile</a></li>
            <li><a href="#security">Security</a></li>
            <li><a href="#ec2">EC2 Settings</a></li>
            <li><a href="#appearance">Appearance</a></li>
          </ul>
        </div>
        
        <div className="settings-main">
          <section id="profile" className="settings-section">
            <h2>Profile Settings</h2>
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  className="form-control"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  className="form-control"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <button type="submit" className="btn btn-primary">Save Profile</button>
            </form>
          </section>
          
          <section id="security" className="settings-section">
            <h2>Security Settings</h2>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  className="form-control"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary">Change Password</button>
            </form>
          </section>
          
          <section id="ec2" className="settings-section">
            <h2>EC2 Settings</h2>
            <form onSubmit={handleSaveEC2Settings}>
              <div className="form-group">
                <label htmlFor="defaultRegion">Default Region</label>
                <select
                  id="defaultRegion"
                  className="form-control"
                  value={defaultRegion}
                  onChange={(e) => setDefaultRegion(e.target.value)}
                >
                  <option value="us-east-1">US East (N. Virginia)</option>
                  <option value="us-east-2">US East (Ohio)</option>
                  <option value="us-west-1">US West (N. California)</option>
                  <option value="us-west-2">US West (Oregon)</option>
                  <option value="eu-west-1">EU (Ireland)</option>
                  <option value="eu-central-1">EU (Frankfurt)</option>
                  <option value="ap-northeast-1">Asia Pacific (Tokyo)</option>
                  <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="defaultInstanceType">Default Instance Type</label>
                <select
                  id="defaultInstanceType"
                  className="form-control"
                  value={defaultInstanceType}
                  onChange={(e) => setDefaultInstanceType(e.target.value)}
                >
                  <option value="t2.micro">t2.micro (1 vCPU, 1 GiB RAM)</option>
                  <option value="t2.small">t2.small (1 vCPU, 2 GiB RAM)</option>
                  <option value="t2.medium">t2.medium (2 vCPU, 4 GiB RAM)</option>
                  <option value="t2.large">t2.large (2 vCPU, 8 GiB RAM)</option>
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="terminateWhenIdle"
                  checked={terminateWhenIdle}
                  onChange={(e) => setTerminateWhenIdle(e.target.checked)}
                />
                <label htmlFor="terminateWhenIdle">Terminate instances when idle</label>
              </div>
              
              {terminateWhenIdle && (
                <div className="form-group">
                  <label htmlFor="idleTimeout">Idle timeout (minutes)</label>
                  <input
                    type="number"
                    id="idleTimeout"
                    className="form-control"
                    value={idleTimeout}
                    onChange={(e) => setIdleTimeout(parseInt(e.target.value))}
                    min="5"
                    max="120"
                  />
                </div>
              )}
              
              <button type="submit" className="btn btn-primary">Save EC2 Settings</button>
            </form>
          </section>
          
          <section id="appearance" className="settings-section">
            <h2>Appearance Settings</h2>
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="darkMode"
                checked={darkMode}
                onChange={handleToggleDarkMode}
              />
              <label htmlFor="darkMode">Dark Mode</label>
            </div>
            
            <p className="settings-note">
              Dark mode changes the appearance of the application to use darker colors, which can be easier on the eyes in low-light environments.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
