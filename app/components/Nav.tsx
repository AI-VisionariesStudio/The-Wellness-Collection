'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/app/LanguageContext'
import { t } from '@/lib/translations'

export default function Nav() {
  const { data: session } = useSession()
  const router = useRouter()
  const { lang, setLang } = useLanguage()
  const T = t[lang].nav
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  async function handleLogout() {
    await signOut({ redirect: false })
    router.push('/')
    router.refresh()
  }

  const menuItems = [
    { label: T.home, href: '/' },
    { label: T.about, href: '/about' },
    { label: T.courses, href: '/dashboard' },
    { label: T.resources, href: '/resources' },
    { label: T.workbooks, href: '/workbooks' },
    { label: T.disclaimers, href: '/disclaimers' },
    { label: T.contact, href: '/contact' },
  ]

  return (
    <nav style={{ background: 'var(--header)', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
      <style>{`
        @media (max-width: 640px) {
          .nav-logo { display: none !important; }
          .nav-title-desktop { display: none !important; }
          .nav-mobile-header { display: flex !important; }
          .nav-menu-btn-text { display: none !important; }
          nav { padding: 12px 16px !important; }
          .nav-mobile-header { position: absolute !important; left: 50% !important; transform: translateX(-50%) !important; }
        }
        @media (min-width: 641px) {
          .nav-mobile-header { display: none !important; }
        }
      `}</style>
      <Link href="/" className="nav-logo">
        <img src="/gr-logo.png" alt="Logo" style={{ height: '100px', width: '100px', objectFit: 'contain' }} />
      </Link>
      {/* Desktop title */}
      <Link href="/" className="nav-title-desktop" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', textDecoration: 'none' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 400, color: 'var(--text)', margin: 0, letterSpacing: '0.04em', lineHeight: 1.2 }}>
          Gracefully Redefined
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 400, color: 'var(--text-muted)', margin: '3px 0 0', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          {t[lang].home.tagline}
        </p>
      </Link>
      {/* Mobile title — truly centered using a spacer div on the left matching button width */}
      <Link href="/" className="nav-mobile-header" style={{ flex: 1, flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 400, color: 'var(--text)', margin: 0, letterSpacing: '0.04em', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
          Gracefully Redefined
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 400, color: 'var(--text-muted)', margin: '3px 0 0', letterSpacing: '0.15em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          The Wellness Collection
        </p>
      </Link>
      <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{ cursor: 'pointer', padding: '10px 20px', border: '1px solid var(--text)', borderRadius: 'var(--radius)', fontSize: '13px', fontFamily: 'var(--font-body)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)', background: 'transparent' }}
        >
          ☰ <span className="nav-menu-btn-text">Menu</span>
        </button>
        {open && (
          <div style={{ position: 'absolute', right: 0, top: '52px', background: 'var(--cream)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', minWidth: '220px', overflow: 'hidden', zIndex: 99 }}>
            {menuItems.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} style={{ display: 'block', padding: '14px 24px', color: 'var(--text)', fontSize: '14px', fontFamily: 'var(--font-body)', letterSpacing: '0.04em', borderBottom: '1px solid var(--border-light)', direction: lang === 'he' ? 'rtl' : 'ltr' }}>
                {item.label}
              </Link>
            ))}


            {session && (
              <Link href="/dashboard" onClick={() => setOpen(false)} style={{ display: 'block', padding: '14px 24px', color: 'var(--text)', fontSize: '14px', fontFamily: 'var(--font-body)', letterSpacing: '0.04em', borderBottom: '1px solid var(--border-light)', direction: lang === 'he' ? 'rtl' : 'ltr' }}>
                My Dashboard
              </Link>
            )}
            {(session?.user as any)?.role === 'ADMIN' && (
              <Link href="/admin" onClick={() => setOpen(false)} style={{ display: 'block', padding: '14px 24px', color: 'var(--gold)', fontSize: '14px', fontFamily: 'var(--font-body)', letterSpacing: '0.04em', borderBottom: '1px solid var(--border-light)', direction: lang === 'he' ? 'rtl' : 'ltr' }}>
                Admin Panel
              </Link>
            )}
            {session ? (
              <button
                onClick={() => { setOpen(false); handleLogout() }}
                style={{ display: 'block', width: '100%', textAlign: lang === 'he' ? 'right' : 'left', padding: '14px 24px', color: 'var(--text)', fontSize: '14px', fontFamily: 'var(--font-body)', letterSpacing: '0.04em', background: 'none', border: 'none', cursor: 'pointer', borderTop: '1px solid var(--border)', direction: lang === 'he' ? 'rtl' : 'ltr' }}
              >
                {T.logout}
              </button>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} style={{ display: 'block', padding: '14px 24px', color: 'var(--text)', fontSize: '14px', fontFamily: 'var(--font-body)', letterSpacing: '0.04em', direction: lang === 'he' ? 'rtl' : 'ltr' }}>
                {T.login}
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
