import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMachine, getLastSession, createSession, getSessions, deleteSession } from '../api.js';

function formatDate(dt) {
  return new Date(dt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function SetRow({ set, index, onChange, onRemove, showRemove }) {
  return (
    <tr>
      <td><span className="set-number">Set {set.set_number}</span></td>
      <td>
        <input
          type="number"
          className="set-input"
          inputMode="numeric"
          value={set.reps}
          placeholder="0"
          onChange={e => onChange(index, 'reps', e.target.value)}
        />
      </td>
      <td>
        <input
          type="number"
          className="set-input"
          inputMode="decimal"
          value={set.weight}
          placeholder="0"
          onChange={e => onChange(index, 'weight', e.target.value)}
        />
      </td>
      <td>
        <div className="unit-toggle">
          <button
            className={`unit-btn ${set.unit === 'lbs' ? 'active' : ''}`}
            onClick={() => onChange(index, 'unit', 'lbs')}
          >lbs</button>
          <button
            className={`unit-btn ${set.unit === 'kg' ? 'active' : ''}`}
            onClick={() => onChange(index, 'unit', 'kg')}
          >kg</button>
        </div>
      </td>
      {showRemove && (
        <td>
          <button
            className="btn btn-danger btn-sm"
            style={{ padding: '8px', minWidth: 'unset' }}
            onClick={() => onRemove(index)}
          >✕</button>
        </td>
      )}
    </tr>
  );
}

function LastSessionCard({ session }) {
  return (
    <div className="card">
      <div className="date-label">Last session: {formatDate(session.date)}</div>
      {session.notes && <p className="text-muted" style={{ fontSize: 13, marginBottom: 8 }}>{session.notes}</p>}
      <div className="session-sets">
        {session.sets.map(s => (
          <div key={s.id} className="session-set-row">
            <span className="text-muted">Set {s.set_number}</span>
            <span>
              <strong>{s.reps}</strong> reps &nbsp;@&nbsp; <strong>{s.weight}</strong> {s.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Machine() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [machine, setMachine] = useState(null);
  const [lastSession, setLastSession] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLogging, setIsLogging] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sets, setSets] = useState([{ set_number: 1, reps: '', weight: '', unit: 'lbs' }]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  async function loadData() {
    const [m, s] = await Promise.all([getMachine(id), getLastSession(id)]);
    setMachine(m);
    setLastSession(s);
    if (s && s.sets && s.sets.length > 0) {
      setSets(s.sets.map(st => ({
        set_number: st.set_number,
        reps: st.reps || '',
        weight: st.weight || '',
        unit: st.unit || 'lbs'
      })));
    }
    setLoading(false);
  }

  useEffect(() => { loadData(); }, [id]);

  function addSet() {
    const last = sets[sets.length - 1];
    setSets([...sets, {
      set_number: sets.length + 1,
      reps: last?.reps || '',
      weight: last?.weight || '',
      unit: last?.unit || 'lbs'
    }]);
  }

  function removeSet(index) {
    setSets(sets.filter((_, i) => i !== index).map((s, i) => ({ ...s, set_number: i + 1 })));
  }

  function updateSet(index, field, value) {
    setSets(sets.map((s, i) => i === index ? { ...s, [field]: value } : s));
  }

  async function saveSession() {
    setSaving(true);
    await createSession({
      machine_id: parseInt(id),
      sets: sets.map(s => ({
        ...s,
        reps: parseInt(s.reps) || 0,
        weight: parseFloat(s.weight) || 0
      })),
      notes
    });
    setIsLogging(false);
    setNotes('');
    showToast('Session saved!');
    await loadData();
    setSaving(false);
  }

  async function loadHistory() {
    const data = await getSessions(id, 10);
    setHistory(data);
    setShowHistory(true);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (!machine) return <div className="page"><p className="text-muted">Machine not found.</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div>
          <h1>{machine.name}</h1>
          {machine.body_parts.length > 0 && (
            <div className="tags" style={{ marginTop: 4 }}>
              {machine.body_parts.map(bp => <span key={bp} className="tag">{bp}</span>)}
            </div>
          )}
        </div>
      </div>

      {machine.description && (
        <p className="text-muted" style={{ marginBottom: 16, fontSize: 14 }}>{machine.description}</p>
      )}

      {!isLogging ? (
        <>
          {lastSession ? (
            <LastSessionCard session={lastSession} />
          ) : (
            <div className="card">
              <p className="text-muted" style={{ textAlign: 'center', padding: '8px 0' }}>No previous sessions — first time on this machine!</p>
            </div>
          )}

          <button className="btn btn-primary btn-full" style={{ marginBottom: 12 }} onClick={() => setIsLogging(true)}>
            Log Workout
          </button>

          <button className="btn btn-ghost btn-full btn-sm" onClick={showHistory ? () => setShowHistory(false) : loadHistory}>
            {showHistory ? 'Hide History' : 'View History'}
          </button>

          {showHistory && history.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h2>History</h2>
              {history.map(session => (
                <div key={session.id} className="card" style={{ marginBottom: 10 }}>
                  <div className="card-header">
                    <span className="date-label">{formatDate(session.date)}</span>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ padding: '4px 10px', fontSize: 12 }}
                      onClick={async () => {
                        await deleteSession(session.id);
                        await loadHistory();
                        await loadData();
                      }}
                    >Delete</button>
                  </div>
                  {session.notes && <p className="text-muted" style={{ fontSize: 12, marginBottom: 6 }}>{session.notes}</p>}
                  <div className="session-sets">
                    {session.sets.map(s => (
                      <div key={s.id} className="session-set-row">
                        <span className="text-muted">Set {s.set_number}</span>
                        <span><strong>{s.reps}</strong> reps @ <strong>{s.weight}</strong> {s.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <h2 style={{ marginBottom: 4 }}>Log Workout</h2>
          {lastSession && (
            <p className="text-muted" style={{ fontSize: 13, marginBottom: 16 }}>
              Pre-filled from last session — update your numbers below
            </p>
          )}

          <div className="card" style={{ overflowX: 'auto' }}>
            <table className="sets-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Set</th>
                  <th>Reps</th>
                  <th>Weight</th>
                  <th>Unit</th>
                  {sets.length > 1 && <th></th>}
                </tr>
              </thead>
              <tbody>
                {sets.map((set, i) => (
                  <SetRow
                    key={i}
                    set={set}
                    index={i}
                    onChange={updateSet}
                    onRemove={removeSet}
                    showRemove={sets.length > 1}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <button className="btn btn-ghost btn-full btn-sm" style={{ marginBottom: 16 }} onClick={addSet}>
            + Add Set
          </button>

          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <textarea
              className="form-input"
              placeholder="How did it feel? Any adjustments?"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <button className="btn btn-primary btn-full" style={{ marginBottom: 10 }} onClick={saveSession} disabled={saving}>
            {saving ? 'Saving...' : 'Save Session'}
          </button>
          <button className="btn btn-ghost btn-full" onClick={() => setIsLogging(false)}>
            Cancel
          </button>
        </>
      )}

      {toast && <div className="snackbar">{toast}</div>}
    </div>
  );
}
