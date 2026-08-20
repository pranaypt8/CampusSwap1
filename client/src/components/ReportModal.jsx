import React, { useState } from 'react';
import { X, Flag, AlertTriangle } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

export const ReportModal = ({ product, isOpen, onClose }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error('Please describe the reason for reporting.');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(`/products/${product._id}/report`, { reason });
      toast.success('Report submitted for admin review.');
      onClose();
      setReason('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit report.');
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
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-100">Report Listing</h3>
            <p className="text-xs text-slate-400 line-clamp-1">{product.title}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Reason for reporting
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-200 focus:border-rose-500 focus:outline-none mb-2"
              required
            >
              <option value="">Select reason...</option>
              <option value="Prohibited or Illegal Item">Prohibited or Illegal Item</option>
              <option value="Spam or Misleading Description">Spam or Misleading Description</option>
              <option value="Fraudulent / Unrealistic Price">Fraudulent / Unrealistic Price</option>
              <option value="Inappropriate Content or Media">Inappropriate Content or Media</option>
              <option value="Other Safety Issue">Other Safety Issue</option>
            </select>
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
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20"
            >
              <Flag className="w-3.5 h-3.5" /> Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
