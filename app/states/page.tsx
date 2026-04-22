import { getStatesAdmin, getOfficialsByStateId } from '@/lib/queries'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Nigerian States — MyReps.ng',
  description: 'Browse elected officials by state — all 36 states and the FCT. Governors, senators, HOR members, and state assembly representatives.',
}

const ZONE_ORDER = ['North West', 'North East', 'North Central', 'South West', 'South East', 'South South']

export default async function StatesPage() {
  const states = await getStatesAdmin()

  // Group by geopolitical zone
  const byZone = ZONE_ORDER.map(zone => ({
    zone,
    states: states.filter(s => s.zone === zone).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter(g => g.states.length > 0)

  // FCT and any unzoned states
  const unzoned = states.filter(s => !s.zone || !ZONE_ORDER.includes(s.zone))

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-base font-semibold text-green-800 tracking-tight">
            MyReps<span className="text-gray-400">.ng</span>
          </Link>
          <div className="flex gap-2 text-xs">
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
          <span className="text-gray-600">States</span>
        </nav>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Nigerian States</h1>
        <p className="text-sm text-gray-500 mb-8 max-w-2xl">
          Browse elected officials by state — governors, senators, federal and state legislators.
          All 36 states and the Federal Capital Territory.
        </p>

        {/* ── Zones ─────────────────────────────────────────────────────── */}
        {byZone.map(group => (
          <section key={group.zone} className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
              {group.zone} <span className="flex-1 border-t border-gray-100" />
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {group.states.map(s => (
                <Link
                  key={s.id}
                  href={`/states/${s.slug}`}
                  className="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-3 hover:border-green-200 hover:bg-green-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center text-xs font-bold text-green-800 shrink-0">
                    {s.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{s.name}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* ── FCT / unzoned ─────────────────────────────────────────────── */}
        {unzoned.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
              Federal Capital Territory <span className="flex-1 border-t border-gray-100" />
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {unzoned.map(s => (
                <Link
                  key={s.id}
                  href={`/states/${s.slug}`}
                  className="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-3 hover:border-green-200 hover:bg-green-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center text-xs font-bold text-green-800 shrink-0">
                    {s.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{s.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── CTAs ──────────────────────────────────────────────────────── */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/find"
            className="bg-green-50 border border-green-100 rounded-xl px-4 py-4 hover:bg-green-100 transition-colors"
          >
            <p className="text-sm font-semibold text-green-800 mb-1">Find my representatives</p>
            <p className="text-xs text-green-600">Enter your address to see who represents you at every level.</p>
          </Link>
          <Link
            href="/constituency"
            className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 hover:bg-gray-100 transition-colors"
          >
            <p className="text-sm font-semibold text-gray-900 mb-1">Find my constituency</p>
            <p className="text-xs text-gray-500">Select your state and LGA to discover all constituencies covering your area.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
