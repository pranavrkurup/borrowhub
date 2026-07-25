import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';
import { Link } from 'react-router-dom';
import { Search, X, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const CATEGORIES = ['All', 'Electronics', 'Books', 'Lab Equipment', 'Sports', 'Other'];

const Feed = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchItems(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const fetchItems = async (search, category) => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (search && search.trim() !== '') params.search = search.trim();
      if (category && category !== 'All') params.category = category;

      const res = await api.get('/api/items', { params });
      setItems(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch items from the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleItemStatusChange = (updatedItem) => {
    setItems((prev) => prev.map((item) => (item._id === updatedItem._id ? updatedItem : item)));
    setSuccessMessage('Item requested successfully!');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="w-full pb-24 pt-12 px-6 flex flex-col md:flex-row gap-8">
      
      {/* Left Sidebar (Filters) */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="sticky top-24 glass-panel p-6">
          <div className="flex items-center gap-2 mb-6 text-primary">
            <Filter size={20} />
            <h2 className="text-lg font-bold">Filters</h2>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Categories</h3>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-accent text-accent-foreground font-semibold shadow-sm' 
                    : 'text-secondary hover:bg-muted font-medium'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search calculators, cameras, lab kits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base rounded-xl bg-white/60 backdrop-blur-sm border-white/80 shadow-sm"
            />
          </div>
          {(searchQuery || selectedCategory !== 'All') && (
            <Button 
              variant="outline" 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="h-12 px-6 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
            >
              <X className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
          )}
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="bg-status-available-bg text-status-available p-4 rounded-xl mb-6 font-semibold border border-status-available/20 shadow-sm">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-semibold border border-red-200 shadow-sm">
            {error}
          </div>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-panel h-[420px] p-0 overflow-hidden animate-pulse">
                <div className="w-full h-52 bg-muted/50" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-6 w-3/4 bg-muted/50 rounded-md" />
                  <div className="h-4 w-full bg-muted/50 rounded-md" />
                  <div className="h-4 w-5/6 bg-muted/50 rounded-md" />
                  <div className="mt-auto pt-4 h-10 w-full bg-muted/50 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="glass-panel p-12 text-center max-w-lg mx-auto mt-12">
            <h3 className="text-2xl font-bold text-primary mb-3">No items found</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {searchQuery || selectedCategory !== 'All' 
                ? 'We couldn\'t find any items matching your filters. Try clearing your search query or selecting another category.' 
                : 'Be the first student to list equipment or a textbook on BorrowHub!'}
            </p>
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link to={user ? "/add-item" : "/login"}>
                {user ? "+ List an Item Now" : "Sign In to Get Started"}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
};

export default Feed;
