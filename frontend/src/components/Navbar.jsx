import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = "font-bold text-[#013E37] hover:bg-[#013E37]/10 px-3 py-2 rounded-lg transition-colors";

  return (
    <header className="w-full flex items-center justify-between px-4 py-4 md:px-8 bg-[#FFEFB3] border-b-2 border-[#013E37]/10 sticky top-0 z-50">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2.5 no-underline shrink-0">
        <div className="w-10 h-10 bg-[#013E37] rounded-xl flex items-center justify-center text-[#FFEFB3] font-extrabold text-xl shadow-md">
          B
        </div>
        <span className="text-xl font-extrabold tracking-tight text-[#013E37] leading-none">
          BorrowHub
        </span>
      </Link>

      {/* Navigation Links */}
      <nav className="flex items-center gap-2 md:gap-6">
        <Link to="/" className={linkClass}>
          Feed
        </Link>

        {user ? (
          <>
            <Link to="/add-item" className={linkClass}>
              + List Item
            </Link>

            <Link to="/dashboard" className={linkClass}>
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="bg-[#013E37] text-[#FFEFB3] px-5 py-2 rounded-full font-bold transition-transform hover:scale-105"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={linkClass}>
              Login
            </Link>

            <Link
              to="/register"
              className="bg-[#013E37] text-[#FFEFB3] px-5 py-2 rounded-full font-bold transition-transform hover:scale-105"
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
