import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Save, Send, Upload, CheckCircle } from 'lucide-react';

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    personalDetails: {
      dob: '', gender: '', permanentAddress: '', currentAddress: '', parentName: '', parentOccupation: '', annualFamilyIncome: ''
    },
    academicDetails: {
      currentCourse: '', department: '', collegeName: '', yearSemester: '', previousQualification: '', previousMarks: '', admissionNumber: '', feeStructure: '', achievements: ''
    },
    financialDetails: {
      tuitionFee: '', hostelFee: '', booksCost: '', otherExpenses: '', requestedAmount: ''
    },
    bankDetails: {
      accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '', branchName: ''
    },
    chapterId: ''
  });

  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [status, setStatus] = useState(null);
  const [chapters, setChapters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const res = await api.get('/applications/my');
        if (res.data.data) {
          const app = res.data.data;
          setApplicationId(app._id);
          setStatus(app.status);
          
          if (app.status !== 'Draft' && app.status !== 'Correction Requested') {
             navigate('/student/dashboard');
          }

          setFormData({
            personalDetails: app.personalDetails || formData.personalDetails,
            academicDetails: app.academicDetails || formData.academicDetails,
            financialDetails: app.financialDetails || formData.financialDetails,
            bankDetails: app.bankDetails || formData.bankDetails,
            chapterId: app.chapterId?._id || app.chapterId || formData.chapterId
          });
        }
      } catch (error) {
        console.log("No draft found, starting fresh.");
      }
    };

    const fetchChapters = async () => {
      try {
        const res = await api.get('/applications/chapters');
        setChapters(res.data.data);
      } catch (error) {
        console.error('Failed to fetch chapters', error);
      }
    };

    fetchDraft();
    fetchChapters();
  }, [navigate]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileChange = (e) => {
    setFiles({
      ...files,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      const res = await api.post('/applications', formData);
      setApplicationId(res.data.data._id);
      alert('Draft saved successfully');
    } catch (error) {
      alert('Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Save latest data
      const saveRes = await api.post('/applications', formData);
      const appId = saveRes.data.data._id;

      // 2. Upload documents
      if (Object.keys(files).length > 0) {
        const formDataUpload = new FormData();
        Object.keys(files).forEach(key => {
          formDataUpload.append(key, files[key]);
        });
        await api.post(`/applications/${appId}/documents`, formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      // 3. Submit
      await api.post(`/applications/${appId}/submit`);
      
      alert('Application submitted successfully!');
      navigate('/student/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const SectionHeader = ({ title }) => (
    <div className="pb-3 border-b border-slate-200 mb-6">
      <h3 className="text-lg leading-6 font-medium text-slate-900">{title}</h3>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Scholarship Application Form</h2>
          <p className="text-sm text-slate-500 mt-1">Please fill out all sections carefully.</p>
        </div>
        {status === 'Correction Requested' && (
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium border border-amber-200">
            Correction Mode
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-12">
        
        {/* Chapter Selection */}
        <section>
          <SectionHeader title="0. Chapter Selection" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Scholarship Chapter <span className="text-red-500">*</span></label>
              <select className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50"
                value={formData.chapterId} onChange={(e) => setFormData({...formData, chapterId: e.target.value})} required>
                <option value="">-- Choose the Chapter nearest to you --</option>
                {chapters.map(ch => (
                  <option key={ch._id} value={ch._id}>{ch.name} - {ch.location}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">This chapter will review your application before forwarding it to the Head Office.</p>
            </div>
          </div>
        </section>

        {/* Personal Details */}
        <section>
          <SectionHeader title="1. Personal Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
              <input type="date" className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50" 
                value={formData.personalDetails.dob?.split('T')[0] || ''} onChange={(e) => handleInputChange('personalDetails', 'dob', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50"
                value={formData.personalDetails.gender} onChange={(e) => handleInputChange('personalDetails', 'gender', e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Permanent Address</label>
              <textarea className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50" rows="2"
                value={formData.personalDetails.permanentAddress} onChange={(e) => handleInputChange('personalDetails', 'permanentAddress', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Parent/Guardian Name</label>
              <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50"
                value={formData.personalDetails.parentName} onChange={(e) => handleInputChange('personalDetails', 'parentName', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Annual Family Income (₹)</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50"
                value={formData.personalDetails.annualFamilyIncome} onChange={(e) => handleInputChange('personalDetails', 'annualFamilyIncome', e.target.value)} required />
            </div>
          </div>
        </section>

        {/* Academic Details */}
        <section>
          <SectionHeader title="2. Academic Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Course</label>
              <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50"
                value={formData.academicDetails.currentCourse} onChange={(e) => handleInputChange('academicDetails', 'currentCourse', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">College/University Name</label>
              <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50"
                value={formData.academicDetails.collegeName} onChange={(e) => handleInputChange('academicDetails', 'collegeName', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Previous Marks/CGPA</label>
              <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50"
                value={formData.academicDetails.previousMarks} onChange={(e) => handleInputChange('academicDetails', 'previousMarks', e.target.value)} required />
            </div>
          </div>
        </section>

        {/* Financial Details */}
        <section>
          <SectionHeader title="3. Financial Requirements" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tuition Fee (₹)</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50"
                value={formData.financialDetails.tuitionFee} onChange={(e) => handleInputChange('financialDetails', 'tuitionFee', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Requested Scholarship Amount (₹)</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg p-2.5 bg-amber-50 focus:ring-amber-500 border-amber-200"
                value={formData.financialDetails.requestedAmount} onChange={(e) => handleInputChange('financialDetails', 'requestedAmount', e.target.value)} required />
            </div>
          </div>
        </section>

        {/* Bank Details */}
        <section>
          <SectionHeader title="4. Bank Details" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Account Holder Name</label>
              <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50"
                value={formData.bankDetails.accountHolderName} onChange={(e) => handleInputChange('bankDetails', 'accountHolderName', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
              <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50"
                value={formData.bankDetails.accountNumber} onChange={(e) => handleInputChange('bankDetails', 'accountNumber', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
              <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50"
                value={formData.bankDetails.bankName} onChange={(e) => handleInputChange('bankDetails', 'bankName', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">IFSC Code</label>
              <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50"
                value={formData.bankDetails.ifscCode} onChange={(e) => handleInputChange('bankDetails', 'ifscCode', e.target.value)} required />
            </div>
          </div>
        </section>

        {/* Documents */}
        <section>
          <SectionHeader title="5. Document Uploads" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Income Certificate</label>
              <input type="file" name="IncomeCertificate" onChange={handleFileChange} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Previous Marksheet</label>
              <input type="file" name="Marksheet" onChange={handleFileChange} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
            </div>
            <div className="border border-slate-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Bank Passbook / Cancelled Cheque</label>
              <input type="file" name="BankPassbook" onChange={handleFileChange} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            <Save size={18} />
            <span>Save Draft</span>
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium disabled:opacity-50"
          >
            <Send size={18} />
            <span>{loading ? 'Submitting...' : 'Submit Application'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default ApplicationForm;
