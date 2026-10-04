import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { DEMO_HREF } from '../content'
import { useLang } from '../i18n'

// Thin reading-progress bar pinned to the top of the window.
export function ProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28 })
  return <motion.div className="read-progress" style={{ scaleX }} aria-hidden />
}

// On every page change: go to the #section if the link has one, otherwise to the top.
export function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const lenis = window.__lenis
    if (!hash) {
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
      else window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    let tries = 0
    const find = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el && lenis) lenis.scrollTo(el, { offset: -84 })
      else if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else if (tries++ < 20) setTimeout(find, 60)
    }
    find()
  }, [pathname, hash])
  return null
}

// Plain <a href="/..."> links in content (e.g. "/pricing#roi") go through the router
// instead of reloading the page.
export function LinkInterceptor() {
  const navigate = useNavigate()
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest('a[href]')
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return
      const href = a.getAttribute('href')
      if (!href.startsWith('/') || href.startsWith('//')) return
      e.preventDefault()
      navigate(href)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [navigate])
  return null
}

// Bottom call-to-action bar on phones.
export function StickyCta() {
  const { t } = useLang()
  const { pathname } = useLocation()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const nearEnd = window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 900
      setShow(window.scrollY > window.innerHeight * 0.6 && !nearEnd)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  if (pathname === '/contact') return null
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="sticky-cta"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
        >
          <span>{t.UI.sticky.text}</span>
          <Link className="btn btn-solid" to={DEMO_HREF}>
            {t.UI.sticky.cta}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
