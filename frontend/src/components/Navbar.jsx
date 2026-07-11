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
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-[#FFEFB3]">
      {/* Logo Left */}
      <Link to="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-10 h-10 bg-[#013E37] rounded-xl flex items-center justify-center text-[#FFEFB3] font-extrabold text-xl shadow-md">
          B
        </div>
        <span className="text-xl font-extrabold tracking-tight text-[#013E37]">
          BorrowHub
        </span>
      </Link>

      {/* Links Right */}
      <div className="flex items-center gap-6 font-semibold text-[#013E37]">
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
                className="bg-[#013E37] text-[#FFEFB3] px-6 py-2 rounded-full font-bold hover:bg-[#02594F] transition-colors"
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
              className="bg-[#013E37] text-[#FFEFB3] px-6 py-2 rounded-full font-bold ml-4 hover:bg-[#02594F] transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
