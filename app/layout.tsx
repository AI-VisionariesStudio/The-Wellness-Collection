import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Analytics } from '@vercel/analytics/react'
import Nav from '@/app/components/Nav'
import FloatingHelp from '@/app/components/FloatingHelp'
import DirectionManager from '@/app/components/DirectionManager'
import ScrollReveal from '@/app/components/ScrollReveal'
export const metadata: Metadata = {
  title: 'The Wellness Collection',
  description: 'Online courses designed to help you understand yourself, heal your patterns, and move forward with clarity and intention.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
