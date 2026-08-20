import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import {
  Shield,
  Users,
  Tag,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  UserX,
  UserCheck,
  Search,
  Activity,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' | 'users'
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const { data: statsData } = await axiosInstance.get('/admin/stats');
      const { data: usersData } = await axiosInstance.get('/admin/users');
      const { data: reportsData } = await axiosInstance.get('/admin/reports');

      setStats(statsData);
      setUsers(usersData || []);
      setReports(reportsData || []);
    } catch (err) {
      toast.error('Failed to load admin analytics data.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (userId) => {
    try {
      const { data } = await axiosInstance.patch(`/admin/users/${userId}/ban`);
      toast.success(data.message);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBanned: data.isBanned } : u))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed.');
    }
  };

  const handleDeleteListingAdmin = async (productId, reportId) => {
    if (!window.confirm('Are you sure you want to delete this reported listing?')) return;
    try {
      await axiosInstance.delete(`/admin/products/${productId}`);
      toast.success('Listing permanently removed by admin.');
      if (reportId) {
        setReports((prev) => prev.filter((r) => r._id !== reportId));
      }
      fetchAdminData();
    } catch (err) {
      toast.error('Could not delete listing.');
    }
  };

  const handleDismissReport = async (reportId) => {
    try {
      await axiosInstance.patch(`/admin/reports/${reportId}`, { status: 'dismissed' });
      toast.success('Report dismissed.');
      setReports((prev) => prev.filter((r) => r._id !== reportId));
    } catch (err) {
      toast.error('Could not dismiss report.');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.hostel.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-100 tracking-tight">Admin Moderation Hub</h1>
            <p className="text-xs text-slate-400 mt-1">Monitor campus analytics, user status, and reported listings</p>
          </div>
        </div>
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-purple-500/20">
          <span className="text-xs text-slate-400 uppercase font-bold block">Total Registered Users</span>
          <span className="text-3xl font-black text-purple-400 mt-2 block">{stats?.totalUsers || 0}</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-cyan-500/20">
          <span className="text-xs text-slate-400 uppercase font-bold block">Total Listings</span>
          <span className="text-3xl font-black text-cyan-400 mt-2 block">{stats?.totalListings || 0}</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-rose-500/20">
          <span className="text-xs text-slate-400 uppercase font-bold block">Reported Listings</span>
          <span className="text-3xl font-black text-rose-400 mt-2 block">{stats?.reportedListings || 0}</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-emerald-500/20">
          <span className="text-xs text-slate-400 uppercase font-bold block">Successful Trades</span>
          <span className="text-3xl font-black text-emerald-400 mt-2 block">{stats?.successfulTrades || 0}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 text-xs font-extrabold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'reports' ? 'text-purple-400 border-purple-400' : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" /> Pending Reports ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-xs font-extrabold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'users' ? 'text-purple-400 border-purple-400' : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-cyan-400" /> User Management ({users.length})
        </button>
      </div>

      {/* Tab Panel */}
      {activeTab === 'reports' ? (
        reports.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center space-y-2 border border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-100">No pending reports</h3>
            <p className="text-xs text-slate-400">All user-flagged items have been resolved clean.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report._id}
                className="glass-card rounded-2xl p-5 border border-rose-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                      Report Reason
                    </span>
                    <span className="text-xs font-bold text-slate-200">{report.reason}</span>
                  </div>

                  {report.product ? (
                    <p className="text-xs text-cyan-400 font-semibold">
                      Item: "{report.product.title}" • Price: ₹{report.product.price} (Seller: {report.product.seller?.name})
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Item already deleted</p>
                  )}

                  <p className="text-[11px] text-slate-400">
                    Reported by {report.reporter?.name} ({report.reporter?.email}) on {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  {report.product && (
                    <button
                      onClick={() => handleDeleteListingAdmin(report.product._id, report._id)}
                      className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-rose-600/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Product
                    </button>
                  )}

                  <button
                    onClick={() => handleDismissReport(report._id)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Dismiss Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search user by name, email, hostel..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-100 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Roll No & Hostel</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-900/40">
                    <td className="p-4 font-bold text-slate-100 flex items-center gap-2">
                      <img src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt="" className="w-7 h-7 rounded-full object-cover" />
                      {u.name}
                    </td>
                    <td className="p-4 text-slate-300">{u.email}</td>
                    <td className="p-4 text-slate-400">{u.rollNumber} • {u.hostel}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-purple-950 text-purple-400 border border-purple-500/30' : 'bg-slate-800 text-slate-300'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.isBanned ? (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <UserX className="w-3.5 h-3.5" /> Banned
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5" /> Active
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleBan(u._id)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                            u.isBanned
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                          }`}
                        >
                          {u.isBanned ? 'Unban User' : 'Ban User'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
