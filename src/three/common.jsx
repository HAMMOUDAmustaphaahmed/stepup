import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

export const COLORS = {
  wall: '#ffffff',
  wallShade: '#eef2f7',
  roof: '#d6dfea',
  navy: '#0d2d4e',
  blue: '#2563eb',
  sky: '#7fb0ff',
  amber: '#f5b400',
  green: '#9cc9a9',
  slab: '#f4f7fb',
}

export const easeOut = (t) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3)

// Grows its children up from the ground after `delay` seconds.
export function Rise({ delay = 0, duration = 0.9, instant = false, children, ...props }) {
  const ref = useRef()
  const start = useRef(null)
  useFrame((state) => {
    if (!ref.current) return
    if (instant) {
      ref.current.scale.y = 1
      return
    }
    if (start.current === null) start.current = state.clock.elapsedTime
    const t = (state.clock.elapsedTime - start.current - delay) / duration
    ref.current.scale.y = Math.max(easeOut(t), 0.0001)
  })
  return (
    <group ref={ref} scale={[1, instant ? 1 : 0.0001, 1]} {...props}>
      {children}
    </group>
  )
}

// Only render frames while the canvas is on screen.
export function useOnScreen(margin = '100px') {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [margin])
  return [ref, visible]
}

