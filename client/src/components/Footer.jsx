import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-12 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-lg">
                ⚡
              </div>
              <span className="text-xl font-black text-white">
                Campus<span className="gradient-text">Swap</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Buy. Sell. Exchange. Inside Your Campus. The ultimate secure marketplace designed exclusively for college students.
            </p>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium">
              <ShieldCheck className="w-4 h-4" /> Verified Student Network
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/marketplace" className="hover:text-cyan-400 transition-colors">Marketplace</Link></li>
              <li><Link to="/sell" className="hover:text-cyan-400 transition-colors">Sell an Item</Link></li>
              <li><Link to="/lostfound" className="hover:text-cyan-400 transition-colors">Lost & Found Portal</Link></li>
              <li><Link to="/wishlist" className="hover:text-cyan-400 transition-colors">Saved Wishlist</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 mb-4">Top Categories</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/marketplace?category=Books" className="hover:text-cyan-400 transition-colors">Textbooks & Notes</Link></li>
              <li><Link to="/marketplace?category=Electronics" className="hover:text-cyan-400 transition-colors">Laptops & Accessories</Link></li>
              <li><Link to="/marketplace?category=Cycles" className="hover:text-cyan-400 transition-colors">Bicycles & Gear</Link></li>
              <li><Link to="/marketplace?category=Hostel Essentials" className="hover:text-cyan-400 transition-colors">Hostel Room Setup</Link></li>
            </ul>
          </div>

          {/* Campus Safety */}
          <div>
            <h4 className="text-sm font-bold text-slate-200 mb-4">Campus Meet-Up Hubs</h4>
            <p className="text-xs text-slate-400 mb-3">
              Always trade at verified safe zones inside campus premises:
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Central Library</span>
              <span className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">SAC Arena</span>
              <span className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Main Gate</span>
              <span className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Academic Block</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CampusSwap. Designed for Student Communities.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for College Campuses
          </p>
        </div>
      </div>
    </footer>
  );
};
