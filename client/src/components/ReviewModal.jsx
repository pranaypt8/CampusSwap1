import React, { useState } from 'react';
import { X, Star, MessageSquare } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

export const ReviewModal = ({ seller, productId, isOpen, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !seller) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a review comment.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/reviews', {
        sellerId: seller._id,
        rating,
        comment,
        productId,
      });

      toast.success('Review submitted successfully!');
      if (onReviewSubmitted) onReviewSubmitted(data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-modal w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <img
            src={seller.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={seller.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-cyan-500/40"
          />
          <div>
            <h3 className="font-bold text-base text-slate-100">Rate & Review Seller</h3>
            <p className="text-xs text-cyan-400 font-medium">{seller.name} ({seller.hostel})</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Rating</label>
            <div className="flex gap-2 justify-center py-2 bg-slate-900/60 rounded-2xl border border-slate-800">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Written Review
            </label>
            <textarea
              rows="4"
              placeholder="Share your experience dealing with this seller (communication, item condition, punctuality)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
