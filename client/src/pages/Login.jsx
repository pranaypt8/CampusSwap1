import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, Sparkles, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/marketplace');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8 glass-card rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-2xl mx-auto shadow-lg shadow-cyan-500/20">
            ⚡
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Student Login</h2>
          <p className="text-xs text-slate-400">Welcome back! Sign in with your college email.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">College Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="rohan.s@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" /> {loading ? 'Logging in...' : 'Login to CampusSwap'}
          </button>
        </form>

        <div className="text-center border-t border-slate-800/80 pt-4 text-xs text-slate-400">
          Don't have a student account?{' '}
          <Link to="/register" className="text-cyan-400 font-bold hover:underline">
            Register here
          </Link>
        </div>

        {/* Demo credentials hint */}
        <div className="bg-slate-950/80 border border-cyan-500/20 p-3 rounded-2xl text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-cyan-400">Quick Demo Logins (Password: password123):</p>
          <p>• Student: <code className="text-slate-200">rohan.s@campus.edu</code></p>
          <p>• Admin: <code className="text-slate-200">admin@campus.edu</code></p>
        </div>
      </div>
    </div>
  );
};
