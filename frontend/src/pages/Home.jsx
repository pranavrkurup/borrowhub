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

  // Debounce timer ref so we don't hammer the API on every keystroke
  const debounceRef = useRef(null);

  // Re-fetch items whenever the search query or category changes
  useEffect(() => {
    // Clear any pending debounced call
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchItems(searchQuery, selectedCategory);
    }, 400); // 400ms debounce

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, selectedCategory]);

  const fetchItems = async (search, category) => {
    try {
      setLoading(true);
      setError(null);

      // Build query params for the backend
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
      <section style={{ textAlign: 'center', padding: '60px 0 44px' }}>
        <div className="badge badge-purple" style={{ marginBottom: '16px' }}>
          ⚡ College Peer-to-Peer Lab & Equipment Inventory
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '18px', letterSpacing: '-1px' }}>
          Borrow What You Need. <br />
          <span style={{ background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-purple) 50%, var(--accent-pink) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Share What You Have.
          </span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '680px', margin: '0 auto 34px', lineHeight: 1.6 }}>
          Access scientific calculators, textbooks, IoT kits, and DSLR cameras from fellow students on campus. Zero cost, maximum collaboration.
        </p>

        {/* Search Bar */}
        <div style={{ maxWidth: '620px', margin: '0 auto 32px' }}>
          <input
            type="text"
            placeholder="🔍 Search calculators, textbooks, sensors, or cameras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input"
            style={{ padding: '16px 22px', fontSize: '1.05rem', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}
          />
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="glass-button"
              style={{
                padding: '8px 20px',
                fontSize: '0.88rem',
                borderRadius: '9999px',
                background: selectedCategory === cat 
                  ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))' 
                  : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === cat ? '#070913' : '#fff',
                border: selectedCategory === cat ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
                fontWeight: selectedCategory === cat ? 700 : 500,
                boxShadow: selectedCategory === cat ? '0 0 20px rgba(0, 240, 255, 0.35)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
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
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Showing results
            {searchQuery && <> for "<strong style={{ color: '#fff' }}>{searchQuery}</strong>"</>}
            {selectedCategory !== 'All' && <> in <strong style={{ color: 'var(--accent-cyan)' }}>{selectedCategory}</strong></>}
            {` — ${items.length} item${items.length !== 1 ? 's' : ''} found`}
          </span>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="glass-button"
            style={{
              padding: '4px 14px',
              fontSize: '0.8rem',
              borderRadius: '9999px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
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
            background: 'rgba(16, 185, 129, 0.18)', 
            borderColor: 'var(--accent-emerald)', 
            padding: '16px 24px', 
            marginBottom: '32px', 
            textAlign: 'center',
            color: '#34d399',
            fontWeight: 600,
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.2)'
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
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
          ⏳ Loading available campus inventory...
        </div>
      ) : items.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '520px', margin: '30px auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '14px' }}>📦</div>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '10px', color: '#fff' }}>No items found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '26px', lineHeight: 1.5 }}>
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
