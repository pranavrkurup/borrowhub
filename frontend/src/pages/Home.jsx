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
      
      {/* ─── 2-Column Hero Section ─── */}
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center pt-16 pb-20 px-6">

        {/* ── Left Column: Copy & Search ── */}
        <div className="flex flex-col items-start">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#485550] leading-tight tracking-tight mb-6">
            Borrow What You Need.
            <span className="text-[#C0EB6A] block mt-2">Share What You Have.</span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
            A frictionless college peer-to-peer equipment sharing platform. Access scientific calculators, textbooks, IoT kits, and DSLR cameras directly from fellow students across campus.
          </p>

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
          <div className="flex flex-wrap gap-4 mb-16">
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

          {/* Stat Cards */}
          <div className="flex flex-wrap gap-6 mt-12">
            <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-xl flex-1 min-w-[140px] text-center transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-2xl font-extrabold text-[#485550]">2,500+</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">Active Students</div>
            </div>
            <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-xl flex-1 min-w-[140px] text-center transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-2xl font-extrabold text-[#485550]">8,000+</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">Items Shared</div>
            </div>
            <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-xl flex-1 min-w-[140px] text-center transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-2xl font-extrabold text-[#485550]">100%</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">Trusted Peers</div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Hub Graphic ── */}
        <div className="relative w-full aspect-square flex items-center justify-center hidden lg:flex">
          {/* Concentric Orbit Circles */}
          <div className="border border-gray-200 rounded-full absolute w-[85%] h-[85%] opacity-60"></div>
          <div className="border border-gray-200 rounded-full absolute w-[62%] h-[62%] opacity-50"></div>
          <div className="border border-gray-100 rounded-full absolute w-[40%] h-[40%] opacity-40"></div>

          {/* Center Logo */}
          <img
            src="/logo.png"
            alt="BorrowHub Logo"
            className="w-24 h-24 object-contain drop-shadow-lg z-10 relative"
          />

          {/* Floating Item: Camera */}
          <div className="absolute top-8 right-12 bg-white shadow-lg rounded-xl p-3 flex items-center gap-2 animate-bounce" style={{ animationDuration: '3s' }}>
            <span className="text-2xl">📷</span>
            <span className="text-sm font-semibold text-[#485550]">DSLR Camera</span>
          </div>

          {/* Floating Item: Calculator */}
          <div className="absolute bottom-24 left-6 bg-white shadow-lg rounded-xl p-3 flex items-center gap-2 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
            <span className="text-2xl">🧮</span>
            <span className="text-sm font-semibold text-[#485550]">Calculator</span>
          </div>

          {/* Floating Item: Textbook */}
          <div className="absolute top-1/3 left-2 bg-white shadow-lg rounded-xl p-3 flex items-center gap-2 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <span className="text-2xl">📚</span>
            <span className="text-sm font-semibold text-[#485550]">Textbooks</span>
          </div>

          {/* Floating Item: IoT Kit */}
          <div className="absolute bottom-12 right-8 bg-white shadow-lg rounded-xl p-3 flex items-center gap-2 animate-bounce" style={{ animationDuration: '3.8s', animationDelay: '0.8s' }}>
            <span className="text-2xl">🔌</span>
            <span className="text-sm font-semibold text-[#485550]">IoT Kit</span>
          </div>
        </div>
      </div>

      {/* ─── Value Props Row (Full Width) ─── */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 py-12 px-6 border-t border-gray-100">
        <div className="flex flex-col items-center text-center gap-2">
          <span className="text-3xl">🎓</span>
          <h3 className="font-bold text-[#485550] text-sm">Verified Students</h3>
          <p className="text-xs text-gray-500">Every user is a verified college student on your campus.</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <span className="text-3xl">🤝</span>
          <h3 className="font-bold text-[#485550] text-sm">Easy & Safe</h3>
          <p className="text-xs text-gray-500">Simple request flow with built-in accountability tracking.</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <span className="text-3xl">♻️</span>
          <h3 className="font-bold text-[#485550] text-sm">Sustainable Campus</h3>
          <p className="text-xs text-gray-500">Share resources instead of buying new — reduce waste together.</p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <span className="text-3xl">💰</span>
          <h3 className="font-bold text-[#485550] text-sm">Save Money</h3>
          <p className="text-xs text-gray-500">Why buy when you can borrow? Keep more in your pocket.</p>
        </div>
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

export default Home;
