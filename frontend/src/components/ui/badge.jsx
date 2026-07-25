import React from 'react';
import { cn } from './button';

function Badge({ className, variant = 'default', ...props }) {
  const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2";
  
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
    outline: "text-foreground",
    available: "border-transparent bg-[var(--color-status-available-bg)] text-[var(--color-status-available)]",
    requested: "border-transparent bg-[var(--color-status-requested-bg)] text-[var(--color-status-requested)]",
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props} />
  );
}

export { Badge };
