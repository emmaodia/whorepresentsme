import { getOfficialsByStateId, getReferenceData, getStatesAdmin } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ElectionCountdown from '@/components/ElectionCountdown'
import type { Metadata } from 'next'
import type { OfficialWithRefs } from '@/lib/types'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamicParams = true

export async function generateStaticParams() {
  try {
    const states = await getStatesAdmin()
    return states.map(s => ({ slug: s.slug }))
  } catch {
    // Supabase env vars not available at build time — pages rendered on demand via ISR
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const states = await getStatesAdmin()
  const state = states.find(s => s.slug === slug)
  if (!state) return { title: 'State | MyReps.ng' }
  return {
    title: `${state.name} — Elected Officials | MyReps.ng`,
    description: `All verified elected officials for ${state.name} State — governor, senators, HOR members, and state assembly.`,
  }
}

function officeTier(o: OfficialWithRefs) {
  const t = o.offices?.title ?? ''
  if (t === 'Governor' || t === 'Deputy Governor') return 'Executive'
  if (t.includes('Senator') || t.includes('Senate President') || t.includes('Deputy Senate')) return 'Senate'
  if (t.includes('House of Rep') || t.includes('House of Representatives')) return 'House of Reps'
  if (t.includes('State House') || t === 'State Legislator' || t.includes('Speaker, State')) return 'State Assembly'
  return 'Other'
}

const TIER_ORDER = ['Executive', 'Senate', 'House of Reps', 'State Assembly', 'Other'] as const

export default async function StatePage({ params }: Props) {
  const { slug } = await params

  // Use admin client for state lookup (no cookies needed at this point)
  const states = await getStatesAdmin()
  const state = states.find(s => s.slug === slug)
  if (!state) notFound()

  // Filter by state_id — reliable direct column filter
  const officials = await getOfficialsByStateId(state.id)

  const total  = officials.length
  const female = officials.filter(o => o.gender === 'Female').length

  // Party breakdown
  const partyCount = new Map<string, { count: number; color: string }>()
  for (const o of officials) {
    const abbr = o.parties?.abbreviation
    if (!abbr) continue
    const ex = partyCount.get(abbr) ?? { count: 0, color: o.parties?.color_hex ?? '#6b7280' }
    partyCount.set(abbr, { count: ex.count + 1, color: ex.color })
  }
  const partyBreakdown = [...partyCount.entries()]
    .map(([abbr, d]) => ({ abbr, ...d }))
    .sort((a, b) => b.count - a.count)

  // Officials grouped by tier
  const byTier = TIER_ORDER
    .map(t => ({
      tier: t,
      officials: officials.filter(o => officeTier(o) === t)
        .sort((a, b) => a.full_name.localeCompare(b.full_name)),
    }))
    .filter(g => g.officials.length > 0)

  const governor = officials.find(o => o.offices?.title === 'Governor')
  const isFCT = state.name === 'FCT'

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-base font-semibold text-green-800 tracking-tight">
            MyReps<span className="text-gray-400">.ng</span>
          </Link>
          <div className="flex gap-2 text-xs">
            <Link href="/states" className="text-gray-500 hover:text-gray-700 py-1.5">All states</Link>
            <Link href="/find" className="text-green-700 border border-green-200 rounded px-3 py-1.5 hover:bg-green-50 transition-colors">
              Find my reps
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span>/</span>
          <Link href="/states" className="hover:text-gray-600">States</Link>
          <span>/</span>
          <span className="text-gray-600">{state.name}</span>
        </nav>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-lg font-bold text-green-800 shrink-0">
            {state.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            {state.zone && (
              <span className="text-[10px] font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full inline-block mb-1">
                {state.zone} Zone
              </span>
            )}
            <h1 className="text-2xl font-semibold text-gray-900">
              {state.name}{!isFCT ? ' State' : ' — Federal Capital Territory'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {total > 0
                ? `${total} elected official${total !== 1 ? 's' : ''} in directory`
                : 'No officials in directory yet'}
            </p>
          </div>
        </div>

        {/* ── Stats ────────────────────────────────────────────────────── */}
        {total > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <StatCard label="In directory" value={total} />
            <StatCard
              label="Female officials"
              value={female}
              sub={`${Math.round((female / total) * 100)}% of total`}
            />
            <StatCard label="Parties represented" value={partyBreakdown.length} />
            <StatCard label="Office tiers" value={byTier.length} />
          </div>
        )}

        {/* ── FCT note ─────────────────────────────────────────────────── */}
        {isFCT && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6 text-xs text-amber-700">
            The FCT does not have an elected governor. The FCT Minister is appointed by the President.
            FCT residents elect senators, HOR members, and Area Council officials.
          </div>
        )}

        {/* ── Governor spotlight ────────────────────────────────────────── */}
        {governor && (
          <section className="mb-8">
            <SectionHeader>State Executive</SectionHeader>
            <Link
              href={`/officials/${governor.id}`}
              className="flex items-center gap-4 bg-green-50 border border-green-100 rounded-xl p-4 hover:bg-green-100 transition-colors"
            >
              {governor.photo_url ? (
                <Image
                  src={governor.photo_url}
                  alt={governor.full_name}
                  width={56} height={56}
                  className="w-14 h-14 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-green-200 flex items-center justify-center text-lg font-bold text-green-800 shrink-0">
                  {governor.full_name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-gray-900">{governor.full_name}</p>
                <p className="text-xs text-gray-500 mt-0.5">Governor of {state.name} State</p>
                {governor.parties && (
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-1.5 inline-block"
                    style={{ background: `${governor.parties.color_hex}22`, color: governor.parties.color_hex }}
                  >
                    {governor.parties.abbreviation}
                  </span>
                )}
              </div>
              {governor.next_election_date && (
                <div className="shrink-0">
                  <ElectionCountdown date={governor.next_election_date} size="sm" />
                </div>
              )}
            </Link>
          </section>
        )}

        {/* ── Party breakdown ───────────────────────────────────────────── */}
        {partyBreakdown.length > 0 && (
          <section className="mb-8">
            <SectionHeader>Party breakdown</SectionHeader>
            <div className="space-y-2">
              {partyBreakdown.map(p => (
                <div key={p.abbr} className="grid grid-cols-[72px_1fr_36px] gap-3 items-center">
                  <Link
                    href={`/parties/${p.abbr.toLowerCase()}`}
                    className="text-xs font-medium text-gray-700 hover:text-green-700 hover:underline"
                  >
                    {p.abbr}
                  </Link>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.round((p.count / total) * 100)}%`, background: p.color }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 text-right">{p.count}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Officials by tier ─────────────────────────────────────────── */}
        {byTier.map(group => (
          <section key={group.tier} className="mb-8">
            <SectionHeader>
              {group.tier === 'Executive' ? 'State Executive' : group.tier} ({group.officials.length})
            </SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {group.officials.map(o => <OfficialRow key={o.id} official={o} />)}
            </div>
          </section>
        ))}

        {/* ── Empty state ──────────────────────────────────────────────── */}
        {total === 0 && (
          <div className="text-center py-16 text-sm text-gray-400">
            <p className="mb-2">No verified officials on record for {state.name} yet.</p>
            <Link href="/contribute" className="text-green-700 hover:underline">
              Help us add them →
            </Link>
          </div>
        )}

        {/* ── Constituency tools ────────────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/constituency"
            className="bg-green-50 border border-green-100 rounded-xl px-4 py-4 hover:bg-green-100 transition-colors"
          >
            <p className="text-sm font-semibold text-green-800 mb-1">Find your constituency in {state.name}</p>
            <p className="text-xs text-green-600">
              Select your LGA to see your senatorial district, federal constituency, and state assembly seat.
            </p>
          </Link>
          <Link
            href="/polling-units"
            className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 hover:bg-gray-100 transition-colors"
          >
            <p className="text-sm font-semibold text-gray-900 mb-1">Find your polling unit</p>
            <p className="text-xs text-gray-500">
              Look up your polling unit in {state.name}.
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
      {children} <span className="flex-1 border-t border-gray-100" />
    </h2>
  )
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-xl font-semibold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function OfficialRow({ official: o }: { official: OfficialWithRefs }) {
  const party = o.parties
  return (
    <Link
      href={`/officials/${o.id}`}
      className="flex items-center gap-3 border border-gray-100 rounded-lg px-3 py-2.5 hover:border-green-200 hover:bg-green-50 transition-colors"
    >
      {o.photo_url ? (
        <Image
          src={o.photo_url}
          alt={o.full_name}
          width={32} height={32}
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
          {o.full_name.split(' ').slice(0, 2).map(n => n[0]).join('')}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{o.full_name}</p>
        <p className="text-xs text-gray-400 truncate">
          {o.offices?.title}{o.constituency ? ` · ${o.constituency}` : ''}
        </p>
      </div>
      {party && (
        <span
          className="text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0"
          style={{ background: `${party.color_hex}22`, color: party.color_hex }}
        >
          {party.abbreviation}
        </span>
      )}
    </Link>
  )
}
