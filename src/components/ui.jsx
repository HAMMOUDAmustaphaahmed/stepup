import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, animate, useInView, useReducedMotion } from 'framer-motion'
import {
  Award,
  BarChart3,
  Boxes,
  Building2,
  Calculator,
  Car,
  ClipboardCheck,
  Cpu,
  Factory,
  FileText,
  GanttChart,
  Gauge,
  GraduationCap,
  Handshake,
  HardHat,
  Layers,
  LifeBuoy,
  Lightbulb,
  ListChecks,
  Megaphone,
  MessagesSquare,
  Network,
  RefreshCcw,
  SearchCheck,
  Server,
  ShoppingCart,
  TrendingUp,
  Truck,
  UserPlus,
  UserX,
  Users,
  UtensilsCrossed,
  Wallet,
  Wrench,
} from 'lucide-react'

// Explicit map keeps the bundle tree-shaken while content names icons by string.
const ICONS = {
  Award,
  BarChart3,
  Boxes,
  Building2,
  Calculator,
  Car,
  ClipboardCheck,
  Cpu,
  Factory,
  FileText,
  GanttChart,
  Gauge,
  GraduationCap,
  Handshake,
  HardHat,
  Layers,
  LifeBuoy,
  Lightbulb,
  ListChecks,
  Megaphone,
  MessagesSquare,
  Network,
  RefreshCcw,
  SearchCheck,
  Server,
  ShoppingCart,
  TrendingUp,
  Truck,
  UserPlus,
  UserX,
  Users,
  UtensilsCrossed,
  Wallet,
  Wrench,
}

export function Icon({ name, ...props }) {
  const C = ICONS[name]
  return C ? <C aria-hidden {...props} /> : null
}

export function Reveal({ children, delay = 0, y = 24, className, style, id, as = 'div' }) {
  const M = motion[as]
  return (
    <M
      id={id}
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}

export function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(reduce ? to : 0)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, to, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, reduce])

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  )
}

export function useMediaQuery(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Stepup">
      <span className="logo-mark" aria-hidden />
      Stepup
    </Link>
  )
}

// Renders a title given as a string or as [before, highlighted, after].
export function Title({ parts }) {
  if (typeof parts === 'string') return parts
  return (
    <>
      {parts[0]}
      <span className="hl">{parts[1]}</span>
      {parts[2]}
    </>
  )
}
