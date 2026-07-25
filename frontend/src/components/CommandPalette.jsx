import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Search, Home, LayoutDashboard, PlusCircle, LogIn, Package } from 'lucide-react';

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-all" onClick={() => setOpen(false)}>
      <div 
        className="fixed left-[50%] top-[20%] z-[101] w-full max-w-[600px] translate-x-[-50%] bg-white rounded-xl shadow-2xl overflow-hidden border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="w-full flex flex-col outline-none bg-transparent">
          <div className="flex items-center border-b border-border px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-5 w-5 shrink-0 text-muted-foreground" />
            <Command.Input 
              autoFocus 
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50" 
              placeholder="Type a command or search..." 
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-item]]:flex [&_[cmdk-item]]:cursor-pointer [&_[cmdk-item]]:items-center [&_[cmdk-item]]:gap-2 [&_[cmdk-item]]:rounded-md [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]]:text-sm [&_[cmdk-item]_svg]:h-4 [&_[cmdk-item]_svg]:w-4 [&_[cmdk-item]_svg]:text-muted-foreground [&_[cmdk-item][data-selected='true']]:bg-accent [&_[cmdk-item][data-selected='true']]:text-accent-foreground [&_[cmdk-item][data-selected='true']_svg]:text-accent-foreground">
            <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>
            
            <Command.Group heading="Navigation">
              <Command.Item onSelect={() => runCommand(() => navigate('/'))}>
                <Home />
                <span>Home</span>
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => navigate('/feed'))}>
                <Package />
                <span>Browse Inventory</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Actions">
              <Command.Item onSelect={() => runCommand(() => navigate('/dashboard'))}>
                <LayoutDashboard />
                <span>My Dashboard</span>
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => navigate('/add-item'))}>
                <PlusCircle />
                <span>List an Item</span>
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => navigate('/login'))}>
                <LogIn />
                <span>Sign In</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
};

export default CommandPalette;
