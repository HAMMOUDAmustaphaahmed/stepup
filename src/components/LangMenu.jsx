import { useEffect, useId, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { LANGUAGES } from './Flags'
import { useLang } from '../i18n'

// Language dropdown with flags. Keyboard: arrows to move, Enter to pick, Esc to close.
export default function LangMenu() {
  const { lang, setLang, t } = useLang()
  const [open, setOpen] = useState(false)
  const [focus, setFocus] = useState(0)
  const root = useRef(null)
  const listId = useId()
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0]

  useEffect(() => {
    if (!open) return
    const onDown = (e) => root.current && !root.current.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  useEffect(() => {
    if (open) root.current?.querySelectorAll('[role="option"]')[focus]?.focus()
  }, [open, focus])

  const choose = (code) => {
    setLang(code)
    setOpen(false)
    root.current?.querySelector('.lm-trigger')?.focus()
  }

  const onKey = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      setFocus(LANGUAGES.indexOf(current))
      setOpen(true)
      return
    }
    if (!open) return
    if (e.key === 'Escape') {
      setOpen(false)
      root.current?.querySelector('.lm-trigger')?.focus()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocus((f) => (f + 1) % LANGUAGES.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocus((f) => (f - 1 + LANGUAGES.length) % LANGUAGES.length)
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div className="lang-menu" ref={root} onKeyDown={onKey}>
      <button
        type="button"
        className="lm-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${t.UI.header.language}: ${current.label}`}
        onClick={() => {
          setFocus(LANGUAGES.indexOf(current))
          setOpen((o) => !o)
        }}
      >
        <span className="lm-flag">
          <current.Flag />
        </span>
        <span className="lm-code">{current.short}</span>
        <ChevronDown size={16} aria-hidden className="lm-chev" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-label={t.UI.header.language}
            className="lm-list"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
          >
            {LANGUAGES.map((l, i) => (
              <li
                key={l.code}
                role="option"
                tabIndex={-1}
                lang={l.code}
                dir={l.rtl ? 'rtl' : 'ltr'}
                aria-selected={l.code === lang}
                className={i === focus ? 'is-focus' : undefined}
                onMouseEnter={() => setFocus(i)}
                onClick={() => choose(l.code)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    choose(l.code)
                  }
                }}
              >
                <span className="lm-flag">
                  <l.Flag />
                </span>
                <span className="lm-label">{l.label}</span>
                {l.code === lang && <Check size={16} aria-hidden className="lm-check" />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
