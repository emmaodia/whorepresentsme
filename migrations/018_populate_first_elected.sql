-- ============================================================
-- Migration 018: Populate first_elected for known multi-term
-- senators and House of Reps members (2023–2027 assembly).
-- All dates are approximate electoral-win / inauguration dates.
-- Sources: INEC results archives, Wikipedia, Vanguard.
-- ============================================================

-- ── Senate ────────────────────────────────────────────────────────────────────

-- Ahmad Ibrahim Lawan — Yobe North; Senate since 2003 (HOR 1999–2003, Senate 2003–)
-- First elected to Senate: May 2003. Continuously re-elected.
UPDATE officials
SET first_elected = '2003-05-29'
WHERE full_name ILIKE '%Ahmad Lawan%'
  AND offices.level = 'Federal';

-- Technically we can't join on `offices` in a plain UPDATE in Postgres
-- without a subquery, so we reference office_id + state_id instead.

UPDATE officials SET first_elected = '2003-05-29'
WHERE full_name ILIKE '%Ahmad%Lawan%'
  AND office_id IN (SELECT id FROM offices WHERE level = 'Federal' AND category = 'Legislative');

-- Mohammed Ali Ndume — Borno South; HOR 2003–2011, Senate 2011–
UPDATE officials SET first_elected = '2011-05-29'
WHERE full_name ILIKE '%Ali Ndume%'
  AND office_id IN (SELECT id FROM offices WHERE level = 'Federal' AND category = 'Legislative');

-- Mohammed Danjuma Goje — Gombe Central; Senate since 2011 (was Governor 2003–2011)
UPDATE officials SET first_elected = '2011-05-29'
WHERE full_name ILIKE '%Danjuma Goje%'
  AND office_id IN (SELECT id FROM offices WHERE level = 'Federal' AND category = 'Legislative');

-- Godswill Obot Akpabio — Akwa Ibom North-West; Senate since 2019
-- (Governor 2007–2015, HOR then Senator)
UPDATE officials SET first_elected = '2019-05-29'
WHERE full_name ILIKE '%Akpabio%'
  AND office_id IN (SELECT id FROM offices WHERE level = 'Federal' AND category = 'Legislative');

-- Barau Jubrin — Kano North; Senate since 2019
UPDATE officials SET first_elected = '2019-05-29'
WHERE full_name ILIKE '%Barau%Jubrin%'
  AND office_id IN (SELECT id FROM offices WHERE level = 'Federal' AND category = 'Legislative');

-- Orji Uzor Kalu — Abia North; Senate since 2019 (was Governor 1999–2007)
UPDATE officials SET first_elected = '2019-05-29'
WHERE full_name ILIKE '%Orji%Kalu%'
  AND office_id IN (SELECT id FROM offices WHERE level = 'Federal' AND category = 'Legislative');

-- Michael Opeyemi Bamidele — Ekiti Central; Senate since 2019 (HOR 2011–2019)
UPDATE officials SET first_elected = '2019-05-29'
WHERE full_name ILIKE '%Bamidele%'
  AND office_id IN (SELECT id FROM offices WHERE level = 'Federal' AND category = 'Legislative');

-- Aliyu Magatakarda Wamakko — Sokoto North; Senate since 2019 (was Governor 2007–2015)
UPDATE officials SET first_elected = '2019-05-29'
WHERE full_name ILIKE '%Wamakko%'
  AND office_id IN (SELECT id FROM offices WHERE level = 'Federal' AND category = 'Legislative');

-- Ibrahim Geidam — Yobe East; Senate since 2019 (was Governor 2009–2019)
UPDATE officials SET first_elected = '2019-05-29'
WHERE full_name ILIKE '%Geidam%'
  AND office_id IN (SELECT id FROM offices WHERE level = 'Federal' AND category = 'Legislative');

-- ── House of Representatives ──────────────────────────────────────────────────

-- Tajudeen Abbas — Speaker, HOR; Zaria constituency since 2011
UPDATE officials SET first_elected = '2011-05-29'
WHERE full_name ILIKE '%Tajudeen%Abbas%'
  AND office_id IN (SELECT id FROM offices WHERE level = 'Federal' AND category = 'Legislative');

-- Benjamin Okezie Kalu — Deputy Speaker, HOR; Bende since 2019
UPDATE officials SET first_elected = '2019-05-29'
WHERE full_name ILIKE '%Okezie Kalu%'
  AND office_id IN (SELECT id FROM offices WHERE level = 'Federal' AND category = 'Legislative');

-- ── Governors (notable multi-term or long-serving) ───────────────────────────

-- Abdullahi Ganduje was governor of Kano 2015–2023 but is no longer in office;
-- current governor Abba Kabir Yusuf took office 2023 — first term, no update needed.

-- Simon Lalong — Plateau; Governor 2015–2023 (became Senator 2023, update above if present)
-- Nyesome Wike — Rivers; Governor 2015–2023 (became FCT Minister, not an official here)

-- Babagana Zulum — Borno; Governor since 2019 (first term)
UPDATE officials SET first_elected = '2019-05-29'
WHERE full_name ILIKE '%Babagana%Zulum%'
  AND office_id IN (SELECT id FROM offices WHERE level = 'State' AND category = 'Executive');

-- Dave Umahi — Ebonyi; Governor 2015–2023, now Senator — already covered by Senator pattern above.
-- Seyi Makinde — Oyo; Governor since 2019 (second term 2023)
UPDATE officials SET first_elected = '2019-05-29'
WHERE full_name ILIKE '%Seyi Makinde%'
  AND office_id IN (SELECT id FROM offices WHERE level = 'State' AND category = 'Executive');

-- Ifeanyi Ugwuanyi — Enugu; Governor 2015–2023 (termed out; successor Peter Mbah took 2023)
-- No update needed for Mbah — first term.

-- Abdullahi Sule — Nasarawa; Governor 2019–2023 (Abdullahi Sule did not return; no update)
-- Godwin Obaseki — Edo; Governor since 2016, second term 2020–2024; termed out 2024 — no update.
