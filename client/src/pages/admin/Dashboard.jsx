import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1 style={{ marginBottom: 4 }}>Admin</h1>
      <p className="text-muted" style={{ marginBottom: 24 }}>Manage your gym machines and QR codes</p>

      <div className="card" style={{ cursor: 'pointer', marginBottom: 12 }} onClick={() => navigate('/admin/machines')}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ marginBottom: 4 }}>Machines</h2>
            <p className="text-muted" style={{ fontSize: 14 }}>Add, edit, and manage gym machines</p>
          </div>
          <span style={{ fontSize: 24 }}>›</span>
        </div>
      </div>

      <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/machines/new')}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ marginBottom: 4 }}>Add Machine</h2>
            <p className="text-muted" style={{ fontSize: 14 }}>Set up a new machine with QR code</p>
          </div>
          <span style={{ fontSize: 24, color: 'var(--accent)' }}>+</span>
        </div>
      </div>
    </div>
  );
}
