import { Link } from 'react-router-dom'
import { Building2, Layers, Users } from 'lucide-react'
import Personas from '../sections/Personas'
import Diagnostic from '../sections/Diagnostic'
import Roi from '../sections/Roi'
import Rollout from '../sections/Rollout'
import { PageHero, Industries, FaqList, Cta } from '../components/Blocks'
import { Reveal } from '../components/ui'
import { QUOTE_HREF } from '../content'
import { useLang, usePageTitle } from '../i18n'

export function Solutions() {
  const { t } = useLang()
  const ui = t.PAGES.solutions
  usePageTitle(t.PAGES.nav[3].label)
  return (
    <>
      <PageHero eyebrow={ui.eyebrow} title={ui.title} lede={ui.lede} crumbs={[[t.PAGES.nav[3].label]]} />
      <Personas />
      <Industries />
      <Cta />
    </>
  )
}

export function Pricing() {
  const { t } = useLang()
  const ui = t.PAGES.pricing
  usePageTitle(t.PAGES.nav[4].label)
  const icons = [Users, Building2, Layers]
  return (
    <>
      <PageHero eyebrow={ui.eyebrow} title={ui.title} lede={ui.lede} crumbs={[[t.PAGES.nav[4].label]]} />
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
  const { t } = useLang()
  const ui = t.PAGES.diagnostic
  usePageTitle(t.PAGES.nav[5].label)
  return (
    <>
      <PageHero eyebrow={ui.eyebrow} title={ui.title} lede={ui.lede} crumbs={[[t.PAGES.nav[5].label]]} />
      <Diagnostic bare />
      <Cta />
    </>
  )
}

export function FaqPage() {
  const { t } = useLang()
  const ui = t.PAGES.faq
  usePageTitle('FAQ')
  return (
    <>
      <PageHero eyebrow={ui.eyebrow} title={ui.title} lede={ui.lede} crumbs={[['FAQ']]} />
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
  usePageTitle(ui.title)
  return (
    <PageHero eyebrow="404" title={ui.title} lede={ui.body}>
      <Link className="btn btn-solid btn-square" to="/" style={{ marginTop: 28 }}>
        {ui.back}
      </Link>
    </PageHero>
  )
}
