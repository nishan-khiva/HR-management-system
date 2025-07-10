import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`main-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile menu toggle button */}
      {isMobile && (
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <FiMenu />
        </button>
      )}

      {/* Mobile overlay */}
      {isMobile && (
        <div 
          className={`mobile-overlay ${sidebarOpen ? 'active' : ''}`}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar}
        isMobile={isMobile}
      />

      {/* Main content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;


