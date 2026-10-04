import { Fragment, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, MessageCircle, RotateCcw, X } from 'lucide-react'
import { useLang } from '../i18n'

const STORE = 'stepup-chat'

// Minimal, safe markdown: paragraphs, "- " lists, **bold** and [label](/internal-path) links.
function inline(text, key) {
  const parts = []
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(\s*([^)\s]+)\s*\)/g
  let last = 0
  let m
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[1]) parts.push(<strong key={`${key}-b${m.index}`}>{m[1]}</strong>)
    else if (m[3].startsWith('/')) {
      parts.push(
        <Link key={`${key}-l${m.index}`} to={m[3]}>
          {m[2]}
        </Link>,
      )
    } else parts.push(m[2])
    last = re.lastIndex
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function Markdown({ text }) {
  const blocks = []
  let list = null
  text.split('\n').forEach((raw, i) => {
    const line = raw.trim()
    const bullet = line.match(/^[-*•]\s+(.*)/)
    if (bullet) {
      list ??= []
      list.push(<li key={i}>{inline(bullet[1], i)}</li>)
      return
    }
    if (list) {
      blocks.push(<ul key={`u${i}`}>{list}</ul>)
      list = null
    }
    if (line) blocks.push(<p key={i}>{inline(line.replace(/^#+\s*/, ''), i)}</p>)
  })
  if (list) blocks.push(<ul key="u-end">{list}</ul>)
  return <Fragment>{blocks}</Fragment>
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
                <Markdown text={ui.greeting} />
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
                    {m.role === 'user' ? m.content : <Markdown text={m.content} />}
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
