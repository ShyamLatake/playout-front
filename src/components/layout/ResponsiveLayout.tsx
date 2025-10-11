import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import BottomNavigation from '../BottomNavigation';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const location = useLocation();
  const { user } = useUser();

  // Detect screen size
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Close sidebar on route change for mobile/tablet
  useEffect(() => {
    if (screenSize !== 'desktop') {
      setSidebarOpen(false);
    }
  }, [location.pathname, screenSize]);

  // Auto-open sidebar on desktop for logged-in users
  useEffect(() => {
    if (screenSize === 'desktop' && user && !noSidebarPages.includes(location.pathname)) {
      setSidebarOpen(true);
    }
  }, [screenSize, user, location.pathname]);

  // Pages configuration
  const noSidebarPages = ['/login', '/register', '/onboarding', '/welcome'];
  const noFooterPages = ['/login', '/register', '/onboarding', '/welcome'];
  const fullWidthPages = ['/login', '/register', '/onboarding', '/welcome', '/forgot-password'];

  const showSidebar = !noSidebarPages.includes(location.pathname) && user;
  // Hide footer if user is logged in OR if it's a no-footer page
  const showFooter = !noFooterPages.includes(location.pathname) && !user;
  const isFullWidth = fullWidthPages.includes(location.pathname);
  const showBottomNav = (screenSize === 'mobile') && showSidebar;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Layout classes based on screen size and sidebar state
  const getLayoutClasses = () => {
    if (isFullWidth) return 'min-h-screen';
    
    const baseClasses = 'min-h-screen bg-gray-50 flex flex-col';
    return baseClasses;
  };

  const getMainClasses = () => {
    if (isFullWidth) return 'flex-1';
    
    let classes = 'flex-1 flex flex-col';
    
    // Add left margin for fixed sidebar on desktop
    if (showSidebar && screenSize === 'desktop') {
      classes += ' ml-64';
    }
    
    // Add bottom padding for mobile bottom navigation
    if (showBottomNav) {
      classes += ' pb-20';
    }
    
    return classes;
  };

  const getContentClasses = () => {
    if (isFullWidth) return '';
    
    let classes = 'flex-1';
    
    // Add responsive padding
    if (screenSize === 'mobile') {
      classes += ' px-0';
    } else if (screenSize === 'tablet') {
      classes += ' px-4';
    } else {
      classes += ' px-0';
    }
    
    return classes;
  };

  return (
    <div className={getLayoutClasses()}>
      {/* Header - Always visible except on full-width pages */}
      {!isFullWidth && (
        <Header 
          onToggleSidebar={toggleSidebar} 
          showSidebar={sidebarOpen}
        />
      )}

      {/* Sidebar */}
      {showSidebar && (
        <Sidebar 
          isOpen={screenSize === 'desktop' ? true : sidebarOpen} 
          onClose={closeSidebar}
        />
      )}

      {/* Main content area */}
      <main className={`${getMainClasses()} transition-all duration-300 ease-in-out`}>
        {/* Page content */}
        <div className={getContentClasses()}>
          {children}
        </div>

        {/* Footer - Desktop and Tablet only */}
        {showFooter && screenSize !== 'mobile' && (
          <Footer />
        )}
      </main>

      {/* Bottom Navigation - Mobile only */}
      {showBottomNav && (
        <BottomNavigation />
      )}
    </div>
  );
};

export default ResponsiveLayout;