-- Guestbook notes left on earvingallardo.com.
CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  who TEXT NOT NULL,            -- name or @handle as typed (trimmed, max 40)
  body TEXT NOT NULL,           -- the note (max 500)
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  ip_hash TEXT NOT NULL,        -- salted SHA-256 of the visitor IP, only for rate limiting
  hidden INTEGER NOT NULL DEFAULT 0  -- set to 1 to take a note down
);
CREATE INDEX IF NOT EXISTS notes_visible ON notes (hidden, id DESC);
CREATE INDEX IF NOT EXISTS notes_ip ON notes (ip_hash, created_at);
