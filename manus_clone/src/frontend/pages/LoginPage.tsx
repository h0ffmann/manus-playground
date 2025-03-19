import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import LoginForm from '../components/auth/LoginForm';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Redirect if already authenticated
  if (isAuthenticated) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div className="login-page">
      <div className="login-page-content">
        <div className="login-page-left">
          <div className="login-logo">
            <h1>Manus EC2</h1>
            <p>Browser Automation in the Cloud</p>
          </div>
          <div className="login-features">
            <h3>Features</h3>
            <ul>
              <li>EC2-based browser automation</li>
              <li>Scalable infrastructure</li>
              <li>Real-time browser control</li>
              <li>Secure and isolated environments</li>
              <li>Cost-effective solution</li>
            </ul>
          </div>
        </div>
        <div className="login-page-right">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
