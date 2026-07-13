import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const BorrowModal = ({ item, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);

  // Fetch booked date ranges when the modal opens
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const { data } = await axios.get(
          `https://borrowhub-backend-9hji.onrender.com/api/items/${item._id}/booked-dates`
        );
        setBookedDates(data);
      } catch (err) {
        console.error('Failed to fetch booked dates:', err);
      }
    };

    if (item?._id) {
      fetchBookedDates();
    }
  }, [item._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

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

    // Client-side date-overlap validation
    const userStart = new Date(startDate);
    const userEnd = new Date(endDate);

    for (const booking of bookedDates) {
      const bookedStart = new Date(booking.startDate);
      const bookedEnd = new Date(booking.endDate);

      if (userStart <= bookedEnd && userEnd >= bookedStart) {
        const fmtStart = bookedStart.toLocaleDateString();
        const fmtEnd = bookedEnd.toLocaleDateString();
        setError(`Dates unavailable. The item is booked from ${fmtStart} to ${fmtEnd}.`);
        return;
      }
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
        'https://borrowhub-backend-9hji.onrender.com/api/requests',
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
      background: 'rgba(0, 0, 0, 0.55)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
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
          border: '1px solid var(--border-strong)',
          boxShadow: 'var(--shadow-main)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-main)',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
        >
          ✕
        </button>

        <div className="badge badge-butter" style={{ marginBottom: '10px' }}>
          🤝 Peer Lending Request
        </div>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>
          Request to Borrow
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '22px' }}>
          You are requesting <strong style={{ color: 'var(--accent-main)' }}>{item.title}</strong>
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#FF8A8A',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            marginBottom: '18px'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="w-full">
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Item Needed Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border-2 border-[#013E37] rounded-lg px-3 py-2 text-[#013E37] outline-none"
              />
            </div>

            <div className="w-full">
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Expected Return Date *
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white border-2 border-[#013E37] rounded-lg px-3 py-2 text-[#013E37] outline-none"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              Message to Owner (Optional)
            </label>
            <textarea
              rows="3"
              maxLength="200"
              placeholder="E.g., Hey, I have a lab on Tuesday, could I grab this in the morning?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white border-2 border-[#013E37] rounded-lg px-3 py-2 text-[#013E37] outline-none mb-4"
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

