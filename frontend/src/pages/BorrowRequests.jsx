import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const getStatusBadge = (status) => {
  switch (status) {
    case 'Approved': return 'badge-butter';
    case 'Rejected': return 'badge-green';
    case 'Returned': return 'badge-butter';
    default: return 'badge-butter';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const BorrowRequests = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' or 'myRequests'
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    if (!user && !localStorage.getItem('userInfo')) {
      navigate('/login');
      return;
    }
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const token = user?.token || storedUser?.token;

      if (!token) {
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get('https://borrowhub-backend-9hji.onrender.com/api/requests', config);
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch borrow requests.');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      setActionLoadingId(requestId);
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const token = user?.token || storedUser?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      await axios.put(`https://borrowhub-backend-9hji.onrender.com/api/requests/${requestId}`, { status: newStatus }, config);

      setRequests((prev) =>
        prev.map((req) => (req._id === requestId ? { ...req, status: newStatus } : req))
      );
      setActionLoadingId(null);
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${newStatus.toLowerCase()} request.`);
      setActionLoadingId(null);
    }
  };

  if (!user && !localStorage.getItem('userInfo')) {
    return null;
  }

  const currentUserId = user?._id || JSON.parse(localStorage.getItem('userInfo') || '{}')?._id;

  const incomingRequests = requests.filter((req) => {
    const lenderId = req.lenderId?._id || req.lenderId;
    return String(lenderId) === String(currentUserId);
  });

  const myRequests = requests.filter((req) => {
    const borrowerId = req.borrowerId?._id || req.borrowerId;
    return String(borrowerId) === String(currentUserId);
  });

  const displayedRequests = activeTab === 'incoming' ? incomingRequests : myRequests;

  return (
    <div className="container" style={{ padding: '40px 20px 90px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div className="badge badge-butter" style={{ marginBottom: '12px' }}>
          📊 Student Management Portal
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
          Lending & Borrowing Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '6px' }}>
          Manage your incoming equipment requests and track items you've borrowed from peers.
        </p>
      </div>

      {error && (
        <div className="glass-panel" style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#FF8A8A', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '30px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('incoming')}
          className="glass-button"
          style={{
            padding: '12px 24px',
            borderRadius: '14px',
            background: activeTab === 'incoming' 
              ? 'var(--accent-main)' 
              : 'var(--bg-input)',
            color: activeTab === 'incoming' ? 'var(--accent-text)' : 'var(--text-secondary)',
            border: activeTab === 'incoming' ? '1px solid var(--accent-main)' : '1px solid var(--border-subtle)',
            fontWeight: activeTab === 'incoming' ? 700 : 500,
            boxShadow: activeTab === 'incoming' ? 'var(--shadow-glow)' : 'none'
          }}
        >
          📥 Incoming Requests ({incomingRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('myRequests')}
          className="glass-button"
          style={{
            padding: '12px 24px',
            borderRadius: '14px',
            background: activeTab === 'myRequests' 
              ? 'var(--accent-main)' 
              : 'var(--bg-input)',
            color: activeTab === 'myRequests' ? 'var(--accent-text)' : 'var(--text-secondary)',
            border: activeTab === 'myRequests' ? '1px solid var(--accent-main)' : '1px solid var(--border-subtle)',
            fontWeight: activeTab === 'myRequests' ? 700 : 500,
            boxShadow: activeTab === 'myRequests' ? 'var(--shadow-glow)' : 'none'
          }}
        >
          📤 My Borrow Requests ({myRequests.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          ⏳ Loading dashboard records...
        </div>
      ) : displayedRequests.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '500px', margin: '40px auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '14px' }}>📭</div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'var(--text-main)' }}>No records found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
            {activeTab === 'incoming'
              ? 'Nobody has requested to borrow your listed items yet. Make sure you have active listings on the campus feed!'
              : 'You haven\'t requested to borrow any items yet. Explore the campus inventory feed to find what you need!'}
          </p>
          <Link to="/" className="glass-button btn-primary" style={{ textDecoration: 'none' }}>
            Explore Campus Feed
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {displayedRequests.map((req) => {
            const item = req.itemId || {};
            const otherUser = activeTab === 'incoming' ? req.borrowerId : req.lenderId;
            const isPending = req.status === 'Pending';
            const isProcessing = actionLoadingId === req._id;

            return (
              <div 
                key={req._id} 
                className="glass-panel animate-fade-in"
                style={{ 
                  padding: '24px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  gap: '18px',
                  borderLeft: `4px solid ${req.status === 'Approved' ? '#FFEFB3' : req.status === 'Rejected' ? '#013E37' : 'var(--border-strong)'}`
                }}
              >
                <div>
                  {/* Item header with thumbnail */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
                    <img 
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'} 
                      alt={item.title || 'Item'} 
                      style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'; }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className={`badge ${getStatusBadge(req.status)}`} style={{ marginBottom: '4px' }}>
                        ● {req.status}
                      </span>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title || 'Deleted Item'}
                      </h4>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{activeTab === 'incoming' ? 'Requested By:' : 'Owner (Lender):'}</span>
                      <strong style={{ color: 'var(--text-main)' }}>{otherUser?.name || 'Campus Student'} ({otherUser?.email || 'N/A'})</strong>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Borrow Duration:</span>
                      <span style={{ color: 'var(--accent-main)', fontWeight: 600 }}>{formatDate(req.startDate)} ➔ {formatDate(req.endDate)}</span>
                    </div>

                    {req.message && (
                      <div style={{ marginTop: '8px', background: 'var(--bg-input)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Message:</span>
                        <p style={{ fontStyle: 'italic', color: 'var(--text-main)' }}>"{req.message}"</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions for Incoming Requests */}
                {activeTab === 'incoming' && (
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', gap: '10px' }}>
                    {isPending ? (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(req._id, 'Approved')}
                          disabled={isProcessing}
                          className="glass-button btn-success"
                          style={{ flex: 1, padding: '10px' }}
                        >
                          {isProcessing ? '...' : '✓ Approve'}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(req._id, 'Rejected')}
                          disabled={isProcessing}
                          className="glass-button btn-danger"
                          style={{ flex: 1, padding: '10px' }}
                        >
                          {isProcessing ? '...' : '✕ Reject'}
                        </button>
                      </>
                    ) : (
                      <div style={{ width: '100%', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)', padding: '6px 0' }}>
                        Status set to <strong style={{ color: 'var(--accent-main)' }}>{req.status}</strong>
                        {req.status === 'Approved' && (
                          <button
                            onClick={() => handleStatusUpdate(req._id, 'Returned')}
                            className="glass-button btn-secondary"
                            style={{ display: 'block', width: '100%', marginTop: '8px', padding: '6px' }}
                          >
                            Mark as Returned
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions for My Requests */}
                {activeTab === 'myRequests' && (
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {req.status === 'Pending' && '⏳ Waiting for owner approval...'}
                      {req.status === 'Approved' && '🎉 Approved! Coordinate with the owner for pickup.'}
                      {req.status === 'Rejected' && '❌ Request declined by owner.'}
                      {req.status === 'Returned' && '📦 Item returned. Thank you for sharing!'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default BorrowRequests;
