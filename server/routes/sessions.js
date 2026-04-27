const express = require('express');
const router = express.Router();
const { getDb } = require('../database');

router.get('/', (req, res) => {
  const { machine_id, limit = 20 } = req.query;
  const db = getDb();
  let sessions;
  if (machine_id) {
    sessions = db.prepare(
      'SELECT * FROM sessions WHERE machine_id = ? ORDER BY date DESC LIMIT ?'
    ).all(machine_id, parseInt(limit));
  } else {
    sessions = db.prepare(`
      SELECT s.*, m.name as machine_name
      FROM sessions s
      JOIN machines m ON m.id = s.machine_id
      ORDER BY s.date DESC LIMIT ?
    `).all(parseInt(limit));
  }
  const sessionsWithSets = sessions.map(session => {
    const sets = db.prepare(
      'SELECT * FROM sets WHERE session_id = ? ORDER BY set_number'
    ).all(session.id);
    return { ...session, sets };
  });
  res.json(sessionsWithSets);
});

router.post('/', (req, res) => {
  const { machine_id, sets, notes, date } = req.body;
  if (!machine_id) return res.status(400).json({ error: 'machine_id is required' });
  const db = getDb();
  const sessionResult = db.prepare(
    'INSERT INTO sessions (machine_id, notes, date) VALUES (?, ?, ?)'
  ).run(machine_id, notes || '', date || new Date().toISOString());
  const sessionId = sessionResult.lastInsertRowid;
  if (sets && sets.length > 0) {
    const insertSet = db.prepare(
      'INSERT INTO sets (session_id, set_number, reps, weight, unit) VALUES (?, ?, ?, ?, ?)'
    );
    for (const set of sets) {
      insertSet.run(sessionId, set.set_number, set.reps || 0, set.weight || 0, set.unit || 'lbs');
    }
  }
  const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId);
  const sessionSets = db.prepare(
    'SELECT * FROM sets WHERE session_id = ? ORDER BY set_number'
  ).all(sessionId);
  res.status(201).json({ ...session, sets: sessionSets });
});

router.delete('/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM sessions WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
