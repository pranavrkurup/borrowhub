import React, { useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import OptimizedImage from '../components/OptimizedImage';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const getStatusVariant = (status) => {
  switch (status) {
    case 'Approved': return 'available';
    case 'Rejected': return 'destructive';
    case 'Returned': return 'secondary';
    default: return 'requested';
  }
};

const BorrowRequests = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('incoming');
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

      const res = await api.get('/api/requests', config);
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch borrow requests.');
      setLoading(false);
    }
  };

  const handleStatusUpdate = useCallback(async (requestId, newStatus) => {
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

      await api.put(`/api/requests/${requestId}`, { status: newStatus }, config);

      setRequests((prev) =>
        prev.map((req) => (req._id === requestId ? { ...req, status: newStatus } : req))
      );
      setActionLoadingId(null);
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${newStatus.toLowerCase()} request.`);
      setActionLoadingId(null);
    }
  }, [user]);

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
    <div 
      className="w-full max-w-6xl mx-auto"
      style={{ 
        paddingLeft: 'var(--space-page-x)', 
        paddingRight: 'var(--space-page-x)',
        paddingTop: 'clamp(1.5rem, 4vw, 2.5rem)',
        paddingBottom: 'var(--space-page-bottom)',
      }}
    >
      
      {/* Header */}
      <div className="mb-6 sm:mb-8 md:mb-9">
        <Badge variant="requested" className="mb-2 sm:mb-3">
          Student Management Portal
        </Badge>
        <h1 className="text-xl sm:text-2xl md:text-[2.5rem] font-extrabold text-primary tracking-tight leading-tight">
          Lending & Borrowing Dashboard
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-1.5">
          Manage your incoming equipment requests and track items you've borrowed from peers.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 text-sm font-semibold border border-red-200">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-3 mb-5 sm:mb-7 border-b border-border pb-3 sm:pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'incoming'
              ? 'bg-accent text-white shadow-sm font-semibold'
              : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-border/40'
          }`}
        >
          Incoming Requests ({incomingRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('myRequests')}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'myRequests'
              ? 'bg-accent text-white shadow-sm font-semibold'
              : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-border/40'
          }`}
        >
          My Borrow Requests ({myRequests.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16 sm:py-20 text-muted-foreground text-sm sm:text-base animate-pulse">
          Loading dashboard records...
        </div>
      ) : displayedRequests.length === 0 ? (
        <Card className="text-center p-8 sm:p-12 md:p-14 max-w-lg mx-auto mt-6 sm:mt-10">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-2 sm:mb-3">No records found</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6 leading-relaxed">
            {activeTab === 'incoming'
              ? 'Nobody has requested to borrow your listed items yet. Make sure you have active listings on the campus feed!'
              : 'You haven\'t requested to borrow any items yet. Explore the campus inventory feed to find what you need!'}
          </p>
          <Button asChild className="btn-standard w-full sm:w-auto">
            <Link to="/feed">Explore Campus Feed</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
          {displayedRequests.map((req) => {
            const item = req.itemId || {};
            const otherUser = activeTab === 'incoming' ? req.borrowerId : req.lenderId;
            const isPending = req.status === 'Pending';
            const isProcessing = actionLoadingId === req._id;

            return (
              <Card 
                key={req._id} 
                className={`p-4 sm:p-5 md:p-6 flex flex-col justify-between gap-3 sm:gap-4 border-l-4 ${
                  req.status === 'Approved' ? 'border-l-status-available' 
                  : req.status === 'Rejected' ? 'border-l-red-400' 
                  : 'border-l-accent'
                }`}
              >
                <div>
                  {/* Item header with thumbnail */}
                  <div className="flex gap-3 sm:gap-4 items-center mb-3 sm:mb-4 pb-3 sm:pb-3.5 border-b border-border/50">
                    <OptimizedImage
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
                      alt={item.title || 'Item'}
                      width={64}
                      aspectRatio="1/1"
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg shrink-0"
                      showBlurPlaceholder={false}
                    />
                    <div className="min-w-0 flex-1">
                      <Badge variant={getStatusVariant(req.status)} className="mb-1 text-[10px] sm:text-xs">
                        {req.status}
                      </Badge>
                      <h4 className="text-sm sm:text-base md:text-lg font-bold text-primary truncate">
                        {item.title || 'Deleted Item'}
                      </h4>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-muted-foreground shrink-0">{activeTab === 'incoming' ? 'Requested By:' : 'Owner:'}</span>
                      <span className="font-semibold text-primary text-right truncate">{otherUser?.name || 'Campus Student'}</span>
                    </div>
                    
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-muted-foreground shrink-0">Duration:</span>
                      <span className="font-semibold text-accent text-right">{formatDate(req.startDate)} → {formatDate(req.endDate)}</span>
                    </div>

                    {req.message && (
                      <div className="mt-1.5 sm:mt-2 bg-muted/20 p-2.5 sm:p-3 rounded-lg border border-border/30">
                        <span className="text-[10px] sm:text-xs text-muted-foreground block mb-0.5">Message:</span>
                        <p className="italic text-foreground text-xs sm:text-sm">"{req.message}"</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions for Incoming Requests */}
                {activeTab === 'incoming' && (
                  <div className="border-t border-border/50 pt-3 sm:pt-4 flex gap-2">
                    {isPending ? (
                      <>
                        <Button
                          onClick={() => handleStatusUpdate(req._id, 'Approved')}
                          disabled={isProcessing}
                          className="flex-1 bg-status-available text-white hover:bg-status-available/90 btn-standard text-xs sm:text-sm"
                        >
                          {isProcessing ? '...' : '✓ Approve'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleStatusUpdate(req._id, 'Rejected')}
                          disabled={isProcessing}
                          className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50 btn-standard text-xs sm:text-sm"
                        >
                          {isProcessing ? '...' : '✕ Reject'}
                        </Button>
                      </>
                    ) : (
                      <div className="w-full text-center text-xs sm:text-sm text-muted-foreground">
                        Status set to <strong className="text-accent">{req.status}</strong>
                        {req.status === 'Approved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="block w-full mt-2 text-xs"
                            onClick={() => handleStatusUpdate(req._id, 'Returned')}
                          >
                            Mark as Returned
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Status for My Requests */}
                {activeTab === 'myRequests' && (
                  <div className="border-t border-border/50 pt-3 sm:pt-3.5 text-center">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {req.status === 'Pending' && 'Waiting for owner approval...'}
                      {req.status === 'Approved' && 'Approved! Coordinate with the owner for pickup.'}
                      {req.status === 'Rejected' && 'Request declined by owner.'}
                      {req.status === 'Returned' && 'Item returned. Thank you for sharing!'}
                    </span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default BorrowRequests;
