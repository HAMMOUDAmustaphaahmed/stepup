import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import './story.css'
import './mirror.css'
import './v4.css'
import './pages.css'
import './motion.css'
import './rtl.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { LANG_CODES, DEFAULT_LANG, splitLang } from './site'
import { PREF_KEY, loadLang } from './i18n'

const { lang } = splitLang(window.location.pathname)

// The dev server has no prerendered <head>: load every font family there.
if (!document.querySelector('link[data-fonts]')) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400..800&family=Montserrat:wght@500..800&family=Open+Sans:wght@400..700&display=swap'
  document.head.appendChild(link)
}

if (!lang) {
  // No language in the URL (e.g. "/"): send the visitor to their language.
  let pref = null
  try {
    pref = localStorage.getItem(PREF_KEY)
  } catch {
    // ignore
  }
  const browser = (navigator.languages || [navigator.language]).map((l) => l?.slice(0, 2).toLowerCase()).find((l) => LANG_CODES.includes(l))
  const target = LANG_CODES.includes(pref) ? pref : browser || DEFAULT_LANG
  const rest = window.location.pathname === '/' ? '' : window.location.pathname
  window.location.replace(`/${target}${rest}${window.location.search}${window.location.hash}`)
} else {
  const root = document.getElementById('root')
  const app = (
    <StrictMode>
      <BrowserRouter basename={`/${lang}`}>
        <App lang={lang} />
      </BrowserRouter>
    </StrictMode>
  )
  // Load this language's copy, then hydrate the prerendered page (or render it in dev).
  loadLang(lang).then(() => {
    // Hydrate only if this HTML was prerendered for this exact URL (not a 404 or fallback page).
    const here = window.location.pathname.replace(/\/+$/, '') || '/'
    if (root.dataset.ssr === here) hydrateRoot(root, app)
    else {
      root.textContent = ''
      createRoot(root).render(app)
    }
  })
}
