import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BottomNavigation from '../BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { user } = useUser();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Pages that should not show the sidebar
  const noSidebarPages = ['/login', '/register', '/onboarding'];
  const showSidebar = !noSidebarPages.includes(location.pathname);

  // Pages that should not show the footer
  const noFooterPages = ['/login', '/register', '/onboarding'];
  // Hide footer if user is logged in OR if it's a no-footer page
  const showFooter = !noFooterPages.includes(location.pathname) && !user;

  // Pages that should show bottom navigation instead of sidebar (mobile)
  const showBottomNav = isMobile && showSidebar;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header 
        onToggleSidebar={toggleSidebar} 
        showSidebar={sidebarOpen}
      />

      {/* Sidebar */}
      {showSidebar && (
        <Sidebar 
          isOpen={isMobile ? sidebarOpen : true} 
          onClose={closeSidebar}
        />
      )}

      {/* Main content */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        showSidebar && !isMobile ? 'ml-64' : ''
      }`}>
        {/* Page content */}
        <div className={`flex-1 ${showBottomNav ? 'pb-20' : ''}`}>
          {children}
        </div>

        {/* Footer - Desktop/Tablet */}
        {showFooter && !isMobile && (
          <Footer />
        )}
      </main>

      {/* Bottom Navigation - Mobile */}
      {showBottomNav && (
        <BottomNavigation />
      )}
    </div>
  );
};

export default Layout;