import React, { useState, useEffect } from 'react';
import { receptionistAPI } from '../services/api';
import { Users, CheckCircle, SkipForward, Play } from 'lucide-react';

const ReceptionistDashboard = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await receptionistAPI.getDailyQueue(date);
      setQueue(res.data);
    } catch (err) {
      console.error('Failed to fetch queue', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [date]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await receptionistAPI.updateQueueStatus(id, status);
      fetchQueue();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  return (
    <div>
      <div className="header">
        <div>
          <h1 className="header-title">Receptionist Dashboard</h1>
          <p className="header-subtitle">Manage today's clinic queue</p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="flex justify-between items-center">
          <h2 className="mb-0">Daily Queue</h2>
          <input 
            type="date" 
            className="form-input" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-4">Loading queue...</div>
      ) : queue.length === 0 ? (
        <div className="card text-center">
          <p className="text-light py-4">No appointments found for this date.</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Patient Name</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((entry) => (
                  <tr key={entry.id}>
                    <td><strong style={{ fontSize: '1.125rem' }}>#{entry.tokenNumber}</strong></td>
                    <td>{entry.appointment?.patient?.name || 'Unknown'}</td>
                    <td>{entry.appointment?.patient?.phone || '-'}</td>
                    <td><span className={`badge badge-${entry.status}`}>{entry.status.replace('-', ' ')}</span></td>
                    <td>
                      <div className="flex gap-2">
                        {entry.status === 'waiting' && (
                          <>
                            <button onClick={() => handleUpdateStatus(entry.id, 'in-progress')} className="btn btn-primary" title="Call in" style={{ padding: '0.4rem' }}>
                              <Play size={18} />
                            </button>
                            <button onClick={() => handleUpdateStatus(entry.id, 'skipped')} className="btn btn-secondary text-danger" title="Skip" style={{ padding: '0.4rem', borderColor: 'var(--danger-hover)' }}>
                              <SkipForward size={18} />
                            </button>
                          </>
                        )}
                        {entry.status === 'in-progress' && (
                          <button onClick={() => handleUpdateStatus(entry.id, 'done')} className="btn btn-success" title="Mark Done" style={{ padding: '0.4rem' }}>
                            <CheckCircle size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionistDashboard;
