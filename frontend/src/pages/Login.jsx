import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('https://borrowhub-backend-9hji.onrender.com/api/users/login', {
        email,
        password,
      });

      // Store the real user data and JWT token
      login(response.data);
      localStorage.setItem('token', response.data.token);

      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="container" style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 76px)' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '40px', position: 'relative' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div className="badge badge-butter" style={{ marginBottom: '12px' }}>
            🔐 Campus Sign In
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
            Sign in with your college account to borrow and share inventory.
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#FF8A8A', padding: '14px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '20px', textAlign: 'center' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
              College Email *
            </label>
            <input 
              type="email" 
              placeholder="student@college.edu"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="glass-input"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Password *
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="glass-input"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="glass-button btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '1.05rem', marginTop: '10px' }}
          >
            {loading ? 'Signing In...' : 'Sign In 🚀'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--accent-main)', textDecoration: 'none', fontWeight: 700 }}>
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
