'use client'

import { useState, useMemo } from 'react'

interface PollingUnit {
  code: string
  location: string
}

interface StateData {
  state: string
  lga_count: number
  ward_count: number
  pu_count: number
  lgas: Record<string, Record<string, PollingUnit[]>>
}

// State name → filename mapping
const STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos',
  'Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers',
  'Sokoto','Taraba','Yobe','Zamfara',
]

function stateToFilename(state: string): string {
  return state.toLowerCase().replace(/ /g, '-').replace(/'/g, '') + '.json'
}

export default function PollingUnitLookup() {
  const [selectedState, setSelectedState] = useState('')
  const [stateData, setStateData] = useState<StateData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [selectedLGA, setSelectedLGA] = useState('')
  const [selectedWard, setSelectedWard] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Derived data
  const lgas = useMemo(() => {
    if (!stateData) return []
    return Object.keys(stateData.lgas).sort()
  }, [stateData])

  const wards = useMemo(() => {
    if (!stateData || !selectedLGA) return []
    return Object.keys(stateData.lgas[selectedLGA] ?? {}).sort()
  }, [stateData, selectedLGA])

  const pollingUnits = useMemo(() => {
    if (!stateData || !selectedLGA || !selectedWard) return []
    return stateData.lgas[selectedLGA]?.[selectedWard] ?? []
  }, [stateData, selectedLGA, selectedWard])

  // Filtered by search
  const filteredUnits = useMemo(() => {
    if (!searchQuery.trim()) return pollingUnits
    const q = searchQuery.toLowerCase()
    return pollingUnits.filter(pu =>
      pu.location.toLowerCase().includes(q) || pu.code.includes(q)
    )
  }, [pollingUnits, searchQuery])

  // Search across all wards in the selected LGA
  const lgaWideSearch = useMemo(() => {
    if (!stateData || !selectedLGA || !searchQuery.trim() || selectedWard) return []
    const q = searchQuery.toLowerCase()
    const results: (PollingUnit & { ward: string })[] = []
    const lgaData = stateData.lgas[selectedLGA]
    if (!lgaData) return []
    for (const [ward, units] of Object.entries(lgaData)) {
      for (const pu of units) {
        if (pu.location.toLowerCase().includes(q) || pu.code.includes(q)) {
          results.push({ ...pu, ward })
        }
      }
      if (results.length >= 50) break
    }
    return results
  }, [stateData, selectedLGA, selectedWard, searchQuery])

  const handleStateChange = async (state: string) => {
    setSelectedState(state)
    setSelectedLGA('')
    setSelectedWard('')
    setSearchQuery('')
    setStateData(null)
    setError('')

    if (!state) return

    setLoading(true)
    try {
      const filename = stateToFilename(state)
      const res = await fetch(`/data/polling-units/${filename}`)
      if (!res.ok) throw new Error('Failed to load data')
      const data: StateData = await res.json()
      setStateData(data)
    } catch {
      setError('Failed to load polling unit data. Please try again.')
    }
    setLoading(false)
  }

  const handleLGAChange = (lga: string) => {
    setSelectedLGA(lga)
    setSelectedWard('')
    setSearchQuery('')
  }

  const handleWardChange = (ward: string) => {
    setSelectedWard(ward)
    setSearchQuery('')
  }

  return (
    <div>
      {/* ── Step 1: State ────────────────────────────────────────────── */}
      <div className="max-w-md mx-auto mb-5">
        <StepLabel number={1} label="Select your state" />
        <select
          value={selectedState}
          onChange={e => handleStateChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-white"
        >
          <option value="">Choose your state...</option>
          {STATES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-5 h-5 border-2 border-green-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400 mt-2">Loading {selectedState} polling units...</p>
        </div>
      )}

      {error && (
        <div className="max-w-md mx-auto mb-5 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* ── State summary ────────────────────────────────────────────── */}
      {stateData && (
        <div className="max-w-md mx-auto mb-5 grid grid-cols-3 gap-2">
          <MiniStat label="LGAs" value={stateData.lga_count} />
          <MiniStat label="Wards" value={stateData.ward_count} />
          <MiniStat label="Polling units" value={stateData.pu_count.toLocaleString()} />
        </div>
      )}

      {/* ── Step 2: LGA ──────────────────────────────────────────────── */}
      {stateData && (
        <div className="max-w-md mx-auto mb-5">
          <StepLabel number={2} label="Select your LGA" />
          <select
            value={selectedLGA}
            onChange={e => handleLGAChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-white capitalize"
          >
            <option value="">Choose your LGA...</option>
            {lgas.map(l => (
              <option key={l} value={l} className="capitalize">{l}</option>
            ))}
          </select>
        </div>
      )}

      {/* ── Step 3: Ward ─────────────────────────────────────────────── */}
      {selectedLGA && (
        <div className="max-w-md mx-auto mb-5">
          <StepLabel number={3} label={`Select your ward (${wards.length} in ${selectedLGA})`} />
          <select
            value={selectedWard}
            onChange={e => handleWardChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-white capitalize"
          >
            <option value="">Choose your ward...</option>
            {wards.map(w => (
              <option key={w} value={w} className="capitalize">{w}</option>
            ))}
          </select>
        </div>
      )}

      {/* ── Search within results ─────────────────────────────────────── */}
      {selectedLGA && (
        <div className="max-w-md mx-auto mb-5">
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={selectedWard
              ? `Search ${filteredUnits.length} polling units by name or code...`
              : `Search all polling units in ${selectedLGA}...`
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-white"
          />
        </div>
      )}

      {/* ── Polling unit results ──────────────────────────────────────── */}
      {selectedWard && filteredUnits.length > 0 && (
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs text-gray-400 uppercase tracking-wide">
              {filteredUnits.length} polling unit{filteredUnits.length !== 1 ? 's' : ''} in {selectedWard}
            </h3>
          </div>
          <div className="space-y-2">
            {filteredUnits.map(pu => (
              <PUCard key={pu.code} code={pu.code} location={pu.location} />
            ))}
          </div>
        </div>
      )}

      {/* ── LGA-wide search results (no ward selected) ────────────────── */}
      {selectedLGA && !selectedWard && searchQuery.trim() && lgaWideSearch.length > 0 && (
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs text-gray-400 uppercase tracking-wide">
              {lgaWideSearch.length} result{lgaWideSearch.length !== 1 ? 's' : ''} across all wards
            </h3>
          </div>
          <div className="space-y-2">
            {lgaWideSearch.map(pu => (
              <PUCard key={pu.code} code={pu.code} location={pu.location} ward={pu.ward} />
            ))}
          </div>
        </div>
      )}

      {/* ── Empty states ──────────────────────────────────────────────── */}
      {selectedWard && filteredUnits.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-500">
            {searchQuery ? 'No polling units match your search.' : 'No polling units found for this ward.'}
          </p>
        </div>
      )}

      {!selectedState && (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Select your state to begin</p>
          <p className="text-xs text-gray-400">Then narrow down by LGA and ward to find your polling unit</p>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepLabel({ number, label }: { number: number; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="w-6 h-6 rounded-full bg-green-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
        {number}
      </span>
      <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
      <p className="text-sm font-semibold text-gray-900">{value}</p>
      <p className="text-[11px] text-gray-400">{label}</p>
    </div>
  )
}

function PUCard({ code, location, ward }: { code: string; location: string; ward?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-green-200 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 capitalize leading-snug">{location.toLowerCase()}</p>
          {ward && (
            <p className="text-xs text-gray-400 mt-0.5 capitalize">Ward: {ward}</p>
          )}
        </div>
        <span className="text-xs font-mono text-green-700 bg-green-50 border border-green-100 rounded px-2 py-1 shrink-0">
          {code}
        </span>
      </div>
    </div>
  )
}
