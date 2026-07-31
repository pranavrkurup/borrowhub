import React, { useState, useContext } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

const AddItem = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    condition: 'Good',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please provide an image of the item.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const token = user?.token || storedUser?.token;
      if (!token) throw new Error('Not authenticated');

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('condition', formData.condition);
      data.append('image', file);

      await api.post('/api/items', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="w-full max-w-3xl mx-auto"
      style={{
        paddingLeft: 'var(--space-page-x)',
        paddingRight: 'var(--space-page-x)',
        paddingTop: 'clamp(1.5rem, 4vw, 4rem)',
        paddingBottom: 'var(--space-page-bottom)',
      }}
    >
      <div className="mb-5 sm:mb-6 md:mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary mb-1.5 sm:mb-2">List an Item</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Share your equipment with the campus community.</p>
      </div>

      <Card className="p-4 sm:p-6 md:p-10">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-semibold border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-primary">Item Title</label>
            <Input 
              type="text" 
              name="title" 
              placeholder="e.g. TI-84 Plus Graphing Calculator"
              value={formData.title} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
                <option value="Lab Equipment">Lab Equipment</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-primary">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="flex w-full rounded-md border border-border bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent resize-none"
              placeholder="Provide details about the item's features, model number, and any accessories included."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-primary">Item Image</label>
            <div className="relative border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors group cursor-pointer overflow-hidden min-h-[200px]">
              <input 
                type="file" 
                onChange={handleFileChange} 
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                required 
              />
              {preview ? (
                <div className="absolute inset-0">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-bold flex items-center gap-2"><UploadCloud size={20}/> Change Image</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 text-muted-foreground group-hover:text-accent transition-colors">
                    <ImageIcon size={28} />
                  </div>
                  <p className="font-semibold text-primary mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (Max 5MB)</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Publishing...' : 'Publish Listing'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddItem;
