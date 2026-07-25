import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';

const navItems = [
  { path: '/feed', label: 'Feed', roles: ['all'] },
  { path: '/dashboard', label: 'Dashboard', roles: ['user', 'admin'] },
  { path: '/add-item', label: 'List Item', roles: ['user', 'admin'] },
  { path: '/requests', label: 'Borrow Requests', roles: ['admin'] },
];

const NavigationLinks = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const filteredItems = navItems.filter((item) => {
    if (item.roles.includes('all')) return true;
    if (!user) return false;
    const userRole = user.role?.toLowerCase() || 'user';
    if (item.roles.includes('admin') && userRole !== 'admin') return false;
    return true;
  });

  return (
    <div className="hidden md:flex items-center gap-2">
      {filteredItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`relative px-3 py-1.5 text-[14px] font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md ${
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {isActive && (
              <motion.div
                layoutId="navbar-active"
                className="absolute inset-0 bg-muted/60 rounded-md -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30, duration: 0.18 }}
              />
            )}
            <span className="relative z-10 block translate-y-[-1px] transition-transform duration-150 hover:translate-y-[-1px]">
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default NavigationLinks;
