import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CreditCard, CheckCircle } from 'lucide-react';

const Disbursements = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/head-office/applications');
      setApplications(res.data.data.filter(app => ['Amount Assigned', 'Disbursed'].includes(app.status)));
    } catch (error) {
      console.error('Error fetching applications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisburse = async (appId) => {
    const ref = prompt('Enter Bank Transaction Reference Number:');
    if (!ref) return;

    try {
      await api.post(`/head-office/applications/${appId}/disburse`, {
        transactionReference: ref,
        notes: 'Disbursed via direct bank transfer'
      });
      alert('Disbursement processed successfully');
      fetchApplications();
    } catch (error) {
      alert(error.response?.data?.message || 'Error processing disbursement');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Process Disbursements</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-medium">App ID</th>
                <th className="p-4 font-medium">Student Name</th>
                <th className="p-4 font-medium">Bank Details</th>
                <th className="p-4 font-medium text-right">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr><td colSpan="6" className="p-4 text-center text-slate-500">No pending disbursements.</td></tr>
              ) : (
                applications.map(app => (
                  <tr key={app._id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-900">{app.applicationId}</td>
                    <td className="p-4 text-slate-700">{app.studentId?.fullName}</td>
                    <td className="p-4 text-sm text-slate-600">
                      <div>A/C: {app.bankDetails?.accountNumber}</div>
                      <div>IFSC: {app.bankDetails?.ifscCode}</div>
                    </td>
                    <td className="p-4 text-right font-bold text-slate-900">₹{app.assignedAmount}</td>
                    <td className="p-4">
                      {app.status === 'Disbursed' ? (
                        <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                          <CheckCircle size={16} /> Paid
                        </span>
                      ) : (
                        <span className="text-amber-600 text-sm font-medium">Pending Payment</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {app.status === 'Amount Assigned' && (
                        <button 
                          onClick={() => handleDisburse(app._id)} 
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 ml-auto"
                        >
                          <CreditCard size={16} /> Pay Now
                        </button>
                      )}
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

export default Disbursements;
