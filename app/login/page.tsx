'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Status = 'idle' | 'loading' | 'sent' | 'error'

export default function LoginPage() {
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        // Supabase redirects here after the user clicks the link in their email
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setStatus(error ? 'error' : 'sent')
  }

  // ── Sent state ────────────────────────────────────────────────────────────
  if (status === 'sent') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-700 text-lg mx-auto mb-4">
            ✓
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Check your email</h2>
          <p className="text-sm text-gray-500 mb-1">
            We sent a login link to
          </p>
          <p className="text-sm font-medium text-gray-800 mb-5">{email}</p>
          <p className="text-xs text-gray-400 mb-6">
            Click the link in the email to access the admin panel.
            The link expires in 60 minutes.
          </p>
          <button
            onClick={() => { setStatus('idle'); setEmail('') }}
            className="text-sm text-green-700 hover:underline"
          >
            Use a different email
          </button>
        </div>
      </div>
    )
  }

  // ── Login form ────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Wordmark */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="flex h-4 overflow-hidden rounded-sm border border-gray-200">
              <div className="w-2 bg-green-800" />
              <div className="w-2 bg-white" />
              <div className="w-2 bg-green-800" />
            </div>
            <span className="text-base font-semibold text-green-800 tracking-tight">
              WhoRepresentsMe<span className="text-gray-400">.ng</span>
            </span>
          </div>
          <p className="text-sm text-gray-500">Admin panel · Sign in</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1.5">
              Email address
            </label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@yourteam.com"
              className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-green-700"
            />
          </div>

          {status === 'error' && (
            <p className="text-sm text-red-600">
              Something went wrong. Check the email and try again.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-green-800 text-white text-sm font-medium py-2.5 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {status === 'loading' ? 'Sending link...' : 'Send login link'}
          </button>
        </form>

        {/* Footer note */}
        <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
          Access is restricted to authorised team members only.
          <br />
          No password needed — we'll email you a secure link.
        </p>

        <div className="border-t border-gray-100 mt-6 pt-4 text-center">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">
            ← Back to public directory
          </Link>
        </div>
      </div>
    </main>
  )
}
