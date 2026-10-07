import { Fragment, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'

// Inertial smooth scrolling for the whole site (off when the visitor prefers reduced motion).
export function SmoothScroll() {
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95 })
    window.__lenis = lenis
    let id
    const raf = (time) => {
      lenis.raf(time)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
      window.__lenis = undefined
    }
  }, [reduce])
  return null
}

const wrap = (min, max, v) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

// An endless row that speeds up, and reverses, with the scroll velocity.
export function VelocityMarquee({ children, baseVelocity = -2 }) {
  const reduce = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false })
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`)
  const dir = useRef(1)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    let move = dir.current * baseVelocity * (delta / 1000)
    if (factor.get() < 0) dir.current = -1
    else if (factor.get() > 0) dir.current = 1
    move += dir.current * move * factor.get()
    baseX.set(baseX.get() + move)
  })

  return (
    <div className="vm" dir="ltr">
      <motion.div className="vm-track" style={{ x }}>
        {[0, 1, 2, 3].map((i) => (
          <div className="vm-group" key={i} aria-hidden={i > 0}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// A section that grows from a rounded "frame" to full width as it scrolls into view.
export function ZoomFrame({ children, className = '', id }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.25'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1])
  const radius = useTransform(scrollYProgress, [0, 1], [36, 0])
  return (
    <motion.div
      ref={ref}
      id={id}
      className={`zoom-frame ${className}`}
      style={reduce ? undefined : { scale, borderRadius: radius }}
    >
      {children}
    </motion.div>
  )
}

// Headline whose words rise into place one after another.
export function SplitWords({ text, className, delay = 0 }) {
  const words = String(text).split(' ')
  return (
    <span className={className}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="sw-mask">
            <motion.span
              className="sw-word"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </span>
  )
}
