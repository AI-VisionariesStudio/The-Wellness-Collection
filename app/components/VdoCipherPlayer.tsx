'use client'
import { useEffect, useRef, useState } from 'react'

interface Props {
  videoId: string
  lessonId: string
  onEnded?: () => void
}

function isIOSNonSafari(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  if (!isIOS) return false
  // Safari on iOS includes "Safari" but NOT "Chrome", "CriOS", "FxiOS", "EdgiOS", etc.
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|Chrome/.test(ua)
  return !isSafari
}

function IOSSafariPrompt() {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <div style={{
      aspectRatio: '16/9',
      background: 'var(--header)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      gap: '16px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '28px', lineHeight: 1 }}>🎬</div>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 300, color: 'var(--text)', margin: 0, lineHeight: 1.4 }}>
        Open in Safari to watch
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6, maxWidth: '260px' }}>
        Video playback is not supported in this browser on iOS. Copy the link below and paste it into Safari.
      </p>
      <button
        onClick={copyLink}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          letterSpacing: '0.08em',
          padding: '10px 24px',
          background: copied ? 'var(--success)' : 'var(--text)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius)',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {copied ? '✓ Copied!' : 'Copy Link'}
      </button>
      <a
        href={`x-safari-${url}`}
        style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em', textDecoration: 'underline', textDecorationColor: 'var(--border)' }}
      >
        or tap here to open in Safari
      </a>
    </div>
  )
}

export default function VdoCipherPlayer({ videoId, lessonId, onEnded }: Props) {
  const [otp, setOtp] = useState<string | null>(null)
  const [playbackInfo, setPlaybackInfo] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [iosNonSafari, setIosNonSafari] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    setIosNonSafari(isIOSNonSafari())
  }, [])

  // Fetch OTP from our backend when the component mounts or videoId changes
  useEffect(() => {
    if (iosNonSafari) return
    setOtp(null)
    setPlaybackInfo(null)
    setError(false)

    fetch('/api/vdocipher/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId, lessonId }),
    })
      .then(res => {
        if (!res.ok) throw new Error('OTP request failed')
        return res.json()
      })
      .then(data => {
        setOtp(data.otp)
        setPlaybackInfo(data.playbackInfo)
      })
      .catch(() => setError(true))
  }, [videoId, lessonId, iosNonSafari])

  // Listen for video end event from vdoCipher iframe
  useEffect(() => {
    if (!onEnded) return
    const onMessage = (e: MessageEvent) => {
      if (!String(e.origin).includes('vdocipher.com')) return
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
        if (data?.event === 'ended') onEnded()
      } catch { /* ignore non-JSON */ }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [onEnded])

  if (iosNonSafari) return <IOSSafariPrompt />

  if (error) {
    return (
      <div style={{
        aspectRatio: '16/9',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)' }}>
          Unable to load video. Please refresh and try again.
        </p>
      </div>
    )
  }

  if (!otp || !playbackInfo) {
    return (
      <div style={{
        aspectRatio: '16/9',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
          Loading video…
        </p>
      </div>
    )
  }

  const src = `https://player.vdocipher.com/v2/?otp=${otp}&playbackInfo=${playbackInfo}`

  return (
    <div
      onContextMenu={e => e.preventDefault()}
      style={{
        position: 'relative',
        paddingTop: '56.25%',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(180,160,140,0.12)',
        userSelect: 'none',
      }}
    >
      <iframe
        ref={iframeRef}
        src={src}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
        allow="encrypted-media"
        allowFullScreen
      />
    </div>
  )
}
