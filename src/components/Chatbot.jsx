import { Fragment, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowUp, MessageCircle, RotateCcw, X } from 'lucide-react'
import { useLang } from '../i18n'
import { SITE_URL } from '../site'

const SITE_HOST = new URL(SITE_URL).host.toLowerCase()

const STORE = 'stepup-chat'

// ---------- Links in answers ----------

// Site pages Kai may link to (without language prefix).
const PAGE_RE = /^\/(?:platform|modules(?:\/[a-z]+)?|ai|solutions|pricing|diagnostic|faq|contact)?(?:#[\w-]+)?$/
// A bare page path inside text, e.g. "/contact" or "/pricing#roi"
const BARE_PATH = /(^|[\s(«"'])(\/(?:platform|modules(?:\/[a-z]+)?|ai|solutions|pricing|diagnostic|faq|contact)(?:#[\w-]+)?)(?=$|[\s).,;:!?»"'])/g

// "/fr/contact", "https://www.stepup.app/en/ai", " /contact " -> "/contact" (or null if not a site page)
function toPage(raw) {
  let p = String(raw || '').trim()
  const host = p.match(/^https?:\/\/([^/]+)/i)?.[1]
  if (host) {
    // only links to this website, never to other domains
    const own = [SITE_HOST, typeof window !== 'undefined' ? window.location.host : ''].filter(Boolean)
    if (!own.includes(host.toLowerCase())) return null
    p = p.slice(p.indexOf(host) + host.length)
  }
  p = p.replace(/^\/(fr|en|ar|es|it)(?=\/|#|$)/, '') || '/'
  if (!p.startsWith('/')) return null
  p = p.replace(/\/+$/, '').replace(/\/(#)/, '$1') || '/'
  return PAGE_RE.test(p) ? p : null
}

// A readable button label for a page, in the visitor's language.
function labelFor(path, t) {
  const [base, hash] = path.split('#')
  const nav = Object.fromEntries(t.PAGES.nav.map((n) => [n.to, n.label]))
  if (base === '/contact') return t.UI.header.demo
  if (base === '/pricing' && hash === 'roi') return t.UI.hero.gains
  if (base.startsWith('/modules/')) return t.MOD[base.slice(9)]?.name || nav['/modules']
  if (base === '/modules') return t.PAGES.allModules
  if (base === '/faq') return 'FAQ'
  if (base === '/') return t.UI.header.home
  return nav[base] || base
}

const looksLikePath = (s) => /^\s*(https?:\/\/|\/)/.test(s)

// Inline text: **bold**, [label](path) and bare page paths become links.
function inline(text, key, t, onNavigate) {
  const parts = []
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(\s*([^)\s]+)\s*\)/g
  let last = 0
  let m
  const pushText = (s, k) => {
    // bare paths inside plain text
    let i = 0
    let b
    BARE_PATH.lastIndex = 0
    while ((b = BARE_PATH.exec(s))) {
      const start = b.index + b[1].length
      if (start > i) parts.push(s.slice(i, start))
      const page = toPage(b[2])
      parts.push(
        <Link key={`${k}-p${start}`} to={page} className="kai-inline-link" onClick={onNavigate}>
          {labelFor(page, t)}
        </Link>,
      )
      i = start + b[2].length
    }
    if (i < s.length) parts.push(s.slice(i))
  }
  while ((m = re.exec(text))) {
    if (m.index > last) pushText(text.slice(last, m.index), `${key}-t${m.index}`)
    if (m[1]) parts.push(<strong key={`${key}-b${m.index}`}>{m[1]}</strong>)
    else {
      const page = toPage(m[3])
      if (page) {
        parts.push(
          <Link key={`${key}-l${m.index}`} to={page} className="kai-inline-link" onClick={onNavigate}>
            {looksLikePath(m[2]) ? labelFor(page, t) : m[2]}
          </Link>,
        )
      } else parts.push(m[2])
    }
    last = re.lastIndex
  }
  if (last < text.length) pushText(text.slice(last), `${key}-end`)
  return parts
}

// Lines that contain nothing but links (e.g. "👉 [Demo](/contact)") become action buttons.
function linkOnlyLine(line) {
  const stripped = line.replace(/^[-*•]\s+/, '').replace(/👉|➡️|➡|→|▶️|▶/gu, '').trim()
  const links = []
  const rest = stripped
    .replace(/\[([^\]]+)\]\(\s*([^)\s]+)\s*\)/g, (_, label, href) => {
      const page = toPage(href)
      if (page) links.push({ page, label: looksLikePath(label) ? null : label.trim() })
      return page ? '' : _
    })
    .replace(/(^|\s)(\/[\w#/-]+)(?=\s|$)/g, (_, sp, path) => {
      const page = toPage(path)
      if (page) links.push({ page, label: null })
      return page ? sp : _
    })
    .replace(/[\s|,·:—–-]+/g, '')
  return links.length && !rest ? links : null
}

function Markdown({ text, t, onNavigate }) {
  const blocks = []
  const actions = []
  let list = null
  text.split('\n').forEach((raw, i) => {
    const line = raw.trim()
    const only = line && linkOnlyLine(line)
    if (only) {
      only.forEach((a) => !actions.some((x) => x.page === a.page) && actions.push(a))
      return
    }
    const bullet = line.match(/^[-*•]\s+(.*)/)
    if (bullet) {
      list ??= []
      list.push(<li key={i}>{inline(bullet[1], i, t, onNavigate)}</li>)
      return
    }
    if (list) {
      blocks.push(<ul key={`u${i}`}>{list}</ul>)
      list = null
    }
    if (line) blocks.push(<p key={i}>{inline(line.replace(/^#+\s*/, ''), i, t, onNavigate)}</p>)
  })
  if (list) blocks.push(<ul key="u-end">{list}</ul>)
  return (
    <Fragment>
      {blocks}
      {actions.length > 0 && (
        <div className="kai-actions">
          {actions.slice(0, 3).map((a) => (
            <Link key={a.page} to={a.page} className="kai-action" onClick={onNavigate}>
              {a.label || labelFor(a.page, t)}
              <ArrowRight size={15} aria-hidden />
            </Link>
          ))}
        </div>
      )}
    </Fragment>
  )
}

function load() {
  try {
    return JSON.parse(sessionStorage.getItem(STORE)) || []
  } catch {
    return []
  }
}

export default function Chatbot() {
  const { t, lang } = useLang()
  const ui = t.UI.chat
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(load)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [nudge, setNudge] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)
  const abortRef = useRef(null)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(messages.slice(-20)))
    } catch {
      // the conversation just won't survive a reload
    }
  }, [messages])

  // a small hint bubble once per visit
  useEffect(() => {
    if (messages.length) return
    const id = setTimeout(() => setNudge(true), 9000)
    return () => clearTimeout(id)
  }, [messages.length])

  useEffect(() => {
    if (open) {
      setNudge(false)
      setTimeout(() => inputRef.current?.focus(), 250)
    }
  }, [open])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const send = async (text) => {
    const content = text.trim()
    if (!content || busy) return
    const history = [...messages, { role: 'user', content }]
    setMessages([...history, { role: 'assistant', content: '' }])
    setInput('')
    setBusy(true)
    const controller = new AbortController()
    abortRef.current = controller
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang, page: pathname, messages: history.filter((m) => m.content && !m.failed).map(({ role, content }) => ({ role, content })) }),
        signal: controller.signal,
      })
      if (!res.ok || !res.body) throw new Error(res.status === 429 ? 'busy' : 'error')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let answer = ''
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        answer += decoder.decode(value, { stream: true })
        setMessages([...history, { role: 'assistant', content: answer }])
      }
      if (!answer.trim()) throw new Error('error')
    } catch (e) {
      if (e.name === 'AbortError') return
      setMessages([...history, { role: 'assistant', content: e.message === 'busy' ? ui.busy : ui.error, failed: true }])
    } finally {
      setBusy(false)
    }
  }

  // on phones the chat covers the page: close it when a link is followed
  const onNavigate = () => {
    if (window.matchMedia('(max-width: 760px)').matches) setOpen(false)
  }

  const reset = () => {
    abortRef.current?.abort()
    setBusy(false)
    setMessages([])
  }

  const onSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  return (
    <>
      <AnimatePresence>
        {nudge && !open && (
          <motion.button
            type="button"
            className="kai-nudge"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => setOpen(true)}
          >
            {ui.open}
            <span
              role="button"
              tabIndex={0}
              aria-label={ui.close}
              className="kai-nudge-x"
              onClick={(e) => {
                e.stopPropagation()
                setNudge(false)
              }}
              onKeyDown={(e) => e.key === 'Enter' && setNudge(false)}
            >
              <X size={14} aria-hidden />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className={`kai-launcher${open ? ' is-open' : ''}`}
        aria-label={open ? ui.close : ui.open}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={26} aria-hidden />
            </motion.span>
          ) : (
            <motion.span key="c" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
              <MessageCircle size={26} aria-hidden />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.section
            className="kai-panel"
            role="dialog"
            aria-label={`${ui.name} — ${ui.role}`}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            <header className="kai-head">
              <span className="kai-avatar" aria-hidden>
                <span className="logo-mark" />
              </span>
              <div>
                <strong>{ui.name}</strong>
                <span>
                  <i aria-hidden /> {ui.role}
                </span>
              </div>
              <button type="button" onClick={reset} aria-label={ui.reset} title={ui.reset}>
                <RotateCcw size={18} aria-hidden />
              </button>
              <button type="button" onClick={() => setOpen(false)} aria-label={ui.close} title={ui.close}>
                <X size={20} aria-hidden />
              </button>
            </header>

            <div className="kai-list" ref={listRef} data-lenis-prevent aria-live="polite">
              <div className="kai-msg bot">
                <Markdown text={ui.greeting} t={t} onNavigate={onNavigate} />
              </div>
              {messages.map((m, i) =>
                m.content ? (
                  <motion.div
                    key={i}
                    dir="auto"
                    className={`kai-msg ${m.role === 'user' ? 'me' : 'bot'}${m.failed ? ' failed' : ''}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {m.role === 'user' ? m.content : <Markdown text={m.content} t={t} onNavigate={onNavigate} />}
                  </motion.div>
                ) : null,
              )}
              {busy && !messages[messages.length - 1]?.content && (
                <div className="kai-msg bot kai-typing" aria-label={ui.typing}>
                  <i />
                  <i />
                  <i />
                </div>
              )}
              {!messages.length && (
                <div className="kai-suggest">
                  {ui.suggestions.map((s) => (
                    <button key={s} type="button" onClick={() => send(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form className="kai-input" onSubmit={onSubmit}>
              <textarea
                dir="auto"
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={1000}
                placeholder={ui.placeholder}
                aria-label={ui.placeholder}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send(input)
                  }
                }}
              />
              <button type="submit" disabled={busy || !input.trim()} aria-label={ui.send}>
                <ArrowUp size={20} aria-hidden />
              </button>
            </form>
            <p className="kai-note">{ui.disclaimer}</p>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  )
}
