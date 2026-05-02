import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FileText, CheckSquare, CreditCard, PieChart } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0, pendingReview: 0, approved: 0, pendingDisbursement: 0, totalAmount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/head-office/applications');
        const apps = res.data.data;
        
        let pendingReview = 0, approved = 0, pendingDisbursement = 0, totalAmount = 0;
        
        apps.forEach(app => {
          if (app.status === 'Under Head Office Review') pendingReview++;
          else if (['Head Office Approved', 'Amount Assigned', 'Disbursed'].includes(app.status)) approved++;
          
          if (app.status === 'Amount Assigned') pendingDisbursement++;
          
          if (app.assignedAmount) totalAmount += app.assignedAmount;
        });

        setStats({ total: apps.length, pendingReview, approved, pendingDisbursement, totalAmount });
      } catch (error) {
        console.error('Error fetching HO applications', error);
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
        <h1 className="text-2xl font-bold text-slate-900">Head Office Dashboard</h1>
        <p className="text-slate-500">Welcome, {user.fullName}. Overview of national scholarship operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="bg-indigo-50 text-indigo-600 p-3 rounded-lg"><FileText size={24} /></div>
          <div><p className="text-sm text-slate-500">Pending Review</p><p className="text-2xl font-bold">{stats.pendingReview}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="bg-green-50 text-green-600 p-3 rounded-lg"><CheckSquare size={24} /></div>
          <div><p className="text-sm text-slate-500">Final Approved</p><p className="text-2xl font-bold">{stats.approved}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="bg-amber-50 text-amber-600 p-3 rounded-lg"><PieChart size={24} /></div>
          <div><p className="text-sm text-slate-500">Pending Payment</p><p className="text-2xl font-bold">{stats.pendingDisbursement}</p></div>
        </div>
        <div className="bg-gradient-to-br from-primary-600 to-indigo-700 p-6 rounded-xl shadow-md text-white flex items-center space-x-4">
          <div className="bg-white/20 p-3 rounded-lg"><CreditCard size={24} /></div>
          <div><p className="text-sm text-white/80">Total Sanctioned</p><p className="text-2xl font-bold">₹{(stats.totalAmount / 100000).toFixed(2)}L</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
             <FileText size={32} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-800">Final Approvals</h3>
            <p className="text-slate-500 text-sm max-w-sm mt-1">Review applications forwarded by chapter coordinators and provide final approval.</p>
          </div>
          <Link to="/head-office/applications" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">View Applications</Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
             <CreditCard size={32} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-800">Disbursements</h3>
            <p className="text-slate-500 text-sm max-w-sm mt-1">Process payments for approved applications and record transaction details.</p>
          </div>
          <Link to="/head-office/disbursements" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Process Payments</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
