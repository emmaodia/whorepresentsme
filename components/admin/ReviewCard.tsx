'use client'

import { useState } from 'react'
import type { Contribution } from '@/lib/types'

type ContributionWithOfficial = Contribution & {
  officials: { id: string; full_name: string } | null
}

export default function ReviewCard({ contribution: c }: { contribution: ContributionWithOfficial }) {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [notes, setNotes]   = useState('')

  const act = async (decision: 'approved' | 'rejected' | 'duplicate') => {
    setState('loading')
    const res = await fetch('/api/admin/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: c.id, status: decision, notes }),
    })
    setState(res.ok ? 'done' : 'idle')
    if (!res.ok) alert('Action failed — please try again.')
  }

  if (state === 'done') {
    return (
      <div className="bg-white border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-400">
        Processed.
      </div>
    )
  }

  const submittedDate = new Date(c.submitted_at).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            {c.change_type.replace('_', ' ')}
          </span>
          {c.officials && (
            <span className="text-sm text-gray-700">
              re: <strong>{c.officials.full_name}</strong>
            </span>
          )}
          {c.field_name && (
            <span className="text-xs text-gray-400">({c.field_name})</span>
          )}
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{submittedDate}</span>
      </div>

      {/* ── Proposed value ───────────────────────────────────────────────── */}
      {c.proposed_value && (
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-1">Proposed value</p>
          <p className="text-sm text-gray-800 bg-gray-50 rounded p-3 whitespace-pre-wrap leading-relaxed">
            {c.proposed_value}
          </p>
        </div>
      )}

      {/* ── Current value (if field update) ─────────────────────────────── */}
      {c.current_value && (
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-1">Current value</p>
          <p className="text-sm text-gray-500 bg-red-50 rounded p-3 line-through">
            {c.current_value}
          </p>
        </div>
      )}

      {/* ── Source ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-400">Source:</span>
        <a
          href={c.source_url}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-green-700 hover:underline truncate"
        >
          {c.source_url}
        </a>
      </div>

      {/* ── Contributor notes ────────────────────────────────────────────── */}
      {c.notes && (
        <p className="text-xs text-gray-500 italic mb-3 border-l-2 border-gray-200 pl-3">
          "{c.notes}"
        </p>
      )}

      {/* ── Contributor identity ─────────────────────────────────────────── */}
      {(c.contributor_name || c.contributor_email) && (
        <p className="text-xs text-gray-400 mb-3">
          From: {c.contributor_name}{c.contributor_email && ` · ${c.contributor_email}`}
        </p>
      )}

      {/* ── Review actions ───────────────────────────────────────────────── */}
      <div className="border-t border-gray-100 pt-3">
        <input
          type="text"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Reviewer notes (optional)"
          className="w-full text-xs border border-gray-200 rounded px-2.5 py-1.5 mb-2 focus:outline-none focus:ring-1 focus:ring-green-700"
        />
        <div className="flex gap-2">
          <button
            onClick={() => act('approved')}
            disabled={state === 'loading'}
            className="flex-1 text-xs bg-green-800 text-white rounded-md py-2 hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => act('rejected')}
            disabled={state === 'loading'}
            className="flex-1 text-xs bg-white text-red-600 border border-red-200 rounded-md py-2 hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => act('duplicate')}
            disabled={state === 'loading'}
            className="flex-1 text-xs bg-white text-gray-500 border border-gray-200 rounded-md py-2 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Duplicate
          </button>
        </div>
      </div>
    </div>
  )
}
