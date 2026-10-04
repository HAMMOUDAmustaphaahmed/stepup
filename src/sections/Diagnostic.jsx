import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw, Target, TrendingDown } from 'lucide-react'
import { Reveal, CountUp } from '../components/ui'
import { CONTACT_EMAIL } from '../content'
import { useLang } from '../i18n'

const MAX = 3
const SIZE = 320
const C = SIZE / 2
const R = 112

function point(i, n, v) {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / n
  const r = R * Math.max(v / MAX, 0.06)
  return [C + r * Math.cos(a), C + r * Math.sin(a)]
}

function pathFor(values) {
  return values.map((v, i) => point(i, values.length, v ?? 0)).map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ' Z'
}

function Radar({ axes, values, current, labels }) {
  const n = axes.length
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="radar" role="img" aria-label={labels.you}>
      {[1, 2, 3].map((lvl) => (
        <path key={lvl} d={pathFor(axes.map(() => lvl))} className={`radar-ring${lvl === 3 ? ' outer' : ''}`} />
      ))}
      {axes.map((_, i) => {
        const [x, y] = point(i, n, MAX)
        return <line key={i} x1={C} y1={C} x2={x} y2={y} className="radar-spoke" />
      })}
      <motion.path
        className="radar-shape"
        initial={false}
        animate={{ d: pathFor(values) }}
        transition={{ type: 'spring', stiffness: 160, damping: 18 }}
      />
      {values.map((v, i) => {
        const [x, y] = point(i, n, v ?? 0)
        return (
          <motion.circle
            key={i}
            r={v == null ? 0 : 5}
            className="radar-dot"
            initial={false}
            animate={{ cx: x, cy: y, r: v == null ? 0 : 5 }}
            transition={{ type: 'spring', stiffness: 160, damping: 18 }}
          />
        )
      })}
      {axes.map((a, i) => {
        const [x, y] = point(i, n, MAX * 1.24)
        return (
          <text
            key={a}
            x={x}
            y={y}
            className={`radar-label${i === current ? ' is-current' : ''}`}
            textAnchor={Math.abs(x - C) < 8 ? 'middle' : x > C ? 'start' : 'end'}
            dominantBaseline="middle"
          >
            {a}
          </text>
        )
      })}
    </svg>
  )
}

export default function Diagnostic({ bare = false }) {
  const { t } = useLang()
  const ui = t.UI.quiz
  const Q = t.QUIZ
  const axes = Q.map((q) => q.axis)
  const [answers, setAnswers] = useState(() => Q.map(() => null))
  const [step, setStep] = useState(0)
  const done = step >= Q.length

  const choose = (v) => {
    const next = answers.slice()
    next[step] = v
    setAnswers(next)
    setTimeout(() => setStep((s) => s + 1), 280)
  }
  const restart = () => {
    setAnswers(Q.map(() => null))
    setStep(0)
  }

  const total = answers.reduce((s, v) => s + (v ?? 0), 0)
  const score = Math.round((total / (Q.length * MAX)) * 100)
  const level = score < 35 ? 0 : score < 60 ? 1 : score < 85 ? 2 : 3
  const weakestIdx = answers.reduce((w, v, i) => ((v ?? 0) < (answers[w] ?? 0) ? i : w), 0)
  const weakest = axes[weakestIdx]
  const start = ui.packs[weakest]
  const mail = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(ui.mailSubject)}&body=${encodeURIComponent(
    ui.mailBody(score, ui.levels[level], weakest, start),
  )}`

  return (
    <section className="section alt diagnostic" id="quiz">
      <div className="wrap">
        {!bare && (
        <Reveal className="center head-block">
          <span className="eyebrow">{ui.eyebrow}</span>
          <h2 className="title">
            {ui.title[0]}
            <span className="hl">{ui.title[1]}</span>
          </h2>
          <p className="lede">{ui.lede}</p>
        </Reveal>
        )}

        <Reveal className="quiz">
          <div className="quiz-visual">
            <Radar axes={axes} values={answers} current={done ? -1 : step} labels={ui} />
            <div className="radar-legend">
              <span>
                <i className="lg-you" /> {ui.you}
              </span>
              <span>
                <i className="lg-target" /> {ui.target}
              </span>
            </div>
          </div>

          <div className="quiz-panel" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {!done ? (
                <motion.div
                  key={`q-${step}`}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="quiz-progress">
                    <span>{ui.step(step + 1, Q.length)}</span>
                    <span className="qp-bar">
                      <motion.i animate={{ width: `${(step / Q.length) * 100}%` }} />
                    </span>
                  </div>
                  <h3 className="quiz-q">{Q[step].q}</h3>
                  <div className="quiz-answers">
                    {Q[step].a.map((label, v) => (
                      <button
                        key={label}
                        type="button"
                        className={`quiz-answer${answers[step] === v ? ' is-picked' : ''}`}
                        onClick={() => choose(v)}
                      >
                        <span className="qa-meter" aria-hidden>
                          {[0, 1, 2].map((k) => (
                            <i key={k} className={k < v ? 'on' : ''} />
                          ))}
                        </span>
                        {label}
                      </button>
                    ))}
                  </div>
                  {step > 0 && (
                    <button type="button" className="quiz-back" onClick={() => setStep((s) => s - 1)}>
                      <ArrowLeft size={16} aria-hidden /> {ui.back}
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  className="quiz-result"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <span className="qr-label">{ui.score}</span>
                  <div className="qr-score">
                    <CountUp to={score} suffix="%" />
                    <span className={`qr-level l${level}`}>{ui.levels[level]}</span>
                  </div>
                  <div className="qr-scale" aria-hidden>
                    {ui.levels.map((l, i) => (
                      <span key={l} className={i === level ? 'on' : ''}>
                        {l}
                      </span>
                    ))}
                  </div>
                  <p className="qr-text">{ui.levelText[level]}</p>
                  <div className="qr-cards">
                    <div>
                      <span>
                        <TrendingDown size={16} aria-hidden /> {ui.weakest}
                      </span>
                      <strong>{weakest}</strong>
                    </div>
                    <div>
                      <span>
                        <Target size={16} aria-hidden /> {ui.start}
                      </span>
                      <strong>{start}</strong>
                    </div>
                  </div>
                  <div className="qr-actions">
                    <a className="btn btn-solid btn-square" href={mail}>
                      {ui.cta}
                    </a>
                    <button type="button" className="quiz-back" onClick={restart}>
                      <RotateCcw size={16} aria-hidden /> {ui.restart}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
