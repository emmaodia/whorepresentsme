import { getReferenceData, getOfficials } from '@/lib/queries'
import DirectoryClient from '@/components/DirectoryClient'
import ElectionCountdown from '@/components/ElectionCountdown'
import { getNextElection, ELECTION_TYPE_LABELS } from '@/lib/data/election-timetable'
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

  // Get the next upcoming election from the official timetable
  const nextElection = getNextElection()

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
              MyReps<span className="text-gray-400">.ng</span>
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
        {nextElection && (
          <div className="mb-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-green-50 border border-green-100 rounded-lg px-4 sm:px-5 py-4">
            <ElectionCountdown date={nextElection.date} size="lg" />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-medium bg-white border border-green-200 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  {ELECTION_TYPE_LABELS[nextElection.type]}
                </span>
                <span className="text-[10px] text-gray-400">{nextElection.scope}</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">{nextElection.title}</p>
              <p className="text-xs text-gray-500 mb-3">
                Make sure you're registered and know who represents you.
              </p>
              <div className="flex gap-2 justify-center sm:justify-start flex-wrap">
                <Link href="/election-timetable" className="text-xs bg-green-800 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors">
                  View timetable
                </Link>
                <Link href="/find" className="text-xs text-green-700 border border-green-200 px-3 py-1.5 rounded-md hover:bg-green-100 transition-colors">
                  Find my reps
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">

          <Link href="/find" className="bg-green-50 border border-green-100 rounded-lg px-4 py-4 hover:bg-green-100 transition-colors">
            <p className="text-sm font-semibold text-green-800 mb-1">Find my representatives</p>
            <p className="text-xs text-green-600">See who represents you at every level of government.</p>
          </Link>
          <Link href="/polling-units" className="bg-green-50 border border-green-100 rounded-lg px-4 py-4 hover:bg-green-100 transition-colors">
            <p className="text-sm font-semibold text-green-800 mb-1">Find my polling unit</p>
            <p className="text-xs text-green-600">Look up where you vote — 176,846 polling units indexed.</p>
          </Link>
          <Link href="/voter-registration" className="bg-green-50 border border-green-100 rounded-lg px-4 py-4 hover:bg-green-100 transition-colors">
            <p className="text-sm font-semibold text-green-800 mb-1">Voter registration & PVC</p>
            <p className="text-xs text-green-600">Find your nearest INEC office — all 774 LGA offices listed.</p>
          </Link>
          <Link href="/constituency" className="bg-green-50 border border-green-100 rounded-lg px-4 py-4 hover:bg-green-100 transition-colors">
            <p className="text-sm font-semibold text-green-800 mb-1">Find my constituency</p>
            <p className="text-xs text-green-600">Discover every constituency covering your location — and which offices you can run for.</p>
          </Link>
          <Link href="/offices" className="bg-green-50 border border-green-100 rounded-lg px-4 py-4 hover:bg-green-100 transition-colors">
            <p className="text-sm font-semibold text-green-800 mb-1">Nigerian elective offices</p>
            <p className="text-xs text-green-600">Roles, powers, and qualifications for every elected office.</p>
          </Link>
          <Link href="/run-for-office" className="bg-green-50 border border-green-100 rounded-lg px-4 py-4 hover:bg-green-100 transition-colors col-span-2 sm:col-span-1">
            <p className="text-sm font-semibold text-green-800 mb-1">How to run for office</p>
            <p className="text-xs text-green-600">Party primaries, INEC nomination, campaign finance.</p>
          </Link>
          <Link href="/representation" className="bg-green-50 border border-green-100 rounded-lg px-4 py-4 hover:bg-green-100 transition-colors">
            <p className="text-sm font-semibold text-green-800 mb-1">Women & youth in politics</p>
            <p className="text-xs text-green-600">Data on gender and age across every tier of government.</p>
          </Link>
          <Link href="/parties" className="bg-green-50 border border-green-100 rounded-lg px-4 py-4 hover:bg-green-100 transition-colors">
            <p className="text-sm font-semibold text-green-800 mb-1">Political party profiles</p>
            <p className="text-xs text-green-600">History, ideology, and seat counts for APC, PDP, LP, and more.</p>
          </Link>
          <Link href="/states" className="bg-green-50 border border-green-100 rounded-lg px-4 py-4 hover:bg-green-100 transition-colors">
            <p className="text-sm font-semibold text-green-800 mb-1">Browse by state</p>
            <p className="text-xs text-green-600">All 36 states and FCT — governors, senators, and assembly members.</p>
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
          <span>MyReps.ng · Open data · Nigeria</span>
          <div className="flex gap-4">
            <Link href="/find" className="hover:text-gray-600">Find my reps</Link>
            <Link href="/polling-units" className="hover:text-gray-600">Polling units</Link>
            <Link href="/election-timetable" className="hover:text-gray-600">Timetable</Link>
            <Link href="/voter-guide" className="hover:text-gray-600">Voter guide</Link>
            <Link href="/voter-registration" className="hover:text-gray-600">Register to vote</Link>
            <Link href="/constituency" className="hover:text-gray-600">My constituency</Link>
            <Link href="/states" className="hover:text-gray-600">States</Link>
            <Link href="/parties" className="hover:text-gray-600">Parties</Link>
            <Link href="/representation" className="hover:text-gray-600">Representation</Link>
            <Link href="/offices" className="hover:text-gray-600">Offices</Link>
            <Link href="/run-for-office" className="hover:text-gray-600">Run for office</Link>
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
