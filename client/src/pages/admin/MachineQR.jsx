import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMachineQR } from '../../api.js';

export default function MachineQR() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMachineQR(id).then(d => {
      setData(d);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="loading">Generating QR code...</div>;
  if (!data) return <div className="page"><p className="text-muted">Not found.</p></div>;

  const { machine, qr } = data;

  return (
    <div className="page">
      <div className="page-header no-print">
        <button className="back-btn" onClick={() => navigate('/admin/machines')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1>QR Code</h1>
      </div>

      <div className="qr-label" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'white',
        borderRadius: 16,
        padding: '24px 20px',
        marginBottom: 20
      }}>
        <h2 style={{ color: '#0f172a', fontSize: 22, marginBottom: 8, textAlign: 'center' }}>
          {machine.name}
        </h2>
        {machine.body_parts && machine.body_parts.length > 0 && (
          <p style={{ color: '#475569', fontSize: 14, marginBottom: 16, textAlign: 'center' }}>
            {machine.body_parts.join(' · ')}
          </p>
        )}
        <img src={qr} alt={`QR code for ${machine.name}`} style={{ width: 240, height: 240 }} />
        {machine.description && (
          <p style={{ color: '#64748b', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
            {machine.description}
          </p>
        )}
        <p style={{ color: '#94a3b8', fontSize: 11, marginTop: 10 }}>
          Scan to log workout
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => window.print()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Print
        </button>
        <button className="btn btn-secondary" style={{ flex: 1 }}
          onClick={() => navigate(`/admin/machines/${id}/edit`)}>
          Edit Machine
        </button>
      </div>

      <p className="text-muted" style={{ fontSize: 12, marginTop: 16, textAlign: 'center' }}>
        Print and stick this label on your machine. Scan the QR code with the app to log your workout.
      </p>
    </div>
  );
}
