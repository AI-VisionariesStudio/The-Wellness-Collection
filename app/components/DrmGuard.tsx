'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function DrmGuard() {
  const { data: session } = useSession()
  const isAdmin = (session?.user as any)?.role === 'ADMIN'

  useEffect(() => {
    if (isAdmin) return

    // Block right-click context menu
    const noContext = (e: MouseEvent) => e.preventDefault()

    // Block save, print, view-source, devtools keyboard shortcuts
    const noKeys = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey
      const blocked =
        (ctrl && ['s', 'p', 'u', 'a'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' ||
        (ctrl && e.shiftKey && ['i', 'j', 'c', 'k'].includes(e.key.toLowerCase()))
      if (blocked) {
        e.preventDefault()
        return false
      }
    }

    // Black screen briefly on PrintScreen — cleared clipboard so paste yields nothing
    const onPrintScreen = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('').catch(() => {})
        document.body.style.filter = 'brightness(0)'
        setTimeout(() => { document.body.style.filter = '' }, 300)
      }
    }

    // Disable text selection
    document.body.style.userSelect = 'none'
    ;(document.body.style as any).webkitUserSelect = 'none'

    document.addEventListener('contextmenu', noContext)
    document.addEventListener('keydown', noKeys)
    document.addEventListener('keyup', onPrintScreen)

    return () => {
      document.body.style.userSelect = ''
      ;(document.body.style as any).webkitUserSelect = ''
      document.removeEventListener('contextmenu', noContext)
      document.removeEventListener('keydown', noKeys)
      document.removeEventListener('keyup', onPrintScreen)
    }
  }, [isAdmin])

  return null
}
