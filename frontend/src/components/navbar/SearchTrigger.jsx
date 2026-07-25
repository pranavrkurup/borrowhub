import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

const SearchTrigger = () => {
  const [modifierKey, setModifierKey] = useState('Ctrl');

  useEffect(() => {
    const platform = window.navigator?.userAgent?.toLowerCase() || '';
    if (platform.includes('mac')) {
      setModifierKey('⌘');
    }
  }, []);

  const openCommandPalette = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }));
  };

  return (
    <button
      onClick={openCommandPalette}
      className="hidden md:flex items-center gap-3 px-3 py-1.5 h-9 bg-muted/30 hover:bg-muted/60 border border-transparent hover:border-border rounded-lg text-muted-foreground transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-transparent group"
      aria-label="Search equipment"
    >
      <Search size={15} className="text-muted-foreground group-hover:text-foreground transition-colors" />
      <span className="text-[13px] font-medium mr-12 group-hover:text-foreground transition-colors">Search equipment...</span>
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-background/50 border border-border px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-sm">
        <span className="text-xs">{modifierKey}</span>K
      </kbd>
    </button>
  );
};

export default SearchTrigger;
