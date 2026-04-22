import { getOfficial } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ElectionCountdown from '@/components/ElectionCountdown'
import ScorecardBadges from '@/components/ScorecardBadges'
import ShareButtons from '@/components/ShareButtons'
import { getSlugForOfficeTitle } from '@/lib/data/elective-offices'
import type { Metadata } from 'next'

export const revalidate = 3600

interface Props {
  params: Promise<{ id: string }>
}

function calcAgeNum(dob?: string | null) {
  if (!dob) return null
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

function daysUntilNum(dateStr?: string | null) {
  if (!dateStr) return null
  const target = new Date(dateStr)
  const diff = Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const o = await getOfficial(id)
    const title = `${o.full_name} — ${o.offices?.title ?? 'Official'} | MyReps.ng`
    const description = [
      o.offices?.title,
      o.constituency,
      o.states?.name,
      o.parties?.abbreviation,
    ].filter(Boolean).join(' · ')

    const ogParams = new URLSearchParams({
      name: o.full_name,
      office: o.offices?.title ?? '',
      constituency: o.constituency ?? '',
      party: o.parties?.abbreviation ?? '',
      partyColor: o.parties?.color_hex ?? '',
      state: o.states?.name ?? '',
      photo: o.photo_url ?? '',
      age: String(calcAgeNum(o.date_of_birth) ?? ''),
      electionDays: String(daysUntilNum(o.next_election_date) ?? ''),
    })

    const ogImageUrl = `/api/og?${ogParams.toString()}`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImageUrl],
      },
    }
  } catch {
    return { title: 'Official | MyReps.ng' }
  }
}

export default async function OfficialPage({ params }: Props) {
  const { id } = await params
  let official
  try {
    official = await getOfficial(id)
  } catch {
    notFound()
  }

  const { parties: party, offices: office, states: state } = official
  const officeSlug = getSlugForOfficeTitle(office?.title)

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-base font-semibold text-green-800 tracking-tight">
            MyReps<span className="text-gray-400">.ng</span>
          </Link>
          <Link href="/contribute" className="text-sm text-green-700 border border-green-200 rounded px-3 py-1.5 hover:bg-green-50 transition-colors">
            Submit an official
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-6 block">
          ← Back to directory
        </Link>

        {/* ── Identity ──────────────────────────────────────────────────── */}
        <div className="flex items-start gap-4 mb-6">
          {official.photo_url ? (
            <Image
              src={official.photo_url}
              alt={official.full_name}
              width={72}
              height={72}
              className="rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-lg font-semibold text-green-800 shrink-0">
              {official.full_name.split(' ').slice(0, 2).map(n => n[0]).join('')}
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold text-gray-900 leading-tight">{official.full_name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {office?.title}
              {official.constituency ? ` · ${official.constituency}` : ''}
            </p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {party && (
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ background: `${party.color_hex}22`, color: party.color_hex }}
                >
                  {party.abbreviation}
                </span>
              )}
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {office?.level}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {office?.category}
              </span>
            </div>
          </div>
        </div>

        {/* ── Election countdown ──────────────────────────────────────── */}
        {official.next_election_date && (
          <div className="mb-6">
            <ElectionCountdown date={official.next_election_date} size="lg" />
          </div>
        )}

        {/* ── Scorecard ──────────────────────────────────────────────────── */}
        {(official.bills_sponsored != null || official.motions_moved != null || official.attendance_pct != null) && (
          <section className="mb-6">
            <h2 className="text-xs text-gray-400 uppercase tracking-wide mb-2">Legislative scorecard</h2>
            <ScorecardBadges
              billsSponsored={official.bills_sponsored}
              motionsMoved={official.motions_moved}
              attendancePct={official.attendance_pct}
              size="md"
            />
          </section>
        )}

        {/* ── Details grid ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-6">
          <InfoCard label="Gender"         value={official.gender} />
          <InfoCard label="Age"            value={calcAge(official.date_of_birth)} />
          <InfoCard label="State"          value={state?.name ?? 'Federal'} />
          <InfoCard label="Party"          value={party?.name} />
          <InfoCard label="Term start"     value={fmtDate(official.term_start)} />
          <InfoCard label="Term end"       value={fmtDate(official.term_end)} />
        </div>

        {/* ── Bio ───────────────────────────────────────────────────────── */}
        {official.bio && (
          <section className="mb-6">
            <h2 className="text-xs text-gray-400 uppercase tracking-wide mb-2">Biography</h2>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">
              {official.bio}
            </p>
          </section>
        )}

        {/* ── Contact ───────────────────────────────────────────────────── */}
        <section className="mb-6">
          <h2 className="text-xs text-gray-400 uppercase tracking-wide mb-2">
            Official contact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {official.phone && (
              <ContactRow label="Phone" value={official.phone} href={`tel:${official.phone}`} />
            )}
            {official.official_email && (
              <ContactRow label="Email" value={official.official_email} href={`mailto:${official.official_email}`} />
            )}
            {official.official_website && (
              <ContactRow label="Website" value={official.official_website} href={`https://${official.official_website}`} />
            )}
            {official.twitter_handle && (
              <ContactRow label="Twitter" value={`@${official.twitter_handle}`} href={`https://twitter.com/${official.twitter_handle}`} />
            )}
            {!official.phone && !official.official_email && !official.official_website && !official.twitter_handle && (
              <p className="text-sm text-gray-400 col-span-2">
                No contact details on record.{' '}
                <Link href={`/contribute?official=${official.id}`} className="text-green-700 hover:underline">
                  Help us add them.
                </Link>
              </p>
            )}
          </div>
        </section>

        {/* ── Contact & accountability ──────────────────────────────────── */}
        {(official.official_email || official.twitter_handle || official.phone) && (
          <section className="mb-6">
            <h2 className="text-xs text-gray-400 uppercase tracking-wide mb-3">Hold them accountable</h2>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-3">
                Use the message below or write your own — then send it via email, Twitter, or WhatsApp.
              </p>
              <textarea
                readOnly
                className="w-full text-sm text-gray-700 bg-white border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-green-700 mb-3"
                rows={4}
                defaultValue={`Dear ${official.full_name},\n\nAs your constituent in ${official.constituency ?? official.states?.name ?? 'your constituency'}, I am writing to request an update on your activities in office and how you are serving the people who elected you.\n\nPlease share your recent legislative/executive actions and how we can stay informed.\n\nThank you.`}
              />
              <div className="flex gap-2 flex-wrap">
                {official.official_email && (
                  <a
                    href={`mailto:${official.official_email}?subject=Message from your constituent&body=Dear ${encodeURIComponent(official.full_name)},%0A%0AAs your constituent...`}
                    className="text-xs bg-green-800 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Send email
                  </a>
                )}
                {official.twitter_handle && (
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`@${official.twitter_handle} As your constituent in ${official.constituency ?? official.states?.name ?? 'your constituency'}, I'd like to know how you are serving us. #NigeriaAccountability`)}`}
                    target="_blank" rel="noreferrer"
                    className="text-xs border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Tweet @{official.twitter_handle}
                  </a>
                )}
                {official.phone && (
                  <a
                    href={`https://wa.me/${official.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Dear ${official.full_name}, as your constituent I am writing to request an update on your activities in office.`)}`}
                    target="_blank" rel="noreferrer"
                    className="text-xs border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Share ──────────────────────────────────────────────────────── */}
        <section className="mb-6">
          <ShareButtons
            url={`/officials/${official.id}`}
            text={`${official.full_name} — ${office?.title ?? 'Official'}${official.constituency ? `, ${official.constituency}` : ''}${state?.name ? ` (${state.name})` : ''} | MyReps.ng`}
          />
        </section>

        {/* ── Office info link ──────────────────────────────────────────── */}
        {officeSlug && (
          <div className="mb-6 bg-green-50 border border-green-100 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-xs text-green-800">
              Want to know more about the role of {office?.title}?
            </p>
            <Link
              href={`/offices/${officeSlug}`}
              className="text-xs text-green-700 border border-green-200 bg-white rounded px-3 py-1.5 hover:bg-green-100 transition-colors whitespace-nowrap"
            >
              About this office →
            </Link>
          </div>
        )}

        {/* ── Footer meta ───────────────────────────────────────────────── */}
        <div className="border-t border-gray-100 pt-4 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-gray-400">
            Last updated:{' '}
            {new Date(official.updated_at).toLocaleDateString('en-NG', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
            {official.source_url && (
              <>
                {' · '}
                <a href={official.source_url} target="_blank" rel="noreferrer" className="hover:underline">
                  Source
                </a>
              </>
            )}
          </p>
          <Link
            href={`/contribute?official=${official.id}`}
            className="text-xs text-green-700 border border-green-200 rounded px-3 py-1.5 hover:bg-green-50 transition-colors"
          >
            Suggest a correction
          </Link>
        </div>
      </div>
    </main>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoCard({ label, value, highlight }: { label: string; value?: string | null; highlight?: boolean }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-sm font-medium ${highlight ? 'text-green-700' : 'text-gray-800'}`}>
        {value ?? '—'}
      </p>
    </div>
  )
}

function ContactRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2">
      <span className="text-xs text-gray-400">{label}</span>
      <a href={href} target="_blank" rel="noreferrer"
        className="text-sm text-green-700 hover:underline truncate ml-2">
        {value}
      </a>
    </div>
  )
}

function calcAge(dob?: string | null) {
  if (!dob) return null
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return `${age} years`
}

function fmtDate(d?: string | null) {
  if (!d) return null
  return new Date(d).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}
