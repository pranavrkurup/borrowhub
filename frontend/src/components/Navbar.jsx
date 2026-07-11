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

  return (
    <header className="w-full bg-[#FFEFB3] border-b border-[#013E37]/10 sticky top-0 z-50 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4 py-3 md:px-8 flex items-center justify-between">
        {/* Brand Logo with BUTTER #FFEEB3 subtext */}
        <Link to="/" className="flex items-center gap-3 no-underline shrink-0">
          <div className="w-11 h-11 bg-[#013E37] rounded-xl flex items-center justify-center text-[#FFEFB3] font-black text-2xl shadow-md">
            B
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-extrabold tracking-tight text-[#013E37] leading-none">
              BorrowHub
            </span>
            <span className="text-[10px] font-bold tracking-widest text-[#013E37]/75 uppercase mt-1">
              BUTTER #FFEEB3
            </span>
          </div>
        </Link>

        {/* Navigation Links matching exact screenshot pills */}
        <nav className="flex items-center gap-3 md:gap-6">
          <Link
            to="/"
            className={`px-5 py-1.5 rounded-full font-bold text-sm transition-all ${
              isActive('/')
                ? 'bg-[#EADE9E]/70 border border-[#013E37]/30 text-[#013E37]'
                : 'text-[#013E37] hover:bg-[#EADE9E]/40'
            }`}
          >
            Feed
          </Link>

          {user ? (
            <>
              <Link
                to="/add-item"
                className="text-[#013E37] font-bold text-sm hover:opacity-80 transition-opacity"
              >
                + List Item
              </Link>

              <Link
                to="/dashboard"
                className="text-[#013E37] font-bold text-sm hover:opacity-80 transition-opacity"
              >
                Dashboard
              </Link>

              <div className="hidden sm:block h-5 w-px bg-[#013E37]/30 mx-1" />

              <span className="hidden sm:inline text-sm font-bold text-[#013E37]">
                Hi, {user.name ? user.name.split(' ')[0] : 'John'}
              </span>

              <button
                onClick={handleLogout}
                className="bg-[#EADE9E]/70 border border-[#013E37]/30 text-[#013E37] px-5 py-1.5 rounded-full font-bold text-sm hover:bg-[#EADE9E] transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[#013E37] font-bold text-sm hover:opacity-80 transition-opacity"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-[#EADE9E]/70 border border-[#013E37]/30 text-[#013E37] px-5 py-1.5 rounded-full font-bold text-sm hover:bg-[#EADE9E] transition-all"
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
