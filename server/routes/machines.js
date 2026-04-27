const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { getDb } = require('../database');

router.get('/', (req, res) => {
  const db = getDb();
  const machines = db.prepare('SELECT * FROM machines ORDER BY name').all();
  res.json(machines.map(m => ({ ...m, body_parts: JSON.parse(m.body_parts) })));
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const machine = db.prepare('SELECT * FROM machines WHERE id = ?').get(req.params.id);
  if (!machine) return res.status(404).json({ error: 'Machine not found' });
  res.json({ ...machine, body_parts: JSON.parse(machine.body_parts) });
});

router.get('/:id/last-session', (req, res) => {
  const db = getDb();
  const session = db.prepare(
    'SELECT * FROM sessions WHERE machine_id = ? ORDER BY date DESC LIMIT 1'
  ).get(req.params.id);
  if (!session) return res.json(null);
  const sets = db.prepare(
    'SELECT * FROM sets WHERE session_id = ? ORDER BY set_number'
  ).all(session.id);
  res.json({ ...session, sets });
});

router.get('/:id/qr', async (req, res) => {
  try {
    const db = getDb();
    const machine = db.prepare('SELECT * FROM machines WHERE id = ?').get(req.params.id);
    if (!machine) return res.status(404).json({ error: 'Machine not found' });
    const qrData = `machine:${req.params.id}`;
    const qrDataUrl = await QRCode.toDataURL(qrData, {
      width: 400,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    });
    res.json({ qr: qrDataUrl, data: qrData, machine: { ...machine, body_parts: JSON.parse(machine.body_parts) } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

router.post('/', (req, res) => {
  const { name, body_parts, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const db = getDb();
  const result = db.prepare(
    'INSERT INTO machines (name, body_parts, description) VALUES (?, ?, ?)'
  ).run(name, JSON.stringify(body_parts || []), description || '');
  const machine = db.prepare('SELECT * FROM machines WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ ...machine, body_parts: JSON.parse(machine.body_parts) });
});

router.put('/:id', (req, res) => {
  const { name, body_parts, description } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT * FROM machines WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Machine not found' });
  db.prepare(
    'UPDATE machines SET name = ?, body_parts = ?, description = ? WHERE id = ?'
  ).run(name, JSON.stringify(body_parts || []), description || '', req.params.id);
  const machine = db.prepare('SELECT * FROM machines WHERE id = ?').get(req.params.id);
  res.json({ ...machine, body_parts: JSON.parse(machine.body_parts) });
});

router.delete('/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM machines WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
