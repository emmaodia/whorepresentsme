import { getReferenceData } from '@/lib/queries'
import OfficialForm from '@/components/admin/OfficialForm'
import Link from 'next/link'

export default async function NewOfficialPage() {
  const { states, parties, offices } = await getReferenceData()

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <Link href="/admin/queue" className="text-gray-500 hover:text-gray-700">← Queue</Link>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-900">Add official</span>
          </div>
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">
            View site →
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-5">
          <h1 className="text-base font-semibold text-gray-900">New official</h1>
          <p className="text-sm text-gray-500 mt-1">
            Records added here are published immediately as verified.
            Use the contribution queue for public submissions.
          </p>
        </div>

        <OfficialForm
          states={states}
          parties={parties}
          offices={offices}
        />
      </div>
    </main>
  )
}
