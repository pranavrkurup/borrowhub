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
    <header className="glass-navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '76px' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.3rem',
            color: '#070913',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)'
          }}>
            B
          </div>
          <span style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#fff' }}>
            Borrow<span style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-pink))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hub</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link 
            to="/" 
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive('/') ? 'var(--accent-cyan)' : 'var(--text-muted)',
              background: isActive('/') ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
              border: isActive('/') ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid transparent',
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
                  color: isActive('/add-item') ? 'var(--accent-pink)' : 'var(--text-muted)',
                  background: isActive('/add-item') ? 'rgba(255, 0, 127, 0.12)' : 'transparent',
                  border: isActive('/add-item') ? '1px solid rgba(255, 0, 127, 0.3)' : '1px solid transparent',
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
                  color: isActive('/dashboard') ? 'var(--accent-purple)' : 'var(--text-muted)',
                  background: isActive('/dashboard') ? 'rgba(138, 43, 226, 0.15)' : 'transparent',
                  border: isActive('/dashboard') ? '1px solid rgba(138, 43, 226, 0.3)' : '1px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                Dashboard
              </Link>

              <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.15)', margin: '0 8px' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 500 }}>
                  Hi, <strong style={{ color: '#fff' }}>{user.name ? user.name.split(' ')[0] : 'Student'}</strong>
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
                  color: isActive('/login') ? '#fff' : 'var(--text-muted)',
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
