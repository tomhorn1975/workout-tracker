import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMachines } from '../api.js';

export default function Home() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMachines().then(data => {
      setMachines(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="page">
      <div style={{ marginBottom: 24 }}>
        <h1>Workout Tracker</h1>
        <p className="text-muted">Scan a QR code or pick a machine below</p>
      </div>

      <button className="btn btn-primary btn-full" style={{ marginBottom: 24, fontSize: 17, padding: '16px' }}
        onClick={() => navigate('/scan')}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
          <rect x="7" y="7" width="10" height="10" rx="1" />
        </svg>
        Scan Machine QR Code
      </button>

      <h2 style={{ marginBottom: 12 }}>All Machines</h2>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : machines.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🏋️</div>
          <p>No machines yet</p>
          <p className="text-muted" style={{ marginTop: 6, marginBottom: 16 }}>Add machines in the Admin section</p>
          <button className="btn btn-secondary" onClick={() => navigate('/admin')}>Go to Admin</button>
        </div>
      ) : (
        machines.map(machine => (
          <Link key={machine.id} to={`/machine/${machine.id}`} className="machine-item">
            <div>
              <div style={{ fontWeight: 600 }}>{machine.name}</div>
              <div className="tags" style={{ marginTop: 4 }}>
                {machine.body_parts.map(bp => (
                  <span key={bp} className="tag">{bp}</span>
                ))}
              </div>
            </div>
            <span className="machine-item-arrow">›</span>
          </Link>
        ))
      )}
    </div>
  );
}
