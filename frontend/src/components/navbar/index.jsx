import React, { useState, useEffect, useContext } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 sm:px-6">
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`pointer-events-auto w-full max-w-[1440px] bg-background border transition-all duration-300 flex items-center justify-between
            ${isScrolled 
              ? 'mt-3 h-14 rounded-full border-border/80 shadow-md shadow-black/5' 
              : 'mt-4 h-16 rounded-[18px] border-border shadow-sm'
            }`}
        >
          <div className="flex items-center px-4 sm:px-6 w-full justify-between gap-6">
            <div className="flex items-center gap-8">
              <Brand />
              <NavigationLinks />
            </div>

            <div className="flex items-center gap-4">
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
                className="md:hidden p-2 -mr-2 rounded-full text-muted-foreground hover:bg-muted/50 outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                onClick={() => setMobileDrawerOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </motion.header>
      </div>

      {/* Spacer to push content down so it doesn't hide behind floating navbar */}
      <div className="h-24 md:h-28"></div>

      <MobileDrawer 
        isOpen={mobileDrawerOpen} 
        onClose={() => setMobileDrawerOpen(false)} 
      />
    </>
  );
};

export default Navbar;
