import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BrowserPage from './pages/BrowserPage';
import SettingsPage from './pages/SettingsPage';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import Notifications from './components/shared/Notifications';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/browser" element={<BrowserPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
      <Notifications />
      <Footer />
    </div>
  );
};

export default App;
