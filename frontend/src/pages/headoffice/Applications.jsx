import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Eye, DollarSign, X } from 'lucide-react';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/head-office/applications');
      setApplications(res.data.data.filter(app => ['Under Head Office Review', 'Head Office Approved'].includes(app.status)));
    } catch (error) {
      console.error('Error fetching applications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await api.get(`/head-office/applications/${id}`);
      setSelectedApp(res.data.data);
    } catch (error) {
      alert('Error fetching application details');
    }
  };

  const handleFinalReview = async (action) => {
    const remarks = prompt('Enter remarks for final decision:');
    if (remarks === null) return;
    
    setActionLoading(true);
    try {
      await api.post(`/head-office/applications/${selectedApp._id}/review`, { action, remarks });
      alert(`Application ${action === 'Approve' ? 'Approved' : 'Rejected'} successfully`);
      setSelectedApp(null);
      fetchApplications();
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting review');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignAmount = async () => {
    const amount = prompt('Enter scholarship amount to sanction (₹):');
    if (!amount || isNaN(amount) || Number(amount) <= 0) return alert('Invalid amount');
    
    setActionLoading(true);
    try {
      await api.post(`/head-office/applications/${selectedApp._id}/assign-amount`, { amount: Number(amount) });
      alert('Amount assigned successfully');
      setSelectedApp(null);
      fetchApplications();
    } catch (error) {
      alert(error.response?.data?.message || 'Error assigning amount');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Final Approvals</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-medium">App ID</th>
                <th className="p-4 font-medium">Chapter</th>
                <th className="p-4 font-medium">Student Name</th>
                <th className="p-4 font-medium">Req. Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr><td colSpan="6" className="p-4 text-center text-slate-500">No applications pending review.</td></tr>
              ) : (
                applications.map(app => (
                  <tr key={app._id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-900">{app.applicationId}</td>
                    <td className="p-4 text-slate-700">{app.chapterId?.name}</td>
                    <td className="p-4 text-slate-700">{app.studentId?.fullName}</td>
                    <td className="p-4 text-slate-700">₹{app.financialDetails?.requestedAmount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${app.status === 'Under Head Office Review' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>{app.status}</span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleView(app._id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-slate-900">Application: {selectedApp.applicationId}</h2>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Simplified details for HO */}
               <div className="space-y-6">
                 <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-3">Chapter Review History</h3>
                  <div className="bg-slate-50 p-4 rounded border">
                    <p className="text-sm"><strong>Chapter:</strong> {selectedApp.chapterId?.name}</p>
                    {selectedApp.reviews?.filter(r => r.action === 'Approved' || r.action === 'Forwarded').map(r => (
                      <div key={r._id} className="mt-2 text-sm border-t pt-2">
                        <p><strong>{r.reviewerId?.role}:</strong> {r.remarks}</p>
                      </div>
                    ))}
                  </div>
                 </div>
                 <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-3">Financial Overview</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-slate-500">Family Income:</span> <span className="font-medium">₹{selectedApp.personalDetails?.annualFamilyIncome}</span>
                    <span className="text-slate-500">Tuition Fee:</span> <span className="font-medium">₹{selectedApp.financialDetails?.tuitionFee}</span>
                    <span className="text-slate-500">Requested:</span> <span className="font-bold text-primary-600">₹{selectedApp.financialDetails?.requestedAmount}</span>
                  </div>
                 </div>
               </div>

               <div className="space-y-6">
                 {selectedApp.status === 'Under Head Office Review' ? (
                   <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                     <h3 className="text-lg font-semibold mb-4">Final Decision</h3>
                     <div className="flex space-x-4">
                       <button onClick={() => handleFinalReview('Approve')} disabled={actionLoading} className="flex-1 bg-green-600 text-white p-2.5 rounded hover:bg-green-700">Final Approve</button>
                       <button onClick={() => handleFinalReview('Reject')} disabled={actionLoading} className="flex-1 bg-red-600 text-white p-2.5 rounded hover:bg-red-700">Reject</button>
                     </div>
                   </div>
                 ) : selectedApp.status === 'Head Office Approved' ? (
                   <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                     <h3 className="text-lg font-semibold mb-2">Sanction Amount</h3>
                     <p className="text-sm text-blue-700 mb-4">Application is approved. Assign the scholarship amount to proceed to disbursement.</p>
                     <button onClick={handleAssignAmount} disabled={actionLoading} className="w-full bg-primary-600 text-white p-2.5 rounded flex justify-center items-center gap-2 hover:bg-primary-700">
                       <DollarSign size={18} /> Assign Amount
                     </button>
                   </div>
                 ) : null}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
