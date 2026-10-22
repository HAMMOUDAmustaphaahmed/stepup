import { Link } from 'react-router-dom'
import { Building2, Layers, Users } from 'lucide-react'
import Personas from '../sections/Personas'
import Diagnostic from '../sections/Diagnostic'
import Roi from '../sections/Roi'
import Rollout from '../sections/Rollout'
import { PageHero, Industries, FaqList, Cta } from '../components/Blocks'
import { Reveal } from '../components/ui'
import { QUOTE_HREF } from '../content'
import { useLang, useSeo } from '../i18n'
import { faqLd, pageLd } from '../seo'

export function Solutions() {
  const { t, lang } = useLang()
  const ui = t.PAGES.solutions
  const title = `${t.PAGES.nav[3].label} — ${t.PERSONAS.map((p) => p.short).join(', ')}`
  useSeo({ title, description: ui.lede, jsonLd: pageLd({ lang, path: '/solutions', title, description: ui.lede, home: t.UI.header.home, crumbs: [[t.PAGES.nav[3].label, '/solutions']] }) })
  return (
    <>
      <PageHero eyebrow={ui.eyebrow} title={ui.title} lede={ui.lede} crumbs={[[t.PAGES.nav[3].label]]} scene="orbit" />
      <Personas />
      <Industries />
      <Cta />
    </>
  )
}

export function Pricing() {
  const { t, lang } = useLang()
  const ui = t.PAGES.pricing
  const title = `${t.PAGES.nav[4].label} — ${ui.title[1].trim().replace(/[.:]$/, '')}`
  useSeo({ title, description: ui.lede, jsonLd: pageLd({ lang, path: '/pricing', title, description: ui.lede, home: t.UI.header.home, crumbs: [[t.PAGES.nav[4].label, '/pricing']] }) })
  const icons = [Users, Building2, Layers]
  return (
    <>
      <PageHero eyebrow={ui.eyebrow} title={ui.title} lede={ui.lede} crumbs={[[t.PAGES.nav[4].label]]} scene="coins" />
      <section className="section">
        <div className="wrap pricing-grid">
          <Reveal>
            <h2 className="mp-h2">{ui.factorsTitle}</h2>
            <ul className="price-factors">
              {ui.factors.map(([title, body], i) => {
                const I = icons[i]
                return (
                  <li key={title}>
                    <I size={24} aria-hidden />
                    <div>
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
            <p className="plans-note">{ui.plans}</p>
            <Link className="btn btn-solid btn-square" to={QUOTE_HREF}>
              {ui.quote}
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mp-h2">{ui.packsTitle}</h2>
            <ul className="packs packs-list">
              {t.PACKS.map((p) => (
                <li key={p.name} className="pack" style={{ borderTopColor: p.color }}>
                  <h3 style={{ color: p.color === '#0d2d4e' ? 'var(--navy)' : p.color }}>{p.name}</h3>
                  <p>{p.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
      <Roi />
      <Rollout />
      <Cta />
    </>
  )
}

export function DiagnosticPage() {
  const { t, lang } = useLang()
  const ui = t.PAGES.diagnostic
  const title = t.UI.quiz.eyebrow
  useSeo({ title, description: ui.lede, jsonLd: pageLd({ lang, path: '/diagnostic', title, description: ui.lede, home: t.UI.header.home, crumbs: [[t.PAGES.nav[5].label, '/diagnostic']] }) })
  return (
    <>
      <PageHero eyebrow={ui.eyebrow} title={ui.title} lede={ui.lede} crumbs={[[t.PAGES.nav[5].label]]} scene="gauge" />
      <Diagnostic bare />
      <Cta />
    </>
  )
}

export function FaqPage() {
  const { t, lang } = useLang()
  const ui = t.PAGES.faq
  const title = `FAQ — ${ui.title.join('').trim()}`
  useSeo({ title, description: `${ui.lede} ${t.FAQ.slice(0, 3).map(([q]) => q).join(' ')}`, jsonLd: [...pageLd({ lang, path: '/faq', title, description: ui.lede, home: t.UI.header.home, crumbs: [['FAQ', '/faq']] }), faqLd(t.FAQ)] })
  return (
    <>
      <PageHero eyebrow={ui.eyebrow} title={ui.title} lede={ui.lede} crumbs={[['FAQ']]} scene="bubbles" />
      <section className="section">
        <div className="wrap">
          <FaqList />
        </div>
      </section>
      <Cta />
    </>
  )
}

export function NotFound() {
  const { t } = useLang()
  const ui = t.PAGES.notFound
  useSeo({ title: ui.title, description: ui.body, noindex: true })
  return (
    <PageHero eyebrow="404" title={ui.title} lede={ui.body} scene="plane">
      <Link className="btn btn-solid btn-square" to="/" style={{ marginTop: 28 }}>
        {ui.back}
      </Link>
    </PageHero>
  )
}
