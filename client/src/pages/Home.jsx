import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { ProductCard } from '../components/ProductCard';
import {
  Search,
  BookOpen,
  Laptop,
  Home as HomeIcon,
  Bike,
  Shirt,
  Trophy,
  Music,
  Armchair,
  Layers,
  TrendingUp,
  Users,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Books', icon: BookOpen, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { name: 'Electronics', icon: Laptop, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
  { name: 'Hostel Essentials', icon: HomeIcon, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { name: 'Cycles', icon: Bike, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  { name: 'Clothing', icon: Shirt, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { name: 'Sports', icon: Trophy, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  { name: 'Musical Instruments', icon: Music, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
  { name: 'Furniture', icon: Armchair, color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
  { name: 'Others', icon: Layers, color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' },
];

export const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [stats, setStats] = useState({ totalListings: 120, activeUsers: 450, successfulTrades: 380 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: featuredRes } = await axiosInstance.get('/products?limit=4&sort=newest');
        const { data: latestRes } = await axiosInstance.get('/products?limit=8&sort=newest');
        setFeaturedProducts(featuredRes.products?.filter(p => p.isBoosted).slice(0, 4) || featuredRes.products?.slice(0, 4) || []);
        setLatestProducts(latestRes.products || []);

        // Optional stats fetch if admin endpoint or calculated
        const { data: adminStats } = await axiosInstance.get('/admin/stats').catch(() => ({ data: null }));
        if (adminStats) {
          setStats({
            totalListings: adminStats.totalListings || 120,
            activeUsers: adminStats.totalUsers || 450,
            successfulTrades: adminStats.successfulTrades || 380,
          });
        }
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 border-b border-slate-800/60">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold tracking-wide uppercase shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-4 h-4" /> Exclusive Student Marketplace
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-100 tracking-tight leading-[1.1]">
            Buy. Sell. Exchange.<br />
            <span className="gradient-text">Inside Your Campus.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            CampusSwap connects verified college students to trade textbooks, electronics, cycles, hostel essentials & gear safely within campus gates.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <div className="glass-card rounded-2xl p-2 flex items-center gap-2 border border-slate-700/80 shadow-2xl focus-within:border-cyan-500 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search by product name, category, or hostel (e.g. Engineering Maths, Hostel A)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-slate-100 placeholder-slate-400 text-sm focus:outline-none py-2"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-sm flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all shrink-0"
              >
                Search <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 pt-4 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-cyan-400" /> Verified Student Emails</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400" /> Zero Shipping / Instant Campus Meetups</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Direct Buyer-Seller Chat</span>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card rounded-3xl p-6 text-center border border-cyan-500/20 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-100">{stats.totalListings}+</h3>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Total Active Listings</p>
          </div>

          <div className="glass-card rounded-3xl p-6 text-center border border-blue-500/20 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-100">{stats.activeUsers}+</h3>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Campus Students Joined</p>
          </div>

          <div className="glass-card rounded-3xl p-6 text-center border border-emerald-500/20 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-100">{stats.successfulTrades}+</h3>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Successful Trades Done</p>
          </div>
        </div>
      </section>

      {/* Browse Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100">Browse Categories</h2>
            <p className="text-xs text-slate-400 mt-1">Explore items listed across campus departments and hostels</p>
          </div>
          <Link to="/marketplace" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => navigate(`/marketplace?category=${encodeURIComponent(cat.name)}`)}
                className="glass-card rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:border-cyan-500/60 hover:scale-105 transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cat.color} group-hover:shadow-lg transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 line-clamp-1">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Listings */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-100">Featured & Boosted</h2>
                <p className="text-xs text-slate-400">High demand student listings with priority visibility</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100">Latest Campus Listings</h2>
            <p className="text-xs text-slate-400">Freshly posted items from fellow students</p>
          </div>
          <Link to="/marketplace" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
            See Marketplace <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="glass-card rounded-2xl h-80 animate-pulse bg-slate-900/50" />
            ))}
          </div>
        ) : latestProducts.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-12">No listings available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-3xl font-extrabold text-slate-100">Have items sitting unused in your hostel room?</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Turn your old textbooks, lab coats, cycles, or electronics into cash instantly by listing them on CampusSwap.
            </p>
          </div>
          <Link
            to="/sell"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 hover:scale-105 transition-transform shrink-0"
          >
            Post Your First Item
          </Link>
        </div>
      </section>
    </div>
  );
};
