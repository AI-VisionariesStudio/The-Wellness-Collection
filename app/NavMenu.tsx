'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

export default function NavMenu() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === 'ADMIN'

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none', border: '2px solid var(--navy)',
          borderRadius: '8px', padding: '8px 16px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px',
          color: 'var(--navy)', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500
        }}
      >
        ☰ Menu
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 98 }}
          />
          {/* Dropdown */}
          <div style={{
            position: 'absolute', right: 0, top: '48px',
            background: 'white', borderRadius: '12px', zIndex: 99,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            border: '1px solid var(--border)',
            minWidth: '200px', overflow: 'hidden'
          }}>
            {[
        { label: 'Home', href: '/' },
        session ? { label: 'Dashboard', href: '/dashboard' } : null,
        session ? { label: 'My Courses', href: '/dashboard' } : null,
        isAdmin ? { label: 'Admin Panel', href: '/admin' } : null,
      ].filter(Boolean).map((item: any) => (
    
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  display: 'block', padding: '14px 20px',
                  color: 'var(--navy)', fontSize: '15px',
                  borderBottom: '1px solid var(--border)',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--cream)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'white')}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              style={{
                display: 'block', width: '100%', padding: '14px 20px',
                color: '#c0392b', fontSize: '15px', textAlign: 'left',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              🚪 Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}