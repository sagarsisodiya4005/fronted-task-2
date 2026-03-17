import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Layout from './components/Layout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import PatientDashboard from './pages/PatientDashboard';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

const DashboardPlaceholder = ({ title }) => (
  <div>
    <div className="header">
      <h1 className="header-title">{title}</h1>
    </div>
    <div className="card">
      <p>This is the {title} content area. Under construction.</p>
    </div>
  </div>
);

const getDashboardRoute = (role) => {
  if (!role) return '/login';
  const r = role.toLowerCase();
  if (['admin', 'patient', 'receptionist', 'doctor'].includes(r)) return `/${r}`;
  return '/login';
};

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            user && getDashboardRoute(user?.role) !== '/login' 
              ? <Navigate to={getDashboardRoute(user.role)} replace /> 
              : <Login />
          } 
        />
        
        <Route element={<Layout allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route element={<Layout allowedRoles={['patient']} />}>
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/patient/book" element={<DashboardPlaceholder title="Book Appointment" />} />
          <Route path="/patient/prescriptions" element={<DashboardPlaceholder title="My Prescriptions" />} />
          <Route path="/patient/reports" element={<DashboardPlaceholder title="My Reports" />} />
        </Route>

        <Route element={<Layout allowedRoles={['receptionist']} />}>
          <Route path="/receptionist" element={<ReceptionistDashboard />} />
        </Route>

        <Route element={<Layout allowedRoles={['doctor']} />}>
          <Route path="/doctor" element={<DoctorDashboard />} />
        </Route>

        <Route path="/" element={<Navigate to={user && getDashboardRoute(user?.role) !== '/login' ? getDashboardRoute(user.role) : "/login"} replace />} />
        <Route path="*" element={<Navigate to={user && getDashboardRoute(user?.role) !== '/login' ? getDashboardRoute(user.role) : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
