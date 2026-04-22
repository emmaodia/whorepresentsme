import type { Metadata, Viewport } from 'next'
import './globals.css'
import PWAProvider from '@/components/PWAProvider'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://myreps.ng'),
  title: 'MyReps.ng',
  description: 'A public, open-source directory of every elected official in Nigeria.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MyReps',
  },
}

export const viewport: Viewport = {
  themeColor: '#166534',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="antialiased">
        <PWAProvider />
        {children}
      </body>
    </html>
  )
}
