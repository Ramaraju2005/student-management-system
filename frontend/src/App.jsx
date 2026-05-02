import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/Dashboard';
import StudentApplication from './pages/student/ApplicationForm';
import StudentStatus from './pages/student/Status';
import CoordinatorDashboard from './pages/coordinator/Dashboard';
import CoordinatorApplications from './pages/coordinator/Applications';
import HeadOfficeDashboard from './pages/headoffice/Dashboard';
import HeadOfficeApplications from './pages/headoffice/Applications';
import HeadOfficeDisbursements from './pages/headoffice/Disbursements';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminChapters from './pages/admin/Chapters';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" />;
  return children;
};

// Dummy components for now
const Unauthorized = () => <div className="p-8 text-red-500 font-bold">Unauthorized Access</div>;

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Student Routes */}
      <Route path="/student" element={<Layout allowedRoles={['Student']} />}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="application" element={<StudentApplication />} />
        <Route path="status" element={<StudentStatus />} />
      </Route>

      {/* Coordinator Routes */}
      <Route path="/coordinator" element={<Layout allowedRoles={['Chapter Coordinator']} />}>
        <Route path="dashboard" element={<CoordinatorDashboard />} />
        <Route path="applications" element={<CoordinatorApplications />} />
      </Route>

      {/* Head Office Routes */}
      <Route path="/head-office" element={<Layout allowedRoles={['Head Office Admin']} />}>
        <Route path="dashboard" element={<HeadOfficeDashboard />} />
        <Route path="applications" element={<HeadOfficeApplications />} />
        <Route path="disbursements" element={<HeadOfficeDisbursements />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<Layout allowedRoles={['Super Admin']} />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="chapters" element={<AdminChapters />} />
      </Route>

      {/* Redirect root based on role if logged in, else login */}
      <Route path="/" element={
        <PrivateRoute>
          <RootRedirector />
        </PrivateRoute>
      } />
    </Routes>
  );
}

const RootRedirector = () => {
  const { user } = useAuth();
  if (user?.role === 'Student') return <Navigate to="/student/dashboard" />;
  if (user?.role === 'Chapter Coordinator') return <Navigate to="/coordinator/dashboard" />;
  if (user?.role === 'Head Office Admin') return <Navigate to="/head-office/dashboard" />;
  if (user?.role === 'Super Admin') return <Navigate to="/admin/dashboard" />;
  return <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
