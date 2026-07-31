import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Brand from './Brand';
import SearchTrigger from './SearchTrigger';
import NavigationLinks from './NavigationLinks';
import NotificationMenu from './NotificationMenu';
import UserMenu from './UserMenu';
import MobileDrawer from './MobileDrawer';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none md:px-6 md:pt-4">
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`pointer-events-auto w-full max-w-[1440px] bg-background/95 backdrop-blur-md transition-all duration-300 flex items-center justify-between
            ${isScrolled 
              ? 'md:mt-0 h-[60px] md:h-14 md:rounded-full border-b md:border-b-0 md:border border-border/50 shadow-[0_1px_2px_rgba(0,0,0,0.02)] md:shadow-sm md:shadow-black/5' 
              : 'md:mt-0 h-[64px] md:h-16 md:rounded-[18px] border-b md:border-b-0 md:border border-border/30 md:shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
            }`}
        >
          <div className="flex items-center px-4 sm:px-5 md:px-6 w-full justify-between gap-3 md:gap-6">
            {/* Left section: Brand + Nav */}
            <div className="flex items-center gap-4 md:gap-8 min-w-0">
              <Brand />
              <NavigationLinks />
            </div>

            {/* Right section: Search + Actions + Mobile toggle */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 shrink-0">
              <SearchTrigger />

              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  <NotificationMenu />
                  <div className="w-px h-6 bg-border/60 mx-1"></div>
                  <UserMenu />
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-accent">
                    Sign In
                  </Link>
                  <Link to="/register" className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4 py-1.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary shadow-sm hover:shadow active:scale-95">
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden flex items-center justify-center w-9 h-9 -mr-0.5 rounded-lg text-foreground hover:bg-muted/40 outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors active:scale-95"
                onClick={() => setMobileDrawerOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileDrawerOpen}
                aria-controls="mobile-navigation"
              >
                <Menu size={20} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </motion.header>
      </div>

      {/* Spacer — fluid, smaller on mobile */}
      <div className="h-[64px] sm:h-[76px] md:h-[88px]"></div>

      <MobileDrawer 
        isOpen={mobileDrawerOpen} 
        onClose={() => setMobileDrawerOpen(false)} 
      />
    </>
  );
};

export default Navbar;
