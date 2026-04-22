import { getPendingContributions } from '@/lib/queries'
import { supabaseAdmin } from '@/lib/supabase-server'
import ReviewCard from '@/components/admin/ReviewCard'
import NotesSection from '@/components/admin/NotesSection'
import Link from 'next/link'

export const revalidate = 0 // Always fresh — no caching on admin pages

async function getActiveOfficials() {
  const { data } = await supabaseAdmin
    .from('officials')
    .select('id, full_name')
    .eq('status', 'active')
    .eq('verified', true)
    .order('full_name')
  return data ?? []
}

export default async function AdminQueuePage() {
  const [pending, officials] = await Promise.all([
    getPendingContributions(),
    getActiveOfficials(),
  ])

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-semibold text-gray-900">
              MyReps Admin
            </Link>
            {pending.length > 0 && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                {pending.length} pending
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/queue/officials/new"
              className="text-xs bg-green-800 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors"
            >
              + Add official
            </Link>
            <Link href="/" className="text-xs text-gray-500 hover:text-gray-700 py-1.5">
              View site →
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* ── Contribution queue ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-base font-semibold text-gray-900">Contribution queue</h1>
          <p className="text-xs text-gray-400">Oldest first</p>
        </div>

        {pending.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-sm font-medium mb-1">Queue is clear</p>
            <p className="text-xs">No pending contributions to review.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(c => (
              <ReviewCard key={c.id} contribution={c} />
            ))}
          </div>
        )}

        {/* ── Notes section ──────────────────────────────────────────────── */}
        <div className="mt-10 border-t border-gray-200 pt-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Official notes</h2>
          <NotesSection officials={officials} />
        </div>
      </div>
    </main>
  )
}
