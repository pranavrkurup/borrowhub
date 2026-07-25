import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BorrowModal = ({ item, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      setError('End date cannot be before start date.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const token = user?.token || storedUser?.token;
      
      await api.post('/api/requests', {
        itemId: item._id,
        startDate,
        endDate,
        message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit borrow request.');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-lg"
        >
          <Card className="overflow-hidden shadow-2xl">
            <div className="bg-muted px-6 py-4 flex justify-between items-center border-b border-border">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <Calendar size={20} className="text-accent" /> Request to Borrow
              </h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-black/5">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl border border-border bg-muted/30">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-16 h-16 rounded-md object-cover border border-border"
                />
                <div>
                  <h4 className="font-bold text-primary line-clamp-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">Owner: {item.ownerId?.name || 'Student'}</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm font-semibold border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={submitHandler} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-primary">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-primary">Return Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-primary">Message (Optional)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="E.g. Hi! I need this for my physics lab on Tuesday. I can pick it up at the library."
                    rows="3"
                    className="flex w-full rounded-md border border-border bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent resize-none"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Sending...' : 'Send Request'}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BorrowModal;
