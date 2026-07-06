import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
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
      const response = await axios.post('https://borrowhub-backend-9hji.onrender.com/api/users/register', {
        name,
        email,
        password,
      });

      login(response.data);
      setLoading(false);
      navigate('/');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Something went wrong during registration');
    }
  };

  return (
    <div className="container" style={{ padding: '50px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 76px)' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '460px', padding: '40px', position: 'relative' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div className="badge badge-purple" style={{ marginBottom: '12px' }}>
            ✨ Join Campus Network
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>Create an Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
            Start sharing and borrowing lab tools, books, and devices.
          </p>
        </div>
        
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '14px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '20px', textAlign: 'center' }}>
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#cbd5e1' }}>
              Full Name <span style={{ color: 'var(--accent-pink)' }}>*</span>
            </label>
            <input 
              type="text" 
              placeholder="Alex Johnson"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="glass-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#cbd5e1' }}>
              College Email <span style={{ color: 'var(--accent-pink)' }}>*</span>
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
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#cbd5e1' }}>
              Password <span style={{ color: 'var(--accent-pink)' }}>*</span>
            </label>
            <input 
              type="password" 
              placeholder="•••••••• (Min 6 characters)"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength={6}
              className="glass-input"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="glass-button btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '1.05rem', marginTop: '10px' }}
          >
            {loading ? 'Creating Account...' : 'Sign Up Now 🎉'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: 700 }}>
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
