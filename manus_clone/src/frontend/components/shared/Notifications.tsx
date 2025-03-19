import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addNotification } from '../../store/uiSlice';
import './Notifications.css';
import { removeNotification } from '../../store/uiSlice';

const Notifications: React.FC = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state: RootState) => state.ui);

  const handleClose = (id: string) => {
    dispatch(removeNotification(id));
  };

  // Auto-close notifications
  React.useEffect(() => {
    notifications.forEach(notification => {
      if (notification.autoClose) {
        const duration = notification.duration || 5000;
        const timer = setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, duration);
        
        return () => clearTimeout(timer);
      }
    });
  }, [notifications, dispatch]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notifications-container">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-content">
            <span className="notification-message">{notification.message}</span>
          </div>
          <button 
            className="notification-close" 
            onClick={() => handleClose(notification.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
