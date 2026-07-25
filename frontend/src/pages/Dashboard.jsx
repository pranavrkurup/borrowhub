import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Package, Inbox, FolderOpen, Box, Plus, User, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import ItemCard from '../components/ItemCard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'incoming', 'outgoing'
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

  const handleRequestAction = async (requestId, actionType) => {
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
  };

  if (!user && !localStorage.getItem('userInfo')) return null;

  const initials = (user?.name || 'Student').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground animate-pulse">
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary">My Inventory</h2>
              <Button asChild><Link to="/add-item"><Plus className="w-4 h-4 mr-2" /> List Item</Link></Button>
            </div>
            
            {myItems.length === 0 ? (
              <Card className="p-12 text-center flex flex-col items-center">
                <Box className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No active inventory</h3>
                <p className="text-muted-foreground mb-6">List your first item to start earning trust points.</p>
                <Button asChild><Link to="/add-item">List an Item</Link></Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myItems.map(item => (
                  <ItemCard key={item._id} item={item} user={user} onStatusChange={() => fetchData()} />
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary">Incoming Requests</h2>
              <Badge variant="secondary">{incomingRequests.filter(r => r.status === 'Pending').length} Pending</Badge>
            </div>

            {incomingRequests.length === 0 ? (
              <Card className="p-12 text-center text-muted-foreground">
                No one has requested your items yet.
              </Card>
            ) : (
              <div className="space-y-4">
                {incomingRequests.map(req => (
                  <Card key={req._id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between border-l-4 border-l-accent">
                    <div className="flex items-center gap-4">
                      <img src={req.itemId?.imageUrl} alt="" className="w-16 h-16 rounded-md object-cover border" />
                      <div>
                        <h4 className="font-bold text-lg">{req.itemId?.title || 'Deleted Item'}</h4>
                        <p className="text-sm text-muted-foreground">Requested by: <span className="font-semibold text-primary">{req.borrowerId?.name}</span></p>
                        <p className="text-xs text-muted-foreground mt-1">From {new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                      {req.status === 'Pending' ? (
                        <>
                          <Button onClick={() => handleRequestAction(req._id, 'Approved')} className="bg-status-available text-white hover:bg-status-available/90 flex-1 sm:flex-none">Approve</Button>
                          <Button variant="outline" onClick={() => handleRequestAction(req._id, 'Rejected')} className="text-red-500 hover:text-red-600 flex-1 sm:flex-none">Reject</Button>
                        </>
                      ) : (
                        <div className="text-center w-full">
                          <Badge variant={req.status === 'Approved' ? 'available' : 'outline'}>{req.status}</Badge>
                          {req.status === 'Approved' && (
                            <Button variant="outline" size="sm" className="block mt-2 w-full" onClick={() => handleRequestAction(req._id, 'Returned')}>Mark Returned</Button>
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
            <h2 className="text-2xl font-bold text-primary mb-6">My Requests</h2>
            {myRequests.length === 0 ? (
              <Card className="p-12 text-center text-muted-foreground">
                You haven't requested to borrow anything yet.
              </Card>
            ) : (
              <div className="space-y-4">
                {myRequests.map(req => (
                  <Card key={req._id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={req.itemId?.imageUrl} alt="" className="w-16 h-16 rounded-md object-cover border" />
                      <div>
                        <h4 className="font-bold text-lg">{req.itemId?.title || 'Deleted Item'}</h4>
                        <p className="text-sm text-muted-foreground">Owner: <span className="font-semibold text-primary">{req.lenderId?.name}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={req.status === 'Approved' ? 'available' : req.status === 'Rejected' ? 'destructive' : 'secondary'}>{req.status}</Badge>
                      <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">
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
    <div className="w-full pb-24 pt-10 px-6 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Profile & Nav */}
      <aside className="w-full md:w-72 shrink-0">
        <div className="sticky top-24 space-y-6">
          <Card className="p-6 text-center">
            <div className="w-20 h-20 bg-accent text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-primary">{user?.name}</h2>
            <div className="flex items-center justify-center text-sm text-muted-foreground mt-1 gap-1">
              <Building2 size={14} /> {user?.university || 'University'}
            </div>
            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center px-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Trust Score</span>
                <span className="text-lg font-bold text-status-available flex items-center gap-1"><ShieldCheck size={16}/> 100</span>
              </div>
              <div className="h-8 w-px bg-border"></div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Items</span>
                <span className="text-lg font-bold text-primary">{myItems.length}</span>
              </div>
            </div>
          </Card>

          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'inventory' ? 'bg-primary text-white shadow-md' : 'text-secondary hover:bg-muted'}`}
            >
              <Package size={18} /> My Inventory
            </button>
            <button
              onClick={() => setActiveTab('incoming')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'incoming' ? 'bg-primary text-white shadow-md' : 'text-secondary hover:bg-muted'}`}
            >
              <Inbox size={18} /> Incoming Requests
              {incomingRequests.filter(r => r.status === 'Pending').length > 0 && (
                <span className="ml-auto bg-accent text-white text-xs px-2 py-0.5 rounded-full">
                  {incomingRequests.filter(r => r.status === 'Pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('outgoing')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'outgoing' ? 'bg-primary text-white shadow-md' : 'text-secondary hover:bg-muted'}`}
            >
              <FolderOpen size={18} /> My Requests
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1">
        {successMessage && (
          <div className="bg-status-available-bg text-status-available px-4 py-3 rounded-xl mb-6 font-semibold border border-status-available/20 shadow-sm animate-fade-in">
            {successMessage}
          </div>
        )}
        
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
