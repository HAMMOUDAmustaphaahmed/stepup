import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Check, MoveRight, X } from 'lucide-react'
import Story from './Story'
import { useMediaQuery } from '../components/ui'
import { useLang } from '../i18n'

// One frame of the film strip. It rotates and dims according to its distance from the centre.
function Frame({ step, index, count, progress, labels, rtl }) {
  const center = index / (count - 1)
  const span = 1 / (count - 1)
  const d = useTransform(progress, (p) => (p - center) / span)
  const rotateY = useTransform(d, [-1, 0, 1], rtl ? [-28, 0, 28] : [28, 0, -28])
  const scale = useTransform(d, [-1, 0, 1], [0.86, 1, 0.86])
  const opacity = useTransform(d, [-1.4, 0, 1.4], [0.25, 1, 0.25])
  const z = useTransform(d, [-1, 0, 1], [-120, 0, -120])

  return (
    <motion.article className="sf-frame" style={{ rotateY, scale, opacity, z }}>
      <span className="sf-num" aria-hidden>
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="story-module">{step.module}</span>
      <h3>{step.title}</h3>
      <div className="sf-compare">
        <div className="story-today">
          <span className="story-tag">
            <X size={14} aria-hidden /> {labels.today}
          </span>
          <p>{step.today}</p>
        </div>
        <div className="story-stepup">
          <span className="story-tag">
            <Check size={14} aria-hidden /> {labels.stepup}
          </span>
          <p>{step.stepup}</p>
        </div>
      </div>
    </motion.article>
  )
}

export default function StoryFrames() {
  const { t, rtl } = useLang()
  const ui = t.UI.story
  const steps = t.STORY
  const narrow = useMediaQuery('(max-width: 860px)')
  const reduce = useReducedMotion()
  const track = useRef(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.0005 })
  const count = steps.length
  // frames are 62vw apart; slide the strip so the active frame sits in the middle
  const x = useTransform(progress, [0, 1], ['0vw', `${(rtl ? 1 : -1) * 62 * (count - 1)}vw`])
  const bgX = useTransform(progress, [0, 1], ['0%', rtl ? '20%' : '-20%'])

  useMotionValueEvent(scrollYProgress, 'change', (p) => setActive(Math.min(count - 1, Math.round(p * (count - 1)))))

  // phones and reduced motion keep the vertical version
  if (narrow || reduce) return <Story />

  return (
    <section className="story-frames" id="story">
      <div className="sf-track" ref={track} style={{ height: `${count * 90 + 40}vh` }}>
        <div className="sf-sticky">
          <motion.div className="sf-bg" style={{ x: bgX }} aria-hidden>
            STEPUP · STEPUP · STEPUP · STEPUP
          </motion.div>
          <div className="wrap sf-head">
            <span className="eyebrow">{ui.eyebrow}</span>
            <h2 className="title">
              {ui.title[0]}
              <span className="hl">{ui.title[1]}</span>
            </h2>
          </div>

          <div className="sf-stage">
            <motion.div className="sf-strip" style={{ x }}>
              {steps.map((s, i) => (
                <Frame key={i} step={s} index={i} count={count} progress={progress} labels={ui} rtl={rtl} />
              ))}
            </motion.div>
          </div>

          <div className="wrap sf-foot">
            <ol className="sf-steps">
              {steps.map((s, i) => (
                <li key={i} className={i === active ? 'is-active' : i < active ? 'is-done' : ''}>
                  <span>{s.module}</span>
                </li>
              ))}
            </ol>
            <div className="sf-bar">
              <motion.i style={{ scaleX: progress }} />
            </div>
            <p className="sf-hint">
              <MoveRight size={16} aria-hidden /> {ui.hint}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
