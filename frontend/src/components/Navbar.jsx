import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `whitespace-nowrap px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
      isActive(path)
        ? 'text-[#013E37] bg-[#013E37]/10 border border-[#013E37]/30'
        : 'text-[#013E37]/60 border border-transparent hover:text-[#013E37] hover:bg-[#013E37]/5'
    }`;

  return (
    <header className="w-full bg-[#FFEFB3]/90 backdrop-blur-md border-b border-[#013E37]/15 sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0">
          <div className="w-10 h-10 bg-[#013E37] rounded-xl flex items-center justify-center text-[#FFEFB3] font-extrabold text-xl shadow-md">
            B
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#013E37] leading-none">
            Borrow<span className="text-[#013E37]/50">Hub</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1.5 md:gap-2.5 overflow-x-auto no-scrollbar">

          <Link to="/" className={linkClass('/')}>
            Feed
          </Link>

          {user ? (
            <>
              <Link to="/add-item" className={linkClass('/add-item')}>
                + List Item
              </Link>

              <Link to="/dashboard" className={linkClass('/dashboard')}>
                Dashboard
              </Link>

              {/* Divider — hidden on small screens */}
              <div className="hidden md:block w-px h-6 bg-[#013E37]/20 mx-1" />

              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline text-sm text-[#013E37]/60 font-medium">
                  Hi, <strong className="text-[#013E37]">{user.name ? user.name.split(' ')[0] : 'Student'}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="whitespace-nowrap px-3 py-2 rounded-lg text-sm font-semibold text-[#013E37]/60 border border-[#013E37]/20 hover:bg-[#013E37]/10 hover:text-[#013E37] transition-all"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass('/login')}>
                Login
              </Link>

              <Link
                to="/register"
                className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold bg-[#013E37] text-[#FFEFB3] hover:bg-[#02594F] transition-all shrink-0"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
