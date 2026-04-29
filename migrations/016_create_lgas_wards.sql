-- ============================================================
-- Migration 016: Local Government Areas & Wards tables
-- Creates the lgas and wards tables and adds optional FK
-- columns on officials so LGA chairmen and ward councillors
-- can be linked precisely.
-- ============================================================

-- ── LGAs ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lgas (
  id            SERIAL PRIMARY KEY,
  state_id      INTEGER NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  name          TEXT    NOT NULL,
  headquarters  TEXT,                        -- town where INEC/LGA HQ is located
  UNIQUE (state_id, name)
);

CREATE INDEX IF NOT EXISTS lgas_state_id_idx ON lgas (state_id);

-- ── Wards ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wards (
  id       SERIAL PRIMARY KEY,
  lga_id   INTEGER NOT NULL REFERENCES lgas(id) ON DELETE CASCADE,
  name     TEXT    NOT NULL,
  UNIQUE (lga_id, name)
);

CREATE INDEX IF NOT EXISTS wards_lga_id_idx ON wards (lga_id);

-- ── Extend officials table with optional LGA / ward links ──────────────────────
-- Allows LGA chairmen, vice-chairmen, and ward councillors to be precisely
-- linked without breaking the existing officials table structure.
ALTER TABLE officials
  ADD COLUMN IF NOT EXISTS lga_id  INTEGER REFERENCES lgas(id),
  ADD COLUMN IF NOT EXISTS ward_id INTEGER REFERENCES wards(id);

CREATE INDEX IF NOT EXISTS officials_lga_id_idx  ON officials (lga_id)  WHERE lga_id  IS NOT NULL;
CREATE INDEX IF NOT EXISTS officials_ward_id_idx ON officials (ward_id) WHERE ward_id IS NOT NULL;

-- ── Row Level Security (mirror the pattern on other tables) ────────────────────
ALTER TABLE lgas  ENABLE ROW LEVEL SECURITY;
ALTER TABLE wards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lgas_public_read"  ON lgas  FOR SELECT USING (true);
CREATE POLICY "wards_public_read" ON wards FOR SELECT USING (true);
