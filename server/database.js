const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../workout.db');
let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initDb() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS machines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      body_parts TEXT NOT NULL DEFAULT '[]',
      description TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      machine_id INTEGER NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
      notes TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      set_number INTEGER NOT NULL,
      reps INTEGER NOT NULL DEFAULT 0,
      weight REAL NOT NULL DEFAULT 0,
      unit TEXT NOT NULL DEFAULT 'lbs'
    );
  `);
}

module.exports = { getDb, initDb };
