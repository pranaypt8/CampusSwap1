import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Tag, Sparkles, CheckCircle2, Trash2, Edit3, Eye, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'sold'

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const { data } = await axiosInstance.get('/products/mylistings');
      setListings(data || []);
    } catch (err) {
      toast.error('Failed to load listings.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSold = async (id) => {
    try {
      const { data } = await axiosInstance.patch(`/products/${id}/sold`);
      toast.success(data.message);
      fetchMyListings();
    } catch (err) {
      toast.error('Could not mark as sold.');
    }
  };

  const handleBoostListing = async (id) => {
    try {
      const { data } = await axiosInstance.patch(`/products/${id}/boost`);
      toast.success('⚡ Listing boosted to top of search results!');
      fetchMyListings();
    } catch (err) {
      toast.error('Could not boost listing.');
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await axiosInstance.delete(`/products/${id}`);
      toast.success('Listing deleted.');
      setListings((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      toast.error('Failed to delete listing.');
    }
  };

  const filteredListings = listings.filter((item) => item.status === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">My Campus Listings</h1>
          <p className="text-xs text-slate-400 mt-1">Manage active items, mark trades as completed, or boost visibility</p>
        </div>

        <Link
          to="/sell"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Post New Item
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 text-xs font-bold transition-colors relative ${
            activeTab === 'active' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Active Listings ({listings.filter((l) => l.status === 'active').length})
        </button>
        <button
          onClick={() => setActiveTab('sold')}
          className={`pb-3 text-xs font-bold transition-colors relative ${
            activeTab === 'sold' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Sold Out ({listings.filter((l) => l.status === 'sold').length})
        </button>
      </div>

      {/* Listings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card rounded-2xl h-32 animate-pulse bg-slate-900/40" />
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-slate-800">
          <p className="text-slate-400 text-sm">No {activeTab} listings found.</p>
          <Link
            to="/sell"
            className="inline-block px-4 py-2 rounded-xl bg-slate-800 text-cyan-400 text-xs font-bold hover:bg-slate-700"
          >
            Create a Listing
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map((item) => (
            <div
              key={item._id}
              className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 hover:border-cyan-500/30 transition-all"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'}
                  alt={item.title}
                  className="w-20 h-20 rounded-xl object-cover bg-slate-900 border border-slate-700/60 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                      {item.category}
                    </span>
                    {item.isBoosted && (
                      <span className="text-[10px] font-black text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Boosted
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-100 text-base line-clamp-1">{item.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="font-extrabold text-cyan-400 text-sm">₹{item.price.toLocaleString()}</span>
                    <span>• {item.condition}</span>
                    <span>• {item.viewsCount || 0} views</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                {item.status === 'active' && (
                  <>
                    <button
                      onClick={() => handleBoostListing(item._id)}
                      disabled={item.isBoosted}
                      className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1 transition-all disabled:opacity-40"
                      title="Boost visibility to top of search results"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Boost UI
                    </button>

                    <button
                      onClick={() => handleMarkAsSold(item._id)}
                      className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Sold
                    </button>
                  </>
                )}

                <Link
                  to={`/product/${item._id}`}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
                  title="View Item"
                >
                  <Eye className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleDeleteListing(item._id)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                  title="Delete Listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
