import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSessions } from '../api.js';

function formatDate(dt) {
  return new Date(dt).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });
}

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getSessions(null, 50).then(data => {
      setSessions(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <h1 style={{ marginBottom: 4 }}>History</h1>
      <p className="text-muted" style={{ marginBottom: 20 }}>All your recent sessions</p>

      {sessions.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <p>No sessions yet</p>
          <p className="text-muted" style={{ marginTop: 6 }}>Log a workout to see your history here</p>
        </div>
      ) : (
        sessions.map(session => (
          <div key={session.id} className="card">
            <div className="card-header">
              <div>
                <div style={{ fontWeight: 600 }}>{session.machine_name}</div>
                <div className="date-label" style={{ marginTop: 2 }}>{formatDate(session.date)}</div>
              </div>
              <Link to={`/machine/${session.machine_id}`} style={{ color: 'var(--accent)', fontSize: 13, textDecoration: 'none' }}>
                View Machine
              </Link>
            </div>
            {session.notes && (
              <p className="text-muted" style={{ fontSize: 13, marginBottom: 8 }}>{session.notes}</p>
            )}
            <div className="session-sets">
              {session.sets.map(s => (
                <div key={s.id} className="session-set-row">
                  <span className="text-muted">Set {s.set_number}</span>
                  <span><strong>{s.reps}</strong> reps @ <strong>{s.weight}</strong> {s.unit}</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
