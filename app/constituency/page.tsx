import { getReferenceData } from '@/lib/queries'
import ConstituencyLookupClient from '@/components/ConstituencyLookupClient'
import Link from 'next/link'
import type { Metadata } from 'next'
import { STATES_WITH_ASSEMBLY_DATA } from '@/lib/data/state-assembly-map'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Find Your Constituency — MyReps.ng',
  description: 'Enter your address or LGA to see every constituency that covers your area — senatorial, federal, state assembly, and LGA — and find the offices you can run for.',
}

export default async function ConstituencyPage() {
  const { states } = await getReferenceData()

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-4 overflow-hidden rounded-sm border border-gray-200">
              <div className="w-2 bg-green-800" />
              <div className="w-2 bg-white" />
              <div className="w-2 bg-green-800" />
            </div>
            <span className="text-base font-semibold text-green-800 tracking-tight">
              MyReps<span className="text-gray-400">.ng</span>
            </span>
          </Link>
          <div className="flex gap-2 text-xs">
            <Link href="/find" className="text-green-700 border border-green-200 rounded px-3 py-1.5 hover:bg-green-50 transition-colors">
              Find my reps
            </Link>
            <Link href="/run-for-office" className="hidden sm:block text-gray-500 border border-gray-200 rounded px-3 py-1.5 hover:bg-gray-50 transition-colors">
              Run for office
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span>/</span>
          <span className="text-gray-600">Find my constituency</span>
        </nav>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Find your constituency</h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
            Enter your address or select your state and LGA to see every constituency
            your location falls under — from your senatorial district down to your LGA.
            Switch tabs to see the offices you can run for.
          </p>
        </div>

        {/* ── Lookup widget ─────────────────────────────────────────────── */}
        <ConstituencyLookupClient
          states={states}
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        />

        {/* ── Coverage note ─────────────────────────────────────────────── */}
        <div className="mt-10 border-t border-gray-100 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Data coverage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <CoverageItem
              label="Senatorial Districts (109)"
              status="complete"
              detail="All 36 states + FCT — fully mapped to LGAs"
            />
            <CoverageItem
              label="Federal Constituencies (360)"
              status="partial"
              detail="~70% mapped; remaining LGAs are being verified"
            />
            <CoverageItem
              label="State Assembly (~993 seats)"
              status="partial"
              detail={`${STATES_WITH_ASSEMBLY_DATA.length} states mapped: ${STATES_WITH_ASSEMBLY_DATA.slice(0, 5).join(', ')}${STATES_WITH_ASSEMBLY_DATA.length > 5 ? ', ...' : ''}`}
            />
            <CoverageItem
              label="LGAs (774)"
              status="complete"
              detail="All 774 LGAs across 36 states + FCT indexed"
            />
            <CoverageItem
              label="Wards / Councillor seats"
              status="coming"
              detail="Ward-level mapping in progress"
            />
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Data sourced from INEC constituency delineation schedules.{' '}
            <Link href="/contribute" className="text-green-700 hover:underline">
              Help us fill the gaps →
            </Link>
          </p>
        </div>

        {/* ── Related tools ─────────────────────────────────────────────── */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/find" className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 hover:bg-gray-100 transition-colors">
            <p className="text-sm font-semibold text-gray-900 mb-1">Find my representatives</p>
            <p className="text-xs text-gray-500">See who currently holds your elected offices.</p>
          </Link>
          <Link href="/offices" className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 hover:bg-gray-100 transition-colors">
            <p className="text-sm font-semibold text-gray-900 mb-1">About elective offices</p>
            <p className="text-xs text-gray-500">Powers, qualifications, and salaries for every office.</p>
          </Link>
          <Link href="/run-for-office" className="bg-green-50 border border-green-100 rounded-xl px-4 py-4 hover:bg-green-100 transition-colors">
            <p className="text-sm font-semibold text-green-800 mb-1">How to run for office</p>
            <p className="text-xs text-green-600">Party primaries, INEC filing, and campaign rules.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}

function CoverageItem({
  label,
  status,
  detail,
}: {
  label: string
  status: 'complete' | 'partial' | 'coming'
  detail: string
}) {
  const badge = {
    complete: { text: 'Complete', cls: 'bg-green-100 text-green-700' },
    partial:  { text: 'Partial',  cls: 'bg-amber-100 text-amber-700' },
    coming:   { text: 'Coming',   cls: 'bg-gray-100 text-gray-500' },
  }[status]

  return (
    <div className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-0.5 whitespace-nowrap ${badge.cls}`}>
        {badge.text}
      </span>
      <div>
        <p className="text-xs font-medium text-gray-700">{label}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{detail}</p>
      </div>
    </div>
  )
}
