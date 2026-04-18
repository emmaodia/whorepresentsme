'use client'

import { useState } from 'react'
import type { OfficialNote } from '@/lib/types'
import NotesPanel from './NotesPanel'

export default function NotesSection({
  officials,
}: {
  officials: { id: string; full_name: string }[]
}) {
  const [selectedId, setSelectedId] = useState('')
  const [selectedName, setSelectedName] = useState('')
  const [notes, setNotes] = useState<OfficialNote[] | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSelect = async (id: string) => {
    if (!id) {
      setSelectedId('')
      setNotes(null)
      return
    }

    const official = officials.find(o => o.id === id)
    setSelectedId(id)
    setSelectedName(official?.full_name ?? '')
    setLoading(true)

    const res = await fetch(`/api/admin/notes?official_id=${id}`)
    if (res.ok) {
      setNotes(await res.json())
    } else {
      setNotes([])
    }
    setLoading(false)
  }

  return (
    <div>
      <select
        value={selectedId}
        onChange={e => handleSelect(e.target.value)}
        className="w-full text-sm border border-gray-200 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-green-700"
      >
        <option value="">Select an official to view/add notes...</option>
        {officials.map(o => (
          <option key={o.id} value={o.id}>{o.full_name}</option>
        ))}
      </select>

      {loading && (
        <p className="text-xs text-gray-400">Loading notes...</p>
      )}

      {notes !== null && !loading && (
        <NotesPanel
          key={selectedId}
          officialId={selectedId}
          officialName={selectedName}
          initialNotes={notes}
        />
      )}
    </div>
  )
}
