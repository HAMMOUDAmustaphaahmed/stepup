// Tells IndexNow search engines (Bing, Yandex, Naver, Seznam, Yep…) about every URL in the sitemap.
// Run after each deployment:  INDEXNOW_KEY=<your key> VITE_SITE_URL=https://www.stepup.app npm run indexnow
// The same INDEXNOW_KEY must be set during `npm run build` so the key file is published.
import fs from 'node:fs'

const key = process.env.INDEXNOW_KEY
const site = (process.env.VITE_SITE_URL || 'https://www.stepup.app').replace(/\/$/, '')
if (!key) {
  console.error('Set INDEXNOW_KEY (any 8–128 character hex string, the same one used at build time).')
  process.exit(1)
}
const sitemap = fs.readFileSync(new URL('../dist/sitemap.xml', import.meta.url), 'utf8')
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${key}.txt`, urlList: urls }),
})
console.log(`IndexNow: ${res.status} for ${urls.length} URLs`)
