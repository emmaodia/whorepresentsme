import Link from 'next/link'
import PollingUnitLookup from '@/components/PollingUnitLookup'

export const metadata = {
  title: 'Find Your Polling Unit | WhoRepresentsMe.ng',
  description: 'Look up your polling unit by state, LGA, and ward. Find the exact name, location, and code of where you vote.',
}

export default function PollingUnitsPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-4 overflow-hidden rounded-sm border border-gray-200">
              <div className="w-2 bg-green-800" />
              <div className="w-2 bg-white" />
              <div className="w-2 bg-green-800" />
            </div>
            <span className="text-base font-semibold text-green-800 tracking-tight">
              WhoRepresentsMe<span className="text-gray-400">.ng</span>
            </span>
          </Link>
          <div className="flex gap-2 text-xs">
            <Link href="/find" className="text-green-700 border border-green-200 rounded px-2.5 sm:px-3 py-2 hover:bg-green-50 transition-colors">
              Find my reps
            </Link>
            <Link href="/voter-guide" className="text-gray-500 hover:text-gray-700 py-2">
              Voter guide
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Find your polling unit</h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Look up the exact name, location, and code of where you vote.
            Nigeria has 176,846 polling units across 8,809 wards.
          </p>
        </div>

        <PollingUnitLookup />

        <div className="mt-10 bg-green-50 border border-green-100 rounded-lg p-4 text-center">
          <p className="text-sm text-green-800 font-medium mb-1">Know who you're voting for</p>
          <p className="text-xs text-green-600 mb-3">
            Look up every elected official who represents your area.
          </p>
          <div className="flex justify-center gap-2">
            <Link
              href="/find"
              className="inline-block text-xs bg-green-800 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Find my representatives
            </Link>
            <Link
              href="/voter-guide"
              className="inline-block text-xs text-green-700 border border-green-200 px-4 py-2 rounded-md hover:bg-green-100 transition-colors"
            >
              Voter guide
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
