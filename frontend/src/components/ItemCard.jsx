import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditItemModal from './EditItemModal';
import BorrowModal from './BorrowModal';

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
        label: 'Available',
        bgColor: 'var(--status-available-bg)',
        borderColor: 'var(--status-available-border)',
        color: 'var(--status-available-text)'
      };
    case 'Requested':
      return {
        label: 'Requested',
        bgColor: 'var(--status-requested-bg)',
        borderColor: 'var(--status-requested-border)',
        color: 'var(--status-requested-text)'
      };
    case 'Borrowed':
      return {
        label: 'Borrowed',
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
  const [imageLoaded, setImageLoaded] = useState(false);

  const displayItem = editedItem || item;

  const isOwner = user && displayItem.ownerId && (
    displayItem.ownerId._id === user._id || displayItem.ownerId === user._id
  );

  const statusConfig = getStatusConfig(displayItem.status);



  return (
    <div
      className="flex flex-col h-full bg-white/40 backdrop-blur-md border border-white/60 shadow-xl rounded-xl overflow-hidden text-[#485550]"
      style={{
        position: 'relative'
      }}
    >
      <div className="flex-grow p-4 flex flex-col">
        {/* Thumbnail Image */}
        <div style={{
          width: '100%',
          height: '210px',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          marginBottom: '18px',
          border: '1px solid var(--border-subtle)',
          background: 'rgba(255, 255, 255, 0.5)',
          padding: '12px'
        }}>
          <img
            src={displayItem.imageUrl}
            alt={displayItem.title}
            onLoad={() => setImageLoaded(true)}
            style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'opacity 0.5s ease-in-out', opacity: imageLoaded ? 1 : 0 }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
              setImageLoaded(true);
            }}
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

        {/* Title & Status Badge */}
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

        <p
          className="text-sm text-[#485550]/80 mt-2 line-clamp-3 overflow-hidden text-ellipsis"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
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
            marginTop: '12px'
          }}>
            {error}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-auto pt-4 border-t border-[#485550]/10 p-4">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.86rem',
          color: 'var(--text-secondary)',
          marginBottom: '16px'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <strong style={{ color: 'var(--text-main)' }}>{displayItem.ownerId?.name || 'Campus Student'}</strong>
          </span>
          <span style={{ color: statusConfig.color, fontWeight: 600 }}>
            {displayItem.status || 'Available'}
          </span>
        </div>

        {isOwner ? (
          <div style={{
            width: '100%',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-input)',
            borderRadius: '12px',
            color: 'var(--text-main)',
            fontWeight: 600,
            fontSize: '0.92rem',
            border: '1px dashed var(--border-strong)',
            gap: '12px'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              You own this item
            </span>
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              style={{
                background: 'transparent',
                border: '2px solid #485550',
                color: '#485550',
                padding: '6px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              className="hover:bg-[#485550] hover:text-[#F4F6F0]"
            >
              Edit
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            disabled={loading}
            className="bg-[#C0EB6A] text-[#485550] font-bold shadow-md hover:bg-[#aade49] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 rounded-xl"
            style={{ width: '100%', padding: '14px' }}
          >
            {loading ? 'Requesting...' : 'Request to Borrow'}
          </button>
        )}
      </div>

      {/* Borrow Request Modal */}
      {showModal && (
        <BorrowModal
          item={item}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            if (onStatusChange) {
              onStatusChange({ ...item, status: 'Requested' });
            }
          }}
        />
      )}

      {/* Edit Item Modal */}
      {showEditModal && (
        <EditItemModal
          item={displayItem}
          user={user}
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
