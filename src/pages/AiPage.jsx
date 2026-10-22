import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CircuitBoard, KeyRound, Power, Wallet, Workflow } from 'lucide-react'
import { Cta } from '../components/Blocks'
import AgentStory from '../sections/AgentStory'
import { Icon, Reveal, Title } from '../components/ui'
import { MODULES } from '../data/modules'
import { useLang, useSeo } from '../i18n'
import { pageLd } from '../seo'

const GUARD_ICONS = [KeyRound, Workflow, Wallet, Power, CircuitBoard]

export default function AiPage() {
  const { t, lang } = useLang()
  const ui = t.PAGES.ai
  const title = `${t.PAGES.nav[2].label} — ${ui.title[0].trim().replace(/[.:]$/, '')}`
  useSeo({ title, description: ui.lede, jsonLd: pageLd({ lang, path: '/ai', title, description: ui.lede, home: t.UI.header.home, crumbs: [[t.PAGES.nav[2].label, '/ai']] }) })
  const capped = MODULES.filter((m) => m.aiCap != null)

  return (
    <>
      <AgentStory eyebrow={ui.eyebrow} title={ui.title} lede={ui.lede} crumbs={[[t.PAGES.nav[2].label]]} />
      <div id="after-agent" />

      <section className="section">
        <div className="wrap">
          <Reveal className="center head-block">
            <span className="eyebrow">{ui.levelsEyebrow}</span>
            <h2 className="title">{ui.levelsTitle}</h2>
          </Reveal>
          <div className="levels-grid">
            {t.AUTONOMY.map((name, i) => (
              <Reveal key={name} delay={i * 0.08} className="level-card">
                <div className="lc-bars" aria-hidden>
                  {[0, 1, 2, 3].map((k) => (
                    <motion.span
                      key={k}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: k <= i ? 1 : 0.25 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + k * 0.08 }}
                      className={k <= i ? 'on' : ''}
                    />
                  ))}
                </div>
                <span className="lc-num">{i + 1}</span>
                <h3>{name}</h3>
                <p className="lc-def">{ui.levels[i][0]}</p>
                <p className="lc-ex">{ui.levels[i][1]}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <Reveal className="center head-block">
            <span className="eyebrow">{t.UI.ai.eyebrow}</span>
            <h2 className="title">{t.UI.ai.title}</h2>
            <p className="lede">{t.UI.ai.lede}</p>
          </Reveal>
          <div className="agents">
            {t.AGENTS.map((a, i) => (
              <Reveal key={i} delay={i * 0.06} className="agent">
                <div className="agent-icon">
                  <Icon name={a.icon} size={20} />
                </div>
                <span className="agent-num">
                  {t.UI.ai.agent} {String(i + 1).padStart(2, '0')}
                </span>
                <h3>{a.name}</h3>
                <p>{a.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap ai-split">
          <Reveal>
            <span className="eyebrow">{ui.capsEyebrow}</span>
            <h2 className="title">
              <Title parts={ui.capsTitle} />
            </h2>
            <p className="lede">{ui.capsLede}</p>
            <ul className="caps">
              {capped.map((m) => (
                <li key={m.slug}>
                  <Link to={`/modules/${m.slug}`}>
                    <Icon name={m.icon} size={18} /> {t.MOD[m.slug].name}
                  </Link>
                  <span className="cap-bar" aria-hidden>
                    {t.AUTONOMY.map((a, i) => (
                      <span key={a} className={i <= m.aiCap ? 'on' : ''} />
                    ))}
                  </span>
                  <strong>{t.AUTONOMY[m.aiCap]}</strong>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mp-h2">{ui.guardsTitle}</h2>
            <ul className="guard-list">
              {ui.guards.map(([title, body], i) => {
                const I = GUARD_ICONS[i]
                return (
                  <li key={title}>
                    <span className="g-icon">
                      <I size={18} aria-hidden />
                    </span>
                    <div>
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>
      </section>
      <Cta />
    </>
  )
}
