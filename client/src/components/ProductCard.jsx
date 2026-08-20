import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Tag, Sparkles, ShieldCheck, Star } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

export const ProductCard = ({ product, onWishlistToggle }) => {
  const { user } = useAuth();
  const { wishlistIds, fetchWishlist } = useNotifications();
  const [isSaved, setIsSaved] = useState(() => wishlistIds.includes(product._id));
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to save items to wishlist.');
      return;
    }

    setWishlistLoading(true);
    try {
      const { data } = await axiosInstance.post('/wishlist/toggle', { productId: product._id });
      setIsSaved(data.isSaved);
      fetchWishlist();
      toast.success(data.message);
      if (onWishlistToggle) onWishlistToggle(product._id, data.isSaved);
    } catch (err) {
      toast.error('Could not update wishlist.');
    } finally {
      setWishlistLoading(false);
    }
  };

  const sellerName = product.seller?.name || 'Student Seller';
  const sellerHostel = product.sellerHostel || product.seller?.hostel || 'Campus Hostel';
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800';

  return (
    <div className="group glass-card rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col h-full relative">
      {/* Boosted badge */}
      {product.isBoosted && (
        <span className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
          <Sparkles className="w-3 h-3 fill-slate-950" /> Boosted
        </span>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        disabled={wishlistLoading}
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full glass-card flex items-center justify-center transition-transform active:scale-90 ${
          isSaved ? 'text-rose-500 bg-rose-500/20 border-rose-500/50' : 'text-slate-300 hover:text-rose-400 hover:bg-slate-800/80'
        }`}
        title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
      >
        <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
      </button>

      {/* Image Container */}
      <Link to={`/product/${product._id}`} className="relative block h-48 overflow-hidden bg-slate-900">
        <img
          src={mainImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.status === 'sold' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-500 text-white font-black text-xs uppercase px-3 py-1.5 rounded-full tracking-wider shadow-lg">
              SOLD OUT
            </span>
          </div>
        )}
      </Link>

      {/* Card Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 gap-2">
            <span className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-semibold truncate">
              {product.category}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
              {product.condition}
            </span>
          </div>

          <Link to={`/product/${product._id}`}>
            <h3 className="font-bold text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-1 text-base">
              {product.title}
            </h3>
          </Link>
        </div>

        <div>
          {/* Price */}
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-xl font-extrabold text-cyan-400">
              ₹{product.price.toLocaleString()}
            </span>
            {product.isNegotiable && (
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-500/30">
                Negotiable
              </span>
            )}
          </div>

          {/* Seller Hostel & Name */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
            <div className="flex items-center gap-1 text-slate-300 truncate">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{sellerHostel}</span>
            </div>
            <span className="text-[11px] text-slate-500 shrink-0">
              {new Date(product.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* View Details CTA */}
        <Link
          to={`/product/${product._id}`}
          className="w-full py-2 text-xs font-bold rounded-xl bg-slate-800/80 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:text-slate-950 text-slate-200 transition-all text-center block shadow-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
