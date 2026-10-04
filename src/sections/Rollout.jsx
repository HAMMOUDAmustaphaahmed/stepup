import { lazy, Suspense, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion'
import { Database, Layers, Server, ShieldCheck } from 'lucide-react'
import { Reveal } from '../components/ui'
import { hasWebGL, SceneBoundary } from '../three/support'
import { useLang } from '../i18n'

const StairsScene = lazy(() => import('../three/StairsScene'))
const RISK_ICONS = [Database, Layers, Server, ShieldCheck]

// A flat staircase for browsers without WebGL.
function FlatStairs({ active, steps }) {
  return (
    <div className="stairs-canvas flat-stairs" aria-hidden>
      {steps.map((s, i) => (
        <motion.span
          key={s.when}
          style={{ background: s.color }}
          animate={{ height: i <= active ? `${(i + 1) * 18}%` : '2%' }}
          transition={{ duration: 0.5 }}
        />
      ))}
    </div>
  )
}

export default function Rollout() {
  const { t } = useLang()
  const ui = t.UI.rollout
  const ROLLOUT = t.ROLLOUT
  const RISK_REDUCERS = t.RISK_REDUCERS
  const track = useRef(null)
  const [webgl] = useState(hasWebGL)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setActive(Math.min(Math.floor(p * ROLLOUT.length), ROLLOUT.length - 1))
  })

  const step = ROLLOUT[active]

  return (
    <section className="rollout" id="rollout">
      <div className="rollout-track" ref={track} style={{ height: `${ROLLOUT.length * 75 + 60}vh` }}>
        <div className="rollout-sticky">
          <div className="wrap rollout-grid">
            <div className="rollout-copy">
              <span className="eyebrow">{ui.eyebrow}</span>
              <h2 className="title">{ui.title}</h2>
              <p className="lede">{ui.lede}</p>

              <ol className="rollout-steps">
                {ROLLOUT.map((s, i) => (
                  <li key={i} className={i === active ? 'is-active' : i < active ? 'is-done' : ''}>
                    <span className="rs-dot" style={{ '--c': s.color }} />
                    <span className="rs-when">{s.when}</span>
                  </li>
                ))}
              </ol>

              <div className="rollout-panel" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step.when}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="rp-pack" style={{ color: step.color, borderColor: step.color }}>
                      {step.pack}
                    </span>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="rollout-note">{ui.note}</p>
            </div>

            <div className="rollout-visual">
              {webgl ? (
                <SceneBoundary fallback={<FlatStairs active={active} steps={ROLLOUT} />}>
                  <Suspense fallback={<div className="stairs-canvas" />}>
                    <StairsScene steps={ROLLOUT} progress={scrollYProgress} />
                  </Suspense>
                </SceneBoundary>
              ) : (
                <FlatStairs active={active} steps={ROLLOUT} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="section risk">
        <div className="wrap">
          <Reveal className="center head-block">
            <span className="eyebrow">{ui.riskEyebrow}</span>
            <h2 className="title">{ui.riskTitle}</h2>
          </Reveal>
          <div className="risk-grid">
            {RISK_REDUCERS.map(([t, b], i) => {
              const I = RISK_ICONS[i]
              return (
                <Reveal key={t} delay={i * 0.07} className="risk-card">
                  <I size={26} aria-hidden />
                  <h3>{t}</h3>
                  <p>{b}</p>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
