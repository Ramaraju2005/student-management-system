import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus } from 'lucide-react';

const Chapters = () => {
  const [chapters, setChapters] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', description: '', coordinatorId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [chaptersRes, usersRes] = await Promise.all([
        api.get('/admin/chapters'),
        api.get('/admin/users')
      ]);
      setChapters(chaptersRes.data.data);
      setUsers(usersRes.data.data.filter(u => u.role === 'Chapter Coordinator'));
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/chapters', formData);
      alert('Chapter created successfully');
      setShowModal(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating chapter');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Chapter Management</h1>
        <button onClick={() => setShowModal(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2">
          <Plus size={18} /> Add Chapter
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-medium">Chapter Name</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">Coordinator</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map(c => (
                <tr key={c._id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-900">{c.name}</td>
                  <td className="p-4 text-slate-700">{c.location}</td>
                  <td className="p-4 text-slate-700">{c.coordinatorId?.fullName || 'Unassigned'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Add New Chapter</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input required type="text" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input required type="text" className="w-full border p-2 rounded" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assign Coordinator</label>
                <select className="w-full border p-2 rounded" value={formData.coordinatorId} onChange={e => setFormData({...formData, coordinatorId: e.target.value})}>
                  <option value="">Select Coordinator (Optional)</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.fullName} ({u.email})</option>)}
                </select>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border p-2 rounded">Cancel</button>
                <button type="submit" className="flex-1 bg-primary-600 text-white p-2 rounded">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chapters;
