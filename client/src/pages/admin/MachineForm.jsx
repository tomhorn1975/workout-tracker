import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMachine, createMachine, updateMachine } from '../../api.js';

const BODY_PARTS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
  'Legs', 'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Abs', 'Core', 'Full Body'
];

export default function MachineForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [bodyParts, setBodyParts] = useState([]);
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    getMachine(id).then(m => {
      setName(m.name);
      setBodyParts(m.body_parts || []);
      setDescription(m.description || '');
      setLoading(false);
    });
  }, [id]);

  function toggleBodyPart(part) {
    setBodyParts(prev =>
      prev.includes(part) ? prev.filter(p => p !== part) : [...prev, part]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const data = { name: name.trim(), body_parts: bodyParts, description: description.trim() };
    const machine = isEdit
      ? await updateMachine(id, data)
      : await createMachine(data);
    setSaving(false);
    navigate(`/admin/machines/${machine.id}/qr`);
  }

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/admin/machines')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1>{isEdit ? 'Edit Machine' : 'New Machine'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Machine Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Chest Press, Lat Pulldown"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">Muscle Groups Targeted</label>
          <div className="body-parts-grid">
            {BODY_PARTS.map(part => (
              <label
                key={part}
                className={`body-part-check ${bodyParts.includes(part) ? 'selected' : ''}`}
                onClick={() => toggleBodyPart(part)}
              >
                <input type="checkbox" readOnly checked={bodyParts.includes(part)} />
                {part}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description (optional)</label>
          <textarea
            className="form-input"
            placeholder="Seat adjustment, cable setting, notes..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full" disabled={saving || !name.trim()}>
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create & View QR Code'}
        </button>
      </form>
    </div>
  );
}
