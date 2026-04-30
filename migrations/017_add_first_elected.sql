-- ============================================================
-- Migration 017: Add first_elected column to officials
-- Tracks when an incumbent first won this (or an equivalent)
-- office — distinct from term_start which resets each term.
-- Used to calculate total continuous time in office.
-- ============================================================

ALTER TABLE officials
  ADD COLUMN IF NOT EXISTS first_elected DATE;

CREATE INDEX IF NOT EXISTS officials_first_elected_idx
  ON officials (first_elected)
  WHERE first_elected IS NOT NULL;
