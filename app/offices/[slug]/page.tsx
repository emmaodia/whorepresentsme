import { getOffice, ELECTIVE_OFFICES, LEVEL_LABELS } from '@/lib/data/elective-offices'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return ELECTIVE_OFFICES.map(o => ({ slug: o.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const office = getOffice(slug)
  if (!office) return { title: 'Office | WhoRepresentsMe.ng' }
  return {
    title: `${office.shortTitle} — Nigerian Elective Office | WhoRepresentsMe.ng`,
    description: office.summary,
  }
}

export default async function OfficePage({ params }: Props) {
  const { slug } = await params
  const office = getOffice(slug)
  if (!office) notFound()

  const relatedOffices = office.relatedOffices
    .map(s => ELECTIVE_OFFICES.find(o => o.slug === s))
    .filter(Boolean) as typeof ELECTIVE_OFFICES

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-base font-semibold text-green-800 tracking-tight">
            WhoRepresentsMe<span className="text-gray-400">.ng</span>
          </Link>
          <Link href="/run-for-office" className="text-xs sm:text-sm text-green-700 border border-green-200 rounded px-3 py-1.5 hover:bg-green-50 transition-colors">
            How to run for office →
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span>/</span>
          <Link href="/offices" className="hover:text-gray-600">Elective Offices</Link>
          <span>/</span>
          <span className="text-gray-600">{office.shortTitle}</span>
        </nav>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800 uppercase tracking-wide">
              {LEVEL_LABELS[office.level]}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {office.category}
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">{office.title}</h1>
          <p className="text-sm text-gray-600 leading-relaxed">{office.summary}</p>
        </div>

        {/* ── Key facts ────────────────────────────────────────────────── */}
        <section className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <FactCard label="Term length" value={`${office.termYears} years`} note={office.termNote} />
            <FactCard label="Seats" value={office.seats.toLocaleString()} note={office.seatsNote} />
            <FactCard label="Minimum age" value={`${getMinAge(office.qualifications)} years`} />
            <FactCard label="Category" value={office.category} />
          </div>
        </section>

        {/* ── Constitutional basis ─────────────────────────────────────── */}
        <section className="mb-8">
          <SectionHeader>Constitutional basis</SectionHeader>
          <p className="text-sm text-gray-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
            {office.constitutionalBasis}
          </p>
        </section>

        {/* ── Qualifications ───────────────────────────────────────────── */}
        <section className="mb-8">
          <SectionHeader>Qualifications to stand</SectionHeader>
          <ul className="space-y-2">
            {office.qualifications.map((q, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                {q}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Responsibilities ──────────────────────────────────────────── */}
        <section className="mb-8">
          <SectionHeader>Roles and responsibilities</SectionHeader>
          <ul className="space-y-2">
            {office.responsibilities.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                {r}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Powers ───────────────────────────────────────────────────── */}
        <section className="mb-8">
          <SectionHeader>Powers</SectionHeader>
          <ul className="space-y-2">
            {office.powers.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-400 mt-0.5 flex-shrink-0">◆</span>
                {p}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Oversight ────────────────────────────────────────────────── */}
        <section className="mb-8">
          <SectionHeader>Checks and oversight</SectionHeader>
          <p className="text-xs text-gray-400 mb-3">Who holds this office accountable?</p>
          <ul className="space-y-2">
            {office.oversight.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">⚖</span>
                {o}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Salary ───────────────────────────────────────────────────── */}
        <section className="mb-8">
          <SectionHeader>Remuneration</SectionHeader>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 mb-1">{office.salary}</p>
            {office.salaryNote && (
              <p className="text-xs text-gray-500">{office.salaryNote}</p>
            )}
          </div>
        </section>

        {/* ── Election info ─────────────────────────────────────────────── */}
        <section className="mb-8">
          <SectionHeader>Election</SectionHeader>
          <div className="space-y-2">
            <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
              <span className="text-gray-400">Conducted by</span>
              <span className="text-gray-900 font-medium">{office.electionBody}</span>
            </div>
            <div className="text-sm text-gray-700 pt-1">{office.electionType}</div>
          </div>
        </section>

        {/* ── Related offices ───────────────────────────────────────────── */}
        {relatedOffices.length > 0 && (
          <section className="mb-8">
            <SectionHeader>Related offices</SectionHeader>
            <div className="flex flex-wrap gap-2">
              {relatedOffices.map(r => (
                <Link
                  key={r.slug}
                  href={`/offices/${r.slug}`}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:border-green-300 hover:bg-green-50 transition-colors text-gray-700"
                >
                  {r.shortTitle}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── CTAs ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
          <Link
            href="/run-for-office"
            className="bg-green-800 text-white rounded-xl px-5 py-4 hover:bg-green-700 transition-colors"
          >
            <p className="text-sm font-semibold mb-1">How to run for this office</p>
            <p className="text-xs text-green-200">Step-by-step guide to becoming a candidate in Nigeria.</p>
          </Link>
          <Link
            href="/"
            className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 hover:bg-gray-100 transition-colors"
          >
            <p className="text-sm font-semibold text-gray-900 mb-1">Browse current officials</p>
            <p className="text-xs text-gray-500">See who holds elected offices in Nigeria right now.</p>
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          Information based on the Constitution of the Federal Republic of Nigeria 1999 (as amended) and the Electoral Act 2022.
        </p>
      </div>
    </main>
  )
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
      {children}
      <span className="flex-1 border-t border-gray-100" />
    </h2>
  )
}

function FactCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
      {note && <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{note}</p>}
    </div>
  )
}

function getMinAge(qualifications: string[]): string {
  const match = qualifications.find(q => q.match(/at least (\d+) years? of age/i))
  if (!match) return '—'
  return match.match(/(\d+)/)?.[1] ?? '—'
}
