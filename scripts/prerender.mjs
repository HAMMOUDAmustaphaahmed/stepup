// Turns the built single-page app into static, indexable HTML:
//  - one page per language and route (/fr/…, /en/…, /ar/…, /es/…, /it/…)
//  - 404.html, a language-choice page at "/" (x-default)
//  - sitemap.xml with hreflang alternates, robots.txt, llms.txt, llms-full.txt
//
// Optional build-time environment variables:
//   VITE_SITE_URL                 https://www.stepup.app (canonical domain)
//   GOOGLE_SITE_VERIFICATION      Google Search Console token
//   BING_SITE_VERIFICATION        Bing Webmaster Tools token (msvalidate.01)
//   YANDEX_VERIFICATION           Yandex Webmaster token
//   BAIDU_VERIFICATION            Baidu Search Resource Platform token
//   INDEXNOW_KEY                  key for IndexNow (Bing, Yandex, Naver, Seznam…)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssr = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href)
const { render, prepare, PATHS, LANG_CODES, RTL_LANGS, SITE_URL, LANGS, MODULES } = ssr
await prepare()

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const today = new Date().toISOString().slice(0, 10)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const url = (lang, p) => `${SITE_URL}/${lang}${p === '/' ? '' : p}`

const verification = [
  ['google-site-verification', process.env.GOOGLE_SITE_VERIFICATION],
  ['msvalidate.01', process.env.BING_SITE_VERIFICATION],
  ['yandex-verification', process.env.YANDEX_VERIFICATION],
  ['baidu-site-verification', process.env.BAIDU_VERIFICATION],
]
  .filter(([, v]) => v)
  .map(([n, v]) => `<meta name="${n}" content="${esc(v)}">`)
  .join('\n    ')

// <link rel="modulepreload"> for the page's language chunks
const manifestFile = path.join(dist, '.vite', 'manifest.json')
const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : {}
const preload = (lang) =>
  [`src/content/${lang}.js`, `src/content/modules.${lang}.js`]
    .map((k) => manifest[k]?.file)
    .filter(Boolean)
    .map((f) => `<link rel="modulepreload" href="/${f}">`)
    .join('\n    ')

// Fonts per language, loaded without blocking the first paint.
const FONT_URL = {
  ar: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400..800&display=swap',
  latin: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500..800&family=Open+Sans:wght@400..700&display=swap',
}
const fonts = (lang) => {
  const href = FONT_URL[lang === 'ar' ? 'ar' : 'latin']
  return `<link rel="preload" as="style" href="${href}" data-fonts>
    <link rel="stylesheet" href="${href}" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="${href}"></noscript>`
}

function fill({ lang, head, html, page }) {
  return template
    .replace('<div id="root">', `<div id="root" data-ssr="${page}">`)
    .replace('<!--app-lang-->', lang)
    .replace('<!--app-dir-->', RTL_LANGS.includes(lang) ? 'rtl' : 'ltr')
    .replace('<!--app-head-->', `${head}\n    ${preload(lang)}`)
    .replace('<!--app-verification-->', verification)
    .replace('<!--app-fonts-->', fonts(lang))
    .replace('<!--app-html-->', html)
}

function write(rel, content) {
  const file = path.join(dist, rel)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
}

// ---------- pages ----------
let count = 0
for (const lang of LANG_CODES) {
  for (const p of PATHS) {
    const { html, head } = render(lang, p)
    write(path.join(lang, p === '/' ? '' : p, 'index.html'), fill({ lang, head, html, page: `/${lang}${p === '/' ? '' : p}` }))
    count++
  }
}

// 404 (served by Vercel/Netlify for unknown URLs)
{
  const { html, head } = render('en', '/__not-found__')
  write('404.html', fill({ lang: 'en', head, html, page: '404' }))
}

// ---------- "/" : language choice (x-default) ----------
{
  const en = LANGS.en
  const names = { fr: 'Français', en: 'English', ar: 'العربية', es: 'Español', it: 'Italiano' }
  const head = [
    `<title>${esc(en.meta.title)}</title>`,
    `<meta name="description" content="${esc(en.meta.description)}" data-seo>`,
    `<meta name="robots" content="index, follow" data-seo>`,
    `<link rel="canonical" href="${SITE_URL}/" data-seo>`,
    ...LANG_CODES.map((l) => `<link rel="alternate" hreflang="${l}" href="${url(l, '/')}" data-seo>`),
    `<link rel="alternate" hreflang="x-default" href="${SITE_URL}/" data-seo>`,
    `<meta property="og:title" content="${esc(en.meta.title)}" data-seo>`,
    `<meta property="og:description" content="${esc(en.meta.description)}" data-seo>`,
    `<meta property="og:url" content="${SITE_URL}/" data-seo>`,
    `<meta property="og:image" content="${SITE_URL}/og/og-en.png" data-seo>`,
    `<meta name="twitter:card" content="summary_large_image" data-seo>`,
  ].join('\n    ')
  const body = `<main class="lang-gate">
      <span class="logo"><span class="logo-mark"></span>Stepup</span>
      <h1>${esc(en.meta.title)}</h1>
      <p>${esc(en.meta.description)}</p>
      <ul>${LANG_CODES.map((l) => `<li><a href="/${l}" hreflang="${l}" lang="${l}">${names[l]}</a></li>`).join('')}</ul>
    </main>`
  write('index.html', fill({ lang: 'en', head, html: body, page: 'gate' }))
}

// ---------- sitemap.xml ----------
{
  const entries = []
  for (const p of PATHS) {
    const alternates = [
      ...LANG_CODES.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${url(l, p)}"/>`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${p === '/' ? `${SITE_URL}/` : url('en', p)}"/>`,
    ].join('\n')
    const priority = p === '/' ? '1.0' : p.startsWith('/modules/') ? '0.7' : '0.8'
    for (const l of LANG_CODES) {
      entries.push(`  <url>\n    <loc>${url(l, p)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n${alternates}\n  </url>`)
    }
  }
  write(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`,
  )
}

// ---------- robots.txt ----------
{
  // Search engines and AI answer engines are explicitly welcome; only the chat API is excluded.
  const bots = [
    'Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'YandexBot', 'Baiduspider', 'Yeti', 'SeznamBot', 'Applebot', 'Qwantbot', 'PetalBot', 'Sogou web spider', '360Spider', 'NaverBot', 'CocCocBot',
    'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Meta-ExternalAgent', 'Amazonbot', 'cohere-ai', 'MistralAI-User', 'DuckAssistBot', 'YouBot', 'CCBot',
  ]
  const lines = ['User-agent: *', 'Allow: /', 'Disallow: /api/', '']
  for (const b of bots) lines.push(`User-agent: ${b}`, 'Allow: /', 'Disallow: /api/', '')
  lines.push(`Sitemap: ${SITE_URL}/sitemap.xml`, '')
  write('robots.txt', lines.join('\n'))
}

// ---------- llms.txt / llms-full.txt (for AI answer engines) ----------
{
  const en = LANGS.en
  const mod = en.MOD
  const pages = [
    ['/', 'Home', en.meta.description],
    ['/platform', 'Platform', en.PAGES.platform.lede],
    ['/modules', 'Modules', en.PAGES.modules.lede],
    ['/ai', 'AI agents', en.PAGES.ai.lede],
    ['/solutions', 'Solutions by role and industry', en.PAGES.solutions.lede],
    ['/pricing', 'Pricing and ROI', en.PAGES.pricing.lede],
    ['/diagnostic', '60-second self-assessment', en.PAGES.diagnostic.lede],
    ['/faq', 'FAQ', en.PAGES.faq.lede],
    ['/contact', 'Contact / demo request', en.PAGES.contact.lede],
  ]
  const intro = `# Stepup

> ${en.meta.description}

Stepup is operational-excellence software for industrial and service companies of 20 to 2,000 people that hold, or are working towards, ISO 9001, ISO 14001, ISO 45001, IATF 16949 or HACCP certification. It is not an ERP replacement: it connects to the software a company already uses in read-only mode, never changes it, and links audits, corrective actions (PDCA), Kaizen, meetings, tasks, skills and training in one place.

Key facts:
- 23 modules, bought one at a time; ready-made packs (Starter Essentiel, Qualité ISO, PMO & Projets, RH & Talents, Manufacturing, Enterprise).
- Optional AI agent per module with four autonomy levels (Observe, Propose, Act with review, Act) and hard limits on sensitive modules.
- Installed on the company's own server by default, or hosted.
- Web app in French, English, Arabic (right-to-left), Spanish and Italian; mobile app for iOS and Android.
- No public price list: priced by active users, sites and modules. 14-day trial. Quotes and demos via the contact page.
- Available languages of this website: ${LANG_CODES.map((l) => `/${l}`).join(', ')}.
`
  const short = `${intro}
## Main pages (English)
${pages.map(([p, name, d]) => `- [${name}](${url('en', p)}): ${d}`).join('\n')}

## Modules
${MODULES.map((m) => `- [${mod[m.slug].name}](${url('en', `/modules/${m.slug}`)}): ${mod[m.slug].summary}`).join('\n')}

## Other languages
${LANG_CODES.filter((l) => l !== 'en').map((l) => `- ${l}: ${url(l, '/')}`).join('\n')}

## Optional
- [Full content for AI systems](${SITE_URL}/llms-full.txt)
`
  const full = `${intro}
## Modules in detail
${MODULES.map((m) => `### ${mod[m.slug].name}\n${url('en', `/modules/${m.slug}`)}\n\n${mod[m.slug].summary}\n\n${mod[m.slug].features.map((f) => `- ${f}`).join('\n')}`).join('\n\n')}

## AI agents
${en.PAGES.ai.lede}

${en.AUTONOMY.map((a, i) => `- **${a}**: ${en.PAGES.ai.levels[i][0]}`).join('\n')}

Guardrails:
${en.PAGES.ai.guards.map(([a, b]) => `- **${a}**: ${b}`).join('\n')}

## Connecting existing software
${en.UI.mirror.lede}

${en.UI.mirror.guarantees.map(([a, b]) => `- **${a}**: ${b}`).join('\n')}

## Pricing
${en.PAGES.pricing.lede}

${en.PAGES.pricing.factors.map(([a, b]) => `- **${a}**: ${b}`).join('\n')}

${en.PAGES.pricing.plans}

## Suggested rollout
${en.ROLLOUT.map((r) => `- **${r.when} — ${r.title}**: ${r.body}`).join('\n')}

## Frequently asked questions
${en.FAQ.map(([q, a]) => `### ${q}\n${a}`).join('\n\n')}
`
  write('llms.txt', short)
  write('llms-full.txt', full)
}

// ---------- IndexNow key ----------
if (process.env.INDEXNOW_KEY) write(`${process.env.INDEXNOW_KEY}.txt`, process.env.INDEXNOW_KEY)

fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`prerendered ${count} pages in ${LANG_CODES.length} languages for ${SITE_URL}`)
