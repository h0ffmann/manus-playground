import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { navigateStart } from '../../store/browserSlice';
import './BrowserControls.css';

const BrowserControls: React.FC = () => {
  const [url, setUrl] = useState('');
  const dispatch = useDispatch();
  const { currentUrl, isLoading, history } = useSelector((state: RootState) => state.browser);
  const { activeInstance } = useSelector((state: RootState) => state.ec2);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) return;
    
    // Ensure URL has protocol
    let navigateUrl = url;
    if (!/^https?:\/\//i.test(navigateUrl)) {
      navigateUrl = 'https://' + navigateUrl;
    }
    
    // In a real app, this would dispatch an action that makes an API call
    // For now, we'll just update the Redux state
    dispatch(navigateStart(navigateUrl));
    
    // Simulate API call to EC2 instance
    console.log(`Navigating to ${navigateUrl} on EC2 instance ${activeInstance?.id}`);
  };

  return (
    <div className="browser-controls">
      <div className="browser-controls-container">
        <div className="url-bar-container">
          <form onSubmit={handleNavigate}>
            <div className="url-bar">
              <button 
                type="button" 
                className="url-bar-button back-button"
                disabled={!history.length || isLoading}
              >
                ←
              </button>
              <button 
                type="button" 
                className="url-bar-button refresh-button"
                disabled={!currentUrl || isLoading}
              >
                ↻
              </button>
              <input
                type="text"
                className="url-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
                disabled={isLoading || !activeInstance}
              />
              <button 
                type="submit" 
                className="url-bar-button go-button"
                disabled={!url || isLoading || !activeInstance}
              >
                Go
              </button>
            </div>
          </form>
        </div>
        
        <div className="browser-status">
          {isLoading ? (
            <div className="loading-indicator">Loading...</div>
          ) : activeInstance ? (
            <div className="instance-info">
              <span className="instance-status">
                <span className={`status-dot status-${activeInstance.status}`}></span>
                {activeInstance.status}
              </span>
              <span className="instance-id">{activeInstance.instanceId}</span>
              <span className="instance-region">{activeInstance.region}</span>
            </div>
          ) : (
            <div className="no-instance">No active EC2 instance</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowserControls;
