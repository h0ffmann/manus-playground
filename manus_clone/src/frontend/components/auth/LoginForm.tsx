import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import { addNotification } from '../../store/uiSlice';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      dispatch(addNotification({
        type: 'error',
        message: 'Please enter both email and password',
        autoClose: true,
        duration: 5000
      }));
      return;
    }
    
    setIsLoading(true);
    dispatch(loginStart());
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a successful login
      setTimeout(() => {
        const user = {
          id: '1',
          email,
          firstName: 'Demo',
          lastName: 'User'
        };
        
        const token = 'demo-token-12345';
        
        dispatch(loginSuccess({ user, token }));
        
        dispatch(addNotification({
          type: 'success',
          message: 'Login successful!',
          autoClose: true,
          duration: 3000
        }));
        
        setIsLoading(false);
        
        // In a real app, we would redirect to dashboard here
        window.location.href = '/dashboard';
      }, 1000);
    } catch (error) {
      dispatch(loginFailure('Invalid email or password'));
      dispatch(addNotification({
        type: 'error',
        message: 'Login failed. Please check your credentials.',
        autoClose: true,
        duration: 5000
      }));
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-card">
        <h2>Sign In to Manus EC2</h2>
        <p className="login-subtitle">Enter your credentials to access your account</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <button 
              type="submit" 
              className="btn btn-primary login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <a href="#">Sign up</a></p>
          <p><a href="#">Forgot password?</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
