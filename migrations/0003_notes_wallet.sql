-- Notes signed with a wallet (Mera passkey wallet on earvingallardo.com).
ALTER TABLE notes ADD COLUMN wallet TEXT;            -- checksummed 0x address of the signer, NULL for older notes
CREATE INDEX IF NOT EXISTS notes_wallet ON notes (wallet, created_at);

-- The optional display name a wallet chose. Notes show the CURRENT name, so a rename applies to old notes.
CREATE TABLE IF NOT EXISTS wallet_names (
  address TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);

-- Sign-in messages are single use: a nonce lands here when it is redeemed.
CREATE TABLE IF NOT EXISTS wallet_nonces (
  nonce TEXT PRIMARY KEY,
  used_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);
