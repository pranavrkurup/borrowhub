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

  return (
    <header className="glass-navbar w-full">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo Left */}
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img src="/logo.jpg" alt="BorrowHub Logo" className="h-10 w-10 object-contain drop-shadow-sm" />
          <span className="text-2xl font-extrabold tracking-tight text-[#485550]">
            BorrowHub
          </span>
        </Link>

        {/* Links Right */}
        <div className="flex items-center gap-6 font-semibold text-[#013E37] text-base">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            Feed
          </Link>

          {user ? (
            <>
              <Link to="/add-item" className="hover:opacity-80 transition-opacity">
                + List Item
              </Link>

              <Link to="/dashboard" className="hover:opacity-80 transition-opacity">
                Dashboard
              </Link>

              <div className="flex items-center gap-3 ml-2 border-l-2 border-[#013E37]/20 pl-4">
                <span className="font-extrabold text-[#013E37]">
                  Hi, {user?.name || user?.username || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-[#013E37] text-[#FFEFB3] px-5 py-2 rounded-full font-bold hover:bg-[#02594F] transition-colors shadow-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:opacity-80 transition-opacity">
                Login
              </Link>

              <Link
                to="/register"
                className="bg-[#013E37] text-[#FFEFB3] px-6 py-2.5 rounded-full font-bold ml-2 hover:bg-[#02594F] transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
