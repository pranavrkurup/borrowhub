import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import BorrowModal from '../components/BorrowModal';
import ItemCard from '../components/ItemCard';
import { Link, useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Lab Equipment', 'Sports', 'Other'];

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemForBorrow, setSelectedItemForBorrow] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchItems(searchQuery, selectedCategory);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
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
    <div className="container" style={{ paddingBottom: '90px' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '56px 0 40px' }}>
        
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.3rem)', fontWeight: 800, lineHeight: 1.12, marginBottom: '18px', letterSpacing: '-1px', color: 'var(--text-main)' }}>
          Borrow What You Need. <br />
          <span style={{ color: 'var(--accent-main)', textDecoration: 'underline', textUnderlineOffset: '6px', textDecorationThickness: '3px' }}>
            Share What You Have.
          </span>
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '680px', margin: '0 auto 30px', lineHeight: 1.6 }}>
          A frictionless college peer-to-peer equipment sharing platform. Access scientific calculators, textbooks, IoT kits, and DSLR cameras directly from fellow students across campus.
        </p>

        {/* New Search Component replacing static palette block */}
        <div className="max-w-2xl mx-auto mb-8 px-4" style={{ maxWidth: '680px', margin: '0 auto 32px' }}>
          
          {/* Pill-Shaped Search Input Wrapper */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchItems(searchQuery, selectedCategory);
            }}
            className="flex items-center rounded-full border-2 border-[#013E37] bg-white p-1.5 shadow-lg"
            style={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '9999px',
              border: '2px solid #013E37',
              background: '#F8FBFB',
              padding: '6px',
              boxShadow: '0 12px 30px rgba(1, 62, 55, 0.15)'
            }}
          >
            {/* Search Icon */}
            <div style={{ paddingLeft: '14px', color: '#013E37', display: 'flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#013E37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>

            {/* Input Field */}
            <input
              type="text"
              placeholder="Search for calculators, cameras, or lab kits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent px-4 py-3 text-[#013E37] placeholder-[#013E37]/60 font-medium focus:outline-none"
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                padding: '12px 16px',
                color: '#013E37',
                fontSize: '1rem',
                fontWeight: 500,
                outline: 'none'
              }}
            />

            {/* Search Button attached inside right */}
            <button
              type="submit"
              className="bg-[#013E37] text-[#FFEFB3] font-bold px-7 py-3 rounded-full hover:bg-[#02594F] transition-all shrink-0"
              style={{
                background: '#013E37',
                color: '#FFEFB3',
                fontWeight: 700,
                padding: '11px 26px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.95rem',
                flexShrink: 0
              }}
            >
              Search
            </button>
          </form>

          {/* Clickable Category Pills */}
          <div
            className="mt-4 flex flex-wrap items-center justify-center gap-2"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '18px'
            }}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className="rounded-full px-4 py-1.5 text-sm transition-all"
                  style={{
                    padding: '6px 16px',
                    fontSize: '0.84rem',
                    borderRadius: '9999px',
                    border: '1px solid #013E37',
                    background: isSelected ? '#013E37' : 'rgba(255, 255, 255, 0.75)',
                    color: isSelected ? '#FFEFB3' : '#013E37',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(1, 62, 55, 0.2)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

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
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          ⏳ Loading available campus inventory...
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

export default Home;
