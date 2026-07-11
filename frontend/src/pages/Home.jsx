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
        
        {/* Signature Palette Showcase Banner */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          background: 'var(--bg-input)',
          border: '1px solid var(--border-strong)',
          marginBottom: '20px',
          fontSize: '0.85rem',
          fontWeight: 700
        }}>
          <span style={{
            display: 'inline-block',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#FFEFB3',
            border: '1px solid #013E37'
          }} />
          <span style={{ color: 'var(--text-main)' }}>Butter #FFEFB3</span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span style={{
            display: 'inline-block',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#013E37',
            border: '1px solid #FFEFB3'
          }} />
          <span style={{ color: 'var(--text-main)' }}>Green #013E37</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.3rem)', fontWeight: 800, lineHeight: 1.12, marginBottom: '18px', letterSpacing: '-1px', color: 'var(--text-main)' }}>
          Borrow What You Need. <br />
          <span style={{ color: 'var(--accent-main)', textDecoration: 'underline', textUnderlineOffset: '6px', textDecorationThickness: '3px' }}>
            Share What You Have.
          </span>
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '680px', margin: '0 auto 30px', lineHeight: 1.6 }}>
          College peer-to-peer equipment sharing built with the signature <strong style={{ color: 'var(--text-main)' }}>Butter & Green</strong> aesthetic. Access scientific calculators, textbooks, IoT kits, and DSLR cameras across campus.
        </p>

        {/* Reference Palette Dual Card */}
        <div style={{
          maxWidth: '420px',
          margin: '0 auto 34px',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-main)',
          border: '1px solid var(--border-strong)'
        }}>
          {/* Top Half: Butter Background #FFEFB3 with Green Script #013E37 */}
          <div style={{
            background: '#FFEFB3',
            padding: '24px 20px',
            textAlign: 'center'
          }}>
            <div style={{
              fontFamily: "'Damion', cursive",
              fontSize: '2.4rem',
              color: '#013E37',
              lineHeight: 1,
              marginBottom: '4px'
            }}>
              Butter
            </div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '0.82rem',
              color: '#013E37',
              letterSpacing: '1.5px'
            }}>
              #FFEFB3
            </div>
          </div>

          {/* Bottom Half: Green Background #013E37 with Butter Script #FFEFB3 */}
          <div style={{
            background: '#013E37',
            padding: '24px 20px',
            textAlign: 'center'
          }}>
            <div style={{
              fontFamily: "'Damion', cursive",
              fontSize: '2.4rem',
              color: '#FFEFB3',
              lineHeight: 1,
              marginBottom: '4px'
            }}>
              Green
            </div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '0.82rem',
              color: '#FFEFB3',
              letterSpacing: '1.5px'
            }}>
              #013E37
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: '640px', margin: '0 auto 30px' }}>
          <input
            type="text"
            placeholder="🔍 Search calculators, textbooks, sensors, or cameras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input"
            style={{ padding: '16px 22px', fontSize: '1.05rem', boxShadow: 'var(--shadow-main)' }}
          />
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="glass-button"
                style={{
                  padding: '8px 20px',
                  fontSize: '0.88rem',
                  borderRadius: '9999px',
                  background: isSelected 
                    ? 'var(--accent-main)' 
                    : 'var(--bg-input)',
                  color: isSelected ? 'var(--accent-text)' : 'var(--text-main)',
                  border: isSelected ? '1px solid var(--accent-main)' : '1px solid var(--border-subtle)',
                  fontWeight: isSelected ? 700 : 500,
                  boxShadow: isSelected ? 'var(--shadow-glow)' : 'none'
                }}
              >
                {cat}
              </button>
            );
          })}
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
