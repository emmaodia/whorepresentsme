/**
 * Extended information for Nigeria's major registered political parties.
 * DB parties table holds abbreviation + color_hex; this file adds history,
 * ideology, and context for the party profile pages.
 *
 * Source: INEC party register, party constitutions, published manifestos.
 */

export interface PartyInfo {
  abbreviation: string
  fullName: string
  slug: string
  founded: number
  ideology: string[]
  summary: string
  history: string
  keyPolicies: string[]
  notableLeaders: string[]
  headquarters: string
  electoralHighlights: string[]
}

export const PARTY_INFO: Record<string, PartyInfo> = {

  APC: {
    abbreviation: 'APC',
    fullName: 'All Progressives Congress',
    slug: 'apc',
    founded: 2013,
    ideology: ['Progressivism', 'Liberal conservatism', 'Nigerian nationalism'],
    summary: 'The APC was formed in 2013 through a merger of four opposition parties and won the 2015 presidential election — the first time an incumbent Nigerian president was defeated at the polls. The party controls the presidency and a significant number of state governments.',
    history: 'The All Progressives Congress emerged from the merger of the Action Congress of Nigeria (ACN), the Congress for Progressive Change (CPC), the All Nigeria Peoples Party (ANPP), and a faction of the All Progressives Grand Alliance (APGA) in 2013. The merger was brokered with the goal of building a single strong opposition to the then-ruling PDP. Under Muhammadu Buhari, the APC won the 2015 presidential election — a historic peaceful transfer of power — and was re-elected in 2019. In 2023, Bola Ahmed Tinubu of the APC won the presidential election.',
    keyPolicies: [
      'Economic diversification away from oil dependency',
      'Security and counter-terrorism operations',
      'Infrastructure development (roads, rail, power)',
      'Agriculture and food security',
      'Student loans and education financing reform',
    ],
    notableLeaders: ['Bola Ahmed Tinubu (President, 2023–)', 'Muhammadu Buhari (President, 2015–2023)', 'Abdullahi Ganduje (National Chairman)'],
    headquarters: 'Abuja, FCT',
    electoralHighlights: [
      '2015 — Won presidency (Muhammadu Buhari) — first opposition defeat of an incumbent',
      '2019 — Re-elected presidency (Muhammadu Buhari)',
      '2023 — Won presidency (Bola Tinubu) with 36.6% of votes',
      'Controls majority in the National Assembly (2023–)',
    ],
  },

  PDP: {
    abbreviation: 'PDP',
    fullName: "Peoples Democratic Party",
    slug: 'pdp',
    founded: 1998,
    ideology: ['Social democracy', 'Big-tent politics', 'Nigerian federalism'],
    summary: "The PDP is Nigeria's oldest major party, founded in 1998 and governing Nigeria from 1999 to 2015 under three presidents. It remains the leading opposition party and controls several states.",
    history: "The Peoples Democratic Party was formed in 1998 and won every presidential election from 1999 to 2011 — making it the dominant party for Nigeria's first 16 years of uninterrupted democracy. Presidents Olusegun Obasanjo (1999–2007), Umaru Musa Yar'Adua (2007–2010), and Goodluck Jonathan (2010–2015) all served under the PDP banner. The party lost the 2015 presidential election to the APC — the first time an incumbent president was defeated — and has remained in opposition at the federal level since. The PDP candidate Atiku Abubakar came second in both 2019 and 2023 presidential elections.",
    keyPolicies: [
      'Federal character and power rotation between North and South',
      'Economic restructuring and fiscal federalism',
      'Security and rule of law',
      'Social investment and poverty reduction',
    ],
    notableLeaders: ['Iyorchia Ayu (National Chairman)', 'Atiku Abubakar (2023 presidential candidate)', 'Goodluck Jonathan (former President 2010–2015)'],
    headquarters: 'Abuja, FCT',
    electoralHighlights: [
      '1999 — Won presidency (Olusegun Obasanjo)',
      '2003, 2007, 2011 — Won consecutive presidential elections',
      '2015 — Lost presidency to APC for the first time',
      '2023 — Atiku Abubakar came third (21% of votes)',
      'Controls significant number of states including Cross River, Delta, Bauchi',
    ],
  },

  LP: {
    abbreviation: 'LP',
    fullName: 'Labour Party',
    slug: 'lp',
    founded: 2002,
    ideology: ['Social democracy', 'Labour rights', 'Youth-driven politics'],
    summary: 'The Labour Party rose from relative obscurity to become a major political force in the 2023 elections when Peter Obi, its presidential candidate, won over 6 million votes and carried Lagos and the South-East geopolitical zone.',
    history: 'The Labour Party was formed in 2002 and remained a minor party for most of its existence. It transformed dramatically in 2022 when former Anambra State Governor Peter Obi joined and became its presidential candidate for the 2023 elections. The party galvanised a youth-driven movement — the "Obidient" movement — that attracted massive support, especially among first-time and urban voters. Obi finished third in the official results with approximately 25% of votes, though the results were contested at the Supreme Court.',
    keyPolicies: [
      "Workers' rights and labour protections",
      'Anti-corruption and accountability',
      'Youth empowerment and employment',
      'Investment in education and healthcare',
      'Economic productivity over consumption',
    ],
    notableLeaders: ['Peter Obi (2023 presidential candidate)', 'Julius Abure (National Chairman)'],
    headquarters: 'Abuja, FCT',
    electoralHighlights: [
      '2023 — Peter Obi won 25.4% of presidential votes (6.1 million votes)',
      '2023 — Won Lagos State presidential vote (first time a non-APC/PDP candidate led Lagos)',
      '2023 — Won Abuja (FCT) presidential vote',
      '2023 — Swept the South-East states in the presidential election',
    ],
  },

  NNPP: {
    abbreviation: 'NNPP',
    fullName: 'New Nigeria Peoples Party',
    slug: 'nnpp',
    founded: 2001,
    ideology: ['Social democracy', 'Northern Nigerian interests', 'Populism'],
    summary: 'The NNPP is a northern-focused party that gained national prominence in 2023 when its candidate Rabiu Musa Kwankwaso ran for president and the party won the Kano governorship.',
    history: 'The New Nigeria Peoples Party was founded in 2001. It re-emerged as a significant force under former Kano State Governor and Senator Rabiu Musa Kwankwaso, who joined the party in 2022 after leaving the PDP. In the 2023 elections, NNPP won the Kano governorship (Abba Kabir Yusuf) — one of the most populous states in Nigeria — and Kwankwaso came fourth in the presidential race.',
    keyPolicies: [
      'Northern Nigeria development and representation',
      'Education and youth empowerment (Kwankwasiyya movement)',
      'Security in the North-West and North-East',
      'Agricultural development',
    ],
    notableLeaders: ['Rabiu Musa Kwankwaso (2023 presidential candidate)', 'Abba Kabir Yusuf (Kano Governor, 2023–)'],
    headquarters: 'Abuja, FCT',
    electoralHighlights: [
      '2023 — Won Kano State governorship (Abba Kabir Yusuf)',
      '2023 — Kwankwaso received ~1.5 million presidential votes',
      'Significant Senate and HOR representation from Kano State',
    ],
  },

  APGA: {
    abbreviation: 'APGA',
    fullName: 'All Progressives Grand Alliance',
    slug: 'apga',
    founded: 2002,
    ideology: ['Igbo nationalism', 'South-East development', 'Social liberalism'],
    summary: 'APGA is the dominant party in Anambra State and has historical roots in the Igbo political movement. It has governed Anambra continuously since 2006.',
    history: 'The All Progressives Grand Alliance was founded in 2002. The party came to prominence under Chukwuemeka Odumegwu Ojukwu, the former Biafra leader who became its first presidential candidate. APGA has governed Anambra State since 2006, making it the only state in Nigeria consistently governed by a party other than APC or PDP at the highest level. Current Anambra Governor Charles Chukwuma Soludo (former CBN Governor) won on the APGA platform in 2021.',
    keyPolicies: [
      'South-East development and Igbo interests',
      'Security and vigilante reform (Anambra)',
      'Economic modernisation and investment',
      'Education and infrastructure in the South-East',
    ],
    notableLeaders: ['Charles Chukwuma Soludo (Anambra Governor, 2022–)', 'Chukwuemeka Odumegwu Ojukwu (founder, deceased)'],
    headquarters: 'Awka, Anambra State',
    electoralHighlights: [
      '2006 to present — Continuous governance of Anambra State',
      '2021 — Soludo won Anambra governorship election',
      'Strong legislative representation in South-East states',
    ],
  },

  SDP: {
    abbreviation: 'SDP',
    fullName: 'Social Democratic Party',
    slug: 'sdp',
    founded: 1989,
    ideology: ['Social democracy', 'Centre-left politics'],
    summary: 'One of the oldest parties in Nigeria, the SDP won the famous June 12 1993 presidential election with Moshood Abiola as its candidate — the result was annulled by the military. The modern SDP was re-registered after the return to democracy.',
    history: "The original Social Democratic Party was one of only two parties permitted during Nigeria's Third Republic under General Babangida. Its candidate MKO Abiola won the June 12, 1993 presidential election, widely considered the freest and fairest in Nigerian history. The military annulled the results, leading to a political crisis. The modern SDP was registered under the Fourth Republic and has contested several elections with limited national success.",
    keyPolicies: [
      'Social welfare and workers\' rights',
      'Democratic governance and rule of law',
      'Remembrance of June 12 democratic heritage',
    ],
    notableLeaders: ['Shehu Gabam (National Chairman)', 'Adewole Adebayo (2023 presidential candidate)'],
    headquarters: 'Abuja, FCT',
    electoralHighlights: [
      '1993 — MKO Abiola won the annulled June 12 presidential election',
      '2023 — Adewole Adebayo contested the presidency',
    ],
  },
}

/** Returns extended info for a party, or null if not in our data. */
export function getPartyInfo(abbreviation: string): PartyInfo | null {
  return PARTY_INFO[abbreviation.toUpperCase()] ?? null
}
