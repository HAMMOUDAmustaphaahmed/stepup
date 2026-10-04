import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, Clock, Eye, FileLock2, KeyRound, Languages, ListTree, Monitor, ScrollText, ShieldCheck, Smartphone, Users, Globe } from 'lucide-react'
import Mirror from '../sections/Mirror'
import { PageHero, Cta } from '../components/Blocks'
import { Icon, Reveal } from '../components/ui'
import { MODULES } from '../data/modules'
import { useLang, usePageTitle } from '../i18n'

const SECURITY_ICONS = [ListTree, ShieldCheck, Users, KeyRound, Eye, ScrollText, Clock, FileLock2]
const bySlug = Object.fromEntries(MODULES.map((m) => [m.slug, m]))

function ModuleChip({ slug }) {
  const { t } = useLang()
  const m = bySlug[slug]
  const fam = t.FAMILIES.find((f) => f.id === m.family)
  return (
    <Link to={`/modules/${slug}`} className="mod-chip" style={{ '--c': fam.color }}>
      <Icon name={m.icon} size={16} /> {t.MOD[slug].name}
    </Link>
  )
}

function Links() {
  const { t } = useLang()
  const ui = t.PAGES.platform
  const reduce = useReducedMotion()
  return (
    <section className="section alt" id="links">
      <div className="wrap">
        <Reveal className="center head-block">
          <span className="eyebrow">{ui.linksEyebrow}</span>
          <h2 className="title">{ui.linksTitle}</h2>
          <p className="lede">{ui.linksLede}</p>
        </Reveal>
        <div className="handoffs">
          {ui.links.map(([from, to, text], i) => (
            <Reveal key={i} delay={(i % 2) * 0.08} className="handoff">
              <div className="ho-route">
                <ModuleChip slug={from} />
                <span className="ho-wire" aria-hidden>
                  {!reduce && (
                    <motion.i
                      animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.25, ease: 'easeInOut' }}
                    />
                  )}
                </span>
                <ModuleChip slug={to} />
              </div>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Security() {
  const { t } = useLang()
  const ui = t.PAGES.platform
  return (
    <section className="section security" id="security">
      <div className="wrap">
        <Reveal className="center head-block">
          <span className="eyebrow">{ui.securityEyebrow}</span>
          <h2 className="title">{ui.securityTitle}</h2>
        </Reveal>
        <div className="sec-grid">
          {ui.security.map(([title, body], i) => {
            const I = SECURITY_ICONS[i]
            return (
              <Reveal key={title} delay={(i % 4) * 0.06} className="sec-card">
                <span className="g-icon">
                  <I size={20} aria-hidden />
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Apps() {
  const { t } = useLang()
  const ui = t.PAGES.platform
  return (
    <section className="section alt" id="apps">
      <div className="wrap">
        <Reveal className="center head-block">
          <span className="eyebrow">{ui.appsEyebrow}</span>
          <h2 className="title">{ui.appsTitle}</h2>
        </Reveal>
        <div className="apps">
          <Reveal className="app-card">
            <Globe size={28} aria-hidden />
            <h3>{ui.web[0]}</h3>
            <p>{ui.web[1]}</p>
            <div className="app-lang">
              <Languages size={18} aria-hidden />
              <div>
                <strong>{ui.langTitle}</strong>
                <span>{ui.langBody}</span>
              </div>
            </div>
          </Reveal>
          <Reveal className="app-card app-mobile" delay={0.08}>
            <Smartphone size={28} aria-hidden />
            <h3>{ui.mobileTitle}</h3>
            <ul>
              {ui.mobile.map((m) => (
                <li key={m}>
                  <Check size={16} aria-hidden /> {m}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="app-card" delay={0.16}>
            <Monitor size={28} aria-hidden />
            <h3>{ui.desktop[0]}</h3>
            <p>{ui.desktop[1]}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default function Platform() {
  const { t } = useLang()
  const ui = t.PAGES.platform
  usePageTitle(t.PAGES.nav[0].label)
  return (
    <>
      <PageHero eyebrow={ui.eyebrow} title={ui.title} lede={ui.lede} crumbs={[[t.PAGES.nav[0].label]]} />
      <Mirror />
      <Links />
      <Security />
      <Apps />
      <Cta />
    </>
  )
}
