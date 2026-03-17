import React, { useState, useEffect } from 'react';
import { patientAPI } from '../services/api';
import { Calendar, Clock, FileText, ClipboardList } from 'lucide-react';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bookData, setBookData] = useState({
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '10:00-10:15'
  });

  const fetchData = async () => {
    try {
      const [apptRes, prepRes, repRes] = await Promise.all([
        patientAPI.getMyAppointments(),
        patientAPI.getMyPrescriptions(),
        patientAPI.getMyReports()
      ]);
      setAppointments(apptRes.data);
      setPrescriptions(prepRes.data);
      setReports(repRes.data);
    } catch (err) {
      console.error('Error fetching patient data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      await patientAPI.bookAppointment(bookData);
      alert('Appointment booked successfully!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to book appointment');
    }
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div>
      <div className="header">
        <div>
          <h1 className="header-title">My Dashboard</h1>
          <p className="header-subtitle">Manage your appointments and medical records</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon primary"><Calendar size={24} /></div>
          <div className="stat-info">
            <h3>Appointments</h3>
            <p>{appointments.length}</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon success"><ClipboardList size={24} /></div>
          <div className="stat-info">
            <h3>Prescriptions</h3>
            <p>{prescriptions.length}</p>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon warning"><FileText size={24} /></div>
          <div className="stat-info">
            <h3>Reports</h3>
            <p>{reports.length}</p>
          </div>
        </div>
      </div>

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="card">
          <h2 className="mb-4">Book Appointment</h2>
          <form onSubmit={handleBookAppointment}>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" required min={new Date().toISOString().split('T')[0]} value={bookData.appointmentDate} onChange={(e) => setBookData({...bookData, appointmentDate: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Time Slot</label>
              <select className="form-select" required value={bookData.timeSlot} onChange={(e) => setBookData({...bookData, timeSlot: e.target.value})}>
                <option value="10:00-10:15">10:00 AM - 10:15 AM</option>
                <option value="10:15-10:30">10:15 AM - 10:30 AM</option>
                <option value="10:30-10:45">10:30 AM - 10:45 AM</option>
                <option value="10:45-11:00">10:45 AM - 11:00 AM</option>
                <option value="11:00-11:15">11:00 AM - 11:15 AM</option>
                <option value="14:00-14:15">02:00 PM - 02:15 PM</option>
                <option value="14:15-14:30">02:15 PM - 02:30 PM</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-full mt-4">Book Now</button>
          </form>
        </div>

        <div className="card">
          <h2 className="mb-4">My Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-light">No appointments found.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Token</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(apt => (
                    <tr key={apt.id}>
                      <td>{apt.appointmentDate}</td>
                      <td>{apt.timeSlot}</td>
                      <td><strong>#{apt.queueEntry?.tokenNumber || '-'}</strong></td>
                      <td>
                        <span className={`badge badge-${apt.status}`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid mt-4" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>
        <div className="card">
          <h2 className="mb-4">My Prescriptions</h2>
          {prescriptions.length === 0 ? (
            <p className="text-light">No prescriptions found.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Appointment</th>
                    <th>Medicines</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map(p => (
                    <tr key={p.id}>
                      <td>{p.appointment?.appointmentDate || 'N/A'}</td>
                      <td>
                        <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.875rem' }}>
                          {p.medicines?.map((m, i) => (
                            <li key={i}>{m.name} ({m.dosage}) - {m.duration}</li>
                          ))}
                        </ul>
                      </td>
                      <td>{p.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="mb-4">My Reports</h2>
          {reports.length === 0 ? (
            <p className="text-light">No medical reports found.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Appointment</th>
                    <th>Diagnosis</th>
                    <th>Tests Recommended</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(r => (
                    <tr key={r.id}>
                      <td>{r.appointment?.appointmentDate || 'N/A'}</td>
                      <td><strong>{r.diagnosis}</strong></td>
                      <td>{r.testRecommended || '-'}</td>
                      <td>{r.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
