import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Users, MapPin, Activity } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, chapters: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, chaptersRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/chapters')
        ]);
        setStats({
          users: usersRes.data.data.length,
          chapters: chaptersRes.data.data.length
        });
      } catch (error) {
        console.error('Error fetching admin stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Administration</h1>
        <p className="text-slate-500">Manage users, chapters, and system configuration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="bg-blue-50 text-blue-600 p-4 rounded-full"><Users size={32} /></div>
          <div>
            <p className="text-sm text-slate-500">Total Users</p>
            <p className="text-3xl font-bold text-slate-900">{stats.users}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="bg-green-50 text-green-600 p-4 rounded-full"><MapPin size={32} /></div>
          <div>
            <p className="text-sm text-slate-500">Total Chapters</p>
            <p className="text-3xl font-bold text-slate-900">{stats.chapters}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="bg-purple-50 text-purple-600 p-4 rounded-full"><Activity size={32} /></div>
          <div>
            <p className="text-sm text-slate-500">System Status</p>
            <p className="text-3xl font-bold text-slate-900">Online</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center flex flex-col items-center">
           <Users size={48} className="text-slate-300 mb-4" />
           <h3 className="font-semibold text-lg">User Management</h3>
           <p className="text-slate-500 text-sm mt-2 mb-6">Create, update, and manage roles for all system users.</p>
           <Link to="/admin/users" className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition">Manage Users</Link>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center flex flex-col items-center">
           <MapPin size={48} className="text-slate-300 mb-4" />
           <h3 className="font-semibold text-lg">Chapter Management</h3>
           <p className="text-slate-500 text-sm mt-2 mb-6">Create chapters and assign coordinators to regions.</p>
           <Link to="/admin/chapters" className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition">Manage Chapters</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
