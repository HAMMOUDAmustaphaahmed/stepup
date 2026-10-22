import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronDown, ChevronRight, Menu, Puzzle, X } from 'lucide-react'
import { Icon, Logo } from './ui'
import LangMenu from './LangMenu'
import { DEMO_HREF, QUOTE_HREF } from '../content'
import { MODULES } from '../data/modules'
import { useLang } from '../i18n'

// Modules menu: the four families first; clicking one opens the list of its modules.
// Below them, custom modules (built for one client) and the page with all modules.
function ModulesMenu() {
  const { t } = useLang()
  const [open, setOpen] = useState(null)
  const fam = t.FAMILIES.find((f) => f.id === open)
  return (
    <motion.div
      className={`mega2${fam ? ' has-sub' : ''}`}
      id="modules-menu"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18 }}
    >
      <div className="mega2-main">
        <ul className="mega2-families">
          {t.FAMILIES.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                className={open === f.id ? 'is-open' : undefined}
                style={{ '--c': f.color }}
                aria-expanded={open === f.id}
                aria-controls="modules-sub"
                onClick={() => setOpen((o) => (o === f.id ? null : f.id))}
              >
                <i aria-hidden />
                <span>{f.name}</span>
                <em>{MODULES.filter((m) => m.family === f.id).length}</em>
                <ChevronRight size={16} aria-hidden className="mega2-chev" />
              </button>
            </li>
          ))}
        </ul>
        <Link to="/contact?topic=custom" className="mega2-custom">
          <span className="mega2-custom-icon" aria-hidden>
            <Puzzle size={18} />
          </span>
          <span>
            <strong>{t.UI.custom.menu}</strong>
            <small>{t.UI.custom.menuBody}</small>
          </span>
        </Link>
        <Link to="/modules" className="mega-all">
          {t.PAGES.allModules} <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {fam && (
          <motion.div
            key={fam.id}
            id="modules-sub"
            className="mega2-sub"
            style={{ '--c': fam.color }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
            transition={{ duration: 0.2 }}
          >
            <h4>{fam.name}</h4>
            <ul>
              {MODULES.filter((m) => m.family === fam.id).map((m) => (
                <li key={m.slug}>
                  <Link to={`/modules/${m.slug}`}>
                    <Icon name={m.icon} size={16} /> {t.MOD[m.slug].name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to={`/modules#${fam.id}`} className="mega2-fam-link">
              {fam.name} <ArrowRight size={14} aria-hidden />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Same structure in the phone menu, as nested accordions.
function MobileModules({ label }) {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [fam, setFam] = useState(null)
  return (
    <li className="mnav-modules">
      <button type="button" className="mnav-toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {label} <ChevronDown size={18} aria-hidden />
      </button>
      {open && (
        <ul className="mnav-families">
          {t.FAMILIES.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                className="mnav-toggle"
                style={{ '--c': f.color }}
                aria-expanded={fam === f.id}
                onClick={() => setFam((x) => (x === f.id ? null : f.id))}
              >
                <i aria-hidden /> {f.name} <ChevronDown size={16} aria-hidden />
              </button>
              {fam === f.id && (
                <ul className="mnav-mods">
                  {MODULES.filter((m) => m.family === f.id).map((m) => (
                    <li key={m.slug}>
                      <Link to={`/modules/${m.slug}`}>
                        <Icon name={m.icon} size={16} /> {t.MOD[m.slug].name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li>
            <Link to="/contact?topic=custom" className="mnav-custom">
              <Puzzle size={16} aria-hidden /> {t.UI.custom.menu}
            </Link>
          </li>
          <li>
            <Link to="/modules" className="mnav-all">
              {t.PAGES.allModules}
            </Link>
          </li>
        </ul>
      )}
    </li>
  )
}

export default function Header() {
  const { t } = useLang()
  const ui = t.UI.header
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const itemRef = useRef(null)

  // close menus whenever the page changes
  useEffect(() => {
    setMobileOpen(false)
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    const onClick = (e) => itemRef.current && !itemRef.current.contains(e.target) && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [menuOpen])

  const navClass = ({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`

  return (
    <header className="header">
      <div className="wrap header-row">
        <Logo />
        <nav className="nav" aria-label={ui.main}>
          {t.PAGES.nav.map((n) =>
            n.menu ? (
              <div key={n.to} className="nav-item" ref={itemRef}>
                <button
                  type="button"
                  className={`nav-link nav-button${pathname.startsWith(n.to) ? ' is-active' : ''}${menuOpen ? ' is-open' : ''}`}
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                  aria-controls="modules-menu"
                  onClick={() => setMenuOpen((o) => !o)}
                >
                  {n.label} <ChevronDown size={16} aria-hidden />
                </button>
                <AnimatePresence>{menuOpen && <ModulesMenu />}</AnimatePresence>
              </div>
            ) : (
              <NavLink key={n.to} to={n.to} className={navClass}>
                {n.label}
              </NavLink>
            ),
          )}
        </nav>
        <LangMenu />
        <div className="header-ctas">
          <Link className="btn btn-outline" to={QUOTE_HREF}>
            {ui.quote}
          </Link>
          <Link className="btn btn-solid" to={DEMO_HREF}>
            {ui.demo}
          </Link>
        </div>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? ui.closeMenu : ui.openMenu}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label={ui.main}
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <ul>
              {t.PAGES.nav.map((n) =>
                n.menu ? (
                  <MobileModules key={n.to} label={n.label} />
                ) : (
                  <li key={n.to}>
                    <NavLink to={n.to} className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                      {n.label}
                    </NavLink>
                  </li>
                ),
              )}
              <li>
                <NavLink to="/faq">FAQ</NavLink>
              </li>
              <li>
                <Link className="btn btn-solid" to={DEMO_HREF}>
                  {ui.demo}
                </Link>
              </li>
              <li>
                <Link className="btn btn-outline" to={QUOTE_HREF}>
                  {ui.quote}
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
