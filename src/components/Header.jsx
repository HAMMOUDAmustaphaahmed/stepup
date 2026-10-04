import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react'
import { Icon, Logo } from './ui'
import LangMenu from './LangMenu'
import { DEMO_HREF, QUOTE_HREF } from '../content'
import { MODULES } from '../data/modules'
import { useLang } from '../i18n'

function ModulesMenu() {
  const { t } = useLang()
  return (
    <motion.div
      className="mega"
      initial={{ opacity: 0, y: 8, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 8, x: '-50%' }}
      transition={{ duration: 0.18 }}
    >
      {t.FAMILIES.map((f) => (
        <div key={f.id}>
          <h4 style={{ borderColor: f.color }}>{f.name}</h4>
          <ul>
            {MODULES.filter((m) => m.family === f.id).map((m) => (
              <li key={m.slug}>
                <Link to={`/modules/${m.slug}`}>
                  <Icon name={m.icon} size={15} /> {t.MOD[m.slug].name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Link to="/modules" className="mega-all">
        {t.PAGES.allModules} <ArrowRight size={16} aria-hidden />
      </Link>
    </motion.div>
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
              <div
                key={n.to}
                className="nav-item"
                ref={itemRef}
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <NavLink to={n.to} className={navClass} aria-haspopup="true" aria-expanded={menuOpen} onFocus={() => setMenuOpen(true)}>
                  {n.label} <ChevronDown size={16} aria-hidden />
                </NavLink>
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
              {t.PAGES.nav.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to} className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                    {n.label}
                  </NavLink>
                </li>
              ))}
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
