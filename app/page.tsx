import { getReferenceData, getOfficials } from '@/lib/queries'
import DirectoryClient from '@/components/DirectoryClient'
import ElectionCountdown from '@/components/ElectionCountdown'
import Link from 'next/link'

// Revalidate the page once per hour; a deploy always busts the cache too
export const revalidate = 3600

export default async function HomePage() {
  const [refs, officials] = await Promise.all([
    getReferenceData(),
    getOfficials(),
  ])

  const federalCount = officials.filter(o => o.offices?.level === 'Federal').length
  const stateCount   = officials.filter(o => o.offices?.level === 'State').length
  const femaleCount  = officials.filter(o => o.gender === 'Female').length

  // Find the nearest upcoming election date
  const now = new Date()
  const nextElection = officials
    .map(o => o.next_election_date)
    .filter((d): d is string => !!d)
    .map(d => new Date(d))
    .filter(d => d > now)
    .sort((a, b) => a.getTime() - b.getTime())[0]

  const nextElectionStr = nextElection?.toISOString().split('T')[0] ?? null

  return (
    <main className="min-h-screen bg-white">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Nigeria flag */}
            <div className="flex h-4 overflow-hidden rounded-sm border border-gray-200">
              <div className="w-2 bg-green-800" />
              <div className="w-2 bg-white" />
              <div className="w-2 bg-green-800" />
            </div>
            <span className="text-base font-semibold text-green-800 tracking-tight">
              WhoRepresentsMe<span className="text-gray-400">.ng</span>
            </span>
          </div>
          <div className="flex gap-2">
            <Link
              href="/find"
              className="text-xs sm:text-sm text-white bg-green-800 rounded px-2.5 sm:px-3 py-2 hover:bg-green-700 transition-colors"
            >
              Find my reps
            </Link>
            <Link
              href="/contribute"
              className="hidden sm:inline-block text-sm text-green-700 border border-green-200 rounded px-3 py-2 hover:bg-green-50 transition-colors"
            >
              Submit an official
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* ── Page intro ─────────────────────────────────────────────────── */}
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-gray-900">Nigeria Elected Officials Directory</h1>
          <p className="text-sm text-gray-500 mt-1">
            A public, open-source registry of every elected office in Nigeria.
          </p>
        </div>

        {/* ── Next election countdown ────────────────────────────────────── */}
        {nextElectionStr && (
          <div className="mb-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-green-50 border border-green-100 rounded-lg px-4 sm:px-5 py-4">
            <ElectionCountdown date={nextElectionStr} size="lg" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-1">Next election is approaching</p>
              <p className="text-xs text-gray-500 mb-2">
                Make sure you're registered and know who represents you.
              </p>
              <div className="flex gap-2">
                <Link href="/find" className="text-xs bg-green-800 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors">
                  Find my reps
                </Link>
                <Link href="/voter-guide" className="text-xs text-green-700 border border-green-200 px-3 py-1.5 rounded-md hover:bg-green-100 transition-colors">
                  Voter guide
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── Summary stats ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-6">
          <StatCard label="Federal officials" value={federalCount} />
          <StatCard label="State officials"   value={stateCount} />
          <StatCard label="Female officials"  value={femaleCount} />
        </div>

        {/* ── Voter education CTAs ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <Link href="/find" className="bg-green-50 border border-green-100 rounded-lg px-4 py-4 hover:bg-green-100 transition-colors group">
            <p className="text-sm font-semibold text-green-800 mb-1">Find my representatives</p>
            <p className="text-xs text-green-600">Select your state to see who represents you at every level of government.</p>
          </Link>
          <Link href="/voter-guide" className="bg-green-50 border border-green-100 rounded-lg px-4 py-4 hover:bg-green-100 transition-colors group">
            <p className="text-sm font-semibold text-green-800 mb-1">Voter registration guide</p>
            <p className="text-xs text-green-600">How to register, what to bring, and what to expect on election day.</p>
          </Link>
        </div>

        {/* ── Phase banner ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-lg px-4 py-2.5 mb-5 text-sm">
          <span className="text-green-800">
            Phase 1 · Federal &amp; State offices
          </span>
          <span className="text-green-600 text-xs">
            {officials.length} of ~1,570 seats catalogued
          </span>
        </div>

        {/* ── Interactive directory ───────────────────────────────────────── */}
        <DirectoryClient
          initialOfficials={officials}
          states={refs.states}
          parties={refs.parties}
          offices={refs.offices}
        />
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 mt-12 px-4 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span>WhoRepresentsMe.ng · Open data · Nigeria</span>
          <div className="flex gap-4">
            <Link href="/find" className="hover:text-gray-600">Find my reps</Link>
            <Link href="/voter-guide" className="hover:text-gray-600">Voter guide</Link>
            <Link href="/contribute" className="hover:text-gray-600">Contribute data</Link>
            <a href="https://inec.gov.ng" target="_blank" rel="noreferrer" className="hover:text-gray-600">INEC</a>
          </div>
        </div>
      </footer>
    </main>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  )
}
