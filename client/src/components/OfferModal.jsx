import React, { useState } from 'react';
import { X, Tag, Send } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

export const OfferModal = ({ product, isOpen, onClose, onOfferSubmitted }) => {
  const [offeredPrice, setOfferedPrice] = useState(product?.price ? Math.round(product.price * 0.9) : 0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offeredPrice || Number(offeredPrice) <= 0) {
      toast.error('Please enter a valid offer price.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/offers', {
        productId: product._id,
        offeredPrice: Number(offeredPrice),
        message,
      });

      toast.success('Offer submitted to seller successfully!');
      if (onOfferSubmitted) onOfferSubmitted(data);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send offer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-modal w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-100">Make an Offer</h3>
            <p className="text-xs text-slate-400 line-clamp-1">{product.title}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 text-xs flex justify-between items-center">
            <span className="text-slate-400">Listing Price:</span>
            <span className="font-extrabold text-cyan-400 text-base">₹{product.price.toLocaleString()}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Your Offer Price (₹)
            </label>
            <input
              type="number"
              min="1"
              value={offeredPrice}
              onChange={(e) => setOfferedPrice(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-lg font-bold text-cyan-400 focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Note to Seller (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="e.g. Can meet near Central Library today evening for cash payment..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
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
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 hover:opacity-90"
            >
              <Send className="w-3.5 h-3.5" /> Submit Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
