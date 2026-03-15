'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0, rootMargin: '0px 0px -40px 0px' }
    )

    const observe = () => {
      document.querySelectorAll('.reveal:not(.revealed)').forEach(el => io.observe(el))
    }

    // Watch for DOM changes (Next.js may commit page content after effect runs)
    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })

    // Multiple timing attempts to cover different render phases
    observe()
    const r1 = requestAnimationFrame(observe)
    const r2 = requestAnimationFrame(() => requestAnimationFrame(observe))
    const t1 = setTimeout(observe, 100)
    const t2 = setTimeout(observe, 400)

    return () => {
      cancelAnimationFrame(r1)
      cancelAnimationFrame(r2)
      clearTimeout(t1)
      clearTimeout(t2)
      mo.disconnect()
      io.disconnect()
    }
  }, [pathname])

  return null
}
