import { createBrowserClient } from '@supabase/ssr'

// ─── Client-side instance (use in 'use client' components) ───────────────────
// Lazily initialised so module evaluation during Next.js prerendering does not
// throw when NEXT_PUBLIC_* env vars are absent from the build container.
let _client: ReturnType<typeof createBrowserClient> | null = null

function getBrowserClient() {
  if (!_client) {
    _client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return _client
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: ReturnType<typeof createBrowserClient> = new Proxy({} as any, {
  get(_, prop) { return (getBrowserClient() as any)[prop] },
})
