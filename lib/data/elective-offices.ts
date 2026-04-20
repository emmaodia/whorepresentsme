export interface ElectiveOffice {
  slug: string
  title: string
  shortTitle: string
  level: 'Federal' | 'State' | 'Local'
  category: string
  termYears: number
  termNote?: string
  seats: number
  seatsNote?: string
  constitutionalBasis: string
  qualifications: string[]
  responsibilities: string[]
  powers: string[]
  oversight: string[]
  salary: string
  salaryNote?: string
  relatedOffices: string[]
  electionBody: string
  electionType: string
  summary: string
}

export const ELECTIVE_OFFICES: ElectiveOffice[] = [
  {
    slug: 'president',
    title: 'President of the Federal Republic of Nigeria',
    shortTitle: 'President',
    level: 'Federal',
    category: 'Executive',
    termYears: 4,
    termNote: 'Maximum two terms (8 years total)',
    seats: 1,
    constitutionalBasis: 'Constitution of the Federal Republic of Nigeria 1999 (as amended), Sections 130–152',
    qualifications: [
      'Nigerian citizen by birth',
      'At least 40 years of age',
      'Member of a registered political party',
      'Minimum School Certificate or equivalent',
      'Sponsored by a political party',
      'Not convicted of an offence involving dishonesty or fraud within the preceding 10 years',
      'No criminal sentence exceeding 12 months without option of fine',
      'Not declared of unsound mind by a competent court',
    ],
    responsibilities: [
      'Head of State, Head of Government, and Commander-in-Chief of the Armed Forces',
      'Formulate and execute national policy',
      'Present the annual budget (Appropriation Bill) to the National Assembly',
      'Assent to or veto bills passed by the National Assembly',
      'Appoint and coordinate Federal Ministers',
      'Represent Nigeria in international relations',
      'Declare states of emergency with National Assembly approval',
      'Grant pardons and respites on advice of the Council of State',
    ],
    powers: [
      'Executive authority of the Federation',
      'Control of the Federal Executive Council (Cabinet)',
      'Power to deploy the Armed Forces (with legislative oversight)',
      'Power to enter treaties (ratified by the Senate)',
      'Emergency powers under Section 305',
      'Power of pardon and clemency',
      'Power to appoint heads of Federal agencies, commissions, and courts (subject to Senate confirmation)',
    ],
    oversight: [
      'National Assembly — can override veto (2/3 majority), impeach on gross misconduct',
      'Supreme Court — judicial review of executive actions',
      'Federal Executive Council — collective Cabinet responsibility',
      'Council of State — advisory body',
      'Independent National Electoral Commission (INEC) — administers election',
    ],
    salary: '₦14,058,820 per annum (basic)',
    salaryNote: 'Plus allowances set by the Revenue Mobilisation Allocation and Fiscal Commission (RMAFC)',
    relatedOffices: ['vice-president', 'senator', 'house-of-reps-member', 'governor'],
    electionBody: 'Independent National Electoral Commission (INEC)',
    electionType: 'Presidential election — winner must have plurality plus at least 25% of votes cast in at least 24 states and FCT',
    summary: 'The President is the most powerful elected official in Nigeria, holding executive authority over the entire federation. The President leads the Federal Executive Council, commands the military, and represents Nigeria internationally.',
  },
  {
    slug: 'vice-president',
    title: 'Vice President of the Federal Republic of Nigeria',
    shortTitle: 'Vice President',
    level: 'Federal',
    category: 'Executive',
    termYears: 4,
    termNote: 'Maximum two terms (runs on same ticket as President)',
    seats: 1,
    constitutionalBasis: 'Constitution of the Federal Republic of Nigeria 1999 (as amended), Sections 130–152',
    qualifications: [
      'Same qualifications as the President',
      'Must be from a different state than the President (constitutional convention)',
      'Elected on a joint ticket with the presidential candidate',
    ],
    responsibilities: [
      'Assist the President in the discharge of executive functions',
      'Chair the Economic and Business Environment Council',
      'Perform functions assigned by the President',
      'Act as President in the absence, incapacitation, or death of the President',
      'Member of the Federal Executive Council',
    ],
    powers: [
      'All presidential powers when acting as President',
      'Powers specifically delegated by the President',
      'Attends Cabinet meetings and participates in executive decisions',
    ],
    oversight: [
      'Senate — can be impeached on gross misconduct',
      'Supreme Court — judicial review',
    ],
    salary: '₦12,653,160 per annum (basic)',
    salaryNote: 'Plus allowances set by RMAFC',
    relatedOffices: ['president', 'senator'],
    electionBody: 'Independent National Electoral Commission (INEC)',
    electionType: 'Joint presidential ticket — elected alongside the President',
    summary: 'The Vice President is elected on the same ticket as the President and serves as a key member of the Federal Executive Council. The VP automatically becomes President if the President dies, resigns, or is impeached.',
  },
  {
    slug: 'senator',
    title: 'Senator',
    shortTitle: 'Senator',
    level: 'Federal',
    category: 'Legislative',
    termYears: 4,
    seats: 109,
    seatsNote: '3 per state (108) + 1 for FCT Abuja = 109 total',
    constitutionalBasis: 'Constitution of the Federal Republic of Nigeria 1999 (as amended), Sections 48–89',
    qualifications: [
      'Nigerian citizen',
      'At least 35 years of age',
      'Member of a registered political party',
      'Minimum School Certificate or equivalent',
      'Resident in the senatorial district or owned property there for at least one year before the election',
      'Not under sentence of death or imprisonment exceeding 12 months',
      'Not declared of unsound mind',
    ],
    responsibilities: [
      'Make laws for the peace, order, and good government of the Federation',
      'Scrutinise and pass the annual budget',
      'Confirm presidential appointments (ministers, ambassadors, INEC chair, etc.)',
      'Ratify international treaties',
      'Investigate the executive through committees',
      'Represent senatorial district constituents',
      'Override presidential veto with 2/3 majority',
    ],
    powers: [
      'Exclusive legislative authority on items in the Exclusive Legislative List',
      'Concurrent legislative authority on the Concurrent List',
      'Power to impeach the President or Vice President',
      'Power to approve or reject executive nominees',
      'Power to amend the constitution (2/3 supermajority required)',
    ],
    oversight: [
      'Electorate — elections every four years',
      'Senate President and Senate Standing Rules',
      'Court of Appeal — election petition tribunal',
      'Code of Conduct Bureau — asset declaration',
    ],
    salary: '₦2,484,091 per annum (basic)',
    salaryNote: 'Actual total remuneration including allowances is significantly higher; RMAFC sets the consolidated package',
    relatedOffices: ['president', 'house-of-reps-member', 'governor'],
    electionBody: 'Independent National Electoral Commission (INEC)',
    electionType: 'Senatorial district election — plurality winner (first past the post)',
    summary: 'Nigeria has 109 senators — three from each of the 36 states and one from the FCT. The Senate forms the upper chamber of the bicameral National Assembly and has special powers including confirming presidential appointments and ratifying treaties.',
  },
  {
    slug: 'house-of-reps-member',
    title: 'Member of the House of Representatives',
    shortTitle: 'HOR Member',
    level: 'Federal',
    category: 'Legislative',
    termYears: 4,
    seats: 360,
    seatsNote: '360 federal constituencies, roughly proportional to population',
    constitutionalBasis: 'Constitution of the Federal Republic of Nigeria 1999 (as amended), Sections 48–89',
    qualifications: [
      'Nigerian citizen',
      'At least 30 years of age',
      'Member of a registered political party',
      'Minimum School Certificate or equivalent',
      'Resident in the federal constituency or owned property there for at least one year before the election',
      'Not under sentence of death or imprisonment exceeding 12 months',
    ],
    responsibilities: [
      'Initiate or co-sponsor bills',
      'Pass appropriation (budget) bills',
      'Oversee Federal Ministries, Departments, and Agencies (MDAs)',
      'Represent constituency interests in national legislation',
      'Participate in conference committees reconciling Senate and HOR bills',
      'Receive and act on constituent petitions',
    ],
    powers: [
      'Concurrent legislative authority with the Senate on most matters',
      'Exclusive power to initiate money bills (Appropriation Bills)',
      'Power to impeach the President or Vice President (proceedings start in HOR)',
      'Committee oversight authority over MDAs',
    ],
    oversight: [
      'Electorate — elections every four years',
      'Speaker of the House and Standing Orders',
      'National/State Electoral Tribunal — election petitions',
      'Code of Conduct Bureau',
    ],
    salary: '₦2,026,400 per annum (basic)',
    salaryNote: 'Total consolidated package including allowances is set by RMAFC',
    relatedOffices: ['senator', 'governor', 'state-assembly-member'],
    electionBody: 'Independent National Electoral Commission (INEC)',
    electionType: 'Federal constituency election — plurality winner (first past the post)',
    summary: 'The House of Representatives has 360 members, one per federal constituency. As the lower chamber of the National Assembly, the HOR has exclusive power to introduce budget bills and is where impeachment proceedings against the President begin.',
  },
  {
    slug: 'governor',
    title: 'State Governor',
    shortTitle: 'Governor',
    level: 'State',
    category: 'Executive',
    termYears: 4,
    termNote: 'Maximum two terms (8 years total)',
    seats: 36,
    seatsNote: 'One per state',
    constitutionalBasis: 'Constitution of the Federal Republic of Nigeria 1999 (as amended), Sections 176–198',
    qualifications: [
      'Nigerian citizen',
      'At least 35 years of age',
      'Member of a registered political party',
      'Minimum School Certificate or equivalent',
      'Indigene or resident of the state for at least three years before the election',
      'Not under sentence of death or imprisonment exceeding 12 months',
    ],
    responsibilities: [
      'Head of the State Executive and Chief Executive of the state',
      'Formulate and implement state policy',
      'Present the state annual budget to the State House of Assembly',
      'Appoint State Commissioners (with assembly approval)',
      "Command the state's security apparatus (working with federal agencies)",
      'Represent the state in dealings with the Federal Government',
      'Assent to or veto bills passed by the State House of Assembly',
    ],
    powers: [
      'State executive authority under Section 5(2)',
      'Power to deploy the State Security Council',
      'Emergency powers within the state',
      'Power of pardon for state-level offences',
      'Power to convene or prorogue the State House of Assembly',
    ],
    oversight: [
      'State House of Assembly — can impeach on gross misconduct',
      'Federal Government — federation oversight on matters of national interest',
      'INEC — electoral administration',
      'EFCC/ICPC — anti-corruption oversight',
    ],
    salary: '₦7,296,180 per annum (basic)',
    salaryNote: 'Plus allowances; actual package varies slightly by state',
    relatedOffices: ['deputy-governor', 'senator', 'state-assembly-member'],
    electionBody: 'Independent National Electoral Commission (INEC)',
    electionType: 'State-wide gubernatorial election — winner must have plurality plus at least 25% of votes in at least 2/3 of LGAs in the state',
    summary: 'There are 36 state governors in Nigeria, one per state. The Governor is the highest executive authority at the state level, commanding a state budget often exceeding billions of naira and overseeing all state MDAs.',
  },
  {
    slug: 'deputy-governor',
    title: 'Deputy Governor',
    shortTitle: 'Deputy Governor',
    level: 'State',
    category: 'Executive',
    termYears: 4,
    termNote: 'Maximum two terms; runs on joint ticket with Governor',
    seats: 36,
    seatsNote: 'One per state',
    constitutionalBasis: 'Constitution of the Federal Republic of Nigeria 1999 (as amended), Sections 186–192',
    qualifications: [
      'Same qualifications as the Governor',
      'Elected on a joint ticket with the gubernatorial candidate',
    ],
    responsibilities: [
      'Assist the Governor in state executive duties',
      'Act as Governor in the absence or incapacitation of the Governor',
      'Perform specific portfolios assigned by the Governor',
      'Member of the State Executive Council',
    ],
    powers: [
      'All gubernatorial powers when acting as Governor',
      'Powers specifically delegated by the Governor',
    ],
    oversight: [
      'State House of Assembly — can be impeached',
      "Governor — works under the Governor's direction",
    ],
    salary: '₦6,566,700 per annum (basic)',
    relatedOffices: ['governor', 'state-assembly-member'],
    electionBody: 'Independent National Electoral Commission (INEC)',
    electionType: 'Joint gubernatorial ticket',
    summary: 'The Deputy Governor is elected alongside the Governor and automatically becomes Governor if the Governor dies, resigns, or is removed from office.',
  },
  {
    slug: 'state-assembly-member',
    title: 'Member of the State House of Assembly',
    shortTitle: 'State Assembly Member',
    level: 'State',
    category: 'Legislative',
    termYears: 4,
    seats: 993,
    seatsNote: 'Minimum 24 per state; actual count varies (Lagos has 40, some states have up to 36)',
    constitutionalBasis: 'Constitution of the Federal Republic of Nigeria 1999 (as amended), Sections 90–120',
    qualifications: [
      'Nigerian citizen',
      'At least 25 years of age',
      'Member of a registered political party',
      'Minimum School Certificate or equivalent',
      'Resident in the constituency for at least one year, or owned property there',
      'Not under sentence of death or imprisonment exceeding 12 months',
    ],
    responsibilities: [
      "Make laws on matters within the state's legislative competence",
      'Pass the state annual budget',
      'Oversee state MDAs through standing committees',
      'Represent constituency interests at the state level',
      'Can impeach the Governor or Deputy Governor',
    ],
    powers: [
      'Legislative authority on items in the Residual and Concurrent Lists at the state level',
      'Power to impeach the Governor (by 2/3 majority)',
      'Power to approve or reject gubernatorial nominees (Commissioners)',
    ],
    oversight: [
      'Electorate — elections every four years',
      'Speaker of the State House of Assembly',
      'State Electoral Tribunal — election petitions',
    ],
    salary: 'Varies by state; typically ₦800,000–₦1,500,000 per annum (basic)',
    salaryNote: 'Allowances and total packages vary significantly between states',
    relatedOffices: ['governor', 'senator', 'lga-chairman'],
    electionBody: 'Independent National Electoral Commission (INEC)',
    electionType: 'State constituency election — plurality winner',
    summary: 'State Assembly members form the legislative branch at the state level. Their main powers include passing state budgets, making local laws, and providing oversight of the state executive.',
  },
  {
    slug: 'lga-chairman',
    title: 'Local Government Area Chairman',
    shortTitle: 'LGA Chairman',
    level: 'Local',
    category: 'Executive',
    termYears: 3,
    termNote: 'Term length varies by state law; commonly 3 years',
    seats: 774,
    seatsNote: '774 LGAs across 36 states and FCT',
    constitutionalBasis: 'Constitution of the Federal Republic of Nigeria 1999 (as amended), Section 7; State Local Government Laws',
    qualifications: [
      'Nigerian citizen',
      'At least 25 years of age',
      'Member of a registered political party',
      'Minimum School Certificate or equivalent',
      'Resident in the LGA for at least one year',
      'Not under sentence of death or imprisonment exceeding 12 months',
    ],
    responsibilities: [
      'Head of the Local Government Council',
      'Execute policies and programmes of the LGA',
      'Present the LGA annual budget to the Legislative Council',
      'Oversee primary healthcare, primary education, and sanitation in the LGA',
      'Maintain local roads and public spaces',
      'Collect rates and fines as authorised by state law',
      'Coordinate with state government on development projects',
    ],
    powers: [
      'Executive authority of the LGA',
      'Power to appoint LGA Supervisory Councillors',
      'Expenditure authority over the LGA budget',
      'Power to enforce LGA by-laws',
    ],
    oversight: [
      'State Government — LGAs are constitutionally under state oversight',
      'LGA Legislative Council (Councillors) — can impeach the Chairman',
      'State Independent Electoral Commission (SIEC) — administers LGA elections',
      'ALGON (Association of Local Governments of Nigeria)',
    ],
    salary: 'Varies significantly by state; typically ₦300,000–₦600,000 per annum',
    relatedOffices: ['councillor', 'governor', 'state-assembly-member'],
    electionBody: 'State Independent Electoral Commission (SIEC)',
    electionType: 'LGA-wide election — plurality winner',
    summary: "The LGA Chairman is the chief executive of one of Nigeria's 774 local government areas. LGAs are the closest tier of government to citizens and are constitutionally responsible for primary healthcare, primary education, and local infrastructure.",
  },
  {
    slug: 'councillor',
    title: 'Local Government Councillor',
    shortTitle: 'Councillor',
    level: 'Local',
    category: 'Legislative',
    termYears: 3,
    termNote: 'Term length varies by state law; commonly 3 years',
    seats: 8809,
    seatsNote: 'Approximately 8,809+ ward councillors across all LGAs',
    constitutionalBasis: 'Constitution of the Federal Republic of Nigeria 1999 (as amended), Section 7; State Local Government Laws',
    qualifications: [
      'Nigerian citizen',
      'At least 21 years of age',
      'Member of a registered political party',
      'Minimum School Certificate or equivalent',
      'Resident in the ward',
    ],
    responsibilities: [
      'Make by-laws for the ward and LGA',
      'Pass the LGA annual budget',
      'Represent ward interests to the LGA Chairman',
      'Oversee LGA services in the ward',
      'Receive petitions and complaints from ward residents',
    ],
    powers: [
      'Legislative authority within the LGA area',
      'Power to impeach the LGA Chairman (by required majority)',
      'Approval of LGA expenditure',
    ],
    oversight: [
      'Electorate — ward-level elections',
      'SIEC — State Independent Electoral Commission',
    ],
    salary: 'Varies widely; typically ₦100,000–₦300,000 per annum',
    relatedOffices: ['lga-chairman', 'state-assembly-member'],
    electionBody: 'State Independent Electoral Commission (SIEC)',
    electionType: 'Ward election — plurality winner',
    summary: "Councillors represent individual wards within each LGA and form the LGA's legislative council. They are the most locally accessible tier of elected government in Nigeria.",
  },
]

export function getOffice(slug: string): ElectiveOffice | undefined {
  return ELECTIVE_OFFICES.find(o => o.slug === slug)
}

export function getOfficesByLevel(level: ElectiveOffice['level']): ElectiveOffice[] {
  return ELECTIVE_OFFICES.filter(o => o.level === level)
}

export const LEVEL_LABELS: Record<ElectiveOffice['level'], string> = {
  Federal: 'Federal (National)',
  State: 'State',
  Local: 'Local Government',
}

// Maps DB office titles to office slugs for cross-linking
const TITLE_TO_SLUG: Record<string, string> = {
  'President': 'president',
  'Vice President': 'vice-president',
  'Senator': 'senator',
  'Senate President': 'senator',
  'Deputy Senate President': 'senator',
  'Member, House of Representatives': 'house-of-reps-member',
  'Speaker, House of Representatives': 'house-of-reps-member',
  'Deputy Speaker, House of Reps': 'house-of-reps-member',
  'Governor': 'governor',
  'Deputy Governor': 'deputy-governor',
  'State Legislator': 'state-assembly-member',
  'Speaker, State House of Assembly': 'state-assembly-member',
  'LGA Chairman': 'lga-chairman',
  'Councillor': 'councillor',
}

export function getSlugForOfficeTitle(title: string | undefined | null): string | null {
  if (!title) return null
  if (TITLE_TO_SLUG[title]) return TITLE_TO_SLUG[title]
  if (title.includes('House of Representatives') || title.includes('House of Rep')) return 'house-of-reps-member'
  if (title.includes('State House of Assembly') || title.includes('State Legislator')) return 'state-assembly-member'
  if (title.includes('Senator')) return 'senator'
  if (title.includes('Chairman')) return 'lga-chairman'
  if (title.includes('Councillor')) return 'councillor'
  return null
}
