import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from './ui/button';
import { Package, LayoutDashboard, LogOut, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass-navbar border-b border-border">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo Left */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10">
            <img src="/logo.png" alt="BorrowHub Logo" className="w-full h-full object-contain drop-shadow-sm" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[17px] font-semibold text-foreground tracking-wide">
              BorrowHub
            </span>
            <span className="text-[17px] text-muted-foreground font-light">
              |
            </span>
            <span className="text-[15px] text-muted-foreground font-medium">
              Campus Inventory
            </span>
          </div>
        </Link>

        {/* Links Right */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:flex text-muted-foreground gap-2" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'k', 'metaKey': true}))}>
            <Search size={16} />
            <span className="text-sm">Search</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-2">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          
          <Button variant="ghost" asChild>
            <Link to="/feed">Feed</Link>
          </Button>

          {user ? (
            <>
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link to="/add-item">List Item</Link>
              </Button>

              <div className="h-4 w-px bg-border mx-2 hidden sm:block"></div>

              <Button variant="ghost" asChild className="gap-2">
                <Link to="/dashboard">
                  <LayoutDashboard size={16} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
