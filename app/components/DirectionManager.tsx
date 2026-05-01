'use client'
import { useEffect } from 'react'
import { useLanguage } from '@/app/LanguageContext'

export default function DirectionManager() {
  const { lang } = useLanguage()

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr'
  }, [lang])

  return null
}
