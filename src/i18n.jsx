import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import en from './content/en'
import fr from './content/fr'
import ar from './content/ar'
import es from './content/es'
import it from './content/it'
import modulesEn from './content/modules.en'
import modulesFr from './content/modules.fr'
import modulesAr from './content/modules.ar'
import modulesEs from './content/modules.es'
import modulesIt from './content/modules.it'

export const LANGS = {
  en: { ...en, MOD: modulesEn },
  fr: { ...fr, MOD: modulesFr },
  ar: { ...ar, MOD: modulesAr },
  es: { ...es, MOD: modulesEs },
  it: { ...it, MOD: modulesIt },
}
export const RTL = ['ar']
const KEY = 'stepup-lang'

function initialLang() {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved && LANGS[saved]) return saved
  } catch {
    // storage blocked: fall back to the browser language
  }
  const nav = navigator.language?.toLowerCase().slice(0, 2)
  return LANGS[nav] ? nav : 'en'
}

const LangContext = createContext({ lang: 'en', setLang: () => {}, t: LANGS.en, rtl: false })

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initialLang)
  const rtl = RTL.includes(lang)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, lang)
    } catch {
      // not persisted; the choice still applies for this visit
    }
    const t = LANGS[lang]
    document.documentElement.lang = lang
    document.documentElement.dir = rtl ? 'rtl' : 'ltr'
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
  }, [lang, rtl])

  const value = useMemo(() => ({ lang, setLang, t: LANGS[lang], rtl }), [lang, rtl])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}

// Sets the browser tab title for the current page.
export function usePageTitle(title) {
  const { t } = useLang()
  useEffect(() => {
    document.title = title ? `${title} — Stepup` : t.meta.title
  }, [title, t])
}
