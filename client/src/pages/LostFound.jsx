import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  PlusCircle,
  Search,
  MapPin,
  Calendar,
  PhoneCall,
  CheckCircle2,
  Trash2,
  X,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Documents', 'Keys & Cards', 'Bags & Wallets', 'Clothing', 'Others'];

export const LostFound = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [activeType, setActiveType] = useState('all'); // 'all' | 'lost' | 'found'
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postType, setPostType] = useState('lost');
  const [postCategory, setPostCategory] = useState('Electronics');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [contactInfo, setContactInfo] = useState(user ? `Hostel ${user.hostel} / ${user.phone || user.email}` : '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLostFoundPosts();
  }, [activeType, category, search]);

  const fetchLostFoundPosts = async () => {
    setLoading(true);
    try {
      const qp = new URLSearchParams();
      if (activeType !== 'all') qp.append('type', activeType);
      if (category !== 'All') qp.append('category', category);
      if (search.trim()) qp.append('search', search.trim());

      const { data } = await axiosInstance.get(`/lostfound?${qp.toString()}`);
      setPosts(data || []);
    } catch (err) {
      toast.error('Could not load Lost & Found posts.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to post a Lost & Found item.');
      return;
    }

    if (!title || !description || !location || !date || !contactInfo) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axiosInstance.post('/lostfound', {
        type: postType,
        category: postCategory,
        title,
        description,
        location,
        date,
        contactInfo,
      });

      toast.success(`Successfully posted ${postType.toUpperCase()} item!`);
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setLocation('');
      fetchLostFoundPosts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish post.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkResolved = async (id) => {
    try {
      const { data } = await axiosInstance.patch(`/lostfound/${id}/resolved`);
      toast.success(data.message);
      fetchLostFoundPosts();
    } catch (err) {
      toast.error('Failed to mark as resolved.');
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await axiosInstance.delete(`/lostfound/${id}`);
      toast.success('Post removed.');
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error('Could not delete post.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-100 tracking-tight">Lost & Found Portal</h1>
            <p className="text-xs text-slate-400 mt-1">Report misplaced items or list belongings found around campus</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 hover:opacity-90 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Create Lost / Found Post
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        {/* Type selector pills */}
        <div className="flex gap-2 w-full md:w-auto">
          {['all', 'lost', 'found'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                activeType === t
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {t === 'all' ? 'All Posts' : `${t} Items`}
            </button>
          ))}
        </div>

        {/* Search & Category */}
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card rounded-2xl h-56 animate-pulse bg-slate-900/40" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-3 border border-slate-800">
          <Compass className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-slate-100">No posts found</h3>
          <p className="text-xs text-slate-400">Be the first to post a lost or found notice on campus.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const isOwner = user && user._id === post.user?._id;
            const isLost = post.type === 'lost';
            return (
              <div
                key={post._id}
                className="glass-card rounded-3xl p-6 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                        isLost ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {isLost ? 'Misplaced / Lost' : 'Item Found'}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg">
                      {post.category}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-100 text-lg line-clamp-1">{post.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{post.description}</p>

                  <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{post.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Date: {post.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-200 font-semibold pt-1">
                      <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Contact: {post.contactInfo}</span>
                    </div>
                  </div>
                </div>

                {/* Footer status / Action */}
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                  <span className="text-[11px] text-slate-500">
                    By {post.user?.name || 'Student'} ({post.user?.hostel})
                  </span>

                  {(isOwner || user?.role === 'admin') && (
                    <div className="flex items-center gap-2">
                      {post.status !== 'resolved' && (
                        <button
                          onClick={() => handleMarkResolved(post._id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold"
                        >
                          Resolve
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Lost & Found Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-modal w-full max-w-lg rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-xl text-slate-100 mb-4 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" /> Create Lost or Found Notice
            </h3>

            <form onSubmit={handleCreatePost} className="space-y-4">
              {/* Type Switch */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPostType('lost')}
                  className={`py-2 text-xs font-extrabold rounded-lg transition-colors ${
                    postType === 'lost' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400'
                  }`}
                >
                  I Lost Something
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('found')}
                  className={`py-2 text-xs font-extrabold rounded-lg transition-colors ${
                    postType === 'found' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'
                  }`}
                >
                  I Found Something
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Item Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Blue Airpods Case / Student ID Card"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Location *</label>
                <input
                  type="text"
                  placeholder="e.g. Near Library 2nd Floor / SAC Canteen"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Details *</label>
                <textarea
                  rows="3"
                  placeholder="Describe color, brand, unique identifiers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Info *</label>
                <input
                  type="text"
                  placeholder="e.g. Phone 9876543210 / Hostel A-102"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
