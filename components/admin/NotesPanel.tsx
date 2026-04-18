'use client'

import { useState } from 'react'
import type { OfficialNote, NoteType } from '@/lib/types'

const NOTE_TYPES: { value: NoteType; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'seat_dispute', label: 'Seat dispute' },
  { value: 'party_change', label: 'Party change' },
  { value: 'vacancy', label: 'Vacancy' },
  { value: 'correction', label: 'Correction' },
  { value: 'historical', label: 'Historical' },
]

export default function NotesPanel({
  officialId,
  officialName,
  initialNotes,
}: {
  officialId: string
  officialName: string
  initialNotes: OfficialNote[]
}) {
  const [notes, setNotes] = useState<OfficialNote[]>(initialNotes)
  const [note, setNote] = useState('')
  const [noteType, setNoteType] = useState<NoteType>('general')
  const [isPublic, setIsPublic] = useState(true)
  const [saving, setSaving] = useState(false)

  const handleAdd = async () => {
    if (!note.trim()) return
    setSaving(true)
    const res = await fetch('/api/admin/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        official_id: officialId,
        note,
        note_type: noteType,
        is_public: isPublic,
      }),
    })
    if (res.ok) {
      const created = await res.json()
      setNotes(prev => [created, ...prev])
      setNote('')
      setNoteType('general')
      setIsPublic(true)
    } else {
      alert('Failed to add note.')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return
    const res = await fetch(`/api/admin/notes?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setNotes(prev => prev.filter(n => n.id !== id))
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Notes for {officialName}
      </h3>

      {/* Add note form */}
      <div className="space-y-2 mb-4">
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Add a note..."
          rows={2}
          className="w-full text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-700 resize-none"
        />
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={noteType}
            onChange={e => setNoteType(e.target.value as NoteType)}
            className="text-xs border border-gray-200 rounded px-2 py-1.5"
          >
            {NOTE_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <label className="flex items-center gap-1.5 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={e => setIsPublic(e.target.checked)}
              className="rounded"
            />
            Public
          </label>
          <button
            onClick={handleAdd}
            disabled={saving || !note.trim()}
            className="ml-auto text-xs bg-green-800 text-white px-3 py-1.5 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Add note'}
          </button>
        </div>
      </div>

      {/* Existing notes */}
      {notes.length === 0 ? (
        <p className="text-xs text-gray-400">No notes yet.</p>
      ) : (
        <div className="space-y-2">
          {notes.map(n => (
            <div key={n.id} className="bg-gray-50 rounded p-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed flex-1">{n.note}</p>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="text-xs text-red-400 hover:text-red-600 flex-shrink-0"
                >
                  Delete
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                  {n.note_type.replace('_', ' ')}
                </span>
                {!n.is_public && (
                  <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">Admin only</span>
                )}
                <span>{n.added_by}</span>
                <span>{new Date(n.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
