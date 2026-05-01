'use client'
import { createContext, useContext, useState, useEffect } from 'react'

type Lang = 'en' | 'he'
interface LanguageContextType { lang: Lang; setLang: (l: Lang) => void }

const LanguageContext = createContext<LanguageContextType>({ lang: 'en', setLang: () => {} })

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null
    if (stored === 'he' || stored === 'en') setLangState(stored)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
