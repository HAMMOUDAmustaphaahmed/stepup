import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Clock, Lightbulb, ShieldCheck, Users } from 'lucide-react'
import { Reveal, CountUp } from '../components/ui'
import { useLang } from '../i18n'

const OWNER_COUNTS = [3, 2, 2]
const KAIZEN = [6, 9, 7, 12, 10, 14, 11, 16, 13, 18, 15, 20]

function Donut({ value, play }) {
  const r = 38
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 100 100" className="donut" aria-hidden>
      <circle cx="50" cy="50" r={r} fill="none" stroke="#e8eef6" strokeWidth="10" />
      <motion.circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="#2563eb"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: play ? c * (1 - value / 100) : c }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        transform="rotate(-90 50 50)"
      />
    </svg>
  )
}

function Tile({ id, active, className = '', children }) {
  return (
    <div className={`tile ${className}${active === id ? ' is-active' : ''}`} data-tile={id}>
      {children}
    </div>
  )
}

export default function Cockpit() {
  const { t } = useLang()
  const ui = t.UI.cockpit
  const QUESTIONS = t.QUESTIONS
  const section = useRef(null)
  const board = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(board, { amount: 0.35 })
  const play = useInView(board, { once: true, amount: 0.3 })
  const [active, setActive] = useState('overdue')
  const [auto, setAuto] = useState(true)

  // Cycle through the questions until the visitor picks one.
  useEffect(() => {
    if (!auto || !inView || reduce) return
    const t = setInterval(() => {
      setActive((cur) => {
        const i = QUESTIONS.findIndex((q) => q.tile === cur)
        return QUESTIONS[(i + 1) % QUESTIONS.length].tile
      })
    }, 3200)
    return () => clearInterval(t)
  }, [auto, inView, reduce, QUESTIONS])

  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'center center'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [24, 0])
  const rotateY = useTransform(scrollYProgress, [0, 1], [-14, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1])

  const pick = (tile) => {
    setAuto(false)
    setActive(tile)
  }

  return (
    <section className="section cockpit" id="cockpit" ref={section}>
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

        <div className="cockpit-grid">
          <ol className="questions">
            {QUESTIONS.map((q, i) => (
              <Reveal as="li" key={q.tile} delay={i * 0.07}>
                <button
                  type="button"
                  className={`question${active === q.tile ? ' is-active' : ''}`}
                  aria-pressed={active === q.tile}
                  onClick={() => pick(q.tile)}
                  onMouseEnter={() => pick(q.tile)}
                >
                  <span className="q-num">{i + 1}</span>
                  <span>{q.q}</span>
                  {active === q.tile && (
                    <motion.span layoutId="q-bar" className="q-bar" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                  )}
                </button>
              </Reveal>
            ))}
          </ol>

          <div className="board-stage">
            <motion.div
              ref={board}
              className="board"
              style={reduce ? undefined : { rotateX, rotateY, scale, transformPerspective: 1400 }}
            >
              <div className="board-bar">
                <span className="dots" aria-hidden>
                  <i />
                  <i />
                  <i />
                </span>
                <span>{ui.board}</span>
                <span className="board-live">
                  <i /> {ui.live}
                </span>
              </div>

              <div className="board-grid">
                <Tile id="overdue" active={active} className="t-overdue">
                  <div className="tile-head">
                    <Clock size={16} aria-hidden /> {ui.overdue}
                  </div>
                  <div className="tile-big">
                    {play ? <CountUp to={7} /> : 0}
                    <small>{ui.overdueSub}</small>
                  </div>
                  <ul className="owners">
                    {OWNER_COUNTS.map((n, oi) => [ui.owners[oi], n]).map(([o, n]) => (
                      <li key={o}>
                        <span>{o}</span>
                        <span className="owner-bar">
                          <motion.i
                            initial={{ width: 0 }}
                            animate={{ width: play ? `${(n / 3) * 100}%` : 0 }}
                            transition={{ duration: 0.9, delay: 0.3 }}
                          />
                        </span>
                        <b>{n}</b>
                      </li>
                    ))}
                  </ul>
                </Tile>

                <Tile id="audit" active={active} className="t-audit">
                  <div className="tile-head">
                    <ShieldCheck size={16} aria-hidden /> {ui.audit}
                  </div>
                  <div className="donut-wrap">
                    <Donut value={92} play={play} />
                    <div className="donut-num">
                      {play ? <CountUp to={92} suffix="%" /> : '0%'}
                    </div>
                  </div>
                  <small className="tile-note">{ui.auditNote}</small>
                </Tile>

                <Tile id="skills" active={active} className="t-skills">
                  <div className="tile-head">
                    <Users size={16} aria-hidden /> {ui.skills}
                  </div>
                  <div className="seats">
                    {[1, 1, 1, 1, 0].map((ok, i) => (
                      <motion.span
                        key={i}
                        className={ok ? 'ok' : 'warn'}
                        initial={{ scale: 0 }}
                        animate={{ scale: play ? 1 : 0 }}
                        transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 400, damping: 18 }}
                      />
                    ))}
                  </div>
                  <div className="tile-mid">{ui.skillsMid}</div>
                  <small className="tile-note warn-text">
                    <AlertTriangle size={13} aria-hidden /> {ui.skillsWarn}
                  </small>
                </Tile>

                <Tile id="decisions" active={active} className="t-decisions">
                  <div className="tile-head">
                    <CheckCircle2 size={16} aria-hidden /> {ui.decisions}
                  </div>
                  <ul className="decisions">
                    {ui.decisionList.map(([d, when]) => (
                      <li key={d}>
                        {d} <em>{when}</em>
                      </li>
                    ))}
                  </ul>
                </Tile>

                <Tile id="kaizen" active={active} className="t-kaizen">
                  <div className="tile-head">
                    <Lightbulb size={16} aria-hidden /> {ui.kaizen}
                  </div>
                  <div className="tile-big">
                    {play ? <CountUp to={36} /> : 0}
                    <small>{ui.kaizenSub}</small>
                  </div>
                  <div className="spark" aria-hidden>
                    {KAIZEN.map((v, i) => (
                      <motion.i
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: play ? `${(v / 20) * 100}%` : 0 }}
                        transition={{ duration: 0.6, delay: 0.2 + i * 0.05 }}
                      />
                    ))}
                  </div>
                </Tile>
              </div>
            </motion.div>
            <p className="board-caption">{ui.caption}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
