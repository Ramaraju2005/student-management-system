import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Edit, Trash2 } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
    } catch (error) {
      console.error('Error fetching users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      alert('Role updated');
      fetchUsers();
    } catch (error) {
      alert('Error updating role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await api.delete(`/admin/users/${userId}`);
        alert('User deleted successfully');
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">User Management</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Chapter</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-900">{u.fullName}</td>
                  <td className="p-4 text-slate-700">{u.email}</td>
                  <td className="p-4">
                    <select 
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="border border-slate-200 rounded p-1 text-sm bg-white"
                    >
                      <option value="Student">Student</option>
                      <option value="Chapter Coordinator">Chapter Coordinator</option>
                      <option value="Head Office Admin">Head Office Admin</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </td>
                  <td className="p-4 text-slate-700">{u.chapterId?.name || 'N/A'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-3">
                     <button className="text-slate-400 hover:text-slate-600" title="Edit"><Edit size={16} /></button>
                     <button onClick={() => handleDeleteUser(u._id)} className="text-red-400 hover:text-red-600" title="Delete"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
