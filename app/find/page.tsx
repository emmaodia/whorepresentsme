import { getOfficials, getReferenceData } from '@/lib/queries'
import FindMyRepsClient from '@/components/FindMyRepsClient'
import Link from 'next/link'

export const revalidate = 3600

export const metadata = {
  title: 'Find My Representatives | MyReps.ng',
  description: 'Enter your state to find all the elected officials who represent you at the federal and state level.',
}

export default async function FindPage() {
  const [officials, refs] = await Promise.all([
    getOfficials(),
    getReferenceData(),
  ])

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
              MyReps<span className="text-gray-400">.ng</span>
            </span>
          </Link>
          <div className="flex gap-3 text-xs">
            <Link href="/voter-guide" className="text-green-700 border border-green-200 rounded px-3 py-1.5 hover:bg-green-50 transition-colors">
              Voter guide
            </Link>
            <Link href="/" className="text-gray-500 hover:text-gray-700 py-1.5">
              Full directory
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Find your representatives</h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Select your state to see every elected official who represents you
            at the federal and state level.
          </p>
        </div>

        <FindMyRepsClient
          officials={officials}
          states={refs.states}
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        />
      </div>
    </main>
  )
}
