import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';
import {
  User,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Star,
  Edit2,
  Tag,
  MessageSquare,
  CheckCircle2,
  X,
  Camera,
} from 'lucide-react';
import toast from 'react-hot-toast';

const HOSTELS = ['Hostel A', 'Hostel B', 'Hostel C', 'Hostel D', 'Girls Hostel 1', 'Girls Hostel 2', 'Admin Block'];

export const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [activeListings, setActiveListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'reviews'
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [hostel, setHostel] = useState(user?.hostel || 'Hostel A');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const { data: listingsRes } = await axiosInstance.get('/products/mylistings');
      const { data: reviewsRes } = await axiosInstance.get(`/reviews/seller/${user._id}`);
      setActiveListings(listingsRes || []);
      setReviews(reviewsRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const success = await updateProfile({ name, hostel, phone, avatar });
    setSaving(false);
    if (success) {
      setIsEditing(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Glass Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-cyan-500/40 shadow-xl"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-slate-100">{user.name}</h1>
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                {user.role === 'admin' && (
                  <span className="bg-purple-500/20 text-purple-400 border border-purple-500/40 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </div>

              <p className="text-xs text-cyan-400 font-semibold flex items-center justify-center sm:justify-start gap-2">
                <span>Roll No: {user.rollNumber}</span> •
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {user.hostel}</span>
              </p>

              <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-3 pt-1">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {user.email}</span>
                {user.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {user.phone}</span>}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setName(user.name);
              setHostel(user.hostel);
              setPhone(user.phone || '');
              setAvatar(user.avatar || '');
              setIsEditing(true);
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-cyan-400" /> Edit Profile
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-6">
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 text-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Items Sold</span>
            <span className="text-2xl font-black text-cyan-400 mt-1 block">{user.itemsSold || 0}</span>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 text-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Active Listings</span>
            <span className="text-2xl font-black text-blue-400 mt-1 block">
              {activeListings.filter((l) => l.status === 'active').length}
            </span>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 text-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Seller Rating</span>
            <span className="text-2xl font-black text-amber-400 mt-1 flex items-center justify-center gap-1">
              <Star className="w-5 h-5 fill-amber-400" /> {user.ratingAverage || 5.0}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 text-xs font-extrabold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'listings' ? 'text-cyan-400 border-cyan-400' : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <Tag className="w-4 h-4" /> My Listed Products ({activeListings.length})
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 text-xs font-extrabold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'reviews' ? 'text-cyan-400 border-cyan-400' : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <Star className="w-4 h-4 text-amber-400" /> Student Reviews ({reviews.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'listings' ? (
        activeListings.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-12">You haven't listed any items yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeListings.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )
      ) : reviews.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-12">No seller reviews received yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div key={rev._id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.reviewer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-slate-100 text-xs">{rev.reviewer?.name || 'Buyer'}</h4>
                    <span className="text-[10px] text-slate-400">{rev.reviewer?.hostel}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-950/60 border border-amber-500/30 px-2 py-1 rounded-lg text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {rev.rating}.0
                </div>
              </div>

              <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>

              <span className="text-[10px] text-slate-500 block">
                {new Date(rev.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-modal w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-lg text-slate-100 mb-4">Edit Profile</h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hostel</label>
                <select
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  {HOSTELS.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
