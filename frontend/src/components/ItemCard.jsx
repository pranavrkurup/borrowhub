import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditItemModal from './EditItemModal';

const getBadgeClass = (category) => {
  switch (category) {
    case 'Electronics': return 'badge-butter';
    case 'Books': return 'badge-green';
    case 'Lab Equipment': return 'badge-butter';
    case 'Sports': return 'badge-green';
    default: return 'badge-butter';
  }
};

const getConditionBadgeClass = (condition) => {
  switch (condition) {
    case 'Like New': return 'badge-butter';
    case 'Good': return 'badge-green';
    default: return 'badge-butter';
  }
};

const getStatusConfig = (status) => {
  switch (status) {
    case 'Available':
      return {
        label: '● Available',
        bgColor: 'var(--status-available-bg)',
        borderColor: 'var(--status-available-border)',
        color: 'var(--status-available-text)'
      };
    case 'Requested':
      return {
        label: '⏳ Requested',
        bgColor: 'var(--status-requested-bg)',
        borderColor: 'var(--status-requested-border)',
        color: 'var(--status-requested-text)'
      };
    case 'Borrowed':
      return {
        label: '🔒 Borrowed',
        bgColor: 'var(--status-borrowed-bg)',
        borderColor: 'var(--status-borrowed-border)',
        color: 'var(--status-borrowed-text)'
      };
    default:
      return {
        label: status || 'Available',
        bgColor: 'var(--status-available-bg)',
        borderColor: 'var(--status-available-border)',
        color: 'var(--status-available-text)'
      };
  }
};

const ItemCard = ({ item, user, onStatusChange }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');

  const displayItem = editedItem || item;

  const isOwner = user && displayItem.ownerId && (
    displayItem.ownerId._id === user._id || displayItem.ownerId === user._id
  );

  const statusConfig = getStatusConfig(displayItem.status);

  const handleConfirmRequest = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

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

      await axios.post(
        'https://borrowhub-backend-9hji.onrender.com/api/requests',
        {
          itemId: item._id,
          lenderId: item.ownerId,
          startDate,
          endDate,
          message,
        },
        config
      );

      try {
        await axios.put(
          `https://borrowhub-backend-9hji.onrender.com/api/items/${item._id}/request`,
          {},
          config
        );
      } catch {
        // Proceed even if PUT fails
      }

      setLoading(false);
      setShowModal(false);
      setStartDate('');
      setEndDate('');
      setMessage('');

      if (onStatusChange) {
        onStatusChange({ ...item, status: 'Requested' });
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to submit borrow request');
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
          border: '1px solid var(--border-subtle)',
          background: 'var(--bg-input)'
        }}>
          <img
            src={displayItem.imageUrl}
            alt={displayItem.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'; }}
          />
          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
            <span className={`badge ${getBadgeClass(displayItem.category)}`}>
              {displayItem.category}
            </span>
          </div>
          <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
            <span className={`badge ${getConditionBadgeClass(displayItem.condition)}`}>
              {displayItem.condition}
            </span>
          </div>
        </div>

        {/* Title, Status Badge & Description */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
            {displayItem.title}
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
              border: `1px solid ${statusConfig.borderColor}`
            }}
          >
            {statusConfig.label}
          </span>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.55, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {displayItem.description}
        </p>

        {error && (
          <div style={{
            color: '#FF8A8A',
            fontSize: '0.82rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
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
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.86rem',
          color: 'var(--text-secondary)',
          marginBottom: '16px'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            👤 <strong style={{ color: 'var(--text-main)' }}>{displayItem.ownerId?.name || 'Campus Student'}</strong>
          </span>
          <span style={{ color: statusConfig.color, fontWeight: 600 }}>
            {displayItem.status || 'Available'}
          </span>
        </div>

        {isOwner ? (
          <div style={{
            width: '100%',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-input)',
            borderRadius: '12px',
            color: 'var(--text-main)',
            fontWeight: 600,
            fontSize: '0.9rem',
            border: '1px dashed var(--border-strong)'
          }}>
            <span>✨ You own this item</span>
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="bg-transparent border-2 border-[#013E37] text-[#013E37] px-4 py-1.5 rounded-lg font-bold hover:bg-[#013E37] hover:text-[#FFEFB3] transition-colors ml-2"
            >
              Edit
            </button>
          </div>
        ) : displayItem.status === 'Available' ? (
          <button
            onClick={() => setShowModal(true)}
            disabled={loading}
            className="glass-button btn-primary"
            style={{ width: '100%', padding: '14px' }}
          >
            {loading ? '⏳ Requesting...' : '📦 Request to Borrow'}
          </button>
        ) : displayItem.status === 'Requested' ? (
          <button
            disabled
            className="glass-button"
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--status-requested-bg)',
              border: '1px solid var(--status-requested-border)',
              color: 'var(--status-requested-text)',
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

      {/* Borrow Request Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#FFEFB3] border-4 border-[#013E37] rounded-xl p-6 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-[#013E37] mb-4">
              Request to Borrow: {item.title}
            </h3>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="w-full">
                <label className="block text-sm font-bold text-[#013E37] mb-1">
                  Item Needed Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white border-2 border-[#013E37] rounded-lg px-3 py-2 text-[#013E37] outline-none"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-bold text-[#013E37] mb-1">
                  Expected Return Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-white border-2 border-[#013E37] rounded-lg px-3 py-2 text-[#013E37] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#013E37] mb-1">
                Message
              </label>
              <textarea
                rows="3"
                placeholder="E.g., Hey, I have a lab on Tuesday, could I grab this in the morning?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white border-2 border-[#013E37] rounded-lg px-3 py-2 text-[#013E37] outline-none mb-4"
              />
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border-2 border-[#013E37] text-[#013E37] font-bold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRequest}
                disabled={loading}
                className="bg-[#013E37] text-[#FFEFB3] font-bold px-4 py-2 rounded-lg"
              >
                {loading ? 'Submitting...' : 'Confirm Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && (
        <EditItemModal
          item={displayItem}
          onClose={() => setShowEditModal(false)}
          onSuccess={(updatedItem) => {
            setEditedItem(updatedItem);
            setShowEditModal(false);
            if (onStatusChange) {
              onStatusChange(updatedItem);
            }
          }}
        />
      )}
    </div>
  );
};

export default ItemCard;
