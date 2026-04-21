'use client'

import { useState, useMemo } from 'react'
import { getStateOffice, getLGAOfficesForState, getLGAOffice } from '@/lib/data/inec-offices'

interface Props {
  states: string[]
}

export default function VoterRegistrationClient({ states }: Props) {
  const [selectedState, setSelectedState] = useState('')
  const [selectedLGA, setSelectedLGA] = useState('')

  const lgaOffices = useMemo(() => getLGAOfficesForState(selectedState), [selectedState])
  const stateOffice = useMemo(() => getStateOffice(selectedState), [selectedState])
  const lgaOffice = useMemo(
    () => (selectedLGA ? getLGAOffice(selectedState, selectedLGA) : undefined),
    [selectedState, selectedLGA]
  )

  function handleStateChange(val: string) {
    setSelectedState(val)
    setSelectedLGA('')
  }

  return (
    <div>
      {/* ── Selectors ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">State</label>
          <select
            value={selectedState}
            onChange={e => handleStateChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
          >
            <option value="">Select a state…</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Local Government Area <span className="text-gray-300">(optional)</span>
          </label>
          <select
            value={selectedLGA}
            onChange={e => setSelectedLGA(e.target.value)}
            disabled={!selectedState}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 disabled:opacity-40"
          >
            <option value="">All LGAs in state…</option>
            {lgaOffices.map(o => <option key={o.lga} value={o.lga}>{o.lga}</option>)}
          </select>
        </div>
      </div>

      {/* ── Empty prompt ──────────────────────────────────────────────── */}
      {!selectedState && (
        <div className="border border-dashed border-gray-200 rounded-xl py-10 text-center text-sm text-gray-400">
          Select your state to find your nearest INEC office.
        </div>
      )}

      {/* ── State office card ─────────────────────────────────────────── */}
      {stateOffice && (
        <div className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
            State INEC Office <span className="flex-1 border-t border-gray-100" />
          </h2>
          <div className="border border-green-100 bg-green-50 rounded-xl px-5 py-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="text-sm font-semibold text-green-900 mb-0.5">
                  INEC {stateOffice.state} State Office
                </p>
                <p className="text-xs text-green-800 mb-2">{stateOffice.address}</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`tel:${stateOffice.phone}`}
                    className="text-xs text-green-700 flex items-center gap-1 hover:underline"
                  >
                    📞 {stateOffice.phone}
                  </a>
                  {stateOffice.email && (
                    <a
                      href={`mailto:${stateOffice.email}`}
                      className="text-xs text-green-700 flex items-center gap-1 hover:underline"
                    >
                      ✉️ {stateOffice.email}
                    </a>
                  )}
                </div>
              </div>
              <a
                href={`https://maps.google.com/?q=INEC+${encodeURIComponent(stateOffice.state)}+State+Office+${encodeURIComponent(stateOffice.city)}+Nigeria`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-green-700 border border-green-200 rounded px-3 py-1.5 hover:bg-green-100 transition-colors whitespace-nowrap shrink-0"
              >
                Open in Maps →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── LGA office card (when specific LGA selected) ──────────────── */}
      {lgaOffice && (
        <div className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
            LGA INEC Office <span className="flex-1 border-t border-gray-100" />
          </h2>
          <div className="border border-gray-100 rounded-xl px-5 py-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-0.5">
                  INEC {lgaOffice.lga} LGA Office
                </p>
                <p className="text-xs text-gray-500 mb-1">
                  Located at the LGA Secretariat, <strong>{lgaOffice.headquarters}</strong>
                </p>
                <p className="text-[11px] text-gray-400">
                  This is where you go for voter registration, biometric capture, and PVC collection.
                </p>
              </div>
              <a
                href={`https://maps.google.com/?q=INEC+${encodeURIComponent(lgaOffice.lga)}+LGA+Office+${encodeURIComponent(lgaOffice.headquarters)}+${encodeURIComponent(lgaOffice.state)}+Nigeria`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gray-600 border border-gray-200 rounded px-3 py-1.5 hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
              >
                Open in Maps →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── All LGA offices list (when state selected but no specific LGA) */}
      {selectedState && !selectedLGA && lgaOffices.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
            All LGA offices in {selectedState} ({lgaOffices.length})
            <span className="flex-1 border-t border-gray-100" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {lgaOffices.map(o => (
              <button
                key={o.lga}
                onClick={() => setSelectedLGA(o.lga)}
                className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-2.5 text-left hover:border-green-200 hover:bg-green-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{o.lga}</p>
                  <p className="text-xs text-gray-400">{o.headquarters}</p>
                </div>
                <span className="text-xs text-green-700 shrink-0 ml-2">View →</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
