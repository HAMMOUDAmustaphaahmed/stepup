import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Bot, Check, Package } from 'lucide-react'
import { PageHero, Cta } from '../components/Blocks'
import { Icon, Reveal } from '../components/ui'
import { MODULES, PACK_MODULES, NOT_IN_ENTERPRISE } from '../data/modules'
import { DEMO_HREF } from '../content'
import { useLang, usePageTitle } from '../i18n'

const W = 420
const H = 300

// The module in the centre, the modules it hands work to around it.
function ConnectionMap({ module, color }) {
  const { t } = useLang()
  const n = module.links.length
  const nodes = module.links.map((slug, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n
    return { slug, x: W / 2 + Math.cos(a) * 150, y: H / 2 + Math.sin(a) * 105 }
  })
  return (
    <div className="cmap" style={{ '--c': color }}>
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden>
        {nodes.map((p, i) => (
          <motion.line
            key={p.slug}
            x1={W / 2}
            y1={H / 2}
            x2={p.x}
            y2={p.y}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 + i * 0.12 }}
          />
        ))}
      </svg>
      <span className="cmap-center" style={{ left: '50%', top: '50%' }}>
        <Icon name={module.icon} size={22} />
        {t.MOD[module.slug].name}
      </span>
      {nodes.map((p, i) => {
        const m = MODULES.find((x) => x.slug === p.slug)
        return (
          <motion.span
            key={p.slug}
            className="cmap-node"
            style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%`, x: '-50%', y: '-50%' }}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.12, type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Link to={`/modules/${p.slug}`}>
              <Icon name={m.icon} size={16} /> {t.MOD[p.slug].name}
            </Link>
          </motion.span>
        )
      })}
    </div>
  )
}

export default function ModulePage() {
  const { slug } = useParams()
  const { t } = useLang()
  const ui = t.PAGES.module
  const index = MODULES.findIndex((m) => m.slug === slug)
  const module = MODULES[index]
  const text = module && t.MOD[slug]
  usePageTitle(text?.name)
  if (!module) return <Navigate to="/modules" replace />

  const fam = t.FAMILIES.find((f) => f.id === module.family)
  const packs = Object.entries(PACK_MODULES)
    .filter(([, slugs]) => slugs.includes(slug))
    .map(([name]) => name)
  if (!NOT_IN_ENTERPRISE.includes(slug)) packs.push('Enterprise')
  const prev = MODULES[(index - 1 + MODULES.length) % MODULES.length]
  const next = MODULES[(index + 1) % MODULES.length]

  return (
    <>
      <PageHero
        eyebrow={fam.name}
        title={text.name}
        lede={text.summary}
        accent={fam.color}
        crumbs={[[t.PAGES.nav[1].label, '/modules'], [text.name]]}
      >
        <div className="mp-hero-actions">
          <Link className="btn btn-solid btn-square" to={DEMO_HREF}>
            {ui.cta(text.name)}
          </Link>
          <Link className="link-arrow" to="/modules">
            <ArrowLeft size={16} aria-hidden /> {ui.back}
          </Link>
        </div>
        <span className="mp-icon" style={{ background: fam.color }} aria-hidden>
          <Icon name={module.icon} size={44} strokeWidth={1.6} />
        </span>
      </PageHero>

      <section className="section">
        <div className="wrap mp-layout">
          <div>
            <Reveal>
              <h2 className="mp-h2">{ui.features}</h2>
            </Reveal>
            <ol className="mp-features">
              {text.features.map((f, i) => (
                <Reveal as="li" key={i} delay={i * 0.07} style={{ '--c': fam.color }}>
                  <span className="mpf-num">{String(i + 1).padStart(2, '0')}</span>
                  <p>{f}</p>
                </Reveal>
              ))}
            </ol>

            <Reveal className="mp-links">
              <h2 className="mp-h2">{ui.links}</h2>
              {module.links.length ? <ConnectionMap module={module} color={fam.color} /> : <p className="mp-muted">{ui.noLinks}</p>}
            </Reveal>
          </div>

          <aside className="mp-side">
            <Reveal className="side-card">
              <h3>
                <Bot size={18} aria-hidden /> {ui.ai}
              </h3>
              {module.aiCap != null ? (
                <>
                  <div className="cap-bar" aria-hidden>
                    {t.AUTONOMY.map((a, i) => (
                      <span key={a} className={i <= module.aiCap ? 'on' : ''} />
                    ))}
                  </div>
                  <p>{ui.aiCap(t.AUTONOMY[module.aiCap])}</p>
                  {slug === 'recruitment' && <p className="mp-muted">{ui.recruitmentNote}</p>}
                </>
              ) : (
                <>
                  <div className="cap-bar free" aria-hidden>
                    {t.AUTONOMY.map((a) => (
                      <span key={a} className="on" />
                    ))}
                  </div>
                  <p>{ui.aiFree}</p>
                </>
              )}
              <Link className="link-arrow" to="/ai">
                {t.PAGES.nav[2].label} <ArrowRight size={16} aria-hidden />
              </Link>
            </Reveal>

            <Reveal className="side-card" delay={0.08}>
              <h3>
                <Package size={18} aria-hidden /> {ui.packs}
              </h3>
              {packs.length ? (
                <ul className="side-list">
                  {packs.map((p) => (
                    <li key={p}>
                      <Check size={16} aria-hidden /> {p}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{ui.noPack}</p>
              )}
              <Link className="link-arrow" to="/pricing">
                {t.PAGES.nav[4].label} <ArrowRight size={16} aria-hidden />
              </Link>
            </Reveal>
          </aside>
        </div>
      </section>

      <nav className="mp-pager wrap" aria-label={t.PAGES.nav[1].label}>
        <Link to={`/modules/${prev.slug}`}>
          <ArrowLeft size={18} aria-hidden />
          <span>
            <small>{ui.prev}</small>
            {t.MOD[prev.slug].name}
          </span>
        </Link>
        <Link to={`/modules/${next.slug}`} className="next">
          <span>
            <small>{ui.next}</small>
            {t.MOD[next.slug].name}
          </span>
          <ArrowRight size={18} aria-hidden />
        </Link>
      </nav>
      <Cta />
    </>
  )
}
