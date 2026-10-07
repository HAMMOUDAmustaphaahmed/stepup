import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, Send } from 'lucide-react'
import { Icon, Reveal } from '../components/ui'
import { useLang } from '../i18n'

function shareHref(ui, p) {
  const url = window.location.href.split('#')[0]
  const body = ui.shareBody(p.role, p.question, p.points, url)
  return `mailto:?subject=${encodeURIComponent(ui.shareSubject)}&body=${encodeURIComponent(body)}`
}

export default function Personas() {
  const { t } = useLang()
  const ui = t.UI.personas
  const [active, setActive] = useState('ceo')
  const p = t.PERSONAS.find((x) => x.id === active)

  const onKey = (e) => {
    const ids = t.PERSONAS.map((x) => x.id)
    const i = ids.indexOf(active)
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(ids[(i + 1) % ids.length])
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(ids[(i - 1 + ids.length) % ids.length])
    }
  }

  return (
    <section className="section personas" id="committee">
      <div className="wrap">
        <Reveal className="center head-block">
          <span className="eyebrow">{ui.eyebrow}</span>
          <h2 className="title">
            {ui.title[0]}
            <span className="hl">{ui.title[1]}</span>
          </h2>
          <p className="lede">{ui.lede}</p>
        </Reveal>

        <Reveal className="committee">
          <div className="seats-row" role="tablist" aria-label={ui.eyebrow} onKeyDown={onKey}>
            {t.PERSONAS.map((x) => (
              <button
                key={x.id}
                type="button"
                role="tab"
                id={`persona-${x.id}`}
                aria-selected={x.id === active}
                aria-controls="persona-panel"
                tabIndex={x.id === active ? 0 : -1}
                className="seat"
                onClick={() => setActive(x.id)}
              >
                <span className="seat-avatar">
                  {x.id === active && (
                    <motion.span
                      layoutId="seat-ring"
                      className="seat-ring"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <Icon name={x.icon} size={24} />
                </span>
                <span className="seat-label">{x.short}</span>
              </button>
            ))}
          </div>

          <div className="persona-panel" id="persona-panel" role="tabpanel" aria-labelledby={`persona-${active}`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                className="persona-body"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div className="persona-head">
                  <span className="persona-role">{p.role}</span>
                  <blockquote>{p.question}</blockquote>
                </div>
                <ul className="persona-points">
                  {p.points.map((pt, i) => (
                    <motion.li
                      key={pt}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                    >
                      <Check size={18} aria-hidden /> {pt}
                    </motion.li>
                  ))}
                </ul>
                <div className="persona-actions">
                  <Link className="link-arrow" to={p.link[0]}>
                    {p.link[1]} <ArrowRight size={16} aria-hidden />
                  </Link>
                  <button type="button" className="btn btn-outline" onClick={() => (window.location.href = shareHref(ui, p))}>
                    <Send size={16} aria-hidden /> {p.shareTo}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
