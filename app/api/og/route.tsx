import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const name = searchParams.get('name') ?? 'Unknown Official'
  const office = searchParams.get('office') ?? ''
  const constituency = searchParams.get('constituency') ?? ''
  const party = searchParams.get('party') ?? ''
  const partyColor = searchParams.get('partyColor') ?? '#6b7280'
  const state = searchParams.get('state') ?? ''
  const photo = searchParams.get('photo') ?? ''
  const age = searchParams.get('age') ?? ''
  const electionDays = searchParams.get('electionDays') ?? ''

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 48px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', height: '20px', overflow: 'hidden', borderRadius: '2px' }}>
              <div style={{ width: '10px', backgroundColor: '#166534' }} />
              <div style={{ width: '10px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }} />
              <div style={{ width: '10px', backgroundColor: '#166534' }} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#166534' }}>
              MyReps.ng
            </span>
          </div>
          {electionDays && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#166534',
              }}
            >
              Election in {electionDays} days
            </div>
          )}
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            padding: '0 48px',
            gap: '40px',
          }}
        >
          {/* Photo / initials */}
          {photo ? (
            <img
              src={photo}
              width={160}
              height={160}
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #e5e7eb',
              }}
            />
          ) : (
            <div
              style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                backgroundColor: '#f0fdf4',
                border: '2px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 700,
                color: '#166534',
              }}
            >
              {initials}
            </div>
          )}

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <p style={{ fontSize: '42px', fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.2 }}>
              {name}
            </p>
            <p style={{ fontSize: '22px', color: '#6b7280', margin: '8px 0 0 0' }}>
              {office}
              {constituency ? ` · ${constituency}` : ''}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
              {party && (
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    padding: '4px 14px',
                    borderRadius: '999px',
                    backgroundColor: `${partyColor}22`,
                    color: partyColor,
                  }}
                >
                  {party}
                </span>
              )}
              {state && (
                <span
                  style={{
                    fontSize: '16px',
                    padding: '4px 14px',
                    borderRadius: '999px',
                    backgroundColor: '#f3f4f6',
                    color: '#4b5563',
                  }}
                >
                  {state}
                </span>
              )}
              {age && (
                <span
                  style={{
                    fontSize: '16px',
                    padding: '4px 14px',
                    borderRadius: '999px',
                    backgroundColor: '#f3f4f6',
                    color: '#4b5563',
                  }}
                >
                  Age {age}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 48px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
          }}
        >
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
            Know who represents you · myreps.ng
          </p>
          <p style={{ fontSize: '14px', color: '#166534', fontWeight: 600, margin: 0 }}>
            Find your representatives →
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
