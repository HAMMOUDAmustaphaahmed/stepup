// Server entry used by scripts/prerender.mjs to render each page to static HTML.
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import App from './App.jsx'
import { SeoContext, loadLang } from './i18n'
import { headToString } from './seo'
import { MODULES } from './data/modules'
import { LANG_CODES, RTL_LANGS, SITE_URL, STATIC_PATHS } from './site'

export { LANG_CODES, RTL_LANGS, SITE_URL }
export { LANGS } from './i18n'
export { MODULES } from './data/modules'

export const PATHS = [...STATIC_PATHS, ...MODULES.map((m) => `/modules/${m.slug}`)]

// Loads every language before rendering (render itself is synchronous).
export const prepare = () => Promise.all(LANG_CODES.map(loadLang))

export function render(lang, path) {
  const collector = { tags: [] }
  const html = renderToString(
    <SeoContext.Provider value={collector}>
      <StaticRouter basename={`/${lang}`} location={`/${lang}${path === '/' ? '' : path}`}>
        <App lang={lang} />
      </StaticRouter>
    </SeoContext.Provider>,
  )
  return { html, head: headToString(collector.tags) }
}
