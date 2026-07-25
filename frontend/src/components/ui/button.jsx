import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variants = {
    default: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    outline: "border border-border bg-transparent hover:bg-muted hover:text-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-muted hover:text-foreground",
    link: "underline-offset-4 hover:underline text-primary",
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10",
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };
