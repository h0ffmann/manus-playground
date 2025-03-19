import React from 'react';
import './Header.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { toggleSidebar } from '../../store/uiSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/';
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          {isAuthenticated && (
            <button className="sidebar-toggle" onClick={handleToggleSidebar}>
              {sidebarOpen ? '✕' : '☰'}
            </button>
          )}
          <div className="logo">
            <a href={isAuthenticated ? '/dashboard' : '/'}>
              <h1>Manus EC2</h1>
            </a>
          </div>
        </div>
        
        <div className="header-right">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">
                {user?.firstName} {user?.lastName}
              </span>
              <div className="user-dropdown">
                <a href="/settings">Settings</a>
                <a href="#" onClick={handleLogout}>Logout</a>
              </div>
            </div>
          ) : (
            <nav className="nav-links">
              <a href="/">Login</a>
              <a href="/about">About</a>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
