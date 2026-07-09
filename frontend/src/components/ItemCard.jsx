import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const getBadgeClass = (category) => {
  switch (category) {
    case 'Electronics': return 'badge-cyan';
    case 'Books': return 'badge-purple';
    case 'Lab Equipment': return 'badge-pink';
    case 'Sports': return 'badge-emerald';
    default: return 'badge-amber';
  }
};

const getConditionBadgeClass = (condition) => {
  switch (condition) {
    case 'Like New': return 'badge-emerald';
    case 'Good': return 'badge-cyan';
    default: return 'badge-amber';
  }
};

const getStatusConfig = (status) => {
  switch (status) {
    case 'Available':
      return {
        badgeClass: 'badge-emerald',
        label: '● Available',
        color: '#34d399',
        bgColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: 'rgba(16, 185, 129, 0.35)'
      };
    case 'Requested':
      return {
        badgeClass: 'badge-amber',
        label: '⏳ Requested',
        color: '#fbbf24',
        bgColor: 'rgba(245, 158, 11, 0.18)',
        borderColor: 'rgba(245, 158, 11, 0.35)'
      };
    case 'Borrowed':
      return {
        badgeClass: 'badge-red',
        label: '🔒 Borrowed',
        color: '#f87171',
        bgColor: 'rgba(239, 68, 68, 0.15)',
        borderColor: 'rgba(239, 68, 68, 0.35)'
      };
    default:
      return {
        badgeClass: 'badge-cyan',
        label: status || 'Available',
        color: '#00f0ff',
        bgColor: 'rgba(0, 240, 255, 0.15)',
        borderColor: 'rgba(0, 240, 255, 0.35)'
      };
  }
};

const ItemCard = ({ item, user, onStatusChange }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isOwner = user && item.ownerId && (
    item.ownerId._id === user._id || item.ownerId === user._id
  );

  const statusConfig = getStatusConfig(item.status);

  const handleRequestBorrow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const token = user?.token || storedUser?.token;

      if (!token) {
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const res = await axios.put(
        `https://borrowhub-backend-9hji.onrender.com/api/items/${item._id}/request`,
        {},
        config
      );

      setLoading(false);
      if (onStatusChange) {
        onStatusChange(res.data);
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to request item');
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        padding: '22px',
        position: 'relative'
      }}
    >
      <div>
        {/* Thumbnail Image */}
        <div style={{
          width: '100%',
          height: '210px',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          marginBottom: '18px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(0,0,0,0.3)'
        }}>
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'; }}
          />
          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
            <span className={`badge ${getBadgeClass(item.category)}`}>
              {item.category}
            </span>
          </div>
          <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
            <span className={`badge ${getConditionBadgeClass(item.condition)}`} style={{ background: 'rgba(11, 15, 25, 0.85)', backdropFilter: 'blur(4px)' }}>
              {item.condition}
            </span>
          </div>
        </div>

        {/* Title, Status Badge & Description */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
            {item.title}
          </h3>
          {/* Status Badge */}
          <span
            style={{
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              background: statusConfig.bgColor,
              color: statusConfig.color,
              border: `1px solid ${statusConfig.borderColor}`,
              boxShadow: `0 0 12px ${statusConfig.bgColor}`
            }}
          >
            {statusConfig.label}
          </span>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.description}
        </p>

        {error && (
          <div style={{
            color: '#f87171',
            fontSize: '0.82rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '8px 12px',
            borderRadius: '8px',
            marginBottom: '12px'
          }}>
            {error}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.85rem',
          color: '#cbd5e1',
          marginBottom: '16px'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            👤 <strong style={{ color: '#fff' }}>{item.ownerId?.name || 'Campus Student'}</strong>
          </span>
          <span style={{ color: statusConfig.color, fontWeight: 600 }}>
            {item.status || 'Available'}
          </span>
        </div>

        {isOwner ? (
          <div style={{
            width: '100%',
            padding: '12px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            color: 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.9rem',
            border: '1px dashed rgba(255, 255, 255, 0.2)'
          }}>
            ✨ You own this item
          </div>
        ) : item.status === 'Available' ? (
          <button
            onClick={handleRequestBorrow}
            disabled={loading}
            className="glass-button btn-primary"
            style={{ width: '100%', padding: '14px' }}
          >
            {loading ? '⏳ Requesting...' : '📦 Request to Borrow'}
          </button>
        ) : item.status === 'Requested' ? (
          <button
            disabled
            className="glass-button"
            style={{
              width: '100%',
              padding: '14px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              color: '#fbbf24',
              opacity: 0.85,
              cursor: 'not-allowed'
            }}
          >
            ⏳ Requested
          </button>
        ) : (
          <button
            disabled
            className="glass-button btn-secondary"
            style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }}
          >
            Currently Borrowed
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
