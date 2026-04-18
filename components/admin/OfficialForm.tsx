'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { State, Party, Office } from '@/lib/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  states:        State[]
  parties:       Party[]
  offices:       Office[]
  /** Pre-fill when editing an existing official */
  defaultValues?: Partial<FormData>
  /** Present = edit mode, absent = create mode */
  officialId?:   string
}

interface FormData {
  // Identity
  full_name:          string
  gender:             string
  date_of_birth:      string
  photo_url:          string
  // Office
  office_id:          string
  state_id:           string
  constituency:       string
  party_id:           string
  // Term
  term_start:         string
  term_end:           string
  next_election_date: string
  // Contact
  phone:              string
  official_email:     string
  official_website:   string
  twitter_handle:     string
  // Bio
  bio:                string
  // Verification
  source_url:         string
  verified:           boolean
}

const EMPTY: FormData = {
  full_name: '', gender: '', date_of_birth: '', photo_url: '',
  office_id: '', state_id: '', constituency: '', party_id: '',
  term_start: '', term_end: '', next_election_date: '',
  phone: '', official_email: '', official_website: '', twitter_handle: '',
  bio: '', source_url: '', verified: true,
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OfficialForm({ states, parties, offices, defaultValues, officialId }: Props) {
  const router  = useRouter()
  const isEdit  = Boolean(officialId)

  const [form,   setForm]   = useState<FormData>({ ...EMPTY, ...defaultValues })
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errors, setErrors] = useState<string[]>([])

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm(p => ({ ...p, [k]: v }))

  // Group offices by level for the <optgroup> select
  const officesByLevel = offices.reduce<Record<string, Office[]>>((acc, o) => {
    ;(acc[o.level] ??= []).push(o)
    return acc
  }, {})

  // Basic client-side validation
  const validate = (): string[] => {
    const errs: string[] = []
    if (!form.full_name.trim())  errs.push('Full name is required.')
    if (!form.office_id)         errs.push('Office is required.')
    if (!form.source_url.trim()) errs.push('Source URL is required — needed for verification.')
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (errs.length) { setErrors(errs); return }

    setStatus('loading')
    setErrors([])

    // Coerce empty strings to null and string IDs to numbers for the DB
    const payload = {
      ...form,
      office_id:          form.office_id    ? Number(form.office_id)  : null,
      state_id:           form.state_id     ? Number(form.state_id)   : null,
      party_id:           form.party_id     ? Number(form.party_id)   : null,
      date_of_birth:      form.date_of_birth      || null,
      photo_url:          form.photo_url          || null,
      constituency:       form.constituency        || null,
      term_start:         form.term_start          || null,
      term_end:           form.term_end            || null,
      next_election_date: form.next_election_date  || null,
      phone:              form.phone               || null,
      official_email:     form.official_email      || null,
      official_website:   form.official_website    || null,
      twitter_handle:     form.twitter_handle      || null,
      bio:                form.bio                 || null,
      ...(isEdit && { id: officialId }),
    }

    const res = await fetch('/api/admin/officials', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/admin/queue')
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      setErrors([data.error ?? 'Failed to save. Please try again.'])
      setStatus('idle')
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* ── Identity ───────────────────────────────────────────────────── */}
      <Section title="Identity">
        <Field label="Full name" required>
          <input
            type="text"
            value={form.full_name}
            onChange={e => set('full_name', e.target.value)}
            placeholder="e.g. Babajide Sanwo-Olu"
            className={inp()}
          />
        </Field>

        <TwoCol>
          <Field label="Gender">
            <select value={form.gender} onChange={e => set('gender', e.target.value)} className={inp()}>
              <option value="">Not specified</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </Field>
          <Field label="Date of birth">
            <input
              type="date"
              value={form.date_of_birth}
              onChange={e => set('date_of_birth', e.target.value)}
              className={inp()}
            />
          </Field>
        </TwoCol>

        <Field label="Photo URL">
          <input
            type="url"
            value={form.photo_url}
            onChange={e => set('photo_url', e.target.value)}
            placeholder="https://..."
            className={inp()}
          />
          <Hint>Direct image URL. Upload to Supabase Storage or Cloudinary first, then paste the public URL here.</Hint>
        </Field>
      </Section>

      {/* ── Office ─────────────────────────────────────────────────────── */}
      <Section title="Office & location">
        <Field label="Office" required>
          <select
            value={form.office_id}
            onChange={e => set('office_id', e.target.value)}
            className={inp()}
          >
            <option value="">Select an office</option>
            {Object.entries(officesByLevel).map(([level, list]) => (
              <optgroup key={level} label={`${level} offices`}>
                {list.map(o => (
                  <option key={o.id} value={String(o.id)}>{o.title}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>

        <TwoCol>
          <Field label="State / Territory">
            <select
              value={form.state_id}
              onChange={e => set('state_id', e.target.value)}
              className={inp()}
            >
              <option value="">None (President / VP)</option>
              {states.map(s => (
                <option key={s.id} value={String(s.id)}>{s.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Party">
            <select
              value={form.party_id}
              onChange={e => set('party_id', e.target.value)}
              className={inp()}
            >
              <option value="">Independent / not listed</option>
              {parties.map(p => (
                <option key={p.id} value={String(p.id)}>
                  {p.abbreviation} — {p.name}
                </option>
              ))}
            </select>
          </Field>
        </TwoCol>

        <Field label="Constituency">
          <input
            type="text"
            value={form.constituency}
            onChange={e => set('constituency', e.target.value)}
            placeholder="e.g. Lagos East Senatorial District"
            className={inp()}
          />
          <Hint>Leave blank for executive positions (President, Governor, etc.).</Hint>
        </Field>
      </Section>

      {/* ── Term & election ────────────────────────────────────────────── */}
      <Section title="Term & election">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Term start">
            <input
              type="date"
              value={form.term_start}
              onChange={e => set('term_start', e.target.value)}
              className={inp()}
            />
          </Field>
          <Field label="Term end">
            <input
              type="date"
              value={form.term_end}
              onChange={e => set('term_end', e.target.value)}
              className={inp()}
            />
          </Field>
          <Field label="Next election date">
            <input
              type="date"
              value={form.next_election_date}
              onChange={e => set('next_election_date', e.target.value)}
              className={inp()}
            />
          </Field>
        </div>
      </Section>

      {/* ── Contact ────────────────────────────────────────────────────── */}
      <Section title="Contact (official channels only)">
        <TwoCol>
          <Field label="Phone">
            <input
              type="tel"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="+234 9 523 0100"
              className={inp()}
            />
          </Field>
          <Field label="Official email">
            <input
              type="email"
              value={form.official_email}
              onChange={e => set('official_email', e.target.value)}
              placeholder="name@gov.ng"
              className={inp()}
            />
          </Field>
          <Field label="Official website">
            <input
              type="text"
              value={form.official_website}
              onChange={e => set('official_website', e.target.value)}
              placeholder="lagosstate.gov.ng (no https://)"
              className={inp()}
            />
          </Field>
          <Field label="Twitter / X handle">
            <input
              type="text"
              value={form.twitter_handle}
              onChange={e => set('twitter_handle', e.target.value)}
              placeholder="username (no @)"
              className={inp()}
            />
          </Field>
        </TwoCol>
        <Hint>Only add contact details that are publicly official — not personal numbers or private emails.</Hint>
      </Section>

      {/* ── Biography ──────────────────────────────────────────────────── */}
      <Section title="Biography">
        <textarea
          rows={5}
          value={form.bio}
          onChange={e => set('bio', e.target.value)}
          placeholder="2–4 sentences covering current role, background, and notable facts..."
          className={`${inp()} resize-none`}
        />
        <Hint>Keep it factual and neutral. No opinion or political framing.</Hint>
      </Section>

      {/* ── Verification ───────────────────────────────────────────────── */}
      <Section title="Verification">
        <Field label="Source URL" required>
          <input
            type="url"
            value={form.source_url}
            onChange={e => set('source_url', e.target.value)}
            placeholder="https://inec.gov.ng/... or official government / NASS source"
            className={inp()}
          />
          <Hint>
            Must be INEC, an official government page, or a credible primary source.
            This is stored for audit purposes and shown publicly on the profile.
          </Hint>
        </Field>

        <label className="flex items-start gap-2.5 cursor-pointer mt-1">
          <input
            type="checkbox"
            checked={form.verified}
            onChange={e => set('verified', e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-green-800 flex-shrink-0"
          />
          <span className="text-sm text-gray-700">
            Mark as verified and publish immediately
          </span>
        </label>

        {!form.verified && (
          <div className="bg-yellow-50 border border-yellow-100 rounded-md px-3 py-2.5 mt-2">
            <p className="text-xs text-yellow-800">
              This record will be saved in draft and will <strong>not</strong> appear publicly until you verify it.
            </p>
          </div>
        )}
      </Section>

      {/* ── Validation errors ───────────────────────────────────────────── */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="text-sm text-red-700">{err}</p>
          ))}
        </div>
      )}

      {/* ── Actions ────────────────────────────────────────────────────── */}
      <div className="flex gap-3 pb-8">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex-1 bg-green-800 text-white text-sm font-medium py-2.5 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {status === 'loading'
            ? 'Saving...'
            : isEdit ? 'Save changes' : 'Add official'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// ─── Style helpers & layout primitives ───────────────────────────────────────

const inp = () =>
  'w-full text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-green-700'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <h2 className="text-xs text-gray-400 uppercase tracking-wide pb-2 border-b border-gray-100">
        {title}
      </h2>
      {children}
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {children}
    </div>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-gray-400 mt-1">{children}</p>
}
