import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FileText, Clock, CheckCircle, AlertCircle, FilePlus } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await api.get('/applications/my');
        setApplication(res.data.data);
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('Error fetching application', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {user.fullName}</h1>
        <p className="text-slate-500">Here is an overview of your scholarship status.</p>
      </div>

      {!application ? (
        <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FilePlus size={32} />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">No Active Application</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            You haven't applied for a scholarship yet. Start your application process by clicking the button below.
          </p>
          <Link 
            to="/student/application"
            className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FileText size={20} />
            <span>Start Application</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800 text-lg flex items-center gap-2">
                  <FileText className="text-primary-500" />
                  Application Details
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${application.status === 'Draft' ? 'bg-slate-100 text-slate-600' : ''}
                  ${['Submitted', 'Under Chapter Review', 'Under Head Office Review'].includes(application.status) ? 'bg-blue-50 text-blue-600' : ''}
                  ${['Chapter Approved', 'Head Office Approved', 'Amount Assigned'].includes(application.status) ? 'bg-green-50 text-green-600' : ''}
                  ${application.status === 'Disbursed' ? 'bg-emerald-100 text-emerald-700' : ''}
                  ${['Chapter Rejected', 'Head Office Rejected'].includes(application.status) ? 'bg-red-50 text-red-600' : ''}
                  ${application.status === 'Correction Requested' ? 'bg-amber-50 text-amber-600' : ''}
                `}>
                  {application.status}
                </span>
              </div>
              
              <div className="p-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Application ID</p>
                  <p className="font-medium text-slate-900">{application.applicationId || 'Not generated yet'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Last Updated</p>
                  <p className="font-medium text-slate-900">{new Date(application.updatedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Course</p>
                  <p className="font-medium text-slate-900">{application.academicDetails?.currentCourse || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Requested Amount</p>
                  <p className="font-medium text-slate-900">₹{application.financialDetails?.requestedAmount || 0}</p>
                </div>
              </div>

              {(application.status === 'Draft' || application.status === 'Correction Requested') && (
                <div className="p-6 bg-slate-50 border-t border-slate-100">
                  <Link 
                    to="/student/application"
                    className="block w-full text-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {application.status === 'Draft' ? 'Continue Application' : 'Fix Corrections'}
                  </Link>
                </div>
              )}
            </div>

            {application.remarks && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex items-start space-x-3">
                <AlertCircle className="text-amber-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-amber-800">Latest Remarks</h4>
                  <p className="text-amber-700 mt-1">{application.remarks}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Clock className="text-primary-500" />
                Timeline
              </h3>
              
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {/* Simulated Timeline Steps */}
                {['Draft', 'Submitted', 'Chapter Review', 'Head Office', 'Disbursement'].map((step, idx) => {
                  let isComplete = false;
                  let isCurrent = false;
                  
                  const statusMap = {
                    'Draft': ['Draft'],
                    'Submitted': ['Submitted'],
                    'Chapter Review': ['Under Chapter Review', 'Chapter Approved', 'Under Head Office Review', 'Head Office Approved', 'Amount Assigned', 'Disbursed', 'Correction Requested'],
                    'Head Office': ['Under Head Office Review', 'Head Office Approved', 'Amount Assigned', 'Disbursed'],
                    'Disbursement': ['Amount Assigned', 'Disbursed']
                  };

                  if (statusMap[step].includes(application.status)) {
                     if (step === 'Disbursement' && application.status === 'Amount Assigned') {
                         isCurrent = true;
                     } else {
                         isComplete = true;
                     }
                  } else if (step === 'Draft' && application.status !== 'Draft') {
                      isComplete = true;
                  }

                  return (
                    <div key={step} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white z-10 shrink-0 ${isComplete ? 'border-primary-500 text-primary-500' : isCurrent ? 'border-amber-500 text-amber-500' : 'border-slate-300 text-slate-300'}`}>
                            {isComplete ? <CheckCircle size={20} /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-100 bg-white shadow-sm">
                            <h4 className={`font-semibold ${isComplete || isCurrent ? 'text-slate-800' : 'text-slate-400'}`}>{step}</h4>
                        </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {application.assignedAmount && (
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-md">
                <h3 className="font-medium text-green-100">Approved Amount</h3>
                <p className="text-3xl font-bold mt-1">₹{application.assignedAmount}</p>
                <p className="text-sm mt-4 text-green-100">
                  {application.status === 'Disbursed' ? 'Amount has been disbursed to your bank account.' : 'Amount is pending disbursement.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
