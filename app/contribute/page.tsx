'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type ChangeType = 'new_official' | 'field_update' | 'correction' | 'photo'

const FIELD_OPTIONS = [
  'full_name', 'gender', 'date_of_birth',
  'phone', 'official_email', 'official_website', 'twitter_handle',
  'bio', 'photo_url', 'party', 'constituency',
  'term_start', 'term_end', 'next_election_date',
]

const CHANGE_TYPE_LABELS: Record<ChangeType, string> = {
  new_official: 'New official',
  field_update: 'Update a field',
  correction:   'Correction',
  photo:        'Photo',
}

function ContributeForm() {
  const searchParams = useSearchParams()
  const officialId = searchParams.get('official')

  const [changeType, setChangeType] = useState<ChangeType>('field_update')
  const [form, setForm] = useState({
    contributor_name:  '',
    contributor_email: '',
    field_name:        '',
    proposed_value:    '',
    source_url:        '',
    notes:             '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.source_url.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          official_id:  officialId ?? undefined,
          change_type:  changeType,
          ...form,
        }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-700 mb-4">
          ✓
        </div>
        <h2 className="text-base font-semibold text-gray-900 mb-2">Submission received</h2>
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          Our team will cross-check your submission against the source provided and publish within 48 hours if approved.
        </p>
        <Link href="/" className="text-sm text-green-700 hover:underline">← Back to directory</Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Change type selector */}
      <div>
        <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">
          Type of change
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(CHANGE_TYPE_LABELS) as ChangeType[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setChangeType(t)}
              className={`text-xs px-3 py-2 rounded-md border transition-colors ${
                changeType === t
                  ? 'bg-green-800 text-white border-green-800'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {CHANGE_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Field selector — only for field_update */}
      {changeType === 'field_update' && (
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
            Which field?
          </label>
          <select
            value={form.field_name}
            onChange={e => set('field_name', e.target.value)}
            required
            className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-700"
          >
            <option value="">Select a field</option>
            {FIELD_OPTIONS.map(f => (
              <option key={f} value={f}>{f.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      )}

      {/* Proposed value */}
      <div>
        <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
          {changeType === 'new_official' ? 'Official details' : 'Correct value'}
        </label>
        <textarea
          rows={changeType === 'new_official' ? 5 : 3}
          value={form.proposed_value}
          onChange={e => set('proposed_value', e.target.value)}
          required
          placeholder={
            changeType === 'new_official'
              ? 'Full name, office, party, state, gender, contact details...'
              : 'What should the correct value be?'
          }
          className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-700 resize-none"
        />
      </div>

      {/* Source URL — required */}
      <div>
        <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
          Source URL <span className="text-red-400 normal-case">*required</span>
        </label>
        <input
          type="url"
          required
          value={form.source_url}
          onChange={e => set('source_url', e.target.value)}
          placeholder="https://inec.gov.ng/... or official government / news source"
          className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-700"
        />
        <p className="text-xs text-gray-400 mt-1">
          Must be an INEC page, official government site, or credible news source. Submissions without a verifiable source will be rejected.
        </p>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
          Additional notes <span className="normal-case text-gray-300">(optional)</span>
        </label>
        <textarea
          rows={2}
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Any context that would help our review team..."
          className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-700 resize-none"
        />
      </div>

      {/* Contributor identity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Your name</label>
          <input
            type="text"
            value={form.contributor_name}
            onChange={e => set('contributor_name', e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-700"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
            Email <span className="normal-case text-gray-300">(for follow-up only)</span>
          </label>
          <input
            type="email"
            value={form.contributor_email}
            onChange={e => set('contributor_email', e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-700"
          />
        </div>
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-green-800 text-white text-sm font-medium py-2.5 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {status === 'loading' ? 'Submitting...' : 'Submit for review'}
      </button>
    </form>
  )
}

export default function ContributePage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="text-base font-semibold text-green-800 tracking-tight">
            MyReps<span className="text-gray-400">.ng</span>
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-6 block">
          ← Back to directory
        </Link>

        <h1 className="text-xl font-semibold text-gray-900 mb-1">Submit a contribution</h1>
        <p className="text-sm text-gray-500 mb-6">
          All submissions are reviewed and verified against INEC records or an official source before going live.
          We typically review within 48 hours.
        </p>

        <Suspense fallback={<p className="text-sm text-gray-400">Loading form...</p>}>
          <ContributeForm />
        </Suspense>
      </div>
    </main>
  )
}
