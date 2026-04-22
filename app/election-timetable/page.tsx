import Link from 'next/link'
import {
  getUpcomingElections,
  getPastElections,
  ELECTION_TYPE_LABELS,
  ELECTION_TYPE_COLORS,
  type ElectionEvent,
} from '@/lib/data/election-timetable'
import ElectionCountdown from '@/components/ElectionCountdown'

export const metadata = {
  title: 'Election Timetable | MyReps.ng',
  description: 'Nigeria\'s election cycle — upcoming presidential, governorship, National Assembly, and state elections.',
}

export const revalidate = 3600

export default function ElectionTimetablePage() {
  const upcoming = getUpcomingElections()
  const past = getPastElections().slice(0, 5) // most recent 5

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
            <Link href="/find" className="text-green-700 border border-green-200 rounded px-2.5 sm:px-3 py-2 hover:bg-green-50 transition-colors">
              Find my reps
            </Link>
            <Link href="/voter-guide" className="text-gray-500 hover:text-gray-700 py-2">
              Voter guide
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Election Timetable</h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Nigeria's upcoming elections — presidential, governorship, National Assembly, and state polls.
          </p>
        </div>

        {/* ── Next election countdown ─────────────────────────────────── */}
        {upcoming.length > 0 && <NextElectionHero event={upcoming[0]} />}

        {/* ── Upcoming timeline ───────────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Upcoming elections</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No upcoming elections scheduled.</p>
          ) : (
            <ol className="relative border-l-2 border-gray-100 ml-3 space-y-6">
              {upcoming.map(event => (
                <TimelineItem key={`${event.date}-${event.type}-${event.scope}`} event={event} />
              ))}
            </ol>
          )}
        </section>

        {/* ── Recent past elections ───────────────────────────────────── */}
        {past.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Recent elections</h2>
            <div className="space-y-3">
              {past.map(event => (
                <PastCard key={`${event.date}-${event.type}-${event.scope}`} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* ── Disclaimer ──────────────────────────────────────────────── */}
        <div className="mt-10 bg-amber-50 border border-amber-100 rounded-lg p-4 text-xs text-amber-800">
          <p className="font-semibold mb-1">About these dates</p>
          <p className="leading-relaxed">
            Elections marked "Projected" are based on historical patterns and constitutional timing rules.
            INEC publishes the official election timetable ~18 months before each cycle.
            Refer to{' '}
            <a href="https://inecnigeria.org" target="_blank" rel="noreferrer" className="underline">inecnigeria.org</a>{' '}
            for confirmed dates.
          </p>
        </div>

        {/* ── CTAs ────────────────────────────────────────────────────── */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/find" className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 hover:bg-green-100 transition-colors text-center">
            <p className="text-sm font-semibold text-green-800">Find my reps</p>
            <p className="text-xs text-green-600 mt-0.5">See who represents you</p>
          </Link>
          <Link href="/polling-units" className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 hover:bg-green-100 transition-colors text-center">
            <p className="text-sm font-semibold text-green-800">Polling unit</p>
            <p className="text-xs text-green-600 mt-0.5">Where you vote</p>
          </Link>
          <Link href="/voter-guide" className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 hover:bg-green-100 transition-colors text-center">
            <p className="text-sm font-semibold text-green-800">Voter guide</p>
            <p className="text-xs text-green-600 mt-0.5">Register and prepare</p>
          </Link>
        </div>
      </div>
    </main>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NextElectionHero({ event }: { event: ElectionEvent }) {
  const colors = ELECTION_TYPE_COLORS[event.type]

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-lg p-6`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${colors.border} ${colors.bg} ${colors.text} uppercase tracking-wide`}>
          {ELECTION_TYPE_LABELS[event.type]}
        </span>
        {event.projected && (
          <span className="text-[10px] font-medium bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
            Projected
          </span>
        )}
      </div>
      <h2 className={`text-xl font-bold ${colors.text} mb-1`}>{event.title}</h2>
      <p className="text-sm text-gray-600 mb-4">{event.description}</p>
      <div className="flex items-center gap-3 flex-wrap">
        <ElectionCountdown date={event.date} size="md" />
        <span className="text-xs text-gray-500">Scope: <strong className="text-gray-700">{event.scope}</strong></span>
      </div>
    </div>
  )
}

function TimelineItem({ event }: { event: ElectionEvent }) {
  const colors = ELECTION_TYPE_COLORS[event.type]
  const dateStr = new Date(event.date).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <li className="pl-6 relative">
      <span className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full ${colors.bg} border-2 ${colors.border}`} />
      <div className="flex flex-wrap items-baseline gap-2 mb-1">
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${colors.border} ${colors.bg} ${colors.text} uppercase tracking-wide`}>
          {ELECTION_TYPE_LABELS[event.type]}
        </span>
        {event.projected && (
          <span className="text-[10px] font-medium bg-amber-50 border border-amber-200 text-amber-700 px-1.5 py-0.5 rounded-full">
            Projected
          </span>
        )}
        <span className="text-xs text-gray-400">{dateStr}</span>
      </div>
      <h3 className="text-sm font-semibold text-gray-900 leading-tight">{event.title}</h3>
      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{event.description}</p>
      <div className="mt-2">
        <ElectionCountdown date={event.date} size="sm" />
      </div>
    </li>
  )
}

function PastCard({ event }: { event: ElectionEvent }) {
  const dateStr = new Date(event.date).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase tracking-wide">
          {ELECTION_TYPE_LABELS[event.type]}
        </span>
        <span className="text-xs text-gray-400">{dateStr}</span>
      </div>
      <h3 className="text-sm text-gray-600 mt-1">{event.title}</h3>
    </div>
  )
}
