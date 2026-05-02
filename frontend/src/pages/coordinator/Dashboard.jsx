import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0, pending: 0, approved: 0, rejected: 0, correction: 0
  });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/coordinator/applications');
        const apps = res.data.data;
        
        let pending = 0, approved = 0, rejected = 0, correction = 0;
        apps.forEach(app => {
          if (['Submitted', 'Under Chapter Review'].includes(app.status)) pending++;
          else if (app.status === 'Chapter Approved') approved++;
          else if (app.status === 'Chapter Rejected') rejected++;
          else if (app.status === 'Correction Requested') correction++;
        });

        setStats({ total: apps.length, pending, approved, rejected, correction });
        setRecentApps(apps.slice(0, 5));
      } catch (error) {
        console.error('Error fetching coordinator applications', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Coordinator Dashboard</h1>
        <p className="text-slate-500">Welcome back, {user.fullName}. Here is your chapter's overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-lg"><FileText size={24} /></div>
          <div><p className="text-sm text-slate-500">Total Applications</p><p className="text-2xl font-bold">{stats.total}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="bg-amber-50 text-amber-600 p-3 rounded-lg"><Clock size={24} /></div>
          <div><p className="text-sm text-slate-500">Pending Review</p><p className="text-2xl font-bold">{stats.pending}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="bg-green-50 text-green-600 p-3 rounded-lg"><CheckCircle size={24} /></div>
          <div><p className="text-sm text-slate-500">Approved</p><p className="text-2xl font-bold">{stats.approved}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="bg-red-50 text-red-600 p-3 rounded-lg"><XCircle size={24} /></div>
          <div><p className="text-sm text-slate-500">Rejected</p><p className="text-2xl font-bold">{stats.rejected}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">Recent Applications</h2>
          <Link to="/coordinator/applications" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-medium">App ID</th>
                <th className="p-4 font-medium">Student Name</th>
                <th className="p-4 font-medium">Course</th>
                <th className="p-4 font-medium">Date Submitted</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentApps.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-slate-500">No recent applications</td></tr>
              ) : (
                recentApps.map(app => (
                  <tr key={app._id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-900">{app.applicationId}</td>
                    <td className="p-4 text-slate-700">{app.studentId?.fullName}</td>
                    <td className="p-4 text-slate-700">{app.academicDetails?.currentCourse}</td>
                    <td className="p-4 text-slate-700">{new Date(app.submittedAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${['Submitted', 'Under Chapter Review'].includes(app.status) ? 'bg-amber-50 text-amber-600' : ''}
                        ${app.status === 'Chapter Approved' ? 'bg-green-50 text-green-600' : ''}
                        ${app.status === 'Chapter Rejected' ? 'bg-red-50 text-red-600' : ''}
                        ${app.status === 'Correction Requested' ? 'bg-blue-50 text-blue-600' : ''}
                      `}>{app.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
