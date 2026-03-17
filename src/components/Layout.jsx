import React from 'react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Users, Calendar, ClipboardList, Activity } from 'lucide-react';

const Layout = ({ allowedRoles }) => {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role ? user.role.toLowerCase() : 'patient';

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If user's role isn't allowed here, redirect to their main dashboard safely
    const defaultRoute = ['admin', 'patient', 'receptionist', 'doctor'].includes(role) ? `/${role}` : '/login';
    return <Navigate to={defaultRoute} replace />;
  }

  const roleLinks = {
    admin: [
      { path: '/admin', label: 'Dashboard', icon: Home },
    ],
    patient: [
      { path: '/patient', label: 'My Appointments', icon: Calendar },
      { path: '/patient/book', label: 'Book Appointment', icon: Activity },
      { path: '/patient/prescriptions', label: 'Prescriptions', icon: ClipboardList },
      { path: '/patient/reports', label: 'Reports', icon: Activity },
    ],
    receptionist: [
      { path: '/receptionist', label: 'Daily Queue', icon: Users },
    ],
    doctor: [
      { path: '/doctor', label: 'Today\'s Queue', icon: Users },
    ]
  };

  const links = roleLinks[role] || [];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">
            <Activity className="w-6 h-6" />
            <span>Clinic Queue</span>
          </div>
          <p className="mt-1" style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
            {user.clinicName}
          </p>
        </div>
        
        <nav className="sidebar-nav">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink 
                key={link.path} 
                to={link.path} 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
