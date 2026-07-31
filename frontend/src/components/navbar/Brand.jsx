import React from 'react';
import { Link } from 'react-router-dom';

const Brand = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg min-w-0"
      aria-label="BorrowHub Home"
    >
      <div className="relative flex items-center justify-center w-6 h-6 sm:w-8 md:w-11 sm:h-8 md:h-11 shrink-0">
        <img src="/logo.png" alt="" className="w-full h-full object-contain drop-shadow-sm" />
      </div>
      <div className="flex items-center gap-1.5 whitespace-nowrap min-w-0">
        <span className="text-[14px] sm:text-[15px] md:text-[17px] font-semibold text-foreground tracking-tight transition-colors duration-150 group-hover:text-primary/80">
          BorrowHub
        </span>
        <span className="hidden md:inline text-[17px] text-muted-foreground font-light">
          |
        </span>
        <span className="hidden md:inline text-[15px] text-muted-foreground font-medium">
          Campus Inventory
        </span>
      </div>
    </Link>
  );
};

export default Brand;
