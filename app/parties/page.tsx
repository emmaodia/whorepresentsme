import { getOfficials, getReferenceData } from '@/lib/queries'
import { getPartyInfo, PARTY_INFO } from '@/lib/data/parties-info'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Nigerian Political Parties — MyReps.ng',
  description: 'Profiles of registered Nigerian political parties — history, ideology, and how many elected officials each party holds.',
}

export default async function PartiesPage() {
  const [officials, { parties }] = await Promise.all([
    getOfficials(),
    getReferenceData(),
  ])

  // Count officials per party
  const countMap = new Map<string, number>()
  const femaleMap = new Map<string, number>()
  for (const o of officials) {
    const abbr = o.parties?.abbreviation
    if (!abbr) continue
    countMap.set(abbr, (countMap.get(abbr) ?? 0) + 1)
    if (o.gender === 'Female') femaleMap.set(abbr, (femaleMap.get(abbr) ?? 0) + 1)
  }

  const partyList = parties
    .map(p => ({
      ...p,
      count: countMap.get(p.abbreviation) ?? 0,
      female: femaleMap.get(p.abbreviation) ?? 0,
      info: getPartyInfo(p.abbreviation),
    }))
    .filter(p => p.count > 0)
    .sort((a, b) => b.count - a.count)

  const withProfile = partyList.filter(p => p.info)
  const withoutProfile = partyList.filter(p => !p.info)

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-base font-semibold text-green-800 tracking-tight">
            MyReps<span className="text-gray-400">.ng</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">Full directory →</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span>/</span>
          <span className="text-gray-600">Political Parties</span>
        </nav>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Nigerian Political Parties</h1>
        <p className="text-sm text-gray-500 mb-8 max-w-2xl">
          Every party that holds elected office in our directory, with seat counts
          and detailed profiles for major parties.
        </p>

        {/* ── Parties with full profiles ─────────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
            Major parties <span className="flex-1 border-t border-gray-100" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {withProfile.map(p => (
              <Link
                key={p.id}
                href={`/parties/${p.info!.slug}`}
                className="group border border-gray-100 rounded-xl p-5 hover:border-green-200 hover:bg-green-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-sm font-bold px-2 py-0.5 rounded"
                        style={{ background: `${p.color_hex}22`, color: p.color_hex }}
                      >
                        {p.abbreviation}
                      </span>
                      <span className="text-[10px] text-gray-400">Est. {p.info!.founded}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 group-hover:text-green-800 leading-tight">{p.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-semibold text-gray-900">{p.count}</p>
                    <p className="text-[10px] text-gray-400">officials</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{p.info!.summary.split('.')[0]}.</p>
                <div className="flex gap-2 flex-wrap">
                  {p.info!.ideology.slice(0, 2).map((tag: string) => (
                    <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                {p.female > 0 && (
                  <p className="text-[11px] text-green-700 mt-2">{p.female} female official{p.female !== 1 ? 's' : ''}</p>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Other parties ─────────────────────────────────────────── */}
        {withoutProfile.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
              Other parties in directory <span className="flex-1 border-t border-gray-100" />
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {withoutProfile.map(p => (
                <div
                  key={p.id}
                  className="border border-gray-100 rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded"
                      style={{ background: `${p.color_hex}22`, color: p.color_hex }}
                    >
                      {p.abbreviation}
                    </span>
                    <span className="text-xs text-gray-600 truncate">{p.name}</span>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-2">{p.count}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="text-xs text-gray-400">
          Only parties with verified officials in our directory are shown. INEC registers all
          recognised political parties at{' '}
          <a href="https://inec.gov.ng" target="_blank" rel="noreferrer" className="text-green-700 hover:underline">
            inec.gov.ng
          </a>.
        </p>
      </div>
    </main>
  )
}
