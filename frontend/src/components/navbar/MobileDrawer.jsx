import React, { useContext, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { X, User, Settings, LogOut, Bell, Search, ArrowRight } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const navItems = [
  { path: '/feed', label: 'Feed', roles: ['all'] },
  { path: '/dashboard', label: 'Dashboard', roles: ['user', 'admin'] },
  { path: '/add-item', label: 'List Item', roles: ['user', 'admin'] },
  { path: '/requests', label: 'Borrow Requests', roles: ['admin'] },
];

const MobileDrawer = ({ isOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Close drawer on navigation
  useEffect(() => {
    if (isOpen) onClose();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Escape key handler
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus the close button for accessibility
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  const openSearch = () => {
    onClose();
    // Small delay to let drawer close before opening command palette
    setTimeout(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }));
    }, 250);
  };

  const filteredItems = navItems.filter((item) => {
    if (item.roles.includes('all')) return true;
    if (!user) return false;
    const userRole = user.role?.toLowerCase() || 'user';
    if (item.roles.includes('admin') && userRole !== 'admin') return false;
    return true;
  });

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[6px] z-[100] md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.aside
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-[340px] bg-background z-[110] md:hidden flex flex-col shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
              <Link 
                to="/" 
                onClick={onClose}
                className="flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
              >
                <img src="/logo.png" alt="" className="w-8 h-8 object-contain" />
                <span className="text-[15px] font-semibold text-foreground tracking-tight">BorrowHub</span>
              </Link>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2 -mr-1 rounded-full text-muted-foreground hover:bg-muted/50 outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                aria-label="Close navigation menu"
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overscroll-contain py-3 px-4 flex flex-col gap-2">
              
              {/* Search trigger */}
              <button 
                onClick={openSearch}
                className="flex items-center gap-3 w-full px-4 py-3 bg-muted/25 border border-border/50 rounded-xl text-muted-foreground text-left hover:bg-muted/40 transition-colors duration-150 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Search size={16} className="shrink-0" />
                <span className="flex-1 text-[14px] font-medium">Search equipment…</span>
                <kbd className="text-[11px] font-mono text-muted-foreground/60 bg-muted/40 px-1.5 py-0.5 rounded">⌘K</kbd>
              </button>

              {/* Navigation links */}
              <nav className="flex flex-col gap-0.5 mt-2" aria-label="Main navigation">
                {filteredItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.06 * index, ease: 'easeOut' }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98] ${
                          isActive 
                            ? 'bg-accent/8 text-foreground' 
                            : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {item.label}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* Footer section */}
            <div className="border-t border-border/60 px-4 py-4 mt-auto">
              {user ? (
                <div className="flex flex-col gap-1">
                  {/* User info */}
                  <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                    <div className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center text-[14px] font-bold shrink-0">
                      {getInitials(user.name)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[14px] font-semibold text-foreground truncate">{user.name}</span>
                      <span className="text-[12px] text-muted-foreground truncate">{user.email}</span>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="flex flex-col gap-0.5">
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] text-muted-foreground font-medium hover:bg-muted/30 hover:text-foreground transition-colors active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <User size={16} className="shrink-0" /> Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] text-muted-foreground font-medium hover:bg-muted/30 hover:text-foreground transition-colors active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <Settings size={16} className="shrink-0" /> Settings
                    </Link>
                    <button 
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] text-muted-foreground font-medium hover:bg-muted/30 hover:text-foreground transition-colors w-full text-left active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <Bell size={16} className="shrink-0" /> Notifications
                    </button>
                  </div>

                  <div className="h-px bg-border/40 my-1.5" />

                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full text-left active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    <LogOut size={16} className="shrink-0" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link 
                    to="/login" 
                    className="flex items-center justify-center px-4 py-3 rounded-xl text-[14px] font-semibold text-foreground border border-border hover:bg-muted/30 transition-colors active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[14px] font-semibold bg-accent text-white hover:bg-accent/90 transition-colors shadow-sm active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  >
                    Get Started <ArrowRight size={15} />
                  </Link>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
