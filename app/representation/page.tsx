import { getOfficials, getReferenceData } from '@/lib/queries'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { OfficialWithRefs } from '@/lib/types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Women & Youth in Nigerian Politics — WhoRepresentsMe.ng',
  description: 'Data-driven look at gender and age representation across every tier of elected government in Nigeria.',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcAge(dob?: string | null): number | null {
  if (!dob) return null
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

function pct(n: number, total: number) {
  if (!total) return 0
  return Math.round((n / total) * 100)
}

function median(nums: number[]) {
  if (!nums.length) return null
  const sorted = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2)
}

function officeTier(o: OfficialWithRefs) {
  const t = o.offices?.title ?? ''
  if (t === 'President' || t === 'Vice President') return 'National'
  if (t.includes('Senator') || t.includes('Senate President') || t.includes('Deputy Senate')) return 'Senator'
  if (t.includes('House of Representatives') || t.includes('House of Rep')) return 'HOR Member'
  if (t === 'Governor') return 'Governor'
  if (t === 'Deputy Governor') return 'Deputy Governor'
  if (t.includes('State House of Assembly') || t === 'State Legislator' || t.includes('Speaker, State')) return 'State Assembly'
  if (t.includes('Chairman')) return 'LGA Chairman'
  if (t.includes('Councillor')) return 'Councillor'
  return 'Other'
}

const TIER_ORDER = ['National', 'Senator', 'HOR Member', 'Governor', 'Deputy Governor', 'State Assembly', 'LGA Chairman', 'Councillor', 'Other']

export default async function RepresentationPage() {
  const [officials, { states }] = await Promise.all([
    getOfficials(),
    getReferenceData(),
  ])

  // ── Overall gender ──────────────────────────────────────────────────────
  const total = officials.length
  const female = officials.filter(o => o.gender === 'Female').length
  const male   = officials.filter(o => o.gender === 'Male').length
  const unknown = total - female - male

  // ── Age stats ───────────────────────────────────────────────────────────
  const withAge = officials.map(o => ({ ...o, age: calcAge(o.date_of_birth) })).filter(o => o.age !== null) as (OfficialWithRefs & { age: number })[]
  const ages = withAge.map(o => o.age)
  const avgAge = ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : null
  const medianAge = median(ages)
  const under35 = ages.filter(a => a < 35).length
  const under40 = ages.filter(a => a < 40).length
  const under45 = ages.filter(a => a < 45).length
  const youngest = withAge.reduce((min, o) => o.age < min.age ? o : min, withAge[0] ?? null)
  const oldest   = withAge.reduce((max, o) => o.age > max.age ? o : max, withAge[0] ?? null)

  // ── By office tier ──────────────────────────────────────────────────────
  const byTier = TIER_ORDER.map(tier => {
    const group = officials.filter(o => officeTier(o) === tier)
    const f = group.filter(o => o.gender === 'Female').length
    const groupAges = group.map(o => calcAge(o.date_of_birth)).filter((a): a is number => a !== null)
    return {
      tier,
      total: group.length,
      female: f,
      male: group.filter(o => o.gender === 'Male').length,
      pctFemale: pct(f, group.length),
      avgAge: groupAges.length ? Math.round(groupAges.reduce((a, b) => a + b, 0) / groupAges.length) : null,
    }
  }).filter(g => g.total > 0)

  // ── By state (female representation ranking) ────────────────────────────
  const byState = states.map(s => {
    const group = officials.filter(o => o.states?.name === s.name)
    const f = group.filter(o => o.gender === 'Female').length
    return { state: s.name, total: group.length, female: f, pct: pct(f, group.length) }
  }).filter(s => s.total > 0).sort((a, b) => b.pct - a.pct || b.female - a.female)

  // ── By party ────────────────────────────────────────────────────────────
  const partyMap = new Map<string, { total: number; female: number; color: string }>()
  for (const o of officials) {
    if (!o.parties?.abbreviation) continue
    const key = o.parties.abbreviation
    const existing = partyMap.get(key) ?? { total: 0, female: 0, color: o.parties.color_hex ?? '#6b7280' }
    partyMap.set(key, {
      total: existing.total + 1,
      female: existing.female + (o.gender === 'Female' ? 1 : 0),
      color: existing.color,
    })
  }
  const byParty = [...partyMap.entries()]
    .map(([party, data]) => ({ party, ...data, pct: pct(data.female, data.total) }))
    .sort((a, b) => b.total - a.total)

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-base font-semibold text-green-800 tracking-tight">
            WhoRepresentsMe<span className="text-gray-400">.ng</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            Full directory →
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span>/</span>
          <span className="text-gray-600">Representation in Nigeria</span>
        </nav>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Women & Youth in Nigerian Politics</h1>
        <p className="text-sm text-gray-500 mb-8 max-w-2xl">
          A data-driven look at gender and age representation across {total} elected officials
          in our directory. All figures are based on verified data — gaps reflect missing records,
          not necessarily zero representation.
        </p>

        {/* ── Top-level stats ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <BigStat label="Officials in directory" value={total.toLocaleString()} />
          <BigStat label="Female officials" value={female.toLocaleString()} sub={`${pct(female, total)}% of total`} highlight />
          <BigStat label="Average age" value={avgAge ? `${avgAge} yrs` : '—'} sub={medianAge ? `Median: ${medianAge} yrs` : undefined} />
          <BigStat label="Under 40 years old" value={under40.toLocaleString()} sub={`of ${withAge.length} with known age`} />
        </div>

        {/* ── Gender overview ───────────────────────────────────────────── */}
        <Section title="Gender breakdown">
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-1.5">
              <div className="flex-1 h-4 rounded-full bg-gray-100 overflow-hidden flex">
                <div className="h-full bg-green-600 transition-all" style={{ width: `${pct(female, total)}%` }} />
                <div className="h-full bg-blue-400 transition-all" style={{ width: `${pct(male, total)}%` }} />
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap w-24 text-right">{pct(female, total)}% female</span>
            </div>
            <div className="flex gap-4 text-xs text-gray-500">
              <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-green-600 mr-1" />{female.toLocaleString()} female ({pct(female, total)}%)</span>
              <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-400 mr-1" />{male.toLocaleString()} male ({pct(male, total)}%)</span>
              {unknown > 0 && <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-300 mr-1" />{unknown} not recorded</span>}
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Nigeria&apos;s 35% affirmative action target for women in politics (recommended by the Gender Equal Opportunity Bill) is
            far from reached at any tier of government.
          </p>
        </Section>

        {/* ── By office type ────────────────────────────────────────────── */}
        <Section title="Female representation by office">
          <div className="space-y-2">
            {byTier.map(g => (
              <div key={g.tier} className="grid grid-cols-[140px_1fr_80px] gap-3 items-center">
                <span className="text-xs text-gray-600 truncate">{g.tier}</span>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${g.pctFemale}%` }} />
                </div>
                <span className="text-xs text-gray-500 text-right">
                  {g.female}/{g.total} ({g.pctFemale}%)
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Age stats ─────────────────────────────────────────────────── */}
        <Section title="Age in Nigerian politics">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <AgeStat label="Under 35" count={under35} total={withAge.length} />
            <AgeStat label="Under 40" count={under40} total={withAge.length} />
            <AgeStat label="Under 45" count={under45} total={withAge.length} />
            <AgeStat label="Average age" count={avgAge ?? 0} total={0} isAvg />
          </div>

          {youngest && oldest && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <PersonCard label="Youngest official" official={youngest} age={youngest.age} />
              <PersonCard label="Oldest official"   official={oldest}   age={oldest.age}   />
            </div>
          )}

          <div className="mt-4 space-y-2">
            {byTier.filter(g => g.avgAge !== null).map(g => (
              <div key={g.tier} className="grid grid-cols-[140px_1fr_60px] gap-3 items-center">
                <span className="text-xs text-gray-600 truncate">{g.tier}</span>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min(100, ((g.avgAge ?? 0) / 80) * 100)}%` }} />
                </div>
                <span className="text-xs text-gray-500 text-right">{g.avgAge} yrs</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Constitutional minimum ages: President/Governor 40 · Senator 35 · HOR Member 30 · State Assembly 25 · Councillor 21.
          </p>
        </Section>

        {/* ── By state (female ranking) ─────────────────────────────────── */}
        <Section title="Female representation by state (top 10)">
          <div className="space-y-2">
            {byState.slice(0, 10).map((s, i) => (
              <div key={s.state} className="grid grid-cols-[24px_120px_1fr_80px] gap-2 items-center">
                <span className="text-xs text-gray-400 text-right">{i + 1}.</span>
                <Link href={`/states/${s.state.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs text-green-700 hover:underline truncate">
                  {s.state}
                </Link>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${s.pct}%` }} />
                </div>
                <span className="text-xs text-gray-500 text-right">{s.female}/{s.total} ({s.pct}%)</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── By party ─────────────────────────────────────────────────── */}
        <Section title="Officials by party">
          <div className="space-y-2">
            {byParty.slice(0, 10).map(p => (
              <div key={p.party} className="grid grid-cols-[72px_1fr_80px] gap-3 items-center">
                <Link href={`/parties/${p.party.toLowerCase()}`} className="text-xs font-medium text-gray-700 hover:text-green-700 hover:underline">
                  {p.party}
                </Link>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct(p.total, total)}%`, background: p.color }} />
                </div>
                <span className="text-xs text-gray-500 text-right">{p.total} officials</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Footer note ───────────────────────────────────────────────── */}
        <p className="mt-8 text-xs text-gray-400">
          Data reflects verified officials in the WhoRepresentsMe.ng directory as of the last update.
          Officials with no gender or date-of-birth records are excluded from those specific calculations.
          <Link href="/contribute" className="text-green-700 hover:underline ml-1">Help us fill the gaps →</Link>
        </p>
      </div>
    </main>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
        {title} <span className="flex-1 border-t border-gray-100" />
      </h2>
      {children}
    </section>
  )
}

function BigStat({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${highlight ? 'text-green-700' : 'text-gray-900'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function AgeStat({ label, count, total, isAvg }: { label: string; count: number; total: number; isAvg?: boolean }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-xl font-semibold text-amber-600">{isAvg ? `${count} yrs` : count}</p>
      {!isAvg && <p className="text-[10px] text-gray-400 mt-0.5">{pct(count, total)}% of those with known age</p>}
    </div>
  )
}

function PersonCard({ label, official, age }: { label: string; official: OfficialWithRefs; age: number }) {
  return (
    <Link href={`/officials/${official.id}`} className="block bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-green-200 rounded-xl p-3 transition-colors">
      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900">{official.full_name}</p>
      <p className="text-xs text-gray-500">{official.offices?.title} · {official.states?.name ?? 'Federal'}</p>
      <p className="text-xs text-amber-600 font-medium mt-1">Age {age}</p>
    </Link>
  )
}
