import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Store,
  PlusCircle,
  Heart,
  MessageSquare,
  Search,
  Moon,
  Sun,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  Bell,
  Shield,
  Tag,
  Package,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount, notifications, markAllRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-nav transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
              ⚡
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white dark:text-white dark:group-hover:text-cyan-400 transition-colors">
                Campus<span className="gradient-text">Swap</span>
              </span>
              <span className="hidden sm:block text-[10px] text-cyan-400 tracking-wider font-semibold uppercase">
                Student Marketplace
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products, categories, hostels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/60 dark:bg-slate-900/80 border border-slate-700/60 rounded-full pl-10 pr-4 py-1.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/') ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/marketplace') ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Store className="w-4 h-4" /> Marketplace
            </Link>

            {user && (
              <>
                <Link
                  to="/sell"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/sell') ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-cyan-400" /> Sell Item
                </Link>
                <Link
                  to="/mylistings"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/mylistings') ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Tag className="w-4 h-4" /> My Listings
                </Link>
                <Link
                  to="/wishlist"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/wishlist') ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Heart className="w-4 h-4 text-rose-400" /> Wishlist
                </Link>
                <Link
                  to="/chat"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 relative ${
                    isActive('/chat') ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-cyan-400" /> Messages
                </Link>
              </>
            )}

            <Link
              to="/lostfound"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/lostfound') ? 'bg-cyan-500/10 text-cyan-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-400" /> Lost & Found
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/admin') ? 'bg-purple-500/10 text-purple-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Shield className="w-4 h-4 text-purple-400" /> Admin
              </Link>
            )}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Notifications Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifMenu(!showNotifMenu);
                    if (unreadCount > 0) markAllRead();
                  }}
                  className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/60 relative transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-cyan-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifMenu && (
                  <div className="absolute right-0 mt-2 w-80 glass-modal rounded-2xl shadow-2xl p-4 border border-slate-700/60 z-50 max-h-96 overflow-y-auto">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-700/40 pb-2">
                      <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                        <Bell className="w-4 h-4 text-cyan-400" /> Notifications
                      </h4>
                      <button
                        onClick={markAllRead}
                        className="text-[11px] text-cyan-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    </div>

                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">No notifications yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {notifications.map((n) => (
                          <Link
                            key={n._id}
                            to={n.link || '#'}
                            onClick={() => setShowNotifMenu(false)}
                            className={`block p-2.5 rounded-xl text-xs transition-all ${
                              n.isRead ? 'bg-slate-900/40 text-slate-300' : 'bg-cyan-950/40 border border-cyan-500/30 text-slate-100'
                            }`}
                          >
                            <p className="font-semibold text-cyan-400">{n.title}</p>
                            <p className="text-slate-300 mt-0.5">{n.message}</p>
                            <span className="text-[10px] text-slate-500 mt-1 block">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
            </button>

            {/* User Dropdown / Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:bg-slate-800/60 p-1.5 rounded-xl transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-500/40"
                  />
                  <span className="hidden sm:block text-xs font-semibold text-slate-200">
                    {user.name.split(' ')[0]}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search marketplace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100"
              />
            </div>
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              <Store className="w-4 h-4 text-cyan-400" /> Marketplace
            </Link>

            {user && (
              <>
                <Link
                  to="/sell"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-cyan-400" /> Sell Item
                </Link>
                <Link
                  to="/mylistings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                >
                  <Tag className="w-4 h-4 text-cyan-400" /> My Listings
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 text-rose-400" /> Wishlist
                </Link>
                <Link
                  to="/chat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-cyan-400" /> Messages
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-cyan-400" /> Profile
                </Link>
              </>
            )}

            <Link
              to="/lostfound"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-amber-400" /> Lost & Found
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 flex items-center gap-2 col-span-2"
              >
                <Shield className="w-4 h-4 text-purple-400" /> Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
