import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';

const NotificationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-muted-foreground hover:bg-muted/50 transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell size={20} className="transition-transform duration-150 hover:scale-105" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 bg-background rounded-xl border border-border shadow-xl overflow-hidden z-50 origin-top-right"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-[15px] text-foreground">Notifications</h3>
            </div>
            <div className="p-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Bell size={24} className="text-muted-foreground/50" />
              </div>
              <h4 className="text-[15px] font-semibold text-foreground mb-1">No notifications yet</h4>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                You'll see borrow requests, approvals, reminders, and messages here.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationMenu;
