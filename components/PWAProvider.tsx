'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAProvider() {
  const [isOffline, setIsOffline] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Register service worker (production only — SW causes stale caching in dev)
    if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    } else if ('serviceWorker' in navigator && window.location.hostname === 'localhost') {
      // Unregister any existing SW in dev to prevent stale caches
      navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(r => r.unregister())
      })
    }

    // Offline detection
    const goOffline = () => setIsOffline(true)
    const goOnline = () => setIsOffline(false)
    setIsOffline(!navigator.onLine)
    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)

    // Install prompt
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      // Only show if user hasn't dismissed before in this session
      const wasDismissed = sessionStorage.getItem('pwa-install-dismissed')
      if (!wasDismissed) {
        setShowInstallBanner(true)
      }
    }
    window.addEventListener('beforeinstallprompt', handleInstallPrompt)

    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setShowInstallBanner(false)
    }
    setInstallPrompt(null)
  }

  const handleDismiss = () => {
    setShowInstallBanner(false)
    setDismissed(true)
    sessionStorage.setItem('pwa-install-dismissed', '1')
  }

  return (
    <>
      {/* Offline indicator */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white text-center text-xs py-1.5 font-medium">
          You are offline. Showing cached data.
        </div>
      )}

      {/* Install banner */}
      {showInstallBanner && !dismissed && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg px-4 py-3 safe-bottom">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-green-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
                WRM
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Install MyReps</p>
                <p className="text-xs text-gray-500">Access your reps anytime, even offline</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleDismiss}
                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5"
              >
                Not now
              </button>
              <button
                onClick={handleInstall}
                className="text-xs bg-green-800 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
