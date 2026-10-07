// Builds every <head> tag a page needs: title, description, canonical, hreflang,
// Open Graph, Twitter and JSON-LD. Used by the prerenderer (as HTML) and by the
// browser after client-side navigation (as DOM updates).
import { LANG_CODES, OG_LOCALE, SITE_NAME, SITE_URL, localUrl } from './site'

const clip = (s, n) => {
  const t = String(s || '').replace(/\s+/g, ' ').trim()
  if (t.length <= n) return t
  const cut = t.slice(0, n - 1)
  return cut.slice(0, cut.lastIndexOf(' ')) + '…'
}

export function buildHead({ lang, path, title, description, jsonLd = [], noindex = false, isHome = false }) {
  const url = localUrl(lang, path)
  const desc = clip(description, 158)
  const image = `${SITE_URL}/og/og-${lang}.png`
  const tags = [
    { tag: 'title', text: title },
    { tag: 'meta', attrs: { name: 'description', content: desc } },
    { tag: 'meta', attrs: { name: 'robots', content: noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' } },
    { tag: 'link', attrs: { rel: 'canonical', href: url } },
    ...LANG_CODES.map((l) => ({ tag: 'link', attrs: { rel: 'alternate', hreflang: l, href: localUrl(l, path) } })),
    { tag: 'link', attrs: { rel: 'alternate', hreflang: 'x-default', href: isHome ? `${SITE_URL}/` : localUrl('en', path) } },
    { tag: 'meta', attrs: { property: 'og:type', content: isHome ? 'website' : 'article' } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: SITE_NAME } },
    { tag: 'meta', attrs: { property: 'og:title', content: title } },
    { tag: 'meta', attrs: { property: 'og:description', content: desc } },
    { tag: 'meta', attrs: { property: 'og:url', content: url } },
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
    { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: title } },
    { tag: 'meta', attrs: { property: 'og:locale', content: OG_LOCALE[lang] } },
    ...LANG_CODES.filter((l) => l !== lang).map((l) => ({ tag: 'meta', attrs: { property: 'og:locale:alternate', content: OG_LOCALE[l] } })),
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: desc } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: image } },
  ]
  if (jsonLd.length) tags.push({ tag: 'script', attrs: { type: 'application/ld+json' }, text: JSON.stringify({ '@context': 'https://schema.org', '@graph': jsonLd }) })
  return tags
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// For the prerenderer
export function headToString(tags) {
  return tags
    .map(({ tag, attrs = {}, text }) => {
      const a = Object.entries(attrs)
        .map(([k, v]) => ` ${k}="${esc(v)}"`)
        .join('')
      if (tag === 'meta' || tag === 'link') return `<${tag}${a} data-seo>`
      const body = tag === 'script' ? text.replace(/</g, '\\u003c') : esc(text)
      return `<${tag}${a}${tag === 'title' ? '' : ' data-seo'}>${body}</${tag}>`
    })
    .join('\n    ')
}

// For client-side navigation
export function applyHead(tags) {
  document.head.querySelectorAll('[data-seo]').forEach((n) => n.remove())
  for (const { tag, attrs = {}, text } of tags) {
    if (tag === 'title') {
      document.title = text
      continue
    }
    const el = document.createElement(tag)
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
    el.setAttribute('data-seo', '')
    if (text) el.textContent = text
    document.head.appendChild(el)
  }
}

// ---------- JSON-LD building blocks ----------

export const orgLd = () => ({
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/icons/icon-512.png`, width: 512, height: 512 },
})

export const websiteLd = (lang) => ({
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  inLanguage: LANG_CODES,
  publisher: { '@id': `${SITE_URL}/#organization` },
  hasPart: { '@type': 'WebPage', url: localUrl(lang, '/'), inLanguage: lang },
})

export const softwareLd = ({ lang, description, features }) => ({
  '@type': 'SoftwareApplication',
  '@id': `${SITE_URL}/#software`,
  name: SITE_NAME,
  url: localUrl(lang, '/'),
  description,
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'Operational excellence, quality management (QMS), continuous improvement',
  operatingSystem: 'Web, iOS, Android',
  inLanguage: LANG_CODES,
  featureList: features,
  publisher: { '@id': `${SITE_URL}/#organization` },
  image: `${SITE_URL}/og/og-${lang}.png`,
})

export const breadcrumbLd = (lang, items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: localUrl(lang, path) })),
})

export const webPageLd = ({ lang, path, title, description, about }) => ({
  '@type': 'WebPage',
  '@id': `${localUrl(lang, path)}#webpage`,
  url: localUrl(lang, path),
  name: title,
  description,
  inLanguage: lang,
  isPartOf: { '@id': `${SITE_URL}/#website` },
  ...(about ? { about } : { about: { '@id': `${SITE_URL}/#software` } }),
})

export const faqLd = (items) => ({
  '@type': 'FAQPage',
  mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
})

// WebPage + breadcrumb for a simple inner page
export const pageLd = ({ lang, path, title, description, home, crumbs }) => [
  webPageLd({ lang, path, title, description }),
  breadcrumbLd(lang, [[home, '/'], ...crumbs]),
]
