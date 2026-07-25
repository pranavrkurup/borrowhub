import React, { useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { X, LayoutDashboard, User, Settings, LogOut, Bell, Search } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Brand from './Brand';

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

  // Close drawer on navigation
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  const openSearch = () => {
    onClose();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }));
  };

  const filteredItems = navItems.filter((item) => {
    if (item.roles.includes('all')) return true;
    if (!user) return false;
    const userRole = user.role?.toLowerCase() || 'user';
    if (item.roles.includes('admin') && userRole !== 'admin') return false;
    return true;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] md:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200, duration: 0.22 }}
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-background border-r border-border shadow-2xl z-[70] md:hidden flex flex-col"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <Brand />
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full text-muted-foreground hover:bg-muted/50 outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6">
              
              <button 
                onClick={openSearch}
                className="flex items-center gap-3 w-full px-4 py-3 bg-muted/30 border border-border rounded-xl text-muted-foreground text-left"
              >
                <Search size={18} />
                <span className="flex-1 font-medium">Search equipment...</span>
              </button>

              <nav className="flex flex-col gap-1">
                {filteredItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive ? 'bg-muted/50 text-foreground' : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {user ? (
                <div className="mt-auto border-t border-border pt-4 flex flex-col gap-1">
                  <div className="px-4 py-2 mb-2 flex flex-col">
                    <span className="font-semibold text-foreground truncate">{user.name}</span>
                    <span className="text-sm text-muted-foreground truncate">{user.email}</span>
                  </div>
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground font-medium hover:bg-muted/30 hover:text-foreground transition-colors">
                    <User size={18} /> Profile
                  </Link>
                  <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground font-medium hover:bg-muted/30 hover:text-foreground transition-colors">
                    <Settings size={18} /> Settings
                  </Link>
                  <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground font-medium hover:bg-muted/30 hover:text-foreground transition-colors w-full text-left">
                    <Bell size={18} /> Notifications
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 mt-2 rounded-lg text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full text-left"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              ) : (
                <div className="mt-auto border-t border-border pt-4 flex flex-col gap-2">
                  <Link to="/login" className="px-4 py-3 rounded-lg font-medium text-center text-muted-foreground hover:bg-muted/30">
                    Sign In
                  </Link>
                  <Link to="/register" className="px-4 py-3 rounded-lg font-medium text-center bg-primary text-primary-foreground">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
