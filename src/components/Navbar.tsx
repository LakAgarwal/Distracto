
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Menu, X, Clock, Calendar, Shield, LogIn, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import DistractoLogo from './DistractoLogo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Clock className="w-4 h-4 mr-2" /> },
    { name: 'Timetable', path: '/timetable', icon: <Calendar className="w-4 h-4 mr-2" /> },
    { name: 'Screen Time', path: '/screen-time', icon: <Clock className="w-4 h-4 mr-2" /> },
    { name: 'Website Blocking', path: '/website-blocking', icon: <Shield className="w-4 h-4 mr-2" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, isMobile]);

  // Close mobile menu when path changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <DistractoLogo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-300",
                  location.pathname === item.path
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-primary"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-primary">
                  <User className="w-4 h-4 mr-2" />
                  {user?.displayName || 'Profile'}
                </Link>
                <button 
                  onClick={logout}
                  className="text-sm font-medium text-gray-500 hover:text-primary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-primary"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="md:hidden glass"
        >
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "block pl-3 pr-4 py-2 text-base font-medium border-l-4",
                  location.pathname === item.path
                    ? "text-primary border-primary bg-primary/5"
                    : "text-gray-500 border-transparent hover:text-primary hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                <div className="flex items-center">
                  {item.icon}
                  {item.name}
                </div>
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block pl-3 pr-4 py-2 text-base font-medium border-l-4 border-transparent hover:text-primary hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium border-l-4 border-transparent hover:text-primary hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block pl-3 pr-4 py-2 text-base font-medium border-l-4 border-transparent hover:text-primary hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-center">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </div>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
