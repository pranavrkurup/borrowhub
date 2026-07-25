import React, { useState, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, LayoutDashboard, User, Settings, LogOut } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { AuthContext } from '../../context/AuthContext';

const UserMenu = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useClickOutside(menuRef, () => setIsOpen(false));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-muted/50 transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center text-[13px] font-bold shrink-0">
          {getInitials(user?.name)}
        </div>
        <ChevronDown size={14} className="text-muted-foreground" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-56 bg-background rounded-xl border border-border shadow-xl overflow-hidden z-50 origin-top-right py-1"
          >
            <div className="px-3 py-2 border-b border-border/50 mb-1">
              <p className="text-[14px] font-semibold text-foreground truncate">{user?.name || 'User'}</p>
              <p className="text-[12px] text-muted-foreground truncate">{user?.email}</p>
            </div>
            
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 px-3 py-1.5 mx-1 text-[14px] font-medium text-foreground hover:bg-muted/50 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard size={16} className="text-muted-foreground" /> Dashboard
            </Link>
            <Link 
              to="/profile" 
              className="flex items-center gap-2 px-3 py-1.5 mx-1 text-[14px] font-medium text-foreground hover:bg-muted/50 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} className="text-muted-foreground" /> Profile
            </Link>
            <Link 
              to="/settings" 
              className="flex items-center gap-2 px-3 py-1.5 mx-1 text-[14px] font-medium text-foreground hover:bg-muted/50 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} className="text-muted-foreground" /> Settings
            </Link>
            
            <div className="h-px bg-border/50 my-1"></div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 mx-1 text-[14px] font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors w-[calc(100%-8px)] text-left"
            >
              <LogOut size={16} /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
