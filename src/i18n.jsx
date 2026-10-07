import { createContext, useContext, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { RTL_LANGS } from './site'
import { applyHead, buildHead } from './seo'

// Each language is a separate chunk: visitors only download their own.
const loaders = {
  en: () => Promise.all([import('./content/en'), import('./content/modules.en')]),
  fr: () => Promise.all([import('./content/fr'), import('./content/modules.fr')]),
  ar: () => Promise.all([import('./content/ar'), import('./content/modules.ar')]),
  es: () => Promise.all([import('./content/es'), import('./content/modules.es')]),
  it: () => Promise.all([import('./content/it'), import('./content/modules.it')]),
}
export const LANGS = {}
export async function loadLang(code) {
  if (!LANGS[code]) {
    const [content, modules] = await loaders[code]()
    LANGS[code] = { ...content.default, MOD: modules.default }
  }
  return LANGS[code]
}
export const PREF_KEY = 'stepup-lang'

const LangContext = createContext({ lang: 'en', setLang: () => {}, t: null, rtl: false })

// The language comes from the URL (/fr/…, /en/…). Switching language loads the
// same page under the other prefix, so every language has its own indexable URL.
export function LangProvider({ lang, children }) {
  const rtl = RTL_LANGS.includes(lang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = rtl ? 'rtl' : 'ltr'
    try {
      localStorage.setItem(PREF_KEY, lang)
    } catch {
      // preference not saved; the URL still carries the language
    }
  }, [lang, rtl])

  const value = useMemo(
    () => ({
      lang,
      rtl,
      t: LANGS[lang],
      setLang: (code) => {
        if (code === lang) return
        try {
          localStorage.setItem(PREF_KEY, code)
        } catch {
          // ignore
        }
        const rest = window.location.pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '')
        window.location.assign(`/${code}${rest}${window.location.search}${window.location.hash}`)
      },
    }),
    [lang, rtl],
  )
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}

// ---------- Page metadata ----------

// During prerendering this object collects the current page's <head> tags.
export const SeoContext = createContext(null)

export function useSeo({ title, description, jsonLd = [], noindex = false }) {
  const { lang, t } = useLang()
  const { pathname } = useLocation()
  const collector = useContext(SeoContext)
  const path = pathname === '' ? '/' : pathname
  const isHome = path === '/'
  const fullTitle = isHome ? t.meta.title : `${title} | Stepup`
  const tags = buildHead({ lang, path, title: fullTitle, description: description || t.meta.description, jsonLd, noindex, isHome })
  if (collector) collector.tags = tags

  const key = JSON.stringify(tags)
  useEffect(() => {
    applyHead(JSON.parse(key))
  }, [key])
}
