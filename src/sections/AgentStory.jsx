import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, ChevronRight } from 'lucide-react'
import { hasWebGL, SceneBoundary } from '../three/support'
import { useLang } from '../i18n'

// AI page hero: a conversation with Kai, the Stepup agent, told by the scroll. The 3D robot stays
// pinned next to the chat; each exchange (question → Kai works → answer) takes one screen.
// Without WebGL, with reduced motion and in the prerendered HTML the whole transcript is shown.

const AgentScene = lazy(() => import('../three/AgentScene'))

const SCREENS_PER_STEP = 0.95

// When each message appears, in story positions (step k runs from k - 1 to k).
const askAt = (k) => k - 0.72
const typingAt = (k) => k - 0.5
const replyAt = (k) => k - 0.25

export function RobotFace({ className = '' }) {
  return (
    <span className={`ag-face ${className}`} aria-hidden>
      <i />
      <i />
    </span>
  )
}

export default function AgentStory({ eyebrow, title, lede, crumbs }) {
  const { t, rtl } = useLang()
  const ui = t.UI.agentStory
  const steps = ui.steps
  const n = steps.length
  const last = n + 1 // + the closing promise
  const reduce = useReducedMotion()
  const [capable, setCapable] = useState(false)
  const live = capable && !reduce

  const track = useRef(null)
  const stage = useRef(null)
  const bar = useRef(null)
  const hint = useRef(null)
  const state = useRef({ target: 0, current: 0 })
  // how far the conversation has gone, as a message count (only changes when one appears)
  const [shownAt, setShownAt] = useState(0)

  useEffect(() => {
    setCapable(hasWebGL() && !navigator.connection?.saveData && (navigator.hardwareConcurrency || 8) > 2)
  }, [])

  const { scrollYProgress } = useScroll({ target: track, offset: ['start 76px', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    state.current.target = p * last
  })

  useEffect(() => {
    if (!live) return
    const s = state.current
    s.target = s.current = scrollYProgress.get() * last
    let id = 0
    let prev = performance.now()
    let running = false
    let shown = -1
    const marks = [n + 0.4, n + 0.62]
    for (let k = 1; k <= n; k++) marks.push(askAt(k), typingAt(k), replyAt(k))
    const paint = (pos) => {
      if (bar.current) bar.current.style.transform = `scaleX(${(pos / last).toFixed(4)})`
      if (hint.current) hint.current.style.opacity = Math.max(0, 1 - pos * 4).toFixed(3)
      stage.current?.style.setProperty('--intro', Math.max(0, 1 - pos * 3).toFixed(3))
      // the chat follows the scroll directly (not the eased position) so it never lags behind
      const raw = s.target
      const next = marks.filter((m) => raw >= m).length
      if (next !== shown) {
        shown = next
        setShownAt(raw)
      }
    }
    const tick = (now) => {
      const dt = Math.min((now - prev) / 1000, 0.1)
      prev = now
      s.current += (s.target - s.current) * (1 - Math.exp(-dt * 6))
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
    // the site chat's "Ask Kai" pop-up would cover this conversation: hide it while it plays
    const root = document.documentElement
    const io = new IntersectionObserver(([e]) => {
      root.classList.toggle('ag-playing', e.isIntersecting)
      if (e.isIntersecting) start()
      else stop()
    })
    io.observe(stage.current)
    return () => {
      io.disconnect()
      root.classList.remove('ag-playing')
      stop()
    }
  }, [live, last, n, scrollYProgress])

  // Scroll to a story position (used by the Approve button).
  const goTo = (pos) => {
    const el = track.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const y = top - 76 + (pos / last) * (el.offsetHeight - window.innerHeight + 76)
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.4 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  // Messages visible at position `at` (everything when the story is not live).
  const at = live ? shownAt : Infinity
  const approved = at >= askAt(4)
  const messages = [{ key: 'hello', who: 'bot', text: ui.greeting }]
  steps.forEach((s, i) => {
    const k = i + 1
    if (at >= askAt(k)) messages.push({ key: `a${k}`, who: 'you', text: s.ask })
    if (at >= typingAt(k) && at < replyAt(k)) messages.push({ key: `t${k}`, who: 'bot', typing: true })
    if (at >= replyAt(k)) messages.push({ key: `r${k}`, who: 'bot', text: s.reply, work: s.work, approve: k === 3 })
  })
  if (at >= n + 0.4 && at < n + 0.62) messages.push({ key: 'tend', who: 'bot', typing: true })
  if (at >= n + 0.62) messages.push({ key: 'end', who: 'bot', text: ui.outro, end: true })
  const chapter = steps.filter((_, i) => at >= replyAt(i + 1)).length

  const chat = (
    <div className="ag-chat" aria-hidden={live || undefined}>
      <div className="ag-chat-head">
        <RobotFace />
        <div>
          <strong>{t.UI.chat.name}</strong>
          <span>
            <i className="ag-dot" /> {ui.online}
          </span>
        </div>
        <ol className="ag-steps" aria-hidden>
          {steps.map((_, i) => (
            <li key={i} className={i < chapter ? 'on' : ''} />
          ))}
        </ol>
      </div>
      <ol className="ag-log">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.li
              key={m.key}
              layout={live ? 'position' : false}
              className={`ag-msg ${m.who}${m.end ? ' end' : ''}`}
              initial={live ? { opacity: 0, y: 14, scale: 0.96 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {m.who === 'bot' && <RobotFace className="sm" />}
              <div className="ag-bubble">
                {m.typing ? (
                  <span className="ag-typing">
                    <i />
                    <i />
                    <i />
                    <span className="sr-only">{ui.typing}</span>
                  </span>
                ) : (
                  <>
                    {m.text}
                    {m.work && (
                      <span className={`ag-work${m.approve && !approved ? ' wait' : ''}`}>
                        {m.approve && !approved ? <i className="ag-pulse" /> : <Check size={13} aria-hidden />}
                        {m.approve && approved ? ui.approved : m.work}
                      </span>
                    )}
                    {m.approve && live && !approved && (
                      <button type="button" className="ag-approve" tabIndex={-1} onClick={() => goTo(askAt(4) + 0.3)}>
                        {ui.approve}
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </div>
  )

  return (
    <section className={`ag${live ? ' is-live' : ''}`} aria-labelledby="ag-title">
      <div className="ag-track" ref={track} style={live ? { height: `${100 + last * SCREENS_PER_STEP * 100}svh` } : undefined}>
        <div className="ag-stage" ref={stage}>
          <div className="ph-grid" aria-hidden />
          {live && (
            <div className="ag-visual" aria-hidden>
              <SceneBoundary fallback={null}>
                <Suspense fallback={null}>
                  <AgentScene state={state} rtl={rtl} steps={steps} last={last} />
                </Suspense>
              </SceneBoundary>
            </div>
          )}
          <div className="wrap ag-inner">
            <div className="ag-copy">
              <nav className="crumbs" aria-label="Breadcrumb">
                <Link to="/">{t.UI.header.home}</Link>
                {crumbs.map(([label]) => (
                  <span key={label}>
                    <ChevronRight size={14} aria-hidden />
                    <span aria-current="page">{label}</span>
                  </span>
                ))}
              </nav>
              <span className="eyebrow">{eyebrow}</span>
              <h1 id="ag-title">
                {title[0]}
                <span className="hl">{title[1]}</span>
              </h1>
              <p className="ag-lede">{lede}</p>
              {live && (
                <p className="ps-hint ag-hint" ref={hint} aria-hidden>
                  {ui.hint}
                </p>
              )}
            </div>
            {chat}
          </div>
          {live && (
            <>
              <div className="ps-progress" aria-hidden>
                <i ref={bar} />
              </div>
              <a className="ps-skip ag-skip" href="#after-agent">
                {ui.skip}
              </a>
            </>
          )}
        </div>
      </div>
      {/* the animated chat is decorative for screen readers; this is the same conversation */}
      {live && (
        <ol className="sr-only">
          <li>{ui.greeting}</li>
          {steps.map((s, i) => (
            <li key={i}>
              {ui.you}: {s.ask} — {t.UI.chat.name}: {s.reply} ({s.work})
            </li>
          ))}
          <li>{ui.outro}</li>
        </ol>
      )}
    </section>
  )
}
