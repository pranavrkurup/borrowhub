import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const BorrowModal = ({ item, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Grab token from AuthContext or fallback to localStorage
    const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const token = user?.token || storedUser?.token;

    if (!token) {
      setError('You must be logged in to make a borrow request.');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError('End date must be after the start date.');
      return;
    }

    setLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      await axios.post(
        'http://localhost:5000/api/requests',
        {
          itemId: item._id,
          startDate,
          endDate,
          message,
        },
        config
      );

      setLoading(false);
      onSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to submit borrow request.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 9, 19, 0.82)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '20px'
    }}>
      <div 
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '32px',
          position: 'relative',
          border: '1px solid rgba(0, 240, 255, 0.35)',
          boxShadow: '0 0 40px rgba(0, 240, 255, 0.2)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
        >
          ✕
        </button>

        <div className="badge badge-cyan" style={{ marginBottom: '10px' }}>
          🤝 Peer Lending Request
        </div>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '6px', color: '#fff' }}>
          Request to Borrow
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '22px' }}>
          You are requesting <strong style={{ color: 'var(--accent-cyan)' }}>{item.title}</strong>
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            marginBottom: '18px'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Start Date <span style={{ color: 'var(--accent-pink)' }}>*</span>
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="glass-input"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              End Date (Expected Return) <span style={{ color: 'var(--accent-pink)' }}>*</span>
            </label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="glass-input"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Message to Owner (Optional)
            </label>
            <textarea
              rows="3"
              maxLength="200"
              placeholder="Why do you need this equipment? Where & when would you like to pick it up?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="glass-input"
              style={{ resize: 'none', fontFamily: 'Outfit, sans-serif' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textAlign: 'right', marginTop: '4px' }}>
              {message.length}/200 characters
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              className="glass-button btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="glass-button btn-primary"
              style={{ flex: 1.5 }}
            >
              {loading ? 'Sending Request...' : 'Send Request 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowModal;
