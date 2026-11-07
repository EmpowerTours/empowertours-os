-- Notes signed in with X carry the X account; guests leave these NULL / 0.
ALTER TABLE notes ADD COLUMN verified INTEGER NOT NULL DEFAULT 0;
ALTER TABLE notes ADD COLUMN x_id TEXT;
ALTER TABLE notes ADD COLUMN avatar TEXT;
