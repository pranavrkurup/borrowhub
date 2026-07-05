import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import BorrowModal from '../components/BorrowModal';
import { Link, useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Lab Equipment', 'Sports', 'Other'];

const getBadgeClass = (category) => {
  switch (category) {
    case 'Electronics': return 'badge-cyan';
    case 'Books': return 'badge-purple';
    case 'Lab Equipment': return 'badge-pink';
    case 'Sports': return 'badge-emerald';
    default: return 'badge-amber';
  }
};

const getConditionBadgeClass = (condition) => {
  switch (condition) {
    case 'Like New': return 'badge-emerald';
    case 'Good': return 'badge-cyan';
    default: return 'badge-amber';
  }
};

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

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/items');
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch items from the server. Ensure backend is running on port 5000.');
      setLoading(false);
    }
  };

  const handleBorrowSuccess = () => {
    setSelectedItemForBorrow(null);
    setSuccessMessage('🎉 Borrow request submitted successfully! The owner has been notified on their dashboard.');
    setTimeout(() => setSuccessMessage(null), 6000);
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
      ) : filteredItems.length === 0 ? (
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
          {filteredItems.map((item) => {
            const isOwner = user && item.ownerId && (item.ownerId._id === user._id || item.ownerId === user._id);
            const isBorrowed = item.status === 'Borrowed';

            return (
              <div 
                key={item._id} 
                className="glass-panel"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between', 
                  overflow: 'hidden',
                  padding: '22px',
                  position: 'relative'
                }}
              >
                <div>
                  {/* Thumbnail Image */}
                  <div style={{ 
                    width: '100%', 
                    height: '210px', 
                    borderRadius: '16px', 
                    overflow: 'hidden', 
                    position: 'relative',
                    marginBottom: '18px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(0,0,0,0.3)'
                  }}>
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'; }}
                    />
                    <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                      <span className={`badge ${getBadgeClass(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
                      <span className={`badge ${getConditionBadgeClass(item.condition)}`} style={{ background: 'rgba(11, 15, 25, 0.85)', backdropFilter: 'blur(4px)' }}>
                        {item.condition}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
                      {item.title}
                    </h3>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      👤 <strong style={{ color: '#fff' }}>{item.ownerId?.name || 'Campus Student'}</strong>
                    </span>
                    <span style={{ 
                      color: isBorrowed ? 'var(--accent-red)' : 'var(--accent-emerald)', 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      ● {item.status}
                    </span>
                  </div>

                  {isOwner ? (
                    <div style={{ 
                      width: '100%', 
                      padding: '12px', 
                      textAlign: 'center', 
                      background: 'rgba(255, 255, 255, 0.05)', 
                      borderRadius: '12px', 
                      color: 'var(--text-muted)', 
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      border: '1px dashed rgba(255, 255, 255, 0.2)'
                    }}>
                      ✨ You own this item
                    </div>
                  ) : isBorrowed ? (
                    <button
                      disabled
                      className="glass-button btn-secondary"
                      style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }}
                    >
                      Currently Borrowed
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (!user) {
                          navigate('/login');
                        } else {
                          setSelectedItemForBorrow(item);
                        }
                      }}
                      className="glass-button btn-primary"
                      style={{ width: '100%', padding: '14px' }}
                    >
                      📦 Request Borrow
                    </button>
                  )}
                </div>
              </div>
            );
          })}
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
