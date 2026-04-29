-- ============================================================
-- Migration: Ogun State House of Assembly (2023–2027)
-- 26 seats — APC majority
-- Governor: Dapo Abiodun (APC) re-elected 2023
-- Source: ogunassembly.gov.ng, Wikipedia
-- Term: 6 June 2023 – 6 June 2027
-- ============================================================

INSERT INTO offices (title, level, category, constituency_type)
SELECT 'Speaker, State House of Assembly', 'State', 'Legislative', 'State Constituency'
WHERE NOT EXISTS (SELECT 1 FROM offices WHERE title = 'Speaker, State House of Assembly');

INSERT INTO offices (title, level, category, constituency_type)
SELECT 'Member, State House of Assembly', 'State', 'Legislative', 'State Constituency'
WHERE NOT EXISTS (SELECT 1 FROM offices WHERE title = 'Member, State House of Assembly');

INSERT INTO officials (
  full_name, gender, office_id, party_id, state_id, constituency,
  term_start, term_end, next_election_date,
  status, verified, verified_by, verified_at, source_url
) VALUES

-- ── Speaker ───────────────────────────────────────────────────────────────────
('Olakunle Oluomo','Male',(SELECT id FROM offices WHERE title='Speaker, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Ado-Odo/Ota I','2023-06-06','2027-06-06','2027-03-01','active',true,'seed-sql',NOW(),'https://ogunassembly.gov.ng'),

-- ── Members — unverified; require confirmation ─────────────────────────────
('Ganiyu Oyedeji','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Abeokuta North','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Remijus Iheanacho','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Abeokuta South I','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Kazeem Balogun','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Abeokuta South II','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Tokunbo Ogunmola','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Ado-Odo/Ota II','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Wale Akinwale','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Ado-Odo/Ota III','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Suraj Adekunbi','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Egbado North I','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Fatai Adebayo','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Egbado North II','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Sola Ogundimu','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Egbado South I','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Bimbo Onitiju','Female',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Egbado South II','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Tope Oladele','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Ewekoro','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Dare Kadiri','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Ifo I','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Oluwaseun Ogunyemi','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Ifo II','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Segun Odunmbaku','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Ijebu East','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Gbenga Efuwape','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Ijebu North I','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Lanre Osinowo','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Ijebu North II','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Bisi Ogunwale','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Ijebu North East','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Rotimi Bashir','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Ijebu Ode','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Adewale Adeleke','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Ikenne','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Gbolahan Fafore','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Imeko-Afon','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Sunday Akande','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Ipokia','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Akeem Balogun','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Obafemi-Owode I','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Yetunde Oladipo','Female',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Obafemi-Owode II','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Tunde Braimoh','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Odeda','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Dare Ogun','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Odogbolu','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Fatai Sodiq','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Ogun Waterside','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Abiodun Akinlade','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Remo North','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Kunle Sobukonla','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Sagamu I','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng'),
('Niyi Adeyoye','Male',(SELECT id FROM offices WHERE title='Member, State House of Assembly' LIMIT 1),(SELECT id FROM parties WHERE abbreviation='APC'),(SELECT id FROM states WHERE name='Ogun'),'Sagamu II','2023-06-06','2027-06-06','2027-03-01','active',false,'seed-sql-unverified',NOW(),'https://ogunassembly.gov.ng');

-- NOTE: Olakunle Oluomo (Speaker) is verified=true from assembly records.
-- All other member names are unverified and require confirmation against
-- ogunassembly.gov.ng. Party split: APC 25+ (near-total majority).
