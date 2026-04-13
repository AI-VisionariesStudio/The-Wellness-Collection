'use client'
import { useEffect, useRef, useState } from 'react'

interface Props {
  videoId: string
  lessonId: string
  onEnded?: () => void
}

export default function VdoCipherPlayer({ videoId, lessonId, onEnded }: Props) {
  const [otp, setOtp] = useState<string | null>(null)
  const [playbackInfo, setPlaybackInfo] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Fetch OTP from our backend when the component mounts or videoId changes
  useEffect(() => {
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
  }, [videoId, lessonId])

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
