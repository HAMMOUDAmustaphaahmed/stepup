import { lazy, Suspense, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { CountUp } from '../components/ui'
import Skyline from '../components/Skyline'
import { hasWebGL, SceneBoundary } from '../three/support'
import { DEMO_HREF } from '../content'
import { useLang } from '../i18n'

// three.js is loaded after first paint so the headline shows immediately.
const HeroScene = lazy(() => import('../three/HeroScene'))

const ease = [0.22, 1, 0.36, 1]
const item = (i) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: 0.1 + i * 0.12, ease },
})
const STATS = [23, 26, 14, 5]

function Fallback() {
  return (
    <div className="hero-canvas hero-fallback">
      <Skyline />
    </div>
  )
}

export default function Hero() {
  const { t } = useLang()
  const ui = t.UI.hero
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [webgl] = useState(hasWebGL)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -140])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 0.9])

  return (
    <section ref={ref} className="hero3d" id="top">
      <div className="hero3d-glow" aria-hidden />
      <div className="wrap hero3d-grid">
        <motion.div className="hero3d-copy" style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}>
          <motion.span className="eyebrow" {...item(0)}>
            {ui.eyebrow}
          </motion.span>
          <motion.h1 {...item(1)}>
            {ui.title[0]}
            <span className="hl">{ui.title[1]}</span>
          </motion.h1>
          <motion.p className="hero3d-lede" {...item(2)}>
            {ui.lede}
          </motion.p>
          <motion.div className="hero-ctas left" {...item(3)}>
            <a className="btn btn-solid btn-square" href={DEMO_HREF}>
              {ui.demo}
            </a>
            <a className="btn btn-outline btn-square" href="/pricing#roi">
              {ui.gains}
            </a>
          </motion.div>
          <motion.dl className="hero3d-stats" {...item(4)}>
            {STATS.map((n, i) => (
              <div key={i}>
                <dt>
                  <CountUp to={n} />
                </dt>
                <dd>{ui.stats[i]}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          className="hero3d-visual"
          style={reduce ? undefined : { scale: visualScale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {webgl ? (
            <SceneBoundary fallback={<Fallback />}>
              <Suspense fallback={<div className="hero-canvas" />}>
                <HeroScene progress={scrollYProgress} reduce={reduce} labels={t.UI.scene.labels} />
              </Suspense>
            </SceneBoundary>
          ) : (
            <Fallback />
          )}
        </motion.div>
      </div>

      <a href="#mirror" className="scroll-cue" aria-label={ui.next}>
        <motion.span
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={22} aria-hidden />
        </motion.span>
      </a>
    </section>
  )
}
