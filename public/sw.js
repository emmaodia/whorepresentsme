// WhoRepresentsMe.ng Service Worker
// Strategy: cache-first for static assets, network-first for pages/API

const CACHE_NAME = 'wrm-v1'
const STATIC_CACHE = 'wrm-static-v1'

// Static assets to pre-cache on install
const PRECACHE_URLS = [
  '/',
  '/find',
  '/voter-guide',
  '/polling-units',
  '/election-timetable',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

// Install: pre-cache key pages
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS)
    })
  )
  // Activate immediately
  self.skipWaiting()
})

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      )
    })
  )
  // Take control of all pages immediately
  self.clients.claim()
})

// Fetch: different strategies by request type
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip external requests (Google Maps, analytics, etc.)
  if (url.origin !== self.location.origin) return

  // Skip API routes (always go to network)
  if (url.pathname.startsWith('/api/')) return

  // Static assets (JS, CSS, images, fonts): cache-first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Pages: network-first with cache fallback
  event.respondWith(networkFirst(request))
})

// Cache-first: serve from cache, fall back to network
async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached

  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    // Return a basic offline response for images
    return new Response('', { status: 408, statusText: 'Offline' })
  }
}

// Network-first: try network, fall back to cache
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached

    // Return offline fallback page
    const offlineCached = await caches.match('/')
    if (offlineCached) return offlineCached

    return new Response(
      '<html><body style="font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f9fafb"><div style="text-align:center"><h1 style="color:#166534;font-size:1.5rem">WhoRepresentsMe.ng</h1><p style="color:#6b7280;font-size:0.875rem">You are offline. Please check your connection.</p></div></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    )
  }
}

function isStaticAsset(pathname) {
  return (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/data/polling-units/') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.woff2') ||
    pathname.endsWith('.woff')
  )
}
