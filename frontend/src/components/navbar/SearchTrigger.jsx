import React from 'react';
import { Search } from 'lucide-react';

const SearchTrigger = () => {
  const openCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }));
  };

  return (
    <button
      onClick={openCommandPalette}
      className="hidden md:flex items-center gap-3 pl-3 pr-16 py-1.5 h-9 bg-muted/30 hover:bg-muted/60 border border-transparent hover:border-border rounded-lg text-muted-foreground transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent group"
      aria-label="Search equipment"
    >
      <Search size={15} className="text-muted-foreground group-hover:text-foreground transition-colors" />
      <span className="text-[13px] font-medium group-hover:text-foreground transition-colors">Search equipment...</span>
    </button>
  );
};

export default SearchTrigger;
