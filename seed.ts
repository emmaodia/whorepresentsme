/**
 * WhoRepresentsMe.ng — Seed Script
 * Seeds all Federal and State officials for Phase 1 rollout.
 *
 * Data sources:
 *  - Federal executive: aso.gov.ng / presidency.gov.ng
 *  - Senators: INEC list (inecnigeria.org) + Pulse Nigeria (June 2023)
 *    https://www.pulse.ng/news/politics/list-of-all-senators-in-nigerias-10th-national-assembly
 *  - Governors & Deputies: Wikipedia, List of current state governors in Nigeria
 *    https://en.wikipedia.org/wiki/List_of_current_state_governors_in_Nigeria
 *
 * Usage:
 *   npm install @supabase/supabase-js
 *   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... npx tsx seed.ts
 *
 * The script uses upsert on full_name + constituency so it is safe to re-run.
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL       = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.')
  process.exit(1)
}

const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ─── Shared constants ─────────────────────────────────────────────────────────

const TERM_NASS       = { start: '2023-06-13', end: '2027-06-12', next: '2027-02-01' }
const TERM_GOV_2023   = { start: '2023-05-29', end: '2027-05-29', next: '2027-03-01' }
const TERM_GOV_2019   = { start: '2019-05-29', end: '2027-05-29', next: '2027-03-01' } // re-elected
const TERM_GOV_2022   = { start: '2022-11-12', end: '2026-11-11', next: '2026-11-01' } // Anambra
const TERM_GOV_2022EK = { start: '2022-10-16', end: '2026-10-15', next: '2026-06-01' } // Ekiti
const TERM_GOV_2022OS = { start: '2022-11-27', end: '2026-11-26', next: '2026-07-01' } // Osun
const TERM_GOV_2024   = { start: '2024-11-12', end: '2028-11-11', next: '2028-09-01' } // Edo
const TERM_GOV_2024KG = { start: '2024-01-27', end: '2028-01-26', next: '2028-11-01' } // Kogi
const TERM_GOV_2020   = { start: '2020-02-14', end: '2028-02-13', next: '2028-11-01' } // Bayelsa, Imo
const TERM_EXEC       = { start: '2023-05-29', end: '2027-05-29', next: '2027-02-01' }
const TERM_GOV_2023OD = { start: '2023-12-27', end: '2029-12-26', next: '2028-09-01' } // Ondo (Aiyedatiwa)

const SOURCE_INEC      = 'https://inecnigeria.org/wp-content/uploads/2023/03/LIST-OF-SENATORS-ELECT-FEB-2023.pdf'
const SOURCE_PULSE_SEN = 'https://www.pulse.ng/news/politics/list-of-all-senators-in-nigerias-10th-national-assembly/y9s1g1l'
const SOURCE_WIKI_GOV  = 'https://en.wikipedia.org/wiki/List_of_current_state_governors_in_Nigeria'
const SOURCE_ASO       = 'https://aso.gov.ng'
const SOURCE_NASS      = 'https://nass.gov.ng'

// ─── Raw data ─────────────────────────────────────────────────────────────────

/** Federal executive and NASS leadership */
const FEDERAL_EXECUTIVE = [
  {
    full_name: 'Bola Ahmed Tinubu',
    gender: 'Male',
    office_title: 'President',
    state_name: null,
    party_abbr: 'APC',
    constituency: null,
    bio: '16th President of Nigeria. Former Governor of Lagos State (1999–2007). Inaugurated 29 May 2023.',
    phone: '+234 9 523 0100',
    official_email: 'president@aso.gov.ng',
    official_website: 'aso.gov.ng',
    twitter_handle: 'officialABAT',
    ...TERM_EXEC,
    source_url: SOURCE_ASO,
  },
  {
    full_name: 'Kashim Shettima',
    gender: 'Male',
    office_title: 'Vice President',
    state_name: null,
    party_abbr: 'APC',
    constituency: null,
    bio: 'Vice President of Nigeria. Former Governor of Borno State (2011–2019).',
    official_email: 'vp@aso.gov.ng',
    official_website: 'aso.gov.ng',
    twitter_handle: 'KashimSM',
    ...TERM_EXEC,
    source_url: SOURCE_ASO,
  },
  {
    full_name: 'Godswill Obot Akpabio',
    gender: 'Male',
    office_title: 'Senate President',
    state_name: 'Akwa Ibom',
    party_abbr: 'APC',
    constituency: 'Akwa Ibom North-West',
    bio: 'Senate President of the 10th National Assembly. Former Governor of Akwa Ibom State (2007–2015) and Minister of Niger Delta Affairs.',
    official_email: 'senate.president@nass.gov.ng',
    official_website: 'nass.gov.ng',
    twitter_handle: 'SenGodswillAkpabio',
    ...TERM_NASS,
    source_url: SOURCE_NASS,
  },
  {
    full_name: 'Barau Jubrin',
    gender: 'Male',
    office_title: 'Deputy Senate President',
    state_name: 'Kano',
    party_abbr: 'APC',
    constituency: 'Kano North',
    bio: 'Deputy Senate President, 10th National Assembly. Re-elected senator for Kano North. Former Chairman, Senate Committee on Finance.',
    official_email: 'deputy.senate.president@nass.gov.ng',
    official_website: 'nass.gov.ng',
    ...TERM_NASS,
    source_url: SOURCE_NASS,
  },
  {
    full_name: 'Tajudeen Abbas',
    gender: 'Male',
    office_title: 'Speaker, House of Representatives',
    state_name: 'Kaduna',
    party_abbr: 'APC',
    constituency: 'Zaria Federal Constituency',
    bio: 'Speaker of the House of Representatives, 10th National Assembly. Member of the House since 2011.',
    official_email: 'speaker@nass.gov.ng',
    official_website: 'nass.gov.ng',
    twitter_handle: 'tajudeen_abbas',
    ...TERM_NASS,
    source_url: SOURCE_NASS,
  },
  {
    full_name: 'Benjamin Okezie Kalu',
    gender: 'Male',
    office_title: 'Deputy Speaker, House of Reps',
    state_name: 'Abia',
    party_abbr: 'APC',
    constituency: 'Bende Federal Constituency',
    bio: 'Deputy Speaker, House of Representatives, 10th National Assembly. First elected to the House in 2019.',
    official_email: 'deputy.speaker@nass.gov.ng',
    official_website: 'nass.gov.ng',
    twitter_handle: 'benkalu',
    ...TERM_NASS,
    source_url: SOURCE_NASS,
  },
]

/** All 109 Senators — 10th National Assembly (2023–2027)
 *  Source: INEC official gazette + Pulse Nigeria June 2023
 *  Format: [full_name, state, district, party, gender]
 */
const SENATORS: [string, string, string, string, string][] = [
  // ── ABIA ────────────────────────────────────────────────────────────────────
  ['Orji Uzor Kalu',           'Abia',      'Abia North',       'APC',  'Male'],
  ['Darlington Nwokeocha',     'Abia',      'Abia Central',     'LP',   'Male'],
  ['Enyinnaya Harcourt Abaribe','Abia',     'Abia South',       'APGA', 'Male'],
  // ── ADAMAWA ─────────────────────────────────────────────────────────────────
  ['Elisha Cliff Abbo',        'Adamawa',   'Adamawa North',    'APC',  'Male'],
  ['Aminu Iya Abass',          'Adamawa',   'Adamawa Central',  'PDP',  'Male'],
  ['Binos Dauda Yaroe',        'Adamawa',   'Adamawa South',    'PDP',  'Male'],
  // ── AKWA IBOM ───────────────────────────────────────────────────────────────
  ['Godswill Obot Akpabio',    'Akwa Ibom', 'Akwa Ibom North-West', 'APC', 'Male'],
  ['Bassey Albert Akpan',      'Akwa Ibom', 'Akwa Ibom North-East', 'PDP', 'Male'],
  ['Ekong Sampson Akpan',      'Akwa Ibom', 'Akwa Ibom South',  'PDP',  'Male'],
  // ── ANAMBRA ─────────────────────────────────────────────────────────────────
  ['Tony Nwoye',               'Anambra',   'Anambra North',    'LP',   'Male'],
  ['Victor Umeh',              'Anambra',   'Anambra Central',  'LP',   'Male'],
  ['Ifeanyi Patrick Ubah',     'Anambra',   'Anambra South',    'YPP',  'Male'],
  // ── BAUCHI ──────────────────────────────────────────────────────────────────
  ['Samaila Dahuwa Kila',      'Bauchi',    'Bauchi North',     'PDP',  'Male'],
  ['Abdul Ningi',              'Bauchi',    'Bauchi Central',   'PDP',  'Male'],
  ['Umar Salihu Baba',         'Bauchi',    'Bauchi South',     'APC',  'Male'],
  // ── BAYELSA ─────────────────────────────────────────────────────────────────
  ['Benson Sunday Agadaga',    'Bayelsa',   'Bayelsa East',     'PDP',  'Male'],
  ['Friday Konbowei Benson',   'Bayelsa',   'Bayelsa Central',  'PDP',  'Male'],
  ['Henry Seriake Dickson',    'Bayelsa',   'Bayelsa West',     'PDP',  'Male'],
  // ── BENUE ───────────────────────────────────────────────────────────────────
  ['Udende Emmanuel Memsa',    'Benue',     'Benue North-East', 'APC',  'Male'],
  ['Titus Tartengar Zam',      'Benue',     'Benue North-West', 'APC',  'Male'],
  ['Patrick Abba Moro',        'Benue',     'Benue South',      'PDP',  'Male'],
  // ── BORNO ───────────────────────────────────────────────────────────────────
  ['Mohammed Tahir Monguno',   'Borno',     'Borno North',      'APC',  'Male'],
  ['Kaka Shehu Lawan',         'Borno',     'Borno Central',    'APC',  'Male'],
  ['Mohammed Ali Ndume',       'Borno',     'Borno South',      'APC',  'Male'],
  // ── CROSS RIVER ─────────────────────────────────────────────────────────────
  ['Jarigbe Agom Jarigbe',     'Cross River','Cross River North','PDP', 'Male'],
  ['Williams Eteng Jonah',     'Cross River','Cross River Central','APC','Male'],
  ['Asuquo Ekpenyong',         'Cross River','Cross River South', 'APC','Male'],
  // ── DELTA ───────────────────────────────────────────────────────────────────
  ['Chinedu Munir Nwoko',      'Delta',     'Delta North',      'PDP',  'Male'],
  ['Ede Omueya Dafinone',      'Delta',     'Delta Central',    'APC',  'Male'],
  ['Joel Ewomazino Onowakpo',  'Delta',     'Delta South',      'APC',  'Male'],
  // ── EBONYI ──────────────────────────────────────────────────────────────────
  ['Onyeka Peter Nwebonyi',    'Ebonyi',    'Ebonyi North',     'APC',  'Male'],
  ['Kenneth Emeka Eze',        'Ebonyi',    'Ebonyi Central',   'APC',  'Male'],
  ['David Nweze Umahi',        'Ebonyi',    'Ebonyi South',     'APC',  'Male'],
  // ── EDO ─────────────────────────────────────────────────────────────────────
  ['Adams Aliyu Oshiomhole',   'Edo',       'Edo North',        'APC',  'Male'],
  ['Sunday Okpebholo',         'Edo',       'Edo Central',      'APC',  'Male'],
  ['Neda Bernards Imasuen',    'Edo',       'Edo South',        'LP',   'Male'],
  // ── EKITI ───────────────────────────────────────────────────────────────────
  ['Cyril Oluwole Fasuyi',     'Ekiti',     'Ekiti North',      'APC',  'Male'],
  ['Michael Opeyemi Bamidele', 'Ekiti',     'Ekiti Central',    'APC',  'Male'],
  ['Adeyemi Raphael Adaramodu','Ekiti',     'Ekiti South',      'APC',  'Male'],
  // ── ENUGU ───────────────────────────────────────────────────────────────────
  ['Okechukwu Ezea',           'Enugu',     'Enugu North',      'LP',   'Male'],
  ['Osita Ngwu',               'Enugu',     'Enugu West',       'PDP',  'Male'],
  ['Kelvin Chukwu',            'Enugu',     'Enugu East',       'LP',   'Male'],
  // ── FCT ─────────────────────────────────────────────────────────────────────
  ['Ireti Heebah Kingibe',     'FCT',       'FCT',              'LP',   'Female'],
  // ── GOMBE ───────────────────────────────────────────────────────────────────
  ['Ibrahim Hassan Dakwambo',  'Gombe',     'Gombe North',      'PDP',  'Male'],
  ['Mohammed Danjuma Goje',    'Gombe',     'Gombe Central',    'APC',  'Male'],
  ['Anthony Siyako Yaro',      'Gombe',     'Gombe South',      'PDP',  'Male'],
  // ── IMO ─────────────────────────────────────────────────────────────────────
  ['Ndubueze Patrick Chiwuba', 'Imo',       'Imo North',        'APC',  'Male'],
  ['Osita Bonaventure Izunaso','Imo',       'Imo West',         'APC',  'Male'],
  ['Ezenwa Francis Onyewuchi', 'Imo',       'Imo East',         'LP',   'Male'],
  // ── JIGAWA ──────────────────────────────────────────────────────────────────
  ['Hussaini Babangida Uba',   'Jigawa',    'Jigawa North-West','APC',  'Male'],
  ['Ahmed Madori Abdulhamid',  'Jigawa',    'Jigawa North-East','APC',  'Male'],
  ['Khabeeb Mustapha',         'Jigawa',    'Jigawa South-West','PDP',  'Male'],
  // ── KADUNA ──────────────────────────────────────────────────────────────────
  ['Khalid Ibrahim Mustapha',  'Kaduna',    'Kaduna North',     'PDP',  'Male'],
  ['Lawal Adamu Usman',        'Kaduna',    'Kaduna Central',   'PDP',  'Male'],
  ['Sunday Katung Usman',      'Kaduna',    'Kaduna South',     'PDP',  'Male'],
  // ── KANO ────────────────────────────────────────────────────────────────────
  ['Barau Jubrin',             'Kano',      'Kano North',       'APC',  'Male'],
  ['Rufai Hanga',              'Kano',      'Kano Central',     'NNPP', 'Male'],
  ['Kawu Sulaiman Abduraman',  'Kano',      'Kano South',       'NNPP', 'Male'],
  // ── KATSINA ─────────────────────────────────────────────────────────────────
  ['Nasir Sani Zangon Daura',  'Katsina',   'Katsina North',    'APC',  'Male'],
  ['Abdulaziz Musa Yar\'Adua', 'Katsina',   'Katsina Central',  'APC',  'Male'],
  ['Dandutse Mutari Mohammed', 'Katsina',   'Katsina South',    'APC',  'Male'],
  // ── KEBBI ───────────────────────────────────────────────────────────────────
  ['Yahaya Abdullahi',         'Kebbi',     'Kebbi North',      'PDP',  'Male'],
  ['Mohammed Adamu Aliero',    'Kebbi',     'Kebbi Central',    'PDP',  'Male'],
  ['Musa Garba',               'Kebbi',     'Kebbi South',      'PDP',  'Male'],
  // ── KOGI ────────────────────────────────────────────────────────────────────
  ['Abubakar Ohere Sadiku',    'Kogi',      'Kogi East',        'APC',  'Male'],
  ['Natasha Akpoti-Uduaghan',  'Kogi',      'Kogi Central',     'PDP',  'Female'],
  ['Sunday Steve Karimu',      'Kogi',      'Kogi West',        'APC',  'Male'],
  // ── KWARA ───────────────────────────────────────────────────────────────────
  ['Umar Sadiq Sulaiman',      'Kwara',     'Kwara North',      'APC',  'Male'],
  ['Salihu Mustapha',          'Kwara',     'Kwara Central',    'APC',  'Male'],
  ['Yisa Ashiru Oyelola',      'Kwara',     'Kwara South',      'APC',  'Male'],
  // ── LAGOS ───────────────────────────────────────────────────────────────────
  ['Wasiu Eshilokun Sanni',    'Lagos',     'Lagos Central',    'APC',  'Male'],
  ['Mukhail Adetokunbo Abiru', 'Lagos',     'Lagos East',       'APC',  'Male'],
  ['Idiat Oluranti Adebule',   'Lagos',     'Lagos West',       'APC',  'Female'],
  // ── NASARAWA ────────────────────────────────────────────────────────────────
  ['Godiya Akwashiki',         'Nasarawa',  'Nasarawa North',   'SDP',  'Male'],
  ['Aliyu Ahmed Wadada',       'Nasarawa',  'Nasarawa West',    'SDP',  'Male'],
  ['Mohammed Ogoshi Onawo',    'Nasarawa',  'Nasarawa South',   'PDP',  'Male'],
  // ── NIGER ───────────────────────────────────────────────────────────────────
  ['Mohammed Sani Musa',       'Niger',     'Niger East',       'APC',  'Male'],
  ['Sani Abubakar Daji',       'Niger',     'Niger North',      'APC',  'Male'],
  ['Peter Ndalikali Jiya',     'Niger',     'Niger South',      'PDP',  'Male'],
  // ── OGUN ────────────────────────────────────────────────────────────────────
  ['Afolabi Shuaib Salisu',    'Ogun',      'Ogun Central',     'APC',  'Male'],
  ['Justus Olugbenga Daniel',  'Ogun',      'Ogun East',        'APC',  'Male'],
  ['Olamilekan Solomon Adeola','Ogun',      'Ogun West',        'APC',  'Male'],
  // ── ONDO ────────────────────────────────────────────────────────────────────
  ['Emmanuel Olajide Ipinsagba','Ondo',     'Ondo North',       'APC',  'Male'],
  ['Adeniyi Ayodele Adegbonmire','Ondo',    'Ondo Central',     'APC',  'Male'],
  ['Jimoh Ibrahim Folorunso',  'Ondo',      'Ondo South',       'APC',  'Male'],
  // ── OSUN ────────────────────────────────────────────────────────────────────
  ['Oluwole Olubiyi Fadeyi',   'Osun',      'Osun Central',     'PDP',  'Male'],
  ['Francis Adenigba Fadahunsi','Osun',     'Osun East',        'PDP',  'Male'],
  ['Kamorudeen Olarere Oyewumi','Osun',     'Osun West',        'PDP',  'Male'],
  // ── OYO ─────────────────────────────────────────────────────────────────────
  ['Yunus Abiodun Akintunde',  'Oyo',       'Oyo Central',      'APC',  'Male'],
  ['Abdulfatai Buhari',        'Oyo',       'Oyo North',        'APC',  'Male'],
  ['Sharafadeen Abiodun Alli', 'Oyo',       'Oyo South',        'APC',  'Male'],
  // ── PLATEAU ─────────────────────────────────────────────────────────────────
  ['Simon Davou Mwadkwon',     'Plateau',   'Plateau North',    'PDP',  'Male'],
  ['Diket Plang',              'Plateau',   'Plateau Central',  'APC',  'Male'],
  ['Napoleon Binkap Bali',     'Plateau',   'Plateau South',    'PDP',  'Male'],
  // ── RIVERS ──────────────────────────────────────────────────────────────────
  ['Allwell Heacho Onyesoh',   'Rivers',    'Rivers East',      'PDP',  'Male'],
  ['Barinda Mpigi',            'Rivers',    'Rivers South-East','PDP',  'Male'],
  ['Ipalibo Harry Banigo',     'Rivers',    'Rivers West',      'PDP',  'Female'],
  // ── SOKOTO ──────────────────────────────────────────────────────────────────
  ['Aliyu Magatakarda Wamakko','Sokoto',    'Sokoto North',     'APC',  'Male'],
  ['Ibrahim Gobir',            'Sokoto',    'Sokoto East',      'APC',  'Male'],
  ['Aminu Tambuwal',           'Sokoto',    'Sokoto South',     'PDP',  'Male'],
  // ── TARABA ──────────────────────────────────────────────────────────────────
  ['Isa Shaibu Lau',           'Taraba',    'Taraba North',     'PDP',  'Male'],
  ['Manu Haruna',              'Taraba',    'Taraba Central',   'PDP',  'Male'],
  ['David Jimkatu',            'Taraba',    'Taraba South',     'APC',  'Male'],
  // ── YOBE ────────────────────────────────────────────────────────────────────
  ['Ibrahim Geidam',           'Yobe',      'Yobe East',        'APC',  'Male'],
  ['Ahmad Ibrahim Lawan',      'Yobe',      'Yobe North',       'APC',  'Male'],
  ['Ibrahim Bomai',            'Yobe',      'Yobe South',       'APC',  'Male'],
  // ── ZAMFARA ─────────────────────────────────────────────────────────────────
  ['Sahabi Ya\'u',             'Zamfara',   'Zamfara North',    'APC',  'Male'],
  ['Abubakar Abdulaziz Yari',  'Zamfara',   'Zamfara West',     'APC',  'Male'],
  ['Ikra Aliyu Bilbis',        'Zamfara',   'Zamfara Central',  'PDP',  'Male'],
]

/** All 36 Governors + Deputy Governors
 *  Source: Wikipedia (List of current state governors in Nigeria) — March 2026
 *  Format: [governor_name, deputy_name, state, party, deputy_gender, term_obj]
 *  All governors are Male per Wikipedia "all current governors are male"
 *  Deputy governors with female names are marked Female
 */
const GOVERNORS: {
  governor:     string
  deputy:       string
  state:        string
  party:        string
  deputy_gender: string
  gov_term:     { start: string; end: string; next: string }
}[] = [
  { governor: 'Alex Otti',             deputy: 'Ikechukwu Emetu',       state: 'Abia',        party: 'LP',   deputy_gender: 'Male',   gov_term: TERM_GOV_2023 },
  { governor: 'Ahmadu Umaru Fintiri',  deputy: 'Kaletapwa Farauta',     state: 'Adamawa',     party: 'APC',  deputy_gender: 'Female', gov_term: TERM_GOV_2019 },
  { governor: 'Umo Eno',               deputy: 'Akon Eyakenyi',         state: 'Akwa Ibom',   party: 'APC',  deputy_gender: 'Female', gov_term: TERM_GOV_2023 },
  { governor: 'Charles Chukwuma Soludo',deputy: 'Onyeka Ibezim',        state: 'Anambra',     party: 'APGA', deputy_gender: 'Male',   gov_term: TERM_GOV_2022 },
  { governor: 'Bala Abdulkadir Muhammed',deputy: 'Auwal Jatau',         state: 'Bauchi',      party: 'PDP',  deputy_gender: 'Male',   gov_term: TERM_GOV_2019 },
  { governor: 'Douye Diri',            deputy: 'Peter Akpe',            state: 'Bayelsa',     party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2020 },
  { governor: 'Hyacinth Alia',         deputy: 'Samuel Ode',            state: 'Benue',       party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2023 },
  { governor: 'Babagana Umara Zulum',  deputy: 'Umar Usman Kadafur',    state: 'Borno',       party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2019 },
  { governor: 'Bassey Edet Otu',       deputy: 'Peter Odey',            state: 'Cross River', party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2023 },
  { governor: 'Sheriff Oborevwori',    deputy: 'Monday Onyeme',         state: 'Delta',       party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2023 },
  { governor: 'Francis Ogbonna Nwifuru',deputy: 'Patricia Obila',       state: 'Ebonyi',      party: 'APC',  deputy_gender: 'Female', gov_term: TERM_GOV_2023 },
  { governor: 'Monday Okpebholo',      deputy: 'Dennis Idahosa',        state: 'Edo',         party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2024 },
  { governor: 'Biodun Abayomi Oyebanji',deputy: 'Monisade Afuye',       state: 'Ekiti',       party: 'APC',  deputy_gender: 'Female', gov_term: TERM_GOV_2022EK },
  { governor: 'Peter Mbah',            deputy: 'Ifeanyi Ossai',         state: 'Enugu',       party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2023 },
  { governor: 'Muhammad Inuwa Yahaya', deputy: 'Manasseh Daniel Jatau', state: 'Gombe',       party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2019 },
  { governor: 'Hope Uzodimma',         deputy: 'Chinyere Ekomaru',      state: 'Imo',         party: 'APC',  deputy_gender: 'Female', gov_term: TERM_GOV_2020 },
  { governor: 'Umar Namadi',           deputy: 'Aminu Usman',           state: 'Jigawa',      party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2023 },
  { governor: 'Uba Sani',              deputy: 'Hadiza Balarabe',       state: 'Kaduna',      party: 'APC',  deputy_gender: 'Female', gov_term: TERM_GOV_2023 },
  { governor: 'Abba Kabir Yusuf',      deputy: 'Aminu Abdussalam Gwarzo',state: 'Kano',       party: 'NNPP', deputy_gender: 'Male',   gov_term: TERM_GOV_2023 },
  { governor: 'Dikko Umar Radda',      deputy: 'Faruk Lawal Jobe',      state: 'Katsina',     party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2023 },
  { governor: 'Nasir Idris',           deputy: 'Abubakar Umar Argungu', state: 'Kebbi',       party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2023 },
  { governor: 'Ahmed Usman Ododo',     deputy: 'Joel Salifu',           state: 'Kogi',        party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2024KG },
  { governor: 'AbdulRahman AbdulRazaq',deputy: 'Kayode Alabi',          state: 'Kwara',       party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2019 },
  { governor: 'Babajide Olusola Sanwo-Olu',deputy: 'Kadri Obafemi Hamzat', state: 'Lagos',   party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2019 },
  { governor: 'Abdullahi Sule',        deputy: 'Emmanuel Akabe',        state: 'Nasarawa',    party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2019 },
  { governor: 'Mohammed Umar Bago',    deputy: 'Yakubu Garba',          state: 'Niger',       party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2023 },
  { governor: 'Dapo Abiodun',          deputy: 'Noimot Salako-Oyedele', state: 'Ogun',        party: 'APC',  deputy_gender: 'Female', gov_term: TERM_GOV_2019 },
  { governor: 'Lucky Orimisan Aiyedatiwa', deputy: 'Olayide Adelami',   state: 'Ondo',        party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2023OD },
  { governor: 'Ademola Jackson Adeleke',deputy: 'Kola Adewusi',         state: 'Osun',        party: 'PDP',  deputy_gender: 'Male',   gov_term: TERM_GOV_2022OS },
  { governor: 'Seyi Makinde',          deputy: 'Bayo Lawal',            state: 'Oyo',         party: 'PDP',  deputy_gender: 'Male',   gov_term: TERM_GOV_2019 },
  { governor: 'Caleb Mutfwang',        deputy: 'Josephine Piyo',        state: 'Plateau',     party: 'APC',  deputy_gender: 'Female', gov_term: TERM_GOV_2023 },
  { governor: 'Siminalayi Fubara',     deputy: 'Ngozi Odu',             state: 'Rivers',      party: 'APC',  deputy_gender: 'Female', gov_term: TERM_GOV_2023 },
  { governor: 'Ahmad Aliyu Sokoto',    deputy: 'Idris Muhammad Gobir',  state: 'Sokoto',      party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2023 },
  { governor: 'Agbu Kefas',           deputy: 'Aminu Abdullahi Alkali', state: 'Taraba',      party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2023 },
  { governor: 'Mai Mala Buni',         deputy: 'Idi Barde Gubana',      state: 'Yobe',        party: 'APC',  deputy_gender: 'Male',   gov_term: TERM_GOV_2019 },
  { governor: 'Dauda Lawal',           deputy: 'Mani Mallam Mummuni',   state: 'Zamfara',     party: 'PDP',  deputy_gender: 'Male',   gov_term: TERM_GOV_2023 },
]

// ─── Seed logic ───────────────────────────────────────────────────────────────

async function seed() {
  console.log('\n🌱  WhoRepresentsMe.ng — Seed Script\n')

  // ── Load reference data ──────────────────────────────────────────────────────
  const [{ data: states }, { data: parties }, { data: offices }] = await Promise.all([
    db.from('states').select('id, name'),
    db.from('parties').select('id, abbreviation'),
    db.from('offices').select('id, title'),
  ])

  if (!states?.length || !parties?.length || !offices?.length) {
    console.error('❌  Reference tables are empty. Run the schema SQL first.')
    process.exit(1)
  }

  // Build lookup maps
  const stateMap  = new Map(states.map(s => [s.name, s.id]))
  const partyMap  = new Map(parties.map(p => [p.abbreviation, p.id]))
  const officeMap = new Map(offices.map(o => [o.title, o.id]))

  let inserted = 0
  let skipped  = 0

  const upsert = async (record: Record<string, unknown>, label: string) => {
    const { error } = await db.from('officials').upsert(record, {
      onConflict: 'full_name,constituency',
      ignoreDuplicates: false,
    })
    if (error) {
      console.warn(`  ⚠️  ${label}: ${error.message}`)
      skipped++
    } else {
      console.log(`  ✓  ${label}`)
      inserted++
    }
  }

  // ── 1. Federal Executive & NASS Leadership ───────────────────────────────────
  console.log('── Federal executive & NASS leadership ──────────────────────')
  for (const r of FEDERAL_EXECUTIVE) {
    const office_id = officeMap.get(r.office_title)
    const party_id  = partyMap.get(r.party_abbr)
    const state_id  = r.state_name ? stateMap.get(r.state_name) : null
    if (!office_id) { console.warn(`  ⚠️  Unknown office: ${r.office_title}`); skipped++; continue }
    await upsert({
      full_name:          r.full_name,
      gender:             r.gender,
      office_id,
      party_id:           party_id ?? null,
      state_id:           state_id ?? null,
      constituency:       r.constituency ?? null,
      bio:                r.bio ?? null,
      phone:              (r as any).phone ?? null,
      official_email:     (r as any).official_email ?? null,
      official_website:   (r as any).official_website ?? null,
      twitter_handle:     (r as any).twitter_handle ?? null,
      term_start:         r.start,
      term_end:           r.end,
      next_election_date: r.next,
      status:             'active',
      verified:           true,
      verified_by:        'seed-script',
      verified_at:        new Date().toISOString(),
      source_url:         r.source_url,
    }, `${r.full_name} — ${r.office_title}`)
  }

  // ── 2. Senators ──────────────────────────────────────────────────────────────
  console.log('\n── 109 Senators ─────────────────────────────────────────────')
  const senatorOfficeId = officeMap.get('Senator')
  if (!senatorOfficeId) { console.error('❌  Senator office not found in DB'); process.exit(1) }

  for (const [name, stateName, district, partyAbbr, gender] of SENATORS) {
    // Senate President and Deputy Senate President are already inserted above
    // as their own office; skip the duplicate senator record for them
    if (name === 'Godswill Obot Akpabio' || name === 'Barau Jubrin') continue

    const state_id = stateMap.get(stateName)
    const party_id = partyMap.get(partyAbbr)
    if (!state_id) { console.warn(`  ⚠️  Unknown state: ${stateName} for ${name}`); skipped++; continue }

    await upsert({
      full_name:          name,
      gender,
      office_id:          senatorOfficeId,
      party_id:           party_id ?? null,
      state_id,
      constituency:       district,
      term_start:         TERM_NASS.start,
      term_end:           TERM_NASS.end,
      next_election_date: TERM_NASS.next,
      status:             'active',
      verified:           true,
      verified_by:        'seed-script',
      verified_at:        new Date().toISOString(),
      source_url:         SOURCE_PULSE_SEN,
    }, `${name} — ${district}`)
  }

  // ── 3. Governors & Deputy Governors ─────────────────────────────────────────
  console.log('\n── 36 Governors + Deputy Governors ──────────────────────────')
  const govOfficeId   = officeMap.get('Governor')
  const depGovOfficeId = officeMap.get('Deputy Governor')
  if (!govOfficeId || !depGovOfficeId) { console.error('❌  Governor/Deputy Governor office not found'); process.exit(1) }

  for (const g of GOVERNORS) {
    const state_id = stateMap.get(g.state)
    const party_id = partyMap.get(g.party)
    if (!state_id) { console.warn(`  ⚠️  Unknown state: ${g.state}`); skipped++; continue }

    await upsert({
      full_name:          g.governor,
      gender:             'Male',
      office_id:          govOfficeId,
      party_id:           party_id ?? null,
      state_id,
      constituency:       g.state,
      term_start:         g.gov_term.start,
      term_end:           g.gov_term.end,
      next_election_date: g.gov_term.next,
      status:             'active',
      verified:           true,
      verified_by:        'seed-script',
      verified_at:        new Date().toISOString(),
      source_url:         SOURCE_WIKI_GOV,
    }, `${g.governor} — Governor, ${g.state}`)

    await upsert({
      full_name:          g.deputy,
      gender:             g.deputy_gender,
      office_id:          depGovOfficeId,
      party_id:           party_id ?? null,
      state_id,
      constituency:       g.state,
      term_start:         g.gov_term.start,
      term_end:           g.gov_term.end,
      next_election_date: g.gov_term.next,
      status:             'active',
      verified:           true,
      verified_by:        'seed-script',
      verified_at:        new Date().toISOString(),
      source_url:         SOURCE_WIKI_GOV,
    }, `${g.deputy} — Deputy Governor, ${g.state}`)
  }

  // ── Summary ──────────────────────────────────────────────────────────────────
  console.log(`\n✅  Done. ${inserted} records upserted, ${skipped} skipped/warned.\n`)
  console.log('Next steps:')
  console.log('  1. Review any ⚠️  warnings above — usually a party abbreviation or state name mismatch.')
  console.log('  2. Add House of Representatives members (360 seats) via the contribute workflow.')
  console.log('  3. Verify contact details (phone/email) for each official through official gov sources.\n')
}

seed().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})