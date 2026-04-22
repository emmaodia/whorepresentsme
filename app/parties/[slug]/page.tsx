import { getOfficials, getReferenceData } from '@/lib/queries'
import { PARTY_INFO, getPartyInfo } from '@/lib/data/parties-info'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import type { OfficialWithRefs } from '@/lib/types'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return Object.values(PARTY_INFO).map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const info = Object.values(PARTY_INFO).find(p => p.slug === slug)
  if (!info) return { title: 'Party | MyReps.ng' }
  return {
    title: `${info.abbreviation} — ${info.fullName} | MyReps.ng`,
    description: info.summary,
  }
}

function officeTier(o: OfficialWithRefs) {
  const t = o.offices?.title ?? ''
  if (t === 'President' || t === 'Vice President') return 'National'
  if (t.includes('Senator') || t.includes('Senate')) return 'Senate'
  if (t.includes('House of Rep') || t.includes('House of Representatives')) return 'House of Reps'
  if (t === 'Governor' || t === 'Deputy Governor') return 'Governors'
  if (t.includes('State House') || t === 'State Legislator' || t.includes('Speaker, State')) return 'State Assembly'
  return 'Other'
}

export default async function PartyPage({ params }: Props) {
  const { slug } = await params
  const info = getPartyInfo(slug.toUpperCase()) ?? Object.values(PARTY_INFO).find(p => p.slug === slug)
  if (!info) notFound()

  const [allOfficials, { parties }] = await Promise.all([
    getOfficials({ party: info.abbreviation }),
    getReferenceData(),
  ])

  const dbParty = parties.find(p => p.abbreviation === info.abbreviation)
  const color = dbParty?.color_hex ?? '#16a34a'

  // Group by tier
  const tierOrder = ['National', 'Senate', 'House of Reps', 'Governors', 'State Assembly', 'Other']
  const byTier = tierOrder.map(tier => ({
    tier,
    officials: allOfficials.filter(o => officeTier(o) === tier),
  })).filter(g => g.officials.length > 0)

  const female = allOfficials.filter(o => o.gender === 'Female').length
  const stateCount = new Set(allOfficials.map(o => o.states?.name).filter(Boolean)).size

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-base font-semibold text-green-800 tracking-tight">
            MyReps<span className="text-gray-400">.ng</span>
          </Link>
          <Link href="/parties" className="text-sm text-gray-500 hover:text-gray-700">All parties</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span>/</span>
          <Link href="/parties" className="hover:text-gray-600">Parties</Link>
          <span>/</span>
          <span className="text-gray-600">{info.abbreviation}</span>
        </nav>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white shrink-0"
              style={{ background: color }}
            >
              {info.abbreviation.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className="text-sm font-bold px-2 py-0.5 rounded"
                  style={{ background: `${color}22`, color }}
                >
                  {info.abbreviation}
                </span>
                <span className="text-xs text-gray-400">Founded {info.founded}</span>
                <span className="text-xs text-gray-400">· {info.headquarters}</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">{info.fullName}</h1>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">{info.summary}</p>
        </div>

        {/* ── Key stats ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-semibold text-gray-900">{allOfficials.length}</p>
            <p className="text-xs text-gray-400 mt-1">Officials in directory</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-semibold text-green-700">{female}</p>
            <p className="text-xs text-gray-400 mt-1">Female officials</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-semibold text-gray-900">{stateCount}</p>
            <p className="text-xs text-gray-400 mt-1">States represented</p>
          </div>
        </div>

        {/* ── Ideology ─────────────────────────────────────────────────── */}
        <section className="mb-8">
          <SectionHeader>Ideology & positioning</SectionHeader>
          <div className="flex flex-wrap gap-2 mb-4">
            {info.ideology.map(tag => (
              <span key={tag} className="text-xs border border-gray-200 rounded-full px-3 py-1 text-gray-600">{tag}</span>
            ))}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4">{info.history}</p>
        </section>

        {/* ── Key policies ─────────────────────────────────────────────── */}
        <section className="mb-8">
          <SectionHeader>Key policy positions</SectionHeader>
          <ul className="space-y-2">
            {info.keyPolicies.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span style={{ color }} className="mt-0.5 shrink-0">→</span>
                {p}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Electoral highlights ─────────────────────────────────────── */}
        <section className="mb-8">
          <SectionHeader>Electoral highlights</SectionHeader>
          <ul className="space-y-2">
            {info.electoralHighlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-gray-300 mt-0.5 shrink-0">•</span>
                {h}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Notable leaders ──────────────────────────────────────────── */}
        <section className="mb-8">
          <SectionHeader>Notable leaders</SectionHeader>
          <div className="flex flex-wrap gap-2">
            {info.notableLeaders.map(l => (
              <span key={l} className="text-xs bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5 text-gray-700">{l}</span>
            ))}
          </div>
        </section>

        {/* ── Officials by tier ─────────────────────────────────────────── */}
        {byTier.map(group => (
          <section key={group.tier} className="mb-8">
            <SectionHeader>{group.tier} ({group.officials.length})</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {group.officials.map(o => (
                <Link
                  key={o.id}
                  href={`/officials/${o.id}`}
                  className="flex items-center gap-3 border border-gray-100 rounded-lg px-3 py-2.5 hover:border-green-200 hover:bg-green-50 transition-colors"
                >
                  {o.photo_url ? (
                    <Image src={o.photo_url} alt={o.full_name} width={32} height={32} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0" style={{ background: color }}>
                      {o.full_name.split(' ').slice(0, 2).map(n => n[0]).join('')}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{o.full_name}</p>
                    <p className="text-xs text-gray-400 truncate">{o.offices?.title}{o.states?.name ? ` · ${o.states.name}` : ''}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {allOfficials.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-400">No verified officials on record for this party yet.</div>
        )}

        <p className="text-xs text-gray-400 mt-4">
          Party profiles are for civic education. Information based on published party constitutions,
          manifestos, and publicly available records. INEC is the authoritative source for party registration.
        </p>
      </div>
    </main>
  )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
      {children} <span className="flex-1 border-t border-gray-100" />
    </h2>
  )
}
