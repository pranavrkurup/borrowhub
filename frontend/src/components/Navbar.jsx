import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('borrowhub-theme') || 'green';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('borrowhub-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'green' ? 'butter' : 'green'));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="glass-navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '76px' }}>
        
        {/* Brand Logo with Butter & Green Palette */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'var(--accent-main)',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.35rem',
            color: 'var(--accent-text)',
            boxShadow: 'var(--shadow-glow)'
          }}>
            B
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text-main)', lineHeight: 1 }}>
              Borrow<span style={{ color: 'var(--text-muted)' }}>Hub</span>
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '2px' }}>
              {theme === 'green' ? 'Green #013E37' : 'Butter #FFEFB3'}
            </span>
          </div>
        </Link>

        {/* Navigation Links & Theme Toggle */}
        <nav style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Butter & Green Palette Mode Switcher */}
          <button
            onClick={toggleTheme}
            className="glass-button btn-secondary"
            title="Switch between Green (#013E37) and Butter (#FFEFB3) theme"
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {theme === 'green' ? (
              <>
                <span>🧈</span>
                <span>Switch to Butter</span>
              </>
            ) : (
              <>
                <span>🌲</span>
                <span>Switch to Green</span>
              </>
            )}
          </button>

          <Link 
            to="/" 
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive('/') ? 'var(--accent-main)' : 'var(--text-muted)',
              background: isActive('/') ? 'var(--bg-input-focus)' : 'transparent',
              border: isActive('/') ? '1px solid var(--border-strong)' : '1px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            Feed
          </Link>

          {user ? (
            <>
              <Link 
                to="/add-item" 
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: isActive('/add-item') ? 'var(--accent-main)' : 'var(--text-muted)',
                  background: isActive('/add-item') ? 'var(--bg-input-focus)' : 'transparent',
                  border: isActive('/add-item') ? '1px solid var(--border-strong)' : '1px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                + List Item
              </Link>

              <Link 
                to="/dashboard" 
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: isActive('/dashboard') ? 'var(--accent-main)' : 'var(--text-muted)',
                  background: isActive('/dashboard') ? 'var(--bg-input-focus)' : 'transparent',
                  border: isActive('/dashboard') ? '1px solid var(--border-strong)' : '1px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                Dashboard
              </Link>

              <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)', margin: '0 8px' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Hi, <strong style={{ color: 'var(--text-main)' }}>{user.name ? user.name.split(' ')[0] : 'Student'}</strong>
                </span>
                <button 
                  onClick={handleLogout}
                  className="glass-button btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: isActive('/login') ? 'var(--text-main)' : 'var(--text-muted)',
                  transition: 'all 0.2s'
                }}
              >
                Login
              </Link>

              <Link 
                to="/register" 
                className="glass-button btn-primary"
                style={{ padding: '8px 18px', textDecoration: 'none', fontSize: '0.9rem' }}
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
