import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Eye, Check, X, AlertCircle, Send } from 'lucide-react';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewAction, setReviewAction] = useState('');
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/coordinator/applications');
      setApplications(res.data.data);
    } catch (error) {
      console.error('Error fetching applications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await api.get(`/coordinator/applications/${id}`);
      setSelectedApp(res.data.data);
      setReviewAction('');
      setRemarks('');
    } catch (error) {
      alert('Error fetching application details');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!reviewAction) return alert('Select an action');
    if (!remarks) return alert('Remarks are required');
    
    setActionLoading(true);
    try {
      await api.post(`/coordinator/applications/${selectedApp._id}/review`, {
        action: reviewAction,
        remarks
      });
      alert('Review submitted successfully');
      setSelectedApp(null);
      fetchApplications();
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting review');
    } finally {
      setActionLoading(false);
    }
  };

  const handleForward = async (id) => {
    if (!window.confirm('Are you sure you want to forward this to Head Office?')) return;
    
    try {
      await api.post(`/coordinator/applications/${id}/forward`);
      alert('Application forwarded to Head Office');
      fetchApplications();
    } catch (error) {
      alert(error.response?.data?.message || 'Error forwarding application');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Chapter Applications</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-medium">App ID</th>
                <th className="p-4 font-medium">Student Name</th>
                <th className="p-4 font-medium">Course</th>
                <th className="p-4 font-medium">Income</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr><td colSpan="6" className="p-4 text-center text-slate-500">No applications found.</td></tr>
              ) : (
                applications.map(app => (
                  <tr key={app._id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-900">{app.applicationId}</td>
                    <td className="p-4 text-slate-700">{app.studentId?.fullName}</td>
                    <td className="p-4 text-slate-700">{app.academicDetails?.currentCourse}</td>
                    <td className="p-4 text-slate-700">₹{app.personalDetails?.annualFamilyIncome}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${['Submitted', 'Under Chapter Review'].includes(app.status) ? 'bg-amber-50 text-amber-600' : ''}
                        ${app.status === 'Chapter Approved' ? 'bg-green-50 text-green-600' : ''}
                        ${app.status === 'Chapter Rejected' ? 'bg-red-50 text-red-600' : ''}
                        ${app.status === 'Correction Requested' ? 'bg-blue-50 text-blue-600' : ''}
                      `}>{app.status}</span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleView(app._id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Application">
                        <Eye size={18} />
                      </button>
                      {app.status === 'Chapter Approved' && (
                        <button onClick={() => handleForward(app._id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Forward to HO">
                          <Send size={18} />
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

      {/* Modal for viewing and reviewing */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-slate-900">Application Details: {selectedApp.applicationId}</h2>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-3">Student Info</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-slate-500">Name:</span> <span className="font-medium">{selectedApp.studentId?.fullName}</span>
                    <span className="text-slate-500">Email:</span> <span className="font-medium">{selectedApp.studentId?.email}</span>
                    <span className="text-slate-500">Phone:</span> <span className="font-medium">{selectedApp.studentId?.phone}</span>
                    <span className="text-slate-500">DOB:</span> <span className="font-medium">{selectedApp.personalDetails?.dob?.split('T')[0]}</span>
                    <span className="text-slate-500">Income:</span> <span className="font-medium">₹{selectedApp.personalDetails?.annualFamilyIncome}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-3">Academic Info</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-slate-500">Course:</span> <span className="font-medium">{selectedApp.academicDetails?.currentCourse}</span>
                    <span className="text-slate-500">College:</span> <span className="font-medium">{selectedApp.academicDetails?.collegeName}</span>
                    <span className="text-slate-500">Prev. Marks:</span> <span className="font-medium">{selectedApp.academicDetails?.previousMarks}</span>
                    <span className="text-slate-500">Req. Amount:</span> <span className="font-medium text-primary-600">₹{selectedApp.financialDetails?.requestedAmount}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-3">Documents</h3>
                  <ul className="space-y-2">
                    {selectedApp.documents?.map(doc => (
                      <li key={doc._id} className="text-sm flex justify-between bg-slate-50 p-2 rounded">
                        <span>{doc.documentType}</span>
                        <a href={`http://localhost:5000/${doc.filePath}`} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">View</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {['Submitted', 'Under Chapter Review'].includes(selectedApp.status) ? (
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-fit">
                  <h3 className="text-lg font-semibold mb-4">Submit Review</h3>
                  <form onSubmit={handleReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Action</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button type="button" onClick={() => setReviewAction('Approve')} className={`p-2 rounded border text-sm font-medium ${reviewAction === 'Approve' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-slate-300'}`}>Approve</button>
                        <button type="button" onClick={() => setReviewAction('Reject')} className={`p-2 rounded border text-sm font-medium ${reviewAction === 'Reject' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-white border-slate-300'}`}>Reject</button>
                        <button type="button" onClick={() => setReviewAction('RequestCorrection')} className={`p-2 rounded border text-sm font-medium ${reviewAction === 'RequestCorrection' ? 'bg-amber-100 border-amber-500 text-amber-700' : 'bg-white border-slate-300'}`}>Correction</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
                      <textarea required value={remarks} onChange={e => setRemarks(e.target.value)} className="w-full border border-slate-300 rounded p-2" rows="4" placeholder="Enter reason or correction details..."></textarea>
                    </div>
                    <button type="submit" disabled={actionLoading} className="w-full bg-primary-600 text-white p-2.5 rounded hover:bg-primary-700 disabled:opacity-50">
                      Submit Review
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-fit">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="text-slate-500" />
                    Review Status
                  </h3>
                  <p className="font-medium text-lg text-slate-800">{selectedApp.status}</p>
                  {selectedApp.remarks && (
                     <div className="mt-4 p-3 bg-white border border-slate-200 rounded">
                        <p className="text-sm text-slate-500">Remarks:</p>
                        <p className="text-sm mt-1">{selectedApp.remarks}</p>
                     </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
