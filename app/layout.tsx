import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Analytics } from '@vercel/analytics/react'
import Nav from '@/app/components/Nav'
import FloatingHelp from '@/app/components/FloatingHelp'
import DirectionManager from '@/app/components/DirectionManager'
import ScrollReveal from '@/app/components/ScrollReveal'
import DrmGuard from '@/app/components/DrmGuard'
export const metadata: Metadata = {
  title: 'The Wellness Collection',
  description: 'Online courses designed to help you understand yourself, heal your patterns, and move forward with clarity and intention.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png?v=3" type="image/png" sizes="180x180" />
        <link rel="apple-touch-icon" href="/favicon-180x180.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
       <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0 }} suppressHydrationWarning>
        <Providers>
          <DrmGuard />
          <DirectionManager />
          <Nav />
          {children}
          <FloatingHelp />
          <ScrollReveal />
          <Analytics />
        </Providers>
      </body>
    </html>
  )}
