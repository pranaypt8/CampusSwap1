import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { ProductCard } from '../components/ProductCard';
import { Heart, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      const { data } = await axiosInstance.get('/wishlist');
      setProducts(data || []);
    } catch (err) {
      toast.error('Could not load saved wishlist items.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = (productId) => {
    setProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <Heart className="w-6 h-6 fill-rose-500" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Saved Wishlist</h1>
          <p className="text-xs text-slate-400 mt-1">Bookmarked items you are interested in buying</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="glass-card rounded-2xl h-80 animate-pulse bg-slate-900/40" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-slate-800">
          <Heart className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-slate-100">Your wishlist is empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse the marketplace and click the heart icon on any product to save it here.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs"
          >
            <Store className="w-4 h-4" /> Explore Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onWishlistToggle={handleRemoveFromWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};
