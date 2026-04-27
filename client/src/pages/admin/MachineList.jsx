import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMachines, deleteMachine } from '../../api.js';

export default function MachineList() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function load() {
    const data = await getMachines();
    setMachines(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This will also delete all workout history for this machine.`)) return;
    await deleteMachine(id);
    load();
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/admin')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1>Machines</h1>
      </div>

      <button className="btn btn-primary btn-full" style={{ marginBottom: 20 }}
        onClick={() => navigate('/admin/machines/new')}>
        + Add Machine
      </button>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : machines.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🏋️</div>
          <p>No machines yet</p>
        </div>
      ) : (
        machines.map(machine => (
          <div key={machine.id} className="card">
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>{machine.name}</div>
              {machine.body_parts.length > 0 && (
                <div className="tags">
                  {machine.body_parts.map(bp => <span key={bp} className="tag">{bp}</span>)}
                </div>
              )}
              {machine.description && (
                <p className="text-muted" style={{ fontSize: 13, marginTop: 6 }}>{machine.description}</p>
              )}
            </div>
            <div className="action-row">
              <button className="btn btn-secondary btn-sm"
                onClick={() => navigate(`/admin/machines/${machine.id}/qr`)}>
                Print QR
              </button>
              <button className="btn btn-secondary btn-sm"
                onClick={() => navigate(`/admin/machines/${machine.id}/edit`)}>
                Edit
              </button>
              <button className="btn btn-danger btn-sm"
                onClick={() => handleDelete(machine.id, machine.name)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
