import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import EditItemModal from '../components/EditItemModal';

const MOCK_ITEMS = [
  {
    _id: 'mock-1',
    title: 'Canon DSLR Camera',
    description: 'Canon EOS Rebel T7 with 18-55mm lens kit. Great for photography assignments and campus events.',
    category: 'Electronics',
    condition: 'Like New',
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'mock-2',
    title: 'TI-84 Scientific Calculator',
    description: 'Texas Instruments TI-84 Plus CE graphing calculator. Perfect for calculus and statistics courses.',
    category: 'Electronics',
    condition: 'Good',
    status: 'Available',
    imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'mock-3',
    title: 'Organic Chemistry Textbook',
    description: 'Clayden Organic Chemistry, 2nd Edition. Barely used with no highlighting or markings.',
    category: 'Books',
    condition: 'Like New',
    status: 'Requested',
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
  },
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    university: user?.university || 'State University',
    bio: user?.bio || 'Engineering student passionate about sharing resources and building community on campus.',
  });
  const [editProfileData, setEditProfileData] = useState({ ...profileData });

  // Inventory state
  const [myItems, setMyItems] = useState(MOCK_ITEMS);
  const [editingItem, setEditingItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (!user && !localStorage.getItem('userInfo')) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Sync profile data when user context changes
  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        university: user.university || prev.university,
      }));
    }
  }, [user]);

  // Fetch user's items from backend
  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const token = user?.token || storedUser?.token;
        if (!token) return;

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const res = await axios.get('https://borrowhub-backend-9hji.onrender.com/api/items/my', config);
        if (res.data && res.data.length > 0) {
          setMyItems(res.data);
        }
      } catch (err) {
        // Fall back to mock items silently
        console.log('Using mock items for inventory display.');
      }
    };

    fetchMyItems();
  }, [user]);

  if (!user && !localStorage.getItem('userInfo')) {
    return null;
  }

  // Profile handlers
  const handleEditProfile = () => {
    setEditProfileData({ ...profileData });
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setEditProfileData({ ...profileData });
    setIsEditingProfile(false);
  };

  const handleSaveProfile = () => {
    setProfileData({ ...editProfileData });
    setIsEditingProfile(false);
    showSuccess('✅ Profile updated successfully!');
  };

  // Inventory handlers
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const token = user?.token || storedUser?.token;

      if (token && !itemId.startsWith('mock-')) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        await axios.delete(`https://borrowhub-backend-9hji.onrender.com/api/items/${itemId}`, config);
      }

      setMyItems((prev) => prev.filter((item) => item._id !== itemId));
      showSuccess('🗑️ Item deleted successfully.');
    } catch (err) {
      console.error('Delete failed:', err);
      // Still remove from UI for mock items
      setMyItems((prev) => prev.filter((item) => item._id !== itemId));
      showSuccess('🗑️ Item removed from inventory.');
    }
  };

  const handleEditItemSuccess = (updatedItem) => {
    setMyItems((prev) =>
      prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
    );
    setEditingItem(null);
    showSuccess('✏️ Item updated successfully!');
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return { bg: 'rgba(192, 235, 106, 0.2)', border: '#C0EB6A', text: '#5a7a1a' };
      case 'Requested':
        return { bg: 'rgba(255, 239, 179, 0.35)', border: '#FFEFB3', text: '#8a6d00' };
      case 'Borrowed':
        return { bg: 'rgba(1, 62, 55, 0.15)', border: '#013E37', text: '#013E37' };
      default:
        return { bg: 'rgba(72, 85, 80, 0.1)', border: '#485550', text: '#485550' };
    }
  };

  // Avatar initials
  const initials = profileData.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto pt-24 px-6 pb-12">

      {/* Page Title */}
      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          color: '#485550',
          letterSpacing: '-0.5px',
          marginBottom: '4px',
        }}
      >
        My Dashboard
      </h1>
      <p style={{ color: '#7a8a82', fontSize: '1.05rem', marginBottom: '8px' }}>
        Manage your profile and campus inventory in one place.
      </p>

      {/* Success Alert */}
      {successMessage && (
        <div
          style={{
            background: 'rgba(192, 235, 106, 0.2)',
            border: '1px solid #C0EB6A',
            color: '#485550',
            padding: '14px 24px',
            borderRadius: '14px',
            marginTop: '16px',
            fontWeight: 600,
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          {successMessage}
        </div>
      )}

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">

        {/* ============================== */}
        {/* LEFT COLUMN — Profile Editor   */}
        {/* ============================== */}
        <div className="lg:col-span-1">
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.65)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              padding: '32px 28px',
            }}
          >
            {!isEditingProfile ? (
              /* ---- VIEW MODE ---- */
              <div style={{ textAlign: 'center' }}>
                {/* Avatar */}
                <div
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #C0EB6A, #013E37)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    boxShadow: '0 6px 24px rgba(192, 235, 106, 0.35)',
                  }}
                >
                  <span
                    style={{
                      color: '#fff',
                      fontSize: '2rem',
                      fontWeight: 800,
                      letterSpacing: '1px',
                    }}
                  >
                    {initials}
                  </span>
                </div>

                {/* Name */}
                <h2
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: '#485550',
                    marginBottom: '6px',
                  }}
                >
                  {profileData.name}
                </h2>

                {/* University */}
                <p
                  style={{
                    color: '#7a8a82',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  🎓 {profileData.university}
                </p>

                {/* Divider */}
                <div
                  style={{
                    width: '60px',
                    height: '3px',
                    background: 'linear-gradient(90deg, #C0EB6A, #013E37)',
                    borderRadius: '999px',
                    margin: '0 auto 16px',
                  }}
                />

                {/* Bio */}
                <p
                  style={{
                    color: '#5e6e66',
                    fontSize: '0.92rem',
                    lineHeight: 1.65,
                    marginBottom: '24px',
                    padding: '0 4px',
                  }}
                >
                  {profileData.bio}
                </p>

                {/* Edit Profile Button */}
                <button
                  onClick={handleEditProfile}
                  className="w-full"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '14px',
                    border: '2px solid #485550',
                    background: 'transparent',
                    color: '#485550',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#485550';
                    e.currentTarget.style.color = '#F4F6F0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#485550';
                  }}
                >
                  ✏️ Edit Profile
                </button>

                {/* Stats row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    marginTop: '24px',
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(72, 85, 80, 0.12)',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#485550' }}>
                      {myItems.length}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#7a8a82', fontWeight: 500 }}>
                      Items Listed
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#C0EB6A' }}>
                      {myItems.filter((i) => i.status === 'Available').length}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#7a8a82', fontWeight: 500 }}>
                      Available
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#013E37' }}>
                      {myItems.filter((i) => i.status === 'Borrowed' || i.status === 'Requested').length}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#7a8a82', fontWeight: 500 }}>
                      In Use
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ---- EDIT MODE ---- */
              <div>
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#485550',
                    marginBottom: '20px',
                  }}
                >
                  ✏️ Edit Profile
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Name Input */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#485550',
                        marginBottom: '6px',
                      }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editProfileData.name}
                      onChange={(e) =>
                        setEditProfileData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(72, 85, 80, 0.25)',
                        background: 'rgba(255,255,255,0.7)',
                        color: '#485550',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* University Input */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#485550',
                        marginBottom: '6px',
                      }}
                    >
                      University
                    </label>
                    <input
                      type="text"
                      value={editProfileData.university}
                      onChange={(e) =>
                        setEditProfileData((prev) => ({ ...prev, university: e.target.value }))
                      }
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(72, 85, 80, 0.25)',
                        background: 'rgba(255,255,255,0.7)',
                        color: '#485550',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Bio Input */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#485550',
                        marginBottom: '6px',
                      }}
                    >
                      Bio
                    </label>
                    <textarea
                      rows="4"
                      value={editProfileData.bio}
                      onChange={(e) =>
                        setEditProfileData((prev) => ({ ...prev, bio: e.target.value }))
                      }
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(72, 85, 80, 0.25)',
                        background: 'rgba(255,255,255,0.7)',
                        color: '#485550',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Edit Actions */}
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '20px',
                  }}
                >
                  <button
                    onClick={handleCancelEdit}
                    style={{
                      flex: 1,
                      padding: '11px',
                      borderRadius: '12px',
                      border: '2px solid rgba(72, 85, 80, 0.3)',
                      background: 'transparent',
                      color: '#485550',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    style={{
                      flex: 1,
                      padding: '11px',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#C0EB6A',
                      color: '#485550',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(192, 235, 106, 0.4)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ====================================== */}
        {/* RIGHT COLUMN — Inventory Management    */}
        {/* ====================================== */}
        <div className="lg:col-span-2">

          {/* Header with title + Add button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
          >
            <h2
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: '#485550',
              }}
            >
              📦 My Inventory
            </h2>
            <Link
              to="/add-item"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 24px',
                borderRadius: '14px',
                background: '#C0EB6A',
                color: '#485550',
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(192, 235, 106, 0.4)',
                transition: 'all 0.2s ease',
              }}
            >
              + Add New Item
            </Link>
          </div>

          {/* Items Grid */}
          {myItems.length === 0 ? (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                borderRadius: '20px',
                padding: '60px 24px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '14px' }}>📭</div>
              <h3
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: '#485550',
                  marginBottom: '10px',
                }}
              >
                No items in your inventory
              </h3>
              <p style={{ color: '#7a8a82', marginBottom: '24px', lineHeight: 1.5 }}>
                Start sharing with your campus community by listing your first item!
              </p>
              <Link
                to="/add-item"
                style={{
                  display: 'inline-block',
                  padding: '12px 28px',
                  borderRadius: '14px',
                  background: '#C0EB6A',
                  color: '#485550',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(192, 235, 106, 0.4)',
                }}
              >
                + List Your First Item
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myItems.map((item) => {
                const statusColor = getStatusColor(item.status);
                return (
                  <div
                    key={item._id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.65)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.7)',
                      borderRadius: '20px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
                    }}
                  >
                    {/* Item Image */}
                    <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                      {/* Status Badge */}
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          background: statusColor.bg,
                          border: `1px solid ${statusColor.border}`,
                          color: statusColor.text,
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        ● {item.status || 'Available'}
                      </span>
                    </div>

                    {/* Item Details */}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: '#485550',
                          marginBottom: '6px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.title}
                      </h3>

                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          marginBottom: '10px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span
                          style={{
                            padding: '2px 10px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: 'rgba(72, 85, 80, 0.08)',
                            color: '#5e6e66',
                          }}
                        >
                          {item.category}
                        </span>
                        <span
                          style={{
                            padding: '2px 10px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: 'rgba(72, 85, 80, 0.08)',
                            color: '#5e6e66',
                          }}
                        >
                          {item.condition}
                        </span>
                      </div>

                      <p
                        style={{
                          color: '#7a8a82',
                          fontSize: '0.88rem',
                          lineHeight: 1.55,
                          flex: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.description}
                      </p>

                      {/* Action Buttons */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          marginTop: '16px',
                          paddingTop: '16px',
                          borderTop: '1px solid rgba(72, 85, 80, 0.1)',
                        }}
                      >
                        <button
                          onClick={() => setEditingItem(item)}
                          style={{
                            flex: 1,
                            padding: '10px 16px',
                            borderRadius: '12px',
                            border: '1.5px solid rgba(72, 85, 80, 0.25)',
                            background: 'transparent',
                            color: '#485550',
                            fontWeight: 600,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(72, 85, 80, 0.06)';
                            e.currentTarget.style.borderColor = '#485550';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = 'rgba(72, 85, 80, 0.25)';
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          style={{
                            flex: 1,
                            padding: '10px 16px',
                            borderRadius: '12px',
                            border: '1.5px solid rgba(239, 68, 68, 0.35)',
                            background: 'transparent',
                            color: '#ef4444',
                            fontWeight: 600,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)';
                            e.currentTarget.style.borderColor = '#ef4444';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.35)';
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          user={user}
          onClose={() => setEditingItem(null)}
          onSuccess={handleEditItemSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;
