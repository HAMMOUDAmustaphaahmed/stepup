// Site-wide configuration for URLs, languages and indexable routes.
// Set VITE_SITE_URL at build time to the real domain (e.g. https://www.stepup.app).

export const SITE_URL = (import.meta.env?.VITE_SITE_URL || 'https://www.stepup.app').replace(/\/$/, '')
export const SITE_NAME = 'Stepup'

export const LANG_CODES = ['fr', 'en', 'ar', 'es', 'it']
export const DEFAULT_LANG = 'en'
export const RTL_LANGS = ['ar']

// Open Graph locale per language
export const OG_LOCALE = { fr: 'fr_FR', en: 'en_US', ar: 'ar_AR', es: 'es_ES', it: 'it_IT' }

// Every indexable path (without language prefix). Module pages are added from data/modules.js.
export const STATIC_PATHS = ['/', '/platform', '/modules', '/ai', '/solutions', '/pricing', '/diagnostic', '/faq', '/contact']

// "/fr/modules/audits" -> { lang: 'fr', path: '/modules/audits' }
export function splitLang(pathname) {
  const m = pathname.match(/^\/([a-z]{2})(?=\/|$)(.*)$/)
  if (m && LANG_CODES.includes(m[1])) return { lang: m[1], path: m[2] || '/' }
  return { lang: null, path: pathname || '/' }
}

export const localUrl = (lang, path = '/') => `${SITE_URL}/${lang}${path === '/' ? '' : path}`
