import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ─── Client-side instance (use in 'use client' components) ───────────────────
// Uses @supabase/ssr so auth state (including PKCE code verifier) is stored in
// cookies, making it accessible to server-side routes and middleware.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
