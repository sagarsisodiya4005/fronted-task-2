import React, { useState, useEffect } from 'react';
import { doctorAPI } from '../services/api';
import { FileText, Plus, Thermometer } from 'lucide-react';

const DoctorDashboard = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  const [prescriptionForm, setPrescriptionForm] = useState({
    medicines: [{ name: '', dosage: '', duration: '' }],
    notes: ''
  });

  const [reportForm, setReportForm] = useState({
    diagnosis: '',
    testRecommended: '',
    remarks: ''
  });

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await doctorAPI.getTodayQueue();
      setQueue(res.data);
    } catch (err) {
      console.error('Failed to fetch doctor queue', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleAddMedicine = () => {
    setPrescriptionForm({
      ...prescriptionForm,
      medicines: [...prescriptionForm.medicines, { name: '', dosage: '', duration: '' }]
    });
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...prescriptionForm.medicines];
    updatedMedicines[index][field] = value;
    setPrescriptionForm({ ...prescriptionForm, medicines: updatedMedicines });
  };

  const submitPrescription = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;
    try {
      await doctorAPI.addPrescription(selectedAppointment.appointmentId, prescriptionForm);
      alert('Prescription added successfully');
      setPrescriptionForm({ medicines: [{ name: '', dosage: '', duration: '' }], notes: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add prescription');
    }
  };

  const submitReport = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;
    try {
      await doctorAPI.addReport(selectedAppointment.appointmentId, reportForm);
      alert('Report added successfully');
      setReportForm({ diagnosis: '', testRecommended: '', remarks: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add report');
    }
  };

  return (
    <div>
      <div className="header">
        <div>
          <h1 className="header-title">Doctor Dashboard</h1>
          <p className="header-subtitle">Manage your patients and medical records</p>
        </div>
      </div>

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '2rem' }}>
        <div className="card">
          <h2 className="mb-4">Today's Queue</h2>
          {queue.length === 0 ? (
            <p className="text-light text-center py-4">No patients queued for today.</p>
          ) : (
            <div className="flex flex-col gap-2 sidebar-nav" style={{ padding: 0 }}>
              {queue.map(entry => (
                <div 
                  key={entry.id} 
                  className={`nav-link ${selectedAppointment?.id === entry.id ? 'active' : ''}`}
                  style={{ cursor: 'pointer', border: '1px solid var(--border)', justifyContent: 'space-between' }}
                  onClick={() => setSelectedAppointment(entry)}
                >
                  <div>
                    <strong>#{entry.tokenNumber}</strong> - {entry.patientName}
                  </div>
                  <span className={`badge badge-${entry.status}`} style={{ fontSize: '0.65rem' }}>
                    {entry.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {selectedAppointment ? (
            <div className="flex flex-col gap-4">
              <div className="card">
                <h2 className="mb-4 flex items-center gap-2"><FileText /> Prescription</h2>
                <form onSubmit={submitPrescription}>
                  {prescriptionForm.medicines.map((med, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input type="text" className="form-input" style={{ flex: 2 }} placeholder="Medicine Name" required value={med.name} onChange={(e) => handleMedicineChange(index, 'name', e.target.value)} />
                      <input type="text" className="form-input" style={{ flex: 1 }} placeholder="Dosage (e.g. 500mg)" required value={med.dosage} onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)} />
                      <input type="text" className="form-input" style={{ flex: 1 }} placeholder="Duration (e.g. 5 days)" required value={med.duration} onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)} />
                    </div>
                  ))}
                  <button type="button" onClick={handleAddMedicine} className="btn btn-secondary mt-2 flex items-center gap-1" style={{ padding: '0.5rem 1rem' }}>
                    <Plus size={16} /> Add Medicine
                  </button>

                  <div className="form-group mt-4">
                    <label className="form-label">Notes (Optional)</label>
                    <textarea className="form-input" rows="2" value={prescriptionForm.notes} onChange={(e) => setPrescriptionForm({...prescriptionForm, notes: e.target.value})}></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-primary mt-2">Save Prescription</button>
                </form>
              </div>

              <div className="card">
                <h2 className="mb-4 flex items-center gap-2"><Thermometer /> Medical Report</h2>
                <form onSubmit={submitReport}>
                  <div className="form-group">
                    <label className="form-label">Diagnosis</label>
                    <input type="text" className="form-input" required value={reportForm.diagnosis} onChange={(e) => setReportForm({...reportForm, diagnosis: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tests Recommended</label>
                    <input type="text" className="form-input" value={reportForm.testRecommended} onChange={(e) => setReportForm({...reportForm, testRecommended: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Remarks</label>
                    <textarea className="form-input" rows="2" value={reportForm.remarks} onChange={(e) => setReportForm({...reportForm, remarks: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary mt-2">Save Report</button>
                </form>
              </div>
            </div>
          ) : (
            <div className="card text-center text-light" style={{ padding: '4rem 2rem' }}>
              <p>Select a patient from the queue to add prescriptions and reports.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
