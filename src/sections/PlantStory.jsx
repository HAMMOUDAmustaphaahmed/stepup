import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { CountUp } from '../components/ui'
import Skyline from '../components/Skyline'
import { hasWebGL, SceneBoundary } from '../three/support'
import { DEMO_HREF } from '../content'
import { useLang } from '../i18n'

// Home page hero + "one problem, followed to the end", told as a single scroll story:
// the 3D plant stays pinned while the chapters scroll past, and the camera stops on the
// building of each chapter. Without WebGL, with reduced motion or in data-saver mode (and
// in the prerendered HTML) the same content shows as a hero followed by stacked cards.

const StoryScene = lazy(() => import('../three/StoryScene'))

const STATS = [23, 26, 14, 5]
const SCREENS_PER_CHAPTER = 0.9 // scroll length of each chapter, in viewport heights

export default function PlantStory() {
  const { t, rtl } = useLang()
  const hero = t.UI.hero
  const ui = t.UI.story
  const steps = t.STORY
  const last = steps.length
  const reduce = useReducedMotion()
  const [capable, setCapable] = useState(false)
  const live = capable && !reduce

  const track = useRef(null)
  const stage = useRef(null)
  const panels = useRef([]) // 0 = hero, 1..n = chapters
  const bar = useRef(null)
  const kicker = useRef(null)
  const hint = useRef(null)
  // Shared with the 3D scene: target follows the scroll, current eases towards it.
  const state = useRef({ target: 0, current: 0 })

  useEffect(() => {
    setCapable(hasWebGL() && !navigator.connection?.saveData && (navigator.hardwareConcurrency || 8) > 2)
  }, [])

  const { scrollYProgress } = useScroll({ target: track, offset: ['start 76px', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    state.current.target = p * last
  })

  // Chapter texts, progress bar and the overview labels, eased in step with the camera.
  useEffect(() => {
    if (!live) return
    const s = state.current
    s.target = s.current = scrollYProgress.get() * last

    const paint = (pos) => {
      panels.current.forEach((el, k) => {
        if (!el) return
        const d = pos - k
        const vis = Math.max(0, 1 - Math.abs(d) / 0.42)
        el.style.opacity = vis.toFixed(3)
        el.style.transform = `translate3d(0, ${(-d * 60).toFixed(1)}px, 0)`
        el.style.visibility = vis > 0.01 ? 'visible' : 'hidden'
      })
      if (bar.current) bar.current.style.transform = `scaleX(${(pos / last).toFixed(4)})`
      const kick = Math.min(1, Math.max(0, (pos - 0.45) * 2.5))
      if (kicker.current) kicker.current.style.opacity = kick.toFixed(3)
      if (hint.current) hint.current.style.opacity = Math.max(0, 1 - pos * 4).toFixed(3)
      stage.current?.style.setProperty('--overview', Math.max(0, 1 - pos * 2.5).toFixed(3))
    }

    let id = 0
    let prev = performance.now()
    let running = false
    const tick = (now) => {
      const dt = Math.min((now - prev) / 1000, 0.1)
      prev = now
      // frame-rate independent easing (same feel at 30 or 144 fps)
      s.current += (s.target - s.current) * (1 - Math.exp(-dt * 7))
      if (Math.abs(s.target - s.current) < 0.0005) s.current = s.target
      paint(s.current)
      id = requestAnimationFrame(tick)
    }
    const start = () => {
      if (running) return
      running = true
      prev = performance.now()
      id = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(id)
    }
    paint(s.current)
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()))
    io.observe(stage.current)
    return () => {
      io.disconnect()
      stop()
    }
  }, [live, last, scrollYProgress])

  const setPanel = (i) => (el) => {
    panels.current[i] = el
  }

  return (
    <section className={`ps${live ? ' is-live' : ''}`} id="top" aria-labelledby="ps-title">
      <div
        className="ps-track"
        ref={track}
        style={live ? { height: `${100 + last * SCREENS_PER_CHAPTER * 100}svh` } : undefined}
      >
        {/* /#story links land on the first chapter */}
        {live && <span id="story" className="ps-anchor" style={{ top: `${SCREENS_PER_CHAPTER * 100}svh` }} />}
        <div className="ps-stage" ref={stage}>
          <div className="ps-grid" aria-hidden />
          <div className="ps-visual" aria-hidden>
            {live ? (
              <SceneBoundary fallback={<Skyline />}>
                <Suspense fallback={null}>
                  <StoryScene state={state} rtl={rtl} labels={t.UI.scene.labels} modules={steps.map((s) => s.module)} />
                </Suspense>
              </SceneBoundary>
            ) : (
              <Skyline />
            )}
          </div>
          <div className="ps-shade" aria-hidden />

          <div className="ps-hero ps-panel" ref={setPanel(0)}>
            <span className="eyebrow">{hero.eyebrow}</span>
            <h1 id="ps-title">
              {hero.title[0]}
              <span className="hl">{hero.title[1]}</span>
            </h1>
            <p className="ps-lede">{hero.lede}</p>
            <div className="hero-ctas left">
              <Link className="btn btn-solid btn-square" to={DEMO_HREF}>
                {hero.demo}
              </Link>
              <Link className="btn btn-outline btn-square" to="/pricing#roi">
                {hero.gains}
              </Link>
            </div>
            <dl className="hero3d-stats ps-stats">
              {STATS.map((n, i) => (
                <div key={i}>
                  <dt>
                    <CountUp to={n} />
                  </dt>
                  <dd>{hero.stats[i]}</dd>
                </div>
              ))}
            </dl>
            <p className="ps-hint" ref={hint} aria-hidden>
              {ui.hint}
            </p>
          </div>

          <div className="ps-story" id={live ? undefined : 'story'}>
            <div className="ps-head" ref={kicker}>
              <span className="eyebrow">{ui.eyebrow}</span>
              <h2 className="title">
                {ui.title[0]}
                <span className="hl">{ui.title[1]}</span>
              </h2>
            </div>
            <ol className="ps-chapters">
              {steps.map((s, i) => (
                <li key={i} className="ps-chapter ps-panel" ref={setPanel(i + 1)}>
                  <span className="ps-tag">
                    <span className="ps-num" aria-hidden>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {s.module}
                  </span>
                  <h3>{s.title}</h3>
                  <div className="ps-compare">
                    <p className="ps-today">
                      <span className="ps-label">
                        <X size={14} aria-hidden /> {ui.today}
                      </span>
                      {s.today}
                    </p>
                    <p className="ps-stepup">
                      <span className="ps-label">
                        <Check size={14} aria-hidden /> {ui.stepup}
                      </span>
                      {s.stepup}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="ps-progress" aria-hidden>
            <i ref={bar} />
          </div>
          {live && (
            <a className="ps-skip" href="#after-story">
              {ui.skip}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
