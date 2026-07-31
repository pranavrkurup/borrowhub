import React, { useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Package, Inbox, FolderOpen, Box, Plus, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import ItemCard from '../components/ItemCard';
import OptimizedImage from '../components/OptimizedImage';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('inventory');
  const [myItems, setMyItems] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (!user && !localStorage.getItem('userInfo')) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const token = user?.token || storedUser?.token;
      const currentUserId = user?._id || storedUser?._id;
      if (!token || !currentUserId) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Fetch items and requests in parallel
      const [itemsRes, reqRes] = await Promise.all([
        api.get('/api/items'),
        api.get('/api/requests', config)
      ]);

      const myOwnedItems = (itemsRes.data || []).filter(item => String(item.ownerId?._id || item.ownerId) === String(currentUserId));
      setMyItems(myOwnedItems);

      if (reqRes.data && Array.isArray(reqRes.data)) {
        setIncomingRequests(reqRes.data.filter(req => String(req.lenderId?._id || req.lenderId) === String(currentUserId)));
        setMyRequests(reqRes.data.filter(req => String(req.borrowerId?._id || req.borrowerId) === String(currentUserId)));
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = useCallback(async (requestId, actionType) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const token = user?.token || storedUser?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const statusToSend = actionType === 'Denied' ? 'Rejected' : actionType;
      await api.put(`/api/requests/${requestId}`, { status: statusToSend }, config);

      setIncomingRequests(prev => prev.map(r => r._id === requestId ? { ...r, status: statusToSend } : r));
      setSuccessMessage(`Request ${actionType.toLowerCase()} successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update request:', err);
    }
  }, [user]);

  if (!user && !localStorage.getItem('userInfo')) return null;

  const initials = (user?.name || 'Student').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const pendingCount = incomingRequests.filter(r => r.status === 'Pending').length;

  const tabs = [
    { key: 'inventory', label: 'Inventory', icon: Package, count: null },
    { key: 'incoming', label: 'Incoming', icon: Inbox, count: pendingCount || null },
    { key: 'outgoing', label: 'My Requests', icon: FolderOpen, count: null },
  ];

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-48 sm:h-64 text-muted-foreground animate-pulse text-sm sm:text-base">
          Loading dashboard data...
        </div>
      );
    }

    switch (activeTab) {
      case 'inventory':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            key="inventory"
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">My Inventory</h2>
              <Button asChild className="btn-standard text-xs sm:text-sm"><Link to="/add-item"><Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> List Item</Link></Button>
            </div>
            
            {myItems.length === 0 ? (
              <Card className="p-8 sm:p-12 text-center flex flex-col items-center">
                <Box className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2">No active inventory</h3>
                <p className="text-sm text-muted-foreground mb-4 sm:mb-6">List your first item to start earning trust points.</p>
                <Button asChild className="btn-standard"><Link to="/add-item">List an Item</Link></Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {myItems.map((item, index) => (
                  <ItemCard key={item._id} item={item} user={user} onStatusChange={() => fetchData()} index={index} />
                ))}
              </div>
            )}
          </motion.div>
        );

      case 'incoming':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            key="incoming"
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">Incoming Requests</h2>
              <Badge variant="secondary" className="text-xs">{pendingCount} Pending</Badge>
            </div>

            {incomingRequests.length === 0 ? (
              <Card className="p-8 sm:p-12 text-center text-sm text-muted-foreground">
                No one has requested your items yet.
              </Card>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {incomingRequests.map(req => (
                  <Card key={req._id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between border-l-4 border-l-accent">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <OptimizedImage 
                        src={req.itemId?.imageUrl} 
                        alt="" 
                        width={64} 
                        aspectRatio="1/1"
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-md shrink-0"
                        showBlurPlaceholder={false}
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-base sm:text-lg truncate">{req.itemId?.title || 'Deleted Item'}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">Requested by: <span className="font-semibold text-primary">{req.borrowerId?.name}</span></p>
                        <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">From {new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                      {req.status === 'Pending' ? (
                        <>
                          <Button onClick={() => handleRequestAction(req._id, 'Approved')} className="bg-status-available text-white hover:bg-status-available/90 flex-1 sm:flex-none btn-standard text-xs sm:text-sm">Approve</Button>
                          <Button variant="outline" onClick={() => handleRequestAction(req._id, 'Rejected')} className="text-red-500 hover:text-red-600 flex-1 sm:flex-none btn-standard text-xs sm:text-sm">Reject</Button>
                        </>
                      ) : (
                        <div className="text-center w-full">
                          <Badge variant={req.status === 'Approved' ? 'available' : 'outline'}>{req.status}</Badge>
                          {req.status === 'Approved' && (
                            <Button variant="outline" size="sm" className="block mt-2 w-full text-xs" onClick={() => handleRequestAction(req._id, 'Returned')}>Mark Returned</Button>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        );

      case 'outgoing':
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            key="outgoing"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-4 sm:mb-6">My Requests</h2>
            {myRequests.length === 0 ? (
              <Card className="p-8 sm:p-12 text-center text-sm text-muted-foreground">
                You haven't requested to borrow anything yet.
              </Card>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {myRequests.map(req => (
                  <Card key={req._id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <OptimizedImage 
                        src={req.itemId?.imageUrl} 
                        alt="" 
                        width={64} 
                        aspectRatio="1/1"
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-md shrink-0"
                        showBlurPlaceholder={false}
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-base sm:text-lg truncate">{req.itemId?.title || 'Deleted Item'}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">Owner: <span className="font-semibold text-primary">{req.lenderId?.name}</span></p>
                      </div>
                    </div>
                    <div className="text-right w-full sm:w-auto">
                      <Badge variant={req.status === 'Approved' ? 'available' : req.status === 'Rejected' ? 'destructive' : 'secondary'}>{req.status}</Badge>
                      <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2 max-w-[200px] ml-auto">
                        {req.status === 'Pending' && 'Waiting for owner approval...'}
                        {req.status === 'Approved' && 'Approved! Coordinate pickup.'}
                        {req.status === 'Returned' && 'Item returned.'}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        );
    }
  };

  return (
    <div 
      className="w-full flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8"
      style={{ 
        paddingLeft: 'var(--space-page-x)', 
        paddingRight: 'var(--space-page-x)',
        paddingTop: 'clamp(1rem, 3vw, 2.5rem)',
        paddingBottom: 'var(--space-page-bottom)',
      }}
    >
      
      {/* Sidebar Profile & Nav */}
      <aside className="w-full md:w-72 shrink-0">
        <div className="sticky top-24 space-y-4 sm:space-y-6">
          {/* Profile Card — compact row on mobile, full card on desktop */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-0 sm:flex-col sm:text-center">
              <div className="w-12 h-12 sm:w-20 sm:h-20 bg-accent text-white rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold shrink-0 sm:mx-auto sm:mb-4">
                {initials}
              </div>
              <div className="min-w-0 flex-1 sm:flex-none">
                <h2 className="text-base sm:text-xl font-bold text-primary truncate">{user?.name}</h2>
                <div className="flex items-center text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 gap-1 sm:justify-center">
                  <Building2 size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="truncate">{user?.university || 'University'}</span>
                </div>
              </div>
              {/* Inline stats on mobile */}
              <div className="flex gap-3 ml-auto sm:hidden">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Trust</span>
                  <span className="text-sm font-bold text-status-available flex items-center gap-0.5"><ShieldCheck size={12}/>100</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Items</span>
                  <span className="text-sm font-bold text-primary">{myItems.length}</span>
                </div>
              </div>
            </div>
            {/* Desktop stats */}
            <div className="hidden sm:flex mt-4 pt-4 border-t border-border justify-between items-center px-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Trust Score</span>
                <span className="text-lg font-bold text-status-available flex items-center gap-1"><ShieldCheck size={16}/>100</span>
              </div>
              <div className="h-8 w-px bg-border"></div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Items</span>
                <span className="text-lg font-bold text-primary">{myItems.length}</span>
              </div>
            </div>
          </Card>

          {/* Tab Navigation — horizontal scroll on mobile, vertical on desktop */}
          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible -mx-1 px-1 pb-1 md:pb-0">
            {tabs.map(({ key, label, icon: Icon, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all font-medium text-sm whitespace-nowrap shrink-0 ${
                  activeTab === key 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-secondary hover:bg-muted'
                }`}
              >
                <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                {label}
                {count != null && count > 0 && (
                  <span className="ml-auto bg-accent text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {successMessage && (
          <div className="bg-status-available-bg text-status-available px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl mb-4 sm:mb-6 font-semibold border border-status-available/20 shadow-sm animate-fade-in text-sm">
            {successMessage}
          </div>
        )}
        
        <div className="min-h-[300px] sm:min-h-[500px]">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
