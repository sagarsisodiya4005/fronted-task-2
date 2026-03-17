import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Users, Activity, Loader } from 'lucide-react';

const AdminDashboard = () => {
  const [clinic, setClinic] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'receptionist',
    phone: '',
  });

  const fetchData = async () => {
    try {
      const [clinicRes, usersRes] = await Promise.all([
        adminAPI.getClinic(),
        adminAPI.getUsers(),
      ]);
      setClinic(clinicRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createUser(formData);
      setFormData({ name: '', email: '', password: '', role: 'receptionist', phone: '' });
      fetchData(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create user');
    }
  };

  if (loading) return <div className="loading-screen"><Loader className="animate-spin text-primary" /></div>;

  return (
    <div>
      <div className="header">
        <div>
          <h1 className="header-title">Admin Dashboard</h1>
          <p className="header-subtitle">Manage your clinic users and overview</p>
        </div>
      </div>

      {clinic && (
        <div className="stats-grid">
          <div className="card stat-card">
            <div className="stat-icon primary">
              <Activity size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p>{clinic.userCount}</p>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon success">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <h3>Appointments</h3>
              <p>{clinic.appointmentCount}</p>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon warning">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <h3>Queue Count</h3>
              <p>{clinic.queueCount}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
        <div className="card">
          <h2 className="mb-4">Clinic Users</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td><span className="badge badge-in-progress">{user.role}</span></td>
                    <td>{user.email}</td>
                    <td>{user.phone || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-4">Create User</h2>
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-input" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Full Name" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email Address" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Secure Password" />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option value="receptionist">Receptionist</option>
                <option value="doctor">Doctor</option>
                <option value="patient">Patient</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="text" className="form-input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Phone Number" />
            </div>
            <button type="submit" className="btn btn-primary btn-full mt-4">Create User</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
