import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { X, Edit2, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EditItemModal = ({ item, onClose, onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: item.title || '',
    description: item.description || '',
    category: item.category || 'Electronics',
    condition: item.condition || 'Good',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(item.imageUrl || null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    setError(null);

    try {
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const token = user?.token || storedUser?.token;
      
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('condition', formData.condition);
      if (file) {
        data.append('image', file);
      }

      const response = await api.put(`/api/items/${item._id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item.');
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
          className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl"
        >
          <Card className="overflow-hidden shadow-2xl border-0">
            <div className="bg-muted px-6 py-4 flex justify-between items-center sticky top-0 z-20 border-b border-border">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <Edit2 size={20} className="text-accent" /> Edit Listing
              </h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-black/5">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm font-semibold border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={submitHandler} className="space-y-5">
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-primary">Item Title</label>
                  <Input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
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
                  <div className="space-y-1.5">
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

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-primary">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="flex w-full rounded-md border border-border bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-primary">Update Image (Optional)</label>
                  <div className="relative border border-border rounded-xl p-2 flex items-center gap-4 bg-muted/30 hover:bg-muted/50 transition-colors group cursor-pointer overflow-hidden h-24">
                    <input 
                      type="file" 
                      onChange={handleFileChange} 
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    {preview && (
                      <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden border border-border bg-white">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 flex items-center gap-2 text-sm font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                      <UploadCloud size={18} />
                      {file ? file.name : "Click to select a new image"}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3 sticky bottom-0 bg-white">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Saving Changes...' : 'Save Changes'}
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

export default EditItemModal;
