'use client'

import { useState, useMemo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { OfficialWithRefs, State } from '@/lib/types'
import { getLGAsForState, getConstituencyForLGA, type LGAMapping } from '@/lib/data/lga-constituency-map'
import ElectionCountdown from './ElectionCountdown'
import ScorecardBadges from './ScorecardBadges'

interface Props {
  officials: OfficialWithRefs[]
  states: State[]
  googleMapsApiKey?: string
}

function calcAge(dob?: string | null) {
  if (!dob) return null
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

function isSenator(o: OfficialWithRefs) {
  const t = o.offices?.title ?? ''
  return t === 'Senator' || t.includes('Senate President') || t.includes('Deputy Senate')
}

function isHOR(o: OfficialWithRefs) {
  const t = o.offices?.title ?? ''
  return t === 'Member, House of Representatives' ||
         t === 'Speaker, House of Representatives' ||
         t === 'Deputy Speaker, House of Reps'
}

function isStateAssembly(o: OfficialWithRefs) {
  const t = o.offices?.title ?? ''
  return t.includes('State House of Assembly') || t === 'State Legislator'
}

function isGovernor(o: OfficialWithRefs) {
  const t = o.offices?.title ?? ''
  return t === 'Governor' || t === 'Deputy Governor'
}

function isNational(o: OfficialWithRefs) {
  const t = o.offices?.title ?? ''
  return t === 'President' || t === 'Vice President'
}

export default function FindMyRepsClient({ officials, states, googleMapsApiKey }: Props) {
  const [selectedState, setSelectedState] = useState('')
  const [selectedLGA, setSelectedLGA] = useState('')
  // Fallback manual selectors for states without LGA data
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedConstituency, setSelectedConstituency] = useState('')
  const [placesInput, setPlacesInput] = useState('')

  // National officials
  const nationalOfficials = useMemo(() => officials.filter(isNational), [officials])

  // State officials
  const stateOfficials = useMemo(() => {
    if (!selectedState) return []
    return officials.filter(o => o.states?.name === selectedState)
  }, [officials, selectedState])

  const governors = useMemo(() => stateOfficials.filter(isGovernor), [stateOfficials])

  // LGA data for selected state
  const lgasForState = useMemo(() => getLGAsForState(selectedState), [selectedState])
  const hasLGAData = lgasForState.length > 0

  // Resolved mapping from LGA selection
  const lgaMapping: LGAMapping | undefined = useMemo(() => {
    if (!selectedState || !selectedLGA) return undefined
    return getConstituencyForLGA(selectedState, selectedLGA)
  }, [selectedState, selectedLGA])

  // Determine the active senatorial district and federal constituency
  // Either from LGA mapping or manual selection
  const activeDistrict = lgaMapping?.senatorialDistrict ?? selectedDistrict
  const activeConstituency = lgaMapping?.federalConstituency ?? selectedConstituency

  // Senatorial districts for manual fallback
  const senatorialDistricts = useMemo(() => {
    const districts = stateOfficials
      .filter(isSenator)
      .map(o => o.constituency)
      .filter((c): c is string => !!c)
    return [...new Set(districts)].sort()
  }, [stateOfficials])

  // Federal constituencies for manual fallback
  const federalConstituencies = useMemo(() => {
    const constituencies = stateOfficials
      .filter(isHOR)
      .map(o => o.constituency)
      .filter((c): c is string => !!c)
    return [...new Set(constituencies)].sort()
  }, [stateOfficials])

  // Resolved officials
  const mySenator = useMemo(() => {
    if (!activeDistrict) return []
    return stateOfficials.filter(o => isSenator(o) && o.constituency === activeDistrict)
  }, [stateOfficials, activeDistrict])

  const myHORMember = useMemo(() => {
    if (!activeConstituency) return []
    return stateOfficials.filter(o => isHOR(o) && o.constituency === activeConstituency)
  }, [stateOfficials, activeConstituency])

  // State Assembly members for the selected state (all of them shown for now —
  // LGA-to-state-constituency mapping requires additional data per state)
  const myStateAssemblyMembers = useMemo(() => {
    return stateOfficials.filter(isStateAssembly)
  }, [stateOfficials])

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    setSelectedLGA('')
    setSelectedDistrict('')
    setSelectedConstituency('')
    setPlacesInput('')
  }

  const handleLGAChange = (lga: string) => {
    setSelectedLGA(lga)
    // Clear manual selectors since LGA takes precedence
    setSelectedDistrict('')
    setSelectedConstituency('')
  }

  // Google Places autocomplete handler
  const handlePlaceSelect = useCallback((state: string, lga: string) => {
    const matchedState = states.find(s =>
      s.name.toLowerCase() === state.toLowerCase() ||
      state.toLowerCase().includes(s.name.toLowerCase())
    )
    if (matchedState) {
      setSelectedState(matchedState.name)
      const lgas = getLGAsForState(matchedState.name)
      const matchedLGA = lgas.find(l =>
        l.lga.toLowerCase() === lga.toLowerCase() ||
        lga.toLowerCase().includes(l.lga.toLowerCase()) ||
        l.lga.toLowerCase().includes(lga.toLowerCase())
      )
      if (matchedLGA) {
        setSelectedLGA(matchedLGA.lga)
      }
    }
  }, [states])

  const totalReps = nationalOfficials.length + governors.length + mySenator.length + myHORMember.length + myStateAssemblyMembers.length
  const allSelected = selectedState && (selectedLGA || (selectedDistrict && selectedConstituency))

  return (
    <div>
      {/* ── Address search (Google Places) ───────────────────────────── */}
      {googleMapsApiKey && (
        <div className="max-w-md mx-auto mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-green-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
              *
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wide">Quick lookup — search by address</span>
          </div>
          <PlacesAutocomplete
            apiKey={googleMapsApiKey}
            onSelect={handlePlaceSelect}
            value={placesInput}
            onChange={setPlacesInput}
          />
          <p className="text-[11px] text-gray-400 mt-1.5">
            Type your address to auto-detect your state and LGA.
          </p>
          {placesInput && (
            <div className="border-t border-gray-100 my-4" />
          )}
        </div>
      )}

      {/* ── Step 1: Select State ─────────────────────────────────────── */}
      <div className="max-w-md mx-auto mb-6">
        <StepLabel number={1} label="Select your state" />
        <select
          value={selectedState}
          onChange={e => handleStateChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-white"
        >
          <option value="">Choose your state...</option>
          {states.map(s => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* ── Step 2: Select LGA (if LGA data available) ───────────────── */}
      {selectedState && hasLGAData && (
        <div className="max-w-md mx-auto mb-6">
          <StepLabel number={2} label="Select your local government area (LGA)" />
          <select
            value={selectedLGA}
            onChange={e => handleLGAChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-white"
          >
            <option value="">Choose your LGA...</option>
            {lgasForState.map(l => (
              <option key={l.lga} value={l.lga}>{l.lga}</option>
            ))}
          </select>

          {selectedLGA && lgaMapping && (
            <div className="mt-3 bg-gray-50 rounded-lg p-3 text-xs text-gray-500 space-y-1">
              <p>Senatorial district: <strong className="text-gray-700">{lgaMapping.senatorialDistrict}</strong></p>
              <p>
                Federal constituency:{' '}
                {lgaMapping.federalConstituency
                  ? <strong className="text-gray-700">{lgaMapping.federalConstituency}</strong>
                  : <span className="text-amber-600">Data pending — mapping not yet verified</span>
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Step 2-3 fallback: Manual district/constituency selectors ── */}
      {selectedState && !hasLGAData && (
        <>
          <div className="max-w-md mx-auto mb-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700 mb-4">
              LGA mapping for {selectedState} is coming soon. Select your senatorial district and federal constituency manually below.
            </div>
          </div>

          {senatorialDistricts.length > 0 && (
            <div className="max-w-md mx-auto mb-6">
              <StepLabel number={2} label="Select your senatorial district" />
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-white"
              >
                <option value="">Choose your senatorial district...</option>
                {senatorialDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}

          {federalConstituencies.length > 0 && (
            <div className="max-w-md mx-auto mb-8">
              <StepLabel number={3} label="Select your federal constituency" />
              <select
                value={selectedConstituency}
                onChange={e => setSelectedConstituency(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-white"
              >
                <option value="">Choose your federal constituency...</option>
                {federalConstituencies.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
        </>
      )}

      {/* ── Results ──────────────────────────────────────────────────── */}
      <div className="space-y-6">

        {/* National */}
        {nationalOfficials.length > 0 && (
          <ResultSection label="National leadership" sublabel="Represents all Nigerians">
            {nationalOfficials.map(o => <RepCard key={o.id} official={o} />)}
          </ResultSection>
        )}

        {/* Governor */}
        {governors.length > 0 && (
          <ResultSection label={`${selectedState} State executive`}>
            {governors.map(o => <RepCard key={o.id} official={o} />)}
          </ResultSection>
        )}

        {/* Senator */}
        {activeDistrict && (
          <ResultSection label="Your senator" sublabel={activeDistrict}>
            {mySenator.length > 0 ? (
              mySenator.map(o => <RepCard key={o.id} official={o} />)
            ) : (
              <EmptyCard message={`No senator data for ${activeDistrict} yet.`} />
            )}
          </ResultSection>
        )}

        {/* HOR Member */}
        {activeConstituency && (
          <ResultSection label="Your House of Reps member" sublabel={activeConstituency}>
            {myHORMember.length > 0 ? (
              myHORMember.map(o => <RepCard key={o.id} official={o} />)
            ) : (
              <EmptyCard message={`No HOR member data for ${activeConstituency} yet.`} />
            )}
          </ResultSection>
        )}

        {/* Pending constituency message for LGA with null federal constituency */}
        {selectedLGA && lgaMapping && !lgaMapping.federalConstituency && !activeConstituency && (
          <ResultSection label="Your House of Reps member" sublabel={selectedLGA}>
            <EmptyCard message={`Federal constituency mapping for ${selectedLGA} is being verified. Check back soon.`} />
          </ResultSection>
        )}

        {/* State House of Assembly members */}
        {selectedState && myStateAssemblyMembers.length > 0 && (
          <ResultSection
            label={`${selectedState} State House of Assembly`}
            sublabel={`${myStateAssemblyMembers.length} member${myStateAssemblyMembers.length !== 1 ? 's' : ''}`}
          >
            {myStateAssemblyMembers.map(o => <RepCard key={o.id} official={o} />)}
          </ResultSection>
        )}

        {/* Prompt */}
        {!selectedState && (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Start by selecting your state above</p>
            <p className="text-xs text-gray-400">
              {googleMapsApiKey
                ? 'Or search by address to auto-detect your location'
                : 'Then select your LGA to see exactly who represents you'}
            </p>
          </div>
        )}

        {/* Summary */}
        {allSelected && totalReps > 0 && (
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center mt-4">
            <p className="text-sm text-green-800 font-medium mb-1">
              {totalReps} official{totalReps !== 1 ? 's' : ''} represent{totalReps === 1 ? 's' : ''} you
            </p>
            <p className="text-xs text-green-600 mb-3">
              From the President down to your federal constituency representative.
            </p>
            <div className="flex justify-center gap-2">
              <Link
                href="/polling-units"
                className="inline-block text-xs bg-green-800 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Find your polling unit
              </Link>
              <Link
                href="/voter-guide"
                className="inline-block text-xs text-green-700 border border-green-200 px-4 py-2 rounded-md hover:bg-green-100 transition-colors"
              >
                Voter guide
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Google Places Autocomplete (new Places API) ─────────────────────────────

interface Suggestion {
  placeId: string
  mainText: string
  secondaryText: string
  fullText: string
}

function PlacesAutocomplete({
  apiKey,
  onSelect,
  value,
  onChange,
}: {
  apiKey: string
  onSelect: (state: string, lga: string) => void
  value: string
  onChange: (v: string) => void
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [ready, setReady] = useState(false)

  // Load Google Maps script with loading=async
  const loadScript = useCallback(() => {
    if (typeof window === 'undefined') return
    if (document.querySelector('#google-maps-script')) {
      setReady(typeof google !== 'undefined' && !!google.maps?.places)
      return
    }
    const script = document.createElement('script')
    script.id = 'google-maps-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`
    script.async = true
    script.onload = () => {
      // Wait for the Places library to be available
      const check = () => {
        if (typeof google !== 'undefined' && google.maps?.places) {
          setReady(true)
        } else {
          setTimeout(check, 100)
        }
      }
      check()
    }
    document.head.appendChild(script)
  }, [apiKey])

  // Ensure script is loaded on mount
  useState(() => { loadScript() })

  const handleInput = async (text: string) => {
    onChange(text)
    if (text.length < 3 || !ready) {
      setSuggestions([])
      return
    }

    try {
      // Use the new AutocompleteSuggestion API
      // @ts-expect-error — @types/google.maps may not have AutocompleteSuggestion yet
      const { suggestions: results } = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: text,
        includedRegionCodes: ['ng'],
        language: 'en',
      })

      const mapped: Suggestion[] = (results ?? [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((s: any) => s.placePrediction)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((s: any) => ({
          placeId: s.placePrediction.placeId,
          mainText: s.placePrediction.mainText?.text ?? s.placePrediction.text?.text ?? '',
          secondaryText: s.placePrediction.secondaryText?.text ?? '',
          fullText: s.placePrediction.text?.text ?? '',
        }))

      setSuggestions(mapped)
      setShowSuggestions(mapped.length > 0)
    } catch {
      setSuggestions([])
    }
  }

  const handleSelect = async (suggestion: Suggestion) => {
    onChange(suggestion.fullText)
    setShowSuggestions(false)
    setSuggestions([])

    try {
      // Use Place.fetchFields to get address components
      // @ts-expect-error — new API may not be in types yet
      const { Place } = google.maps.places
      const place = new Place({ id: suggestion.placeId })
      await place.fetchFields({ fields: ['addressComponents'] })

      let state = ''
      let lga = ''

      for (const comp of place.addressComponents ?? []) {
        if (comp.types.includes('administrative_area_level_1')) {
          state = comp.longText?.replace(' State', '') ?? ''
        }
        if (comp.types.includes('administrative_area_level_2')) {
          lga = comp.longText ?? ''
        }
      }

      if (state) {
        onSelect(state, lga)
      }
    } catch {
      // Fallback: use Geocoder if Place class isn't available
      try {
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({ placeId: suggestion.placeId }, (results, status) => {
          if (status !== 'OK' || !results?.[0]) return

          let state = ''
          let lga = ''
          for (const comp of results[0].address_components) {
            if (comp.types.includes('administrative_area_level_1')) {
              state = comp.long_name.replace(' State', '')
            }
            if (comp.types.includes('administrative_area_level_2')) {
              lga = comp.long_name
            }
          }
          if (state) onSelect(state, lga)
        })
      } catch {}
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={e => handleInput(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={ready ? 'Type your address or area (e.g. Lekki, Victoria Island)...' : 'Loading Google Places...'}
        disabled={!ready}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 bg-white disabled:bg-gray-50 disabled:text-gray-400"
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map(s => (
            <li key={s.placeId}>
              <button
                type="button"
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                onMouseDown={() => handleSelect(s)}
              >
                <span className="text-gray-900">{s.mainText}</span>
                {s.secondaryText && <span className="text-xs text-gray-400 ml-1.5">{s.secondaryText}</span>}
              </button>
            </li>
          ))}
          <li className="px-4 py-2 text-[10px] text-gray-300 border-t border-gray-100">
            Powered by Google
          </li>
        </ul>
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

function ResultSection({ label, sublabel, children }: { label: string; sublabel?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
        <h3 className="text-xs text-gray-400 uppercase tracking-wide">{label}</h3>
        {sublabel && <span className="text-xs text-gray-300">· {sublabel}</span>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  )
}

function EmptyCard({ message }: { message: string }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center col-span-full">
      <p className="text-xs text-gray-400">{message}</p>
      <Link href="/contribute" className="text-xs text-green-700 hover:underline mt-1 inline-block">
        Help us add this data
      </Link>
    </div>
  )
}

function RepCard({ official: o }: { official: OfficialWithRefs }) {
  const party = o.parties
  const partyBg = party ? `${party.color_hex}15` : '#f9fafb'
  const partyTx = party?.color_hex ?? '#6b7280'
  const age = calcAge(o.date_of_birth)

  return (
    <Link
      href={`/officials/${o.id}`}
      className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start gap-3">
        {o.photo_url ? (
          <Image
            src={o.photo_url}
            alt={o.full_name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover shrink-0 border border-gray-100"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-sm font-semibold text-green-800 shrink-0">
            {o.full_name.split(' ').slice(0, 2).map(n => n[0]).join('')}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-tight truncate">{o.full_name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{o.offices?.title}</p>
          {o.constituency && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">{o.constituency}</p>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {party && (
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                style={{ background: partyBg, color: partyTx }}
              >
                {party.abbreviation}
              </span>
            )}
            {age && (
              <span className="text-[10px] text-gray-400">Age {age}</span>
            )}
            <ElectionCountdown date={o.next_election_date} size="sm" />
            <ScorecardBadges
              billsSponsored={o.bills_sponsored}
              motionsMoved={o.motions_moved}
              attendancePct={o.attendance_pct}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
