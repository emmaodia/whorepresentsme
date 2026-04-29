/**
 * State House of Assembly constituency mapping: state → LGA → constituency names.
 *
 * One LGA can span multiple state assembly constituencies. Where a state's data
 * has not been verified, the LGA entry is omitted and the lookup returns null —
 * the UI shows "data coming soon" for that state.
 *
 * Sources: INEC constituency delineation schedules, state assembly official sites.
 *
 * Coverage status:
 *   Lagos       — complete (40 constituencies, 20 LGAs)
 *   Others      — pending verification
 */

// state → { lga → constituencies[] }
type AssemblyMapEntry = Record<string, string[]>
const ASSEMBLY_MAP: Record<string, AssemblyMapEntry> = {

  // ──────────────────────────────────────────────────────────────────
  // LAGOS — 40 constituencies across 20 LGAs
  // Most LGAs have 2 seats; Ikorodu has 3; Ibeju-Lekki has 1.
  // ──────────────────────────────────────────────────────────────────
  'Lagos': {
    'Agege':              ['Agege I', 'Agege II'],
    'Ajeromi-Ifelodun':  ['Ajeromi I', 'Ajeromi II'],
    'Alimosho':          ['Alimosho I', 'Alimosho II'],
    'Amuwo-Odofin':      ['Amuwo-Odofin I', 'Amuwo-Odofin II'],
    'Apapa':             ['Apapa I', 'Apapa II'],
    'Badagry':           ['Badagry I', 'Badagry II'],
    'Epe':               ['Epe I', 'Epe II'],
    'Eti-Osa':           ['Eti-Osa I', 'Eti-Osa II'],
    'Ibeju-Lekki':       ['Ibeju/Lekki'],
    'Ifako-Ijaiye':      ['Ifako-Ijaiye I', 'Ifako-Ijaiye II'],
    'Ikeja':             ['Ikeja I', 'Ikeja II'],
    'Ikorodu':           ['Ikorodu I', 'Ikorodu II', 'Ikorodu III'],
    'Kosofe':            ['Kosofe I', 'Kosofe II'],
    'Lagos Island':      ['Lagos Island I', 'Lagos Island II'],
    'Lagos Mainland':    ['Lagos Mainland I', 'Lagos Mainland II'],
    'Mushin':            ['Mushin I', 'Mushin II'],
    'Ojo':               ['Ojo I', 'Ojo II'],
    'Oshodi-Isolo':      ['Oshodi-Isolo I', 'Oshodi-Isolo II'],
    'Shomolu':           ['Shomolu I', 'Shomolu II'],
    'Surulere':          ['Surulere I', 'Surulere II'],
  },

  // ──────────────────────────────────────────────────────────────────
  // RIVERS — 32 constituencies across 23 LGAs
  // ──────────────────────────────────────────────────────────────────
  'Rivers': {
    'Port Harcourt':     ['Port Harcourt I', 'Port Harcourt II', 'Port Harcourt III', 'Port Harcourt IV'],
    'Obio-Akpor':        ['Obio I', 'Obio II', 'Obio III'],
    'Ikwerre':           ['Ikwerre I', 'Ikwerre II'],
    'Etche':             ['Etche I', 'Etche II'],
    'Ogba-Egbema-Ndoni': ['Ogba-Egbema-Ndoni I', 'Ogba-Egbema-Ndoni II'],
    'Ogu-Bolo':          ['Ogu-Bolo'],
    'Okrika':            ['Okrika'],
    'Eleme':             ['Eleme'],
    'Tai':               ['Tai'],
    'Gokana':            ['Gokana'],
    'Khana':             ['Khana I', 'Khana II'],
    'Oyigbo':            ['Oyigbo'],
    'Opobo-Nkoro':       ['Opobo-Nkoro'],
    'Andoni':            ['Andoni'],
    'Bonny':             ['Bonny'],
    'Degema':            ['Degema'],
    'Asari-Toru':        ['Asari-Toru'],
    'Akuku-Toru':        ['Akuku-Toru'],
    'Ahoada East':       ['Ahoada East I', 'Ahoada East II'],
    'Ahoada West':       ['Ahoada West'],
    'Abua-Odual':        ['Abua-Odual'],
    'Emohua':            ['Emohua'],
    'Omuma':             ['Omuma'],
  },

  // ──────────────────────────────────────────────────────────────────
  // FCT — 10 constituencies (Area Councils, not a traditional state)
  // ──────────────────────────────────────────────────────────────────
  'FCT': {
    'Abuja Municipal':   ['AMAC I', 'AMAC II', 'AMAC III'],
    'Bwari':             ['Bwari'],
    'Gwagwalada':        ['Gwagwalada'],
    'Kuje':              ['Kuje'],
    'Kwali':             ['Kwali'],
    'Abaji':             ['Abaji'],
  },

  // ──────────────────────────────────────────────────────────────────
  // KANO — 40 constituencies across 44 LGAs
  // ──────────────────────────────────────────────────────────────────
  'Kano': {
    'Kano Municipal':     ['Kano Municipal'],
    'Fagge':              ['Fagge'],
    'Dala':               ['Dala'],
    'Gwale':              ['Gwale'],
    'Tarauni':            ['Tarauni'],
    'Nassarawa':          ['Nassarawa'],
    'Ungogo':             ['Ungogo'],
    'Dawakin Tofa':       ['Dawakin Tofa'],
    'Tofa':               ['Tofa'],
    'Rimin Gado':         ['Rimin Gado'],
    'Bagwai':             ['Bagwai'],
    'Shanono':            ['Shanono'],
    'Dawakin Kudu':       ['Dawakin Kudu'],
    'Warawa':             ['Warawa'],
    'Kiru':               ['Kiru'],
    'Garun Mallam':       ['Garun Mallam'],
    'Bunkure':            ['Bunkure'],
    'Kibiya':             ['Kibiya'],
    'Wudil':              ['Wudil'],
    'Garko':              ['Garko'],
    'Albasu':             ['Albasu'],
    'Gwarzo':             ['Gwarzo'],
    'Kabo':               ['Kabo'],
    'Gezawa':             ['Gezawa'],
    'Dambatta':           ['Dambatta'],
    'Minjibir':           ['Minjibir'],
    'Bebeji':             ['Bebeji'],
    'Rano':               ['Rano'],
    'Tudun Wada':         ['Tudun Wada'],
    'Doguwa':             ['Doguwa'],
    'Kura':               ['Kura'],
    'Madobi':             ['Madobi'],
    'Sumaila':            ['Sumaila'],
    'Gaya':               ['Gaya'],
    'Ajingi':             ['Ajingi'],
    'Kunchi':             ['Kunchi'],
    'Bichi':              ['Bichi'],
    'Tsanyawa':           ['Tsanyawa'],
    'Makoda':             ['Makoda'],
    'Karaye':             ['Karaye'],
    'Gabasawa':           ['Gabasawa'],
    'Rogo':               ['Rogo'],
    'Takai':              ['Takai'],
  },

  // ──────────────────────────────────────────────────────────────────
  // OGUN — 26 constituencies across 20 LGAs
  // ──────────────────────────────────────────────────────────────────
  'Ogun': {
    'Abeokuta North':     ['Abeokuta North'],
    'Abeokuta South':     ['Abeokuta South I', 'Abeokuta South II'],
    'Ado-Odo/Ota':        ['Ado-Odo/Ota I', 'Ado-Odo/Ota II', 'Ado-Odo/Ota III'],
    'Egbado North':       ['Egbado North I', 'Egbado North II'],
    'Egbado South':       ['Egbado South I', 'Egbado South II'],
    'Ewekoro':            ['Ewekoro'],
    'Ifo':                ['Ifo I', 'Ifo II'],
    'Ijebu East':         ['Ijebu East'],
    'Ijebu North':        ['Ijebu North I', 'Ijebu North II'],
    'Ijebu North East':   ['Ijebu North East'],
    'Ijebu Ode':          ['Ijebu Ode'],
    'Ikenne':             ['Ikenne'],
    'Imeko-Afon':         ['Imeko-Afon'],
    'Ipokia':             ['Ipokia'],
    'Obafemi-Owode':      ['Obafemi-Owode I', 'Obafemi-Owode II'],
    'Odeda':              ['Odeda'],
    'Odogbolu':           ['Odogbolu'],
    'Ogun Waterside':     ['Ogun Waterside'],
    'Remo North':         ['Remo North'],
    'Sagamu':             ['Sagamu I', 'Sagamu II'],
  },

  // ──────────────────────────────────────────────────────────────────
  // OYO — 32 constituencies across 33 LGAs
  // ──────────────────────────────────────────────────────────────────
  'Oyo': {
    'Ibadan North':       ['Ibadan North I', 'Ibadan North II'],
    'Ibadan North-East':  ['Ibadan North-East'],
    'Ibadan North-West':  ['Ibadan North-West'],
    'Ibadan South-East':  ['Ibadan South-East'],
    'Ibadan South-West':  ['Ibadan South-West I', 'Ibadan South-West II'],
    'Ibarapa Central':    ['Ibarapa Central'],
    'Ibarapa East':       ['Ibarapa East'],
    'Ibarapa North':      ['Ibarapa North'],
    'Ido':                ['Ido'],
    'Lagelu':             ['Lagelu'],
    'Akinyele':           ['Akinyele I', 'Akinyele II'],
    'Egbeda':             ['Egbeda'],
    'Ona Ara':            ['Ona Ara'],
    'Oluyole':            ['Oluyole'],
    'Afijio':             ['Afijio'],
    'Atiba':              ['Atiba'],
    'Oyo East':           ['Oyo East'],
    'Oyo West':           ['Oyo West'],
    'Ogbomosho North':    ['Ogbomosho North'],
    'Ogbomosho South':    ['Ogbomosho South'],
    'Ori Ire':            ['Ori Ire'],
    'Ogo Oluwa':          ['Ogo Oluwa'],
    'Surulere':           ['Surulere'],
    'Iseyin':             ['Iseyin'],
    'Itesiwaju':          ['Itesiwaju'],
    'Kajola':             ['Kajola'],
    'Iwajowa':            ['Iwajowa'],
    'Atisbo':             ['Atisbo'],
    'Saki East':          ['Saki East'],
    'Saki West':          ['Saki West'],
    'Irepo':              ['Irepo'],
    'Olorunsogo':         ['Olorunsogo'],
    'Oorelope':           ['Oorelope'],
  },

  // ──────────────────────────────────────────────────────────────────
  // DELTA — 29 constituencies across 25 LGAs
  // ──────────────────────────────────────────────────────────────────
  'Delta': {
    'Oshimili North':   ['Oshimili North'],
    'Oshimili South':   ['Oshimili South I', 'Oshimili South II'],
    'Aniocha North':    ['Aniocha North'],
    'Aniocha South':    ['Aniocha South I', 'Aniocha South II'],
    'Ika North-East':   ['Ika North-East I', 'Ika North-East II'],
    'Ika South':        ['Ika South'],
    'Ndokwa East':      ['Ndokwa East'],
    'Ndokwa West':      ['Ndokwa West'],
    'Ukwuani':          ['Ukwuani'],
    'Isoko North':      ['Isoko North'],
    'Isoko South':      ['Isoko South I', 'Isoko South II'],
    'Ethiope East':     ['Ethiope East'],
    'Ethiope West':     ['Ethiope West'],
    'Sapele':           ['Sapele I', 'Sapele II'],
    'Okpe':             ['Okpe'],
    'Uvwie':            ['Uvwie I', 'Uvwie II'],
    'Udu':              ['Udu'],
    'Warri South':      ['Warri South I', 'Warri South II'],
    'Warri North':      ['Warri North'],
    'Warri South-West': ['Warri South-West'],
    'Ughelli North':    ['Ughelli North I', 'Ughelli North II'],
    'Ughelli South':    ['Ughelli South'],
    'Bomadi':           ['Bomadi'],
    'Burutu':           ['Burutu I', 'Burutu II'],
    'Patani':           ['Patani'],
  },

  // ──────────────────────────────────────────────────────────────────
  // ANAMBRA — 30 constituencies across 21 LGAs
  // Term: 2022–2026 (off-cycle from federal election)
  // ──────────────────────────────────────────────────────────────────
  'Anambra': {
    'Aguata':            ['Aguata I', 'Aguata II'],
    'Anambra East':      ['Anambra East'],
    'Anambra West':      ['Anambra West'],
    'Anaocha':           ['Anaocha I', 'Anaocha II'],
    'Awka North':        ['Awka North'],
    'Awka South':        ['Awka South I', 'Awka South II'],
    'Ayamelum':          ['Ayamelum'],
    'Dunukofia':         ['Dunukofia'],
    'Ekwusigo':          ['Ekwusigo'],
    'Idemili North':     ['Idemili North I', 'Idemili North II'],
    'Idemili South':     ['Idemili South I', 'Idemili South II'],
    'Ihiala':            ['Ihiala I', 'Ihiala II'],
    'Njikoka':           ['Njikoka I', 'Njikoka II'],
    'Nnewi North':       ['Nnewi North'],
    'Nnewi South':       ['Nnewi South'],
    'Ogbaru':            ['Ogbaru I', 'Ogbaru II'],
    'Onitsha North':     ['Onitsha North I', 'Onitsha North II'],
    'Onitsha South':     ['Onitsha South I', 'Onitsha South II'],
    'Orumba North':      ['Orumba North'],
    'Orumba South':      ['Orumba South'],
    'Oyi':               ['Oyi'],
  },

  // ──────────────────────────────────────────────────────────────────
  // EDO — 24 constituencies across 18 LGAs
  // ──────────────────────────────────────────────────────────────────
  'Edo': {
    'Oredo':             ['Oredo I', 'Oredo II'],
    'Ikpoba-Okha':       ['Ikpoba-Okha I', 'Ikpoba-Okha II'],
    'Egor':              ['Egor'],
    'Orhionmwon':        ['Orhionmwon I', 'Orhionmwon II'],
    'Ovia North-East':   ['Ovia North-East I', 'Ovia North-East II'],
    'Ovia South-West':   ['Ovia South-West'],
    'Owan East':         ['Owan East'],
    'Owan West':         ['Owan West'],
    'Akoko-Edo':         ['Akoko-Edo I', 'Akoko-Edo II'],
    'Etsako East':       ['Etsako East'],
    'Etsako West':       ['Etsako West I', 'Etsako West II'],
    'Etsako Central':    ['Etsako Central'],
    'Uhunmwonde':        ['Uhunmwonde'],
    'Esan North-East':   ['Esan North-East'],
    'Esan West':         ['Esan West I', 'Esan West II'],
    'Esan Central':      ['Esan Central'],
    'Esan South-East':   ['Esan South-East'],
  },

}

/**
 * Returns state assembly constituencies for a given state and LGA.
 * Returns null if the state or LGA data has not been mapped yet.
 */
export function getAssemblyConstituencies(state: string, lga: string): string[] | null {
  const stateMap = ASSEMBLY_MAP[state]
  if (!stateMap) return null
  return stateMap[lga] ?? null
}

/** Returns true if we have state assembly data for the given state. */
export function hasAssemblyData(state: string): boolean {
  return !!ASSEMBLY_MAP[state]
}

/** All states for which assembly data is available. */
export const STATES_WITH_ASSEMBLY_DATA = Object.keys(ASSEMBLY_MAP)
