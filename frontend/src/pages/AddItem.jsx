import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CATEGORIES = ['Electronics', 'Books', 'Lab Equipment', 'Sports', 'Other'];
const CONDITIONS = ['Like New', 'Good', 'Fair'];

const AddItem = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [condition, setCondition] = useState('Like New');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const token = user?.token || storedUser?.token;

    if (!token) {
      setError('You must be logged in to list an item.');
      return;
    }

    if (!imageFile) {
      setError('Please select an image file to upload.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('condition', condition);
      formData.append('description', description);
      formData.append('image', imageFile);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      await axios.post('https://borrowhub-backend-9hji.onrender.com/api/items', formData, config);

      setLoading(false);
      navigate('/');
    } catch (err) {
      console.error('❌ Item creation failed:', err.response?.status, err.response?.data || err.message);
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to list item. Ensure backend is running and image upload is working.');
    }
  };

  if (!user && !localStorage.getItem('userInfo')) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '480px', margin: '0 auto', padding: '40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '12px', color: 'var(--text-main)' }}>Access Denied</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '0 0 24px', lineHeight: 1.5 }}>
            You must be signed in with your college student account to list equipment or books for lending.
          </p>
          <button onClick={() => navigate('/login')} className="glass-button btn-primary" style={{ width: '100%', padding: '14px' }}>
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px 90px' }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto', padding: '40px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '34px' }}>
          <div className="badge badge-butter" style={{ marginBottom: '14px' }}>
            📦 Campus Inventory Listing
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            List Equipment for Sharing
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginTop: '8px' }}>
            Help fellow students by lending scientific tools, textbooks, and hardware devices.
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#FF8A8A', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '0.9rem' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '8px' }}>
              Item Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Casio FX-991EX Scientific Calculator"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glass-input"
            />
          </div>

          {/* Category & Condition Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input"
                style={{ cursor: 'pointer' }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} style={{ color: '#013E37', background: '#FFEFB3' }}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="glass-input"
                style={{ cursor: 'pointer' }}
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond} style={{ color: '#013E37', background: '#FFEFB3' }}>{cond}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '8px' }}>
              Description & Specifications *
            </label>
            <textarea
              rows="4"
              required
              placeholder="Provide details about condition, specs, or included accessories (e.g., cables, manuals)."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="glass-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '8px' }}>
              Item Photo *
            </label>
            
            <div style={{
              border: '2px dashed var(--border-strong)',
              borderRadius: '16px',
              padding: '28px',
              textAlign: 'center',
              background: 'var(--bg-input)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s'
            }}>
              <input
                type="file"
                accept="image/*"
                required={!imageFile}
                onChange={handleImageChange}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />

              {imagePreview ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                  <img src={imagePreview} alt="Preview" style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '14px', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-main)' }} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--accent-main)', fontWeight: 600 }}>✓ Click or drag to change image</span>
                </div>
              ) : (
                <div style={{ padding: '20px 0' }}>
                  <div style={{ fontSize: '2.8rem', marginBottom: '10px' }}>📸</div>
                  <p style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px', fontSize: '1.05rem' }}>Click or drag photo to upload</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Supports JPG, PNG, WEBP (Max 5MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="glass-button btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '1.05rem', marginTop: '14px' }}
          >
            {loading ? '📤 Uploading to Cloudinary & Listing...' : '🚀 Publish Item Listing'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddItem;
