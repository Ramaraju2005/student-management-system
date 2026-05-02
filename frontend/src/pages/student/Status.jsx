import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FileText, Download } from 'lucide-react';

const Status = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await api.get('/applications/my');
        setApplication(res.data.data);
      } catch (error) {
        console.error('Error fetching application', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  if (!application) return <div className="p-8">No application found.</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <FileText className="text-primary-500" />
        Detailed Status Tracking
      </h2>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <p className="text-sm text-slate-500">Application ID</p>
            <p className="font-semibold text-lg">{application.applicationId || 'N/A'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Current Status</p>
            <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
              {application.status}
            </span>
          </div>
        </div>

        {application.remarks && (
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800">Review Remarks</h4>
            <p className="text-amber-700 mt-1 text-sm">{application.remarks}</p>
            <p className="text-xs text-amber-500 mt-2">
              Reviewed By: {application.lastReviewedBy?.fullName || 'System'}
            </p>
          </div>
        )}

        {application.documents && application.documents.length > 0 && (
          <div>
            <h4 className="font-medium text-slate-800 mb-3">Uploaded Documents</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {application.documents.map(doc => (
                <div key={doc._id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
                  <span className="text-sm text-slate-700 truncate mr-2" title={doc.documentType}>
                    {doc.documentType}
                  </span>
                  <a href={`http://localhost:5000/${doc.filePath}`} target="_blank" rel="noreferrer" className="text-primary-600 hover:text-primary-800">
                    <Download size={16} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Status;
