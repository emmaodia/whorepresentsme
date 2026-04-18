'use client'

/**
 * Election countdown badge. Shows days remaining until an election date.
 * Colour shifts from green (far) → amber (< 1 year) → red (< 90 days).
 * Returns null if the date is in the past or missing.
 */
export default function ElectionCountdown({
  date,
  size = 'sm',
}: {
  date?: string | null
  size?: 'sm' | 'md' | 'lg'
}) {
  if (!date) return null

  const target = new Date(date)
  const now = new Date()
  const diffMs = target.getTime() - now.getTime()
  if (diffMs <= 0) return null

  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  // Human-friendly label
  let label: string
  if (days <= 1) label = 'Tomorrow'
  else if (days <= 60) label = `${days} days`
  else if (days <= 365) label = months === 1 ? '1 month' : `${months} months`
  else label = years === 1 ? `1 yr ${months - 12 > 0 ? `${months - 12} mo` : ''}`.trim() : `${years} yrs`

  // Urgency colour
  let bg: string, text: string, ring: string
  if (days <= 90) {
    bg = 'bg-red-50'; text = 'text-red-700'; ring = 'border-red-200'
  } else if (days <= 365) {
    bg = 'bg-amber-50'; text = 'text-amber-700'; ring = 'border-amber-200'
  } else {
    bg = 'bg-green-50'; text = 'text-green-700'; ring = 'border-green-200'
  }

  if (size === 'lg') {
    return (
      <div className={`${bg} ${ring} border rounded-lg p-4 text-center`}>
        <p className={`text-2xl font-bold ${text}`}>{days}</p>
        <p className={`text-xs ${text} font-medium mt-0.5`}>days to election</p>
        <p className="text-[11px] text-gray-400 mt-1">
          {target.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    )
  }

  if (size === 'md') {
    return (
      <div className={`${bg} ${ring} border rounded-lg px-3 py-2 inline-flex items-center gap-2`}>
        <span className={`text-base font-bold ${text}`}>{days}</span>
        <div>
          <p className={`text-xs font-medium ${text} leading-tight`}>days to election</p>
          <p className="text-[10px] text-gray-400">
            {target.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>
    )
  }

  // sm (default) — compact badge for table rows and cards
  return (
    <span className={`${bg} ${ring} border rounded-full px-2 py-0.5 text-[10px] font-medium ${text} inline-flex items-center gap-1 whitespace-nowrap`}>
      {label}
    </span>
  )
}
