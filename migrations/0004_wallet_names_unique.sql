-- A registered name belongs to one wallet: no two wallets can hold the same name (case-insensitive).
CREATE UNIQUE INDEX IF NOT EXISTS wallet_names_name ON wallet_names (name COLLATE NOCASE);
