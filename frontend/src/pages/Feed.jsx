import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import BorrowModal from '../components/BorrowModal';
import ItemCard from '../components/ItemCard';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Lab Equipment', 'Sports', 'Other'];

const Feed = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemForBorrow, setSelectedItemForBorrow] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchItems(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const fetchItems = async (search, category) => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (search && search.trim() !== '') {
        params.search = search.trim();
      }
      if (category && category !== 'All') {
        params.category = category;
      }

      const res = await axios.get('https://borrowhub-backend-9hji.onrender.com/api/items', { params });
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch items from the server.');
      setLoading(false);
    }
  };

  const handleBorrowSuccess = () => {
    setSelectedItemForBorrow(null);
    setSuccessMessage('🎉 Borrow request submitted successfully! The owner has been notified on their dashboard.');
    setTimeout(() => setSuccessMessage(null), 6000);
  };

  const handleItemStatusChange = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
    );
    setSuccessMessage('🎉 Item status updated to Requested successfully!');
    setTimeout(() => setSuccessMessage(null), 6000);
  };

  return (
    <div className="max-w-7xl mx-auto pt-24 px-6 pb-24">

      {/* Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchItems(searchQuery, selectedCategory);
        }}
        className="relative flex items-center w-full max-w-xl bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 mb-10 border border-gray-100"
      >
        <div className="pl-4 text-[#485550] flex items-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#485550" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search calculators, cameras, lab kits..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent pl-6 py-3 outline-none text-gray-700 text-lg placeholder-gray-400"
        />
        <button
          type="submit"
          className="bg-[#C0EB6A] text-[#485550] px-8 py-3 rounded-full font-bold hover:bg-[#aee050] transition-colors"
        >
          Search
        </button>
      </form>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-4 mb-10">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={
                isSelected
                  ? "px-5 py-2.5 rounded-full bg-[#C0EB6A] text-[#485550] border border-[#C0EB6A] font-medium shadow-sm transition-all cursor-pointer"
                  : "px-5 py-2.5 rounded-full border border-gray-200 text-gray-600 hover:border-[#C0EB6A] hover:text-[#485550] hover:bg-[#C0EB6A]/10 transition-all cursor-pointer font-medium"
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Active Filters Summary */}
      {(searchQuery || selectedCategory !== 'All') && !loading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Showing results
            {searchQuery && <> for "<strong style={{ color: 'var(--text-main)' }}>{searchQuery}</strong>"</>}
            {selectedCategory !== 'All' && <> in <strong style={{ color: 'var(--text-main)' }}>{selectedCategory}</strong></>}
            {` — ${items.length} item${items.length !== 1 ? 's' : ''} found`}
          </span>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="glass-button"
            style={{
              padding: '4px 14px',
              fontSize: '0.8rem',
              borderRadius: '9999px',
              background: 'rgba(239, 68, 68, 0.18)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171'
            }}
          >
            ✕ Clear Filters
          </button>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div 
          className="glass-panel animate-fade-in"
          style={{ 
            background: 'var(--status-available-bg)', 
            borderColor: 'var(--status-available-border)', 
            padding: '16px 24px', 
            marginBottom: '32px', 
            textAlign: 'center',
            color: 'var(--text-main)',
            fontWeight: 600,
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          {successMessage}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="glass-panel" style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '18px', borderRadius: '16px', textAlign: 'center', marginBottom: '32px' }}>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '26px',
          marginTop: '24px'
        }}>
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col h-[400px] bg-white/40 backdrop-blur-md border border-white/60 shadow-xl rounded-xl p-4 animate-pulse"
            >
              <div className="w-full h-[210px] bg-[#485550]/10 rounded-2xl mb-4" />
              <div className="w-3/4 h-6 bg-[#485550]/10 rounded-md mb-3" />
              <div className="w-full h-4 bg-[#485550]/10 rounded-md mb-2" />
              <div className="w-full h-4 bg-[#485550]/10 rounded-md mb-2" />
              <div className="w-2/3 h-4 bg-[#485550]/10 rounded-md mb-2" />
              <div className="w-full h-12 bg-[#485550]/10 rounded-xl mt-4 mt-auto" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '520px', margin: '30px auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '14px' }}>📦</div>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '10px', color: 'var(--text-main)' }}>No items found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '26px', lineHeight: 1.5 }}>
            {searchQuery || selectedCategory !== 'All' 
              ? 'We couldn\'t find any items matching your filters. Try clearing your search query or selecting another category.' 
              : 'Be the first student to list equipment or a textbook on BorrowHub!'}
          </p>
          {user ? (
            <Link to="/add-item" className="glass-button btn-primary" style={{ textDecoration: 'none' }}>
              + List an Item Now
            </Link>
          ) : (
            <Link to="/login" className="glass-button btn-primary" style={{ textDecoration: 'none' }}>
              Sign In to Get Started
            </Link>
          )}
        </div>
      ) : (
        /* Items Grid */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '26px',
          marginTop: '24px'
        }}>
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              user={user}
              onStatusChange={handleItemStatusChange}
            />
          ))}
        </div>
      )}

      {/* Borrow Modal Popup */}
      {selectedItemForBorrow && (
        <BorrowModal
          item={selectedItemForBorrow}
          onClose={() => setSelectedItemForBorrow(null)}
          onSuccess={handleBorrowSuccess}
        />
      )}

    </div>
  );
};

export default Feed;
