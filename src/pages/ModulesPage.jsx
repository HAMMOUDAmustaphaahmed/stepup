import { Link } from 'react-router-dom'
import { ArrowRight, Check, Puzzle } from 'lucide-react'
import { PageHero, Cta } from '../components/Blocks'
import { Icon, Reveal } from '../components/ui'
import { MODULES, PACK_MODULES } from '../data/modules'
import { useLang, useSeo } from '../i18n'
import { pageLd } from '../seo'
import { SITE_URL as SITE } from '../site'

export default function ModulesPage() {
  const { t, lang } = useLang()
  const ui = t.PAGES.modules
  const title = `${t.PAGES.allModules} — ${['audits', 'quality', 'kaizen', 'talents', 'crm'].map((s) => t.MOD[s].name).join(', ')}…`
  useSeo({
    title,
    description: ui.lede,
    jsonLd: [
      ...pageLd({ lang, path: '/modules', title, description: ui.lede, home: t.UI.header.home, crumbs: [[t.PAGES.nav[1].label, '/modules']] }),
      {
        '@type': 'ItemList',
        name: t.PAGES.allModules,
        itemListElement: MODULES.map((m, i) => ({ '@type': 'ListItem', position: i + 1, name: t.MOD[m.slug].name, url: `${SITE}/${lang}/modules/${m.slug}` })),
      },
    ],
  })

  return (
    <>
      <PageHero eyebrow={ui.eyebrow} title={ui.title} lede={ui.lede} crumbs={[[t.PAGES.nav[1].label]]} scene="grid">
        <nav className="family-jump" aria-label={t.UI.modules.families}>
          {t.FAMILIES.map((f) => (
            <a key={f.id} href={`#${f.id}`} style={{ '--c': f.color }}>
              {f.name} <span>{MODULES.filter((m) => m.family === f.id).length}</span>
            </a>
          ))}
        </nav>
      </PageHero>

      <section className="section alt">
        <div className="wrap">
          <Reveal className="head-block">
            <span className="eyebrow">{t.UI.modules.eyebrow}</span>
            <h2 className="title">{t.PAGES.pricing.packsTitle}</h2>
          </Reveal>
          <ul className="packs">
            {t.PACKS.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 0.06} className="pack" style={{ borderTopColor: p.color }}>
                <h3 style={{ color: p.color === '#0d2d4e' ? 'var(--navy)' : p.color }}>{p.name}</h3>
                <div className="pack-chips">
                  {(PACK_MODULES[p.name] || []).map((slug) => (
                    <Link key={slug} to={`/modules/${slug}`}>
                      {t.MOD[slug].name}
                    </Link>
                  ))}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {t.FAMILIES.map((f, fi) => (
        <section key={f.id} id={f.id} className={`section family-section${fi % 2 ? ' alt' : ''}`} style={{ '--c': f.color }}>
          <div className="wrap">
            <Reveal className="family-head">
              <span className="family-bar" aria-hidden />
              <h2 className="title">{f.name}</h2>
            </Reveal>
            <div className="mod-cards">
              {MODULES.filter((m) => m.family === f.id).map((m, i) => (
                <Reveal key={m.slug} delay={(i % 3) * 0.06}>
                  <Link to={`/modules/${m.slug}`} className="mod-card">
                    <span className="mc-icon">
                      <Icon name={m.icon} size={22} />
                    </span>
                    <h3>{t.MOD[m.slug].name}</h3>
                    <p>{t.MOD[m.slug].summary}</p>
                    <span className="mc-more">
                      {ui.open} <ArrowRight size={16} aria-hidden />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section" id="custom">
        <div className="wrap">
          <Reveal className="custom-band">
            <span className="custom-icon" aria-hidden>
              <Puzzle size={30} />
            </span>
            <div>
              <span className="eyebrow">{t.UI.custom.eyebrow}</span>
              <h2 className="title">{t.UI.custom.title}</h2>
              <p className="lede">{t.UI.custom.body}</p>
              <ul className="custom-points">
                {t.UI.custom.points.map((p) => (
                  <li key={p}>
                    <Check size={16} aria-hidden /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <Link className="btn btn-solid btn-square" to="/contact?topic=custom">
              {t.UI.custom.cta}
            </Link>
          </Reveal>
        </div>
      </section>
      <Cta />
    </>
  )
}
