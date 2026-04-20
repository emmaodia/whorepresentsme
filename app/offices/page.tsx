import Link from 'next/link'
import { ELECTIVE_OFFICES, getOfficesByLevel, LEVEL_LABELS } from '@/lib/data/elective-offices'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nigerian Elective Offices — WhoRepresentsMe.ng',
  description: 'Understand every elected office in Nigeria — roles, qualifications, powers, and how they relate to each other.',
}

const LEVEL_ORDER = ['Federal', 'State', 'Local'] as const

export default function OfficesPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-base font-semibold text-green-800 tracking-tight">
            WhoRepresentsMe<span className="text-gray-400">.ng</span>
          </Link>
          <Link href="/run-for-office" className="text-sm text-green-700 border border-green-200 rounded px-3 py-1.5 hover:bg-green-50 transition-colors">
            How to run for office →
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-6 block">← Back</Link>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Nigerian Elective Offices</h1>
        <p className="text-sm text-gray-500 mb-8 max-w-2xl">
          Nigeria has three tiers of elected government — Federal, State, and Local Government. Here is every
          elective office, what it does, and what it takes to qualify.
        </p>

        {LEVEL_ORDER.map(level => {
          const offices = getOfficesByLevel(level)
          return (
            <section key={level} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  {LEVEL_LABELS[level]}
                </h2>
                <div className="flex-1 border-t border-gray-100" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {offices.map(o => (
                  <Link
                    key={o.slug}
                    href={`/offices/${o.slug}`}
                    className="group border border-gray-100 rounded-xl p-4 hover:border-green-200 hover:bg-green-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-green-800">
                        {o.shortTitle}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 whitespace-nowrap">
                        {o.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">{o.summary.split('.')[0]}.</p>
                    <div className="flex gap-3 text-[11px] text-gray-400">
                      <span>{o.termYears}-yr term</span>
                      <span>·</span>
                      <span>{o.seats.toLocaleString()} seat{o.seats !== 1 ? 's' : ''}</span>
                      {o.seatsNote && <span className="hidden sm:inline">· {o.seatsNote.split(',')[0]}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        {/* CTA */}
        <div className="mt-8 bg-green-50 border border-green-100 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-green-900 mb-1">Want to run for one of these offices?</p>
            <p className="text-xs text-green-700">
              Read the step-by-step guide — from picking your office to election day.
            </p>
          </div>
          <Link
            href="/run-for-office"
            className="text-sm bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            How to run for office →
          </Link>
        </div>

        <div className="mt-6 text-xs text-gray-400">
          Information based on the Constitution of the Federal Republic of Nigeria 1999 (as amended) and the Electoral Act 2022.
          Salary figures are indicative; consult RMAFC for the latest consolidated remuneration packages.
        </div>
      </div>
    </main>
  )
}
