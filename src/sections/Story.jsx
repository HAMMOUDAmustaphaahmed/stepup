import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useSpring } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { Reveal } from '../components/ui'
import { useLang } from '../i18n'

function StepCard({ step, index, onActive, labels }) {
  const ref = useRef(null)
  const seen = useInView(ref, { once: true, amount: 0.5 })
  const centered = useInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => {
    if (centered) onActive(index)
  }, [centered, index, onActive])

  return (
    <article ref={ref} className={`story-card${centered ? ' is-active' : ''}`}>
      <span className="story-module">
        {String(index + 1).padStart(2, '0')} · {step.module}
      </span>
      <h3>{step.title}</h3>
      <div className="story-compare">
        <div className="story-today">
          <span className="story-tag">
            <X size={14} aria-hidden /> {labels.today}
          </span>
          <p>
            {step.today}
            <motion.span
              className="strike"
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ scaleX: seen ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
            />
          </p>
        </div>
        <motion.div
          className="story-stepup"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: seen ? 1 : 0, x: seen ? 0 : 24 }}
          transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="story-tag">
            <Check size={14} aria-hidden /> {labels.stepup}
          </span>
          <p>{step.stepup}</p>
        </motion.div>
      </div>
    </article>
  )
}

export default function Story() {
  const { t } = useLang()
  const ui = t.UI.story
  const STORY = t.STORY
  const track = useRef(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start center', 'end center'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  return (
    <section className="section alt" id="story">
      <div className="wrap">
        <Reveal className="center head-block">
          <span className="eyebrow">{ui.eyebrow}</span>
          <h2 className="title">
            {ui.title[0]}
            <span className="hl">{ui.title[1]}</span>
          </h2>
          <p className="lede">
            {ui.lede}
          </p>
        </Reveal>

        <div className="story" ref={track}>
          <aside className="story-rail" aria-hidden>
            <div className="rail">
              <motion.div className="rail-fill" style={{ scaleY: fill }} />
              {STORY.map((s, i) => (
                <div key={i} className={`rail-node${i <= active ? ' on' : ''}`} style={{ top: `${(i / (STORY.length - 1)) * 100}%` }}>
                  <span>{s.module}</span>
                </div>
              ))}
            </div>
            <div className="rail-counter">
              <AnimatePresence mode="wait">
                <motion.span
                  key={active}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {String(active + 1).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
              <small>/ {String(STORY.length).padStart(2, '0')}</small>
            </div>
          </aside>

          <div className="story-steps">
            {STORY.map((s, i) => (
              <StepCard key={i} step={s} index={i} onActive={setActive} labels={ui} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
