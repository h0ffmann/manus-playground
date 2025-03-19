import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import './BrowserDisplay.css';

const BrowserDisplay: React.FC = () => {
  const { screenshot, content, elements, isLoading, currentUrl } = useSelector((state: RootState) => state.browser);
  const { activeInstance } = useSelector((state: RootState) => state.ec2);

  const handleElementClick = (elementId: number) => {
    console.log(`Clicked element with ID: ${elementId}`);
    // In a real app, this would dispatch an action to click the element on the EC2 instance
  };

  if (!activeInstance) {
    return (
      <div className="browser-display no-instance">
        <div className="browser-placeholder">
          <h3>No Active EC2 Instance</h3>
          <p>Launch an EC2 instance to start browser automation</p>
          <button className="btn btn-primary">Launch Instance</button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="browser-display loading">
        <div className="browser-loading">
          <div className="loading-spinner"></div>
          <p>Loading browser content...</p>
        </div>
      </div>
    );
  }

  if (!currentUrl) {
    return (
      <div className="browser-display empty">
        <div className="browser-placeholder">
          <h3>Enter a URL to begin</h3>
          <p>Use the browser controls above to navigate to a website</p>
        </div>
      </div>
    );
  }

  return (
    <div className="browser-display">
      <div className="browser-content">
        {screenshot && (
          <div className="browser-screenshot">
            <img src={screenshot} alt="Browser screenshot" />
            
            {/* Interactive elements overlay */}
            {elements && elements.length > 0 && (
              <div className="browser-elements-overlay">
                {elements.map(element => (
                  <div
                    key={element.id}
                    className="browser-element"
                    style={{
                      left: `${element.x}px`,
                      top: `${element.y}px`,
                      width: `${element.width}px`,
                      height: `${element.height}px`
                    }}
                    onClick={() => handleElementClick(element.id)}
                    title={element.text}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        {content && (
          <div className="browser-html-content">
            <h4>Page Content</h4>
            <div className="content-preview">
              {content}
            </div>
          </div>
        )}
      </div>
      
      <div className="browser-actions">
        <button className="btn btn-secondary">Take Screenshot</button>
        <button className="btn btn-secondary">View Source</button>
        <button className="btn btn-secondary">Execute Script</button>
      </div>
    </div>
  );
};

export default BrowserDisplay;
