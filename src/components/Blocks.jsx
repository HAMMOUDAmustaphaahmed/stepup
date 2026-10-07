import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, BadgeCheck, CalendarCheck, ChevronDown, ChevronRight, Layers, Rocket } from 'lucide-react'
import { Icon, Reveal, Logo } from './ui'
import { SplitWords, VelocityMarquee, ZoomFrame } from './Motion'
import { DEMO_HREF, QUOTE_HREF, STANDARDS } from '../content'
import { useLang } from '../i18n'

// Top of every inner page: breadcrumb, title, lede and an animated Stepup mark.
export function PageHero({ eyebrow, title, lede, crumbs = [], accent, children }) {
  const { t } = useLang()
  return (
    <section className="page-hero" style={accent ? { '--accent': accent } : undefined}>
      <div className="ph-grid" aria-hidden />
      <svg className="ph-mark" viewBox="0 0 120 100" aria-hidden>
        <motion.path
          d="M4 94 L30 50 L42 70 L62 30 L78 60 L104 14"
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </svg>
      <div className="wrap ph-inner">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">{t.UI.header.home}</Link>
          {crumbs.map(([label, to]) => (
            <span key={label}>
              <ChevronRight size={14} aria-hidden />
              {to ? <Link to={to}>{label}</Link> : <span aria-current="page">{label}</span>}
            </span>
          ))}
        </nav>
        <motion.span className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {eyebrow}
        </motion.span>
        <h1>
          {typeof title === 'string' ? (
            <SplitWords text={title} />
          ) : (
            <>
              <SplitWords text={title[0].trim()} />
              <SplitWords text={title[1]} className="hl" delay={0.15} />
            </>
          )}
        </h1>
        {lede && (
          <motion.p className="ph-lede" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16 }}>
            {lede}
          </motion.p>
        )}
        {children}
      </div>
    </section>
  )
}

export function Standards() {
  const { t } = useLang()
  return (
    <div className="strip">
      <div className="wrap">
        <span className="eyebrow">{t.UI.standards}</span>
      </div>
      <VelocityMarquee>
        {STANDARDS.map((s) => (
          <span className="vm-item" key={s}>
            <BadgeCheck size={22} aria-hidden /> {s}
          </span>
        ))}
      </VelocityMarquee>
    </div>
  )
}

export function Industries() {
  const { t } = useLang()
  const ui = t.UI.industries
  return (
    <section className="section alt" id="industries">
      <div className="wrap">
        <Reveal className="ind-head head-block">
          <div>
            <span className="eyebrow">{ui.eyebrow}</span>
            <h2 className="title">{ui.title}</h2>
          </div>
          <Link className="link-arrow" to={DEMO_HREF}>
            {ui.link} <ArrowRight size={16} aria-hidden />
          </Link>
        </Reveal>
        <div className="industries">
          {t.INDUSTRIES.map((ind, i) => (
            <Reveal key={i} delay={i * 0.08} className="industry">
              <div className="ind-visual">
                <Icon name={ind.icon} size={64} strokeWidth={1.3} />
              </div>
              <div className="ind-body">
                <div className="ind-sector">{ind.sector}</div>
                <h3>{ind.title}</h3>
                <p>{ind.body}</p>
                <div className="ind-tag">{ind.tag}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FaqList({ items }) {
  const { t } = useLang()
  const list = items ?? t.FAQ
  const [open, setOpen] = useState(0)
  return (
    <div className="faq">
      {list.map(([q, a], i) => {
        const isOpen = open === i
        return (
          <div className="faq-item" key={i}>
            <button type="button" className="faq-q" aria-expanded={isOpen} aria-controls={`faq-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
              {q}
              <ChevronDown size={22} aria-hidden />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-${i}`}
                  className="faq-a"
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <p>{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export function Cta() {
  return (
    <ZoomFrame className="cta-frame">
      <CtaBody />
    </ZoomFrame>
  )
}

function CtaBody() {
  const { t } = useLang()
  const ui = t.UI.cta
  const icons = [CalendarCheck, Rocket, Layers]
  return (
    <section className="section cta">
      <div className="wrap">
        <Reveal>
          <span className="eyebrow">{ui.eyebrow}</span>
          <h2 className="title">{ui.title}</h2>
          <p className="lede">{ui.lede}</p>
          <ul className="cta-steps">
            {ui.steps.map((s, i) => {
              const I = icons[i]
              return (
                <li key={i}>
                  <I size={20} aria-hidden /> {s}
                </li>
              )
            })}
          </ul>
          <div className="hero-ctas">
            <Link className="btn btn-solid btn-square" to={DEMO_HREF}>
              {ui.demo}
            </Link>
            <Link className="btn btn-outline btn-square" to={QUOTE_HREF}>
              {ui.quote}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  const { t } = useLang()
  const ui = t.UI.footer
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Logo />
            <p>{ui.tagline}</p>
          </div>
          {t.FOOTER.map(([title, links]) => (
            <div key={title}>
              <h3>{title}</h3>
              <ul>
                {links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Stepup. {ui.rights}
          </span>
          <span>{ui.available}</span>
        </div>
      </div>
    </footer>
  )
}
