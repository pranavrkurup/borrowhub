import React, { useState } from 'react';
import axios from 'axios';

const CATEGORIES = ['Electronics', 'Books', 'Lab Equipment', 'Sports', 'Other'];
const CONDITIONS = ['Like New', 'Good', 'Fair'];

const EditItemModal = ({ item, user, onClose, onSuccess }) => {
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [category, setCategory] = useState(item?.category || 'Electronics');
  const [condition, setCondition] = useState(item?.condition || 'Good');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const token = user?.token || storedUser?.token;

      if (!token) {
        setError('You must be logged in to edit an item.');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.put(
        `https://borrowhub-backend-9hji.onrender.com/api/items/${item._id}`,
        {
          title: title.trim(),
          description: description.trim(),
          category,
          condition,
        },
        config
      );

      setLoading(false);
      if (onSuccess) {
        onSuccess(response.data);
      }
      onClose();
    } catch (err) {
      console.error('Edit item error:', err);
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Failed to update item details.');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white/40 backdrop-blur-md border border-white/60 shadow-xl rounded-xl p-6 w-full max-w-md relative text-[#485550]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#485550]">Edit Item Details</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#485550] font-bold text-lg hover:opacity-75"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-[#485550] mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-white/70 border border-[#485550]/30 rounded-lg px-3 py-2 text-[#485550] font-medium outline-none focus:ring-2 focus:ring-[#C0EB6A]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full">
              <label className="block text-sm font-bold text-[#485550] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/70 border border-[#485550]/30 rounded-lg px-3 py-2 text-[#485550] font-medium outline-none focus:ring-2 focus:ring-[#C0EB6A]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <label className="block text-sm font-bold text-[#485550] mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-white/70 border border-[#485550]/30 rounded-lg px-3 py-2 text-[#485550] font-medium outline-none focus:ring-2 focus:ring-[#C0EB6A]"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#485550] mb-1">
              Description
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full bg-white/70 border border-[#485550]/30 rounded-lg px-3 py-2 text-[#485550] font-medium outline-none focus:ring-2 focus:ring-[#C0EB6A]"
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-transparent border-2 border-[#485550] text-[#485550] font-bold rounded-lg hover:bg-[#485550] hover:text-[#F4F6F0] transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#C0EB6A] text-[#485550] font-bold px-5 py-2 rounded-lg shadow-md hover:bg-[#aade49] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;
