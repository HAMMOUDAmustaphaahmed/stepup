import { motion, useReducedMotion } from 'framer-motion'
import { BarChart3, Bell, Bot, Cctv, Database, KeyRound, Lock, Plug, ShieldX } from 'lucide-react'
import { Reveal } from '../components/ui'
import { useLang } from '../i18n'

const ITEM_ICONS = [BarChart3, Bell, Bot]
const GUARD_ICONS = [Lock, KeyRound, Plug]
const CYCLE = 3.2

function Channel({ read, blocked }) {
  const reduce = useReducedMotion()
  return (
    <div className="mirror-channel" aria-hidden>
      <div className="mc-track">
        {!reduce &&
          [0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="mc-packet"
              animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: 'linear' }}
            />
          ))}
        {/* a write coming back from Stepup is stopped halfway */}
        {!reduce && (
          <motion.span
            className="mc-packet write"
            animate={{ left: ['100%', '56%', '56%'], opacity: [0, 1, 0], scale: [1, 1, 0.2] }}
            transition={{ duration: CYCLE, repeat: Infinity, times: [0, 0.45, 0.6], ease: 'easeOut' }}
          />
        )}
        <motion.span
          className="mc-shield"
          animate={reduce ? undefined : { scale: [1, 1, 1.25, 1], boxShadow: ['0 0 0 0 rgba(220,38,38,0)', '0 0 0 0 rgba(220,38,38,0)', '0 0 0 10px rgba(220,38,38,0.18)', '0 0 0 0 rgba(220,38,38,0)'] }}
          transition={{ duration: CYCLE, repeat: Infinity, times: [0, 0.42, 0.5, 0.65] }}
        >
          <ShieldX size={18} />
        </motion.span>
      </div>
      <div className="mc-labels">
        <span className="mc-read">
          <Cctv size={16} /> {read}
        </span>
        <span className="mc-blocked">{blocked}</span>
      </div>
    </div>
  )
}

export default function Mirror() {
  const { t } = useLang()
  const m = t.UI.mirror
  return (
    <section className="section mirror" id="mirror">
      <div className="wrap">
        <Reveal className="center head-block">
          <span className="eyebrow">{m.eyebrow}</span>
          <h2 className="title">
            {m.title[0]}
            <span className="hl">{m.title[1]}</span>
            {m.title[2]}
          </h2>
          <p className="lede">{m.lede}</p>
        </Reveal>

        <Reveal className="mirror-stage">
          <div className="mirror-sources">
            <h3>{m.sourcesTitle}</h3>
            <ul>
              {m.sources.map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                >
                  <Database size={18} aria-hidden /> {s}
                </motion.li>
              ))}
            </ul>
            <small>{m.engines}</small>
          </div>

          <Channel read={m.read} blocked={m.blocked} />

          <div className="mirror-stepup">
            <h3>
              <span className="logo-mark" aria-hidden /> {m.stepupTitle}
            </h3>
            <ul>
              {m.stepupItems.map((s, i) => {
                const I = ITEM_ICONS[i]
                return (
                  <motion.li
                    key={s}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <I size={18} aria-hidden /> {s}
                  </motion.li>
                )
              })}
            </ul>
          </div>
        </Reveal>

        <div className="guarantees">
          {m.guarantees.map(([title, body], i) => {
            const I = GUARD_ICONS[i]
            return (
              <Reveal key={title} delay={i * 0.08} className="guarantee">
                <span className="g-icon">
                  <I size={20} aria-hidden />
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </Reveal>
            )
          })}
        </div>
        <p className="mirror-foot">{m.foot}</p>
      </div>
    </section>
  )
}
