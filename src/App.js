import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Layout components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import AIScreening from './pages/AIScreening';
import ResourceHub from './pages/ResourceHub';
import CognitiveTraining from './pages/CognitiveTraining';
import HealthMonitoring from './pages/HealthMonitoring';
import NotificationsPage from './pages/NotificationsPage';

function App() {
  // State for mobile sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // State for sidebar condensed mode
  const [sidebarCondensed, setSidebarCondensed] = useState(false);
  
  // State for dark mode
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage or user preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Toggle sidebar condensed state
  const toggleSidebarCondensed = () => {
    setSidebarCondensed(!sidebarCondensed);
  };

  // Update localStorage and body class when dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <Router>
      <div className={`h-full ${darkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col">
          <Sidebar 
            open={sidebarOpen} 
            setOpen={setSidebarOpen} 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode}
            condensed={sidebarCondensed}
            toggleCondensed={toggleSidebarCondensed}
          />
          <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${sidebarCondensed ? 'lg:pl-20' : 'lg:pl-64'}`}>
            <Header 
              setSidebarOpen={setSidebarOpen} 
              darkMode={darkMode} 
              condensed={sidebarCondensed}
            />
            <main className="flex-1 pb-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/ai-screening" element={<AIScreening />} />
                <Route path="/resource-hub" element={<ResourceHub />} />
                <Route path="/cognitive-training" element={<CognitiveTraining />} />
                <Route path="/health-monitoring" element={<HealthMonitoring />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App; 