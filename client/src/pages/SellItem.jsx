import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Upload, X, Tag, Sparkles, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Books',
  'Electronics',
  'Hostel Essentials',
  'Cycles',
  'Clothing',
  'Sports',
  'Musical Instruments',
  'Furniture',
  'Others',
];

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];
const HOSTELS = ['Hostel A', 'Hostel B', 'Hostel C', 'Hostel D', 'Girls Hostel 1', 'Girls Hostel 2', 'Admin Block'];

export const SellItem = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Books');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('Good');
  const [hostel, setHostel] = useState(user?.hostel || 'Hostel A');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (imageFiles.length + files.length > 6) {
      toast.error('You can upload a maximum of 6 images per listing.');
      return;
    }

    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !price || !category || !condition || !hostel) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('condition', condition);
      formData.append('hostel', hostel);
      formData.append('isNegotiable', isNegotiable);

      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      const { data } = await axiosInstance.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Listing created successfully! 🎉');
      navigate(`/product/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">Sell an Item on Campus</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          List your textbooks, electronics, cycles, or hostel essentials for fellow students to buy or exchange.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-10 space-y-6 border border-slate-800 shadow-2xl">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
            Product Title *
          </label>
          <input
            type="text"
            placeholder="e.g. Introduction to Algorithms CLRS 3rd Edition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            required
          />
        </div>

        {/* Category & Condition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Condition *
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond} className="bg-slate-900">{cond}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price, Negotiable Toggle, Hostel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Price (₹) *
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 750"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-cyan-400 font-bold focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Hostel / Location *
            </label>
            <select
              value={hostel}
              onChange={(e) => setHostel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              {HOSTELS.map((h) => (
                <option key={h} value={h} className="bg-slate-900">{h}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <input
              type="checkbox"
              id="negotiable"
              checked={isNegotiable}
              onChange={(e) => setIsNegotiable(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
            <label htmlFor="negotiable" className="text-xs font-semibold text-slate-200 cursor-pointer">
              Price Negotiable
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
            Detailed Description *
          </label>
          <textarea
            rows="5"
            placeholder="Mention details like usage duration, includes accessories/box, reason for selling..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none"
            required
          />
        </div>

        {/* Image Upload up to 6 images */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-cyan-400" /> Upload Images (Up to 6)
            </label>
            <span className="text-xs text-slate-400 font-semibold">{imagePreviews.length} / 6 uploaded</span>
          </div>

          {/* Previews grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
            {imagePreviews.map((preview, idx) => (
              <div key={idx} className="relative h-24 rounded-2xl overflow-hidden border border-cyan-500/40 group">
                <img src={preview} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-slate-950/80 text-rose-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {imagePreviews.length < 6 && (
              <label className="h-24 rounded-2xl border-2 border-dashed border-slate-700/80 hover:border-cyan-500 flex flex-col items-center justify-center cursor-pointer bg-slate-950/50 hover:bg-slate-900/50 transition-colors">
                <Upload className="w-5 h-5 text-cyan-400 mb-1" />
                <span className="text-[10px] text-slate-400 font-bold">Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Publishing Listing...' : 'Publish Listing Now 🚀'}
        </button>
      </form>
    </div>
  );
};
