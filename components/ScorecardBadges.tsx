/**
 * Scorecard badges for legislative accountability metrics.
 * Only renders badges for non-null values — officials without
 * tracked data simply show nothing.
 */

interface Props {
  billsSponsored?: number | null
  motionsMoved?: number | null
  attendancePct?: number | null
  size?: 'sm' | 'md'
}

export default function ScorecardBadges({
  billsSponsored,
  motionsMoved,
  attendancePct,
  size = 'sm',
}: Props) {
  const hasAny = billsSponsored != null || motionsMoved != null || attendancePct != null
  if (!hasAny) return null

  if (size === 'md') {
    return (
      <div className="grid grid-cols-3 gap-3">
        {billsSponsored != null && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-blue-700">{billsSponsored}</p>
            <p className="text-[11px] text-blue-500 mt-0.5">Bills sponsored</p>
          </div>
        )}
        {motionsMoved != null && (
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 text-center">
            <p className="text-xl font-bold text-purple-700">{motionsMoved}</p>
            <p className="text-[11px] text-purple-500 mt-0.5">Motions moved</p>
          </div>
        )}
        {attendancePct != null && (
          <div className={`border rounded-lg p-3 text-center ${
            attendancePct >= 75
              ? 'bg-green-50 border-green-100'
              : attendancePct >= 50
                ? 'bg-amber-50 border-amber-100'
                : 'bg-red-50 border-red-100'
          }`}>
            <p className={`text-xl font-bold ${
              attendancePct >= 75
                ? 'text-green-700'
                : attendancePct >= 50
                  ? 'text-amber-700'
                  : 'text-red-700'
            }`}>{attendancePct}%</p>
            <p className={`text-[11px] mt-0.5 ${
              attendancePct >= 75
                ? 'text-green-500'
                : attendancePct >= 50
                  ? 'text-amber-500'
                  : 'text-red-500'
            }`}>Attendance</p>
          </div>
        )}
      </div>
    )
  }

  // sm — inline badges for cards and table rows
  return (
    <span className="inline-flex items-center gap-1.5">
      {billsSponsored != null && (
        <span className="bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap">
          {billsSponsored} bill{billsSponsored !== 1 ? 's' : ''}
        </span>
      )}
      {motionsMoved != null && (
        <span className="bg-purple-50 border border-purple-100 text-purple-700 text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap">
          {motionsMoved} motion{motionsMoved !== 1 ? 's' : ''}
        </span>
      )}
      {attendancePct != null && (
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap border ${
          attendancePct >= 75
            ? 'bg-green-50 border-green-100 text-green-700'
            : attendancePct >= 50
              ? 'bg-amber-50 border-amber-100 text-amber-700'
              : 'bg-red-50 border-red-100 text-red-700'
        }`}>
          {attendancePct}% att.
        </span>
      )}
    </span>
  )
}
