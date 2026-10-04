// Builds the chatbot's knowledge from the website's own content, so the assistant
// only knows what the site itself says about Stepup.
//
// Groq's free tier allows ~8,000 tokens per minute, so the prompt is split into a
// compact core (always sent) and full module details (sent only when a question
// mentions that module).
import en from '../src/content/en.js'
import modEn from '../src/content/modules.en.js'
import modFr from '../src/content/modules.fr.js'
import modAr from '../src/content/modules.ar.js'
import modEs from '../src/content/modules.es.js'
import modIt from '../src/content/modules.it.js'
import { MODULES, PACK_MODULES, NOT_IN_ENTERPRISE } from '../src/data/modules.js'
import { STANDARDS } from '../src/content.js'

const P = en.PAGES
const ALL_NAMES = [modEn, modFr, modAr, modEs, modIt]

const norm = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

export function buildCore() {
  const modules = MODULES.map((x) => {
    const cap = x.aiCap != null ? ` [AI capped at ${en.AUTONOMY[x.aiCap]}]` : ''
    return `- ${modEn[x.slug].name} (/modules/${x.slug}): ${plain(modEn[x.slug].summary)}${cap}`
  }).join('\n')

  return `
STEPUP: operational-excellence software for industrial and service companies (20–2,000 people) certified or working towards ${STANDARDS.join(', ')}. Not an ERP replacement. 23 modules sold one at a time, optional AI agent per module, self-hosted by default (hosted option exists). Web app in 5 languages (FR, EN, IT, ES, AR with right-to-left). Mobile app iOS/Android: ${P.platform.mobile.join('; ')}. Desktop app: in preparation.

CONNECTING EXISTING SYSTEMS (Stepup Connect): Stepup connects to the software the company already uses and only reads it — like a security camera, not a new door. It keeps its own copy of what it reads, on the company's side, and never writes, changes or deletes anything in the existing systems. Three independent safeguards guarantee this, and the company's IT team keeps control and can cut the link at any time. If the link is cut, existing systems are not affected; Stepup simply shows older data and says so. No migration is needed on day one.

MODULES:
${modules}

AUTOMATIC HAND-OFFS: ${P.platform.links.map(([, , t]) => t).join(' ')}

PACKS (pre-selections; all modules also à la carte): ${Object.entries(PACK_MODULES)
    .map(([p, s]) => `${p} = ${s.map((x) => modEn[x].name).join(', ')}`)
    .join('; ')}; Enterprise = all modules except ${NOT_IN_ENTERPRISE.map((x) => modEn[x].name).join(' and ')}.

AI AGENTS: optional, per module, never exceed the rights of the person they work for, and only act through the same controlled path as the modules. Levels: ${en.AUTONOMY.map((n, i) => `${n} = ${P.ai.levels[i][0]}`).join(' ')} Caps: Accounting and Evaluations at Observe, Recruitment at Observe (sees applications by reference only), Talents at Propose, HR at Act with review. Spending limits per action, per agent each month and per company; an emergency stop; automatic safety cut-off after repeated errors; a backup coordinator, and if everything fails requests become tasks for a person.

SECURITY (business level only): each company's data is fully separated from other companies and can be completely deleted on request (GDPR); the company sets its own security rules (two-step sign-in, password rules, session duration, allowed locations); six roles plus fine-grained rights by module, page, department or site; people only see the records they are allowed to see, and an administrator can check why; changes are traced for audits; every support access is logged; connection secrets are encrypted. Stepup is installed on the company's own server by default, or hosted for them.

PRICING: no public price list. Depends on active users (tiered discounts, read-only users cheaper), sites and modules; AI agents optional per module. Plans Starter, Professional, Enterprise. 14-day trial. Quote via /contact; ROI calculator at /pricing#roi.

ROLLOUT (example): ${en.ROLLOUT.map((r) => `${r.when}: ${r.title}`).join('; ')}.

PAGES: / (home), /platform, /modules, /modules/<slug>, /ai, /solutions, /pricing, /pricing#roi, /diagnostic (60-second self-assessment), /faq, /contact (demo or quote).
`.trim()
}

// Technical vocabulary is removed before module details reach the assistant.
const TECH = [
  [/Devices — sensors, meters, PLCs, cameras — over MQTT, HTTP or WebSocket/gi, 'Connect machine sensors, meters and cameras'],
  [/\s*—?\s*over MQTT, HTTP or WebSocket/gi, ''],
  [/\b(MQTT|HTTP|WebSocket|PostgreSQL|MySQL|MariaDB|Oracle|PLCs?)\b,?\s*/gi, ''],
  [/\s*\(average cost or FIFO\)/gi, ''],
  [/\s{2,}/g, ' '],
]
const plain = (s) => TECH.reduce((acc, [re, to]) => acc.replace(re, to), s).trim()

// Full feature lists for the modules a question mentions (max 3).
export function moduleDetails(text) {
  const q = norm(text || '')
  const hits = MODULES.filter((m) => q.includes(m.slug) || ALL_NAMES.some((names) => names[m.slug].name.split('/').some((n) => n.trim().length > 2 && q.includes(norm(n.trim())))))
  return hits
    .slice(0, 3)
    .map((m) => {
      const t = modEn[m.slug]
      const links = m.links.length ? ` Links with: ${m.links.map((s) => modEn[s].name).join(', ')}.` : ''
      return `${t.name} (/modules/${m.slug}) features: ${t.features.map(plain).join('; ')}.${links}`
    })
    .join('\n')
}
