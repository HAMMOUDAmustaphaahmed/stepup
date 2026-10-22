import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'
import { COLORS, useOnScreen } from './common'

// One small 3D object per inner page, at the top. Each reacts to `progress` (0 while the page
// hero is fully on screen → 1 once it has scrolled out) and leans towards the pointer.

const clamp01 = (x) => Math.min(1, Math.max(0, x))
const smooth = (x) => x * x * (3 - 2 * x)
const damp = THREE.MathUtils.damp

function Mat({ color, ...props }) {
  return <meshStandardMaterial color={color} roughness={0.45} metalness={0.05} {...props} />
}

// Leans the whole object towards the pointer and gives it a slow idle sway.
function Tilt({ children, progress, spin = 0 }) {
  const ref = useRef()
  useFrame((st, dt) => {
    const p = progress.get()
    ref.current.rotation.y = damp(ref.current.rotation.y, st.pointer.x * 0.35 + Math.sin(st.clock.elapsedTime * 0.4) * 0.12 + p * spin, 4, dt)
    ref.current.rotation.x = damp(ref.current.rotation.x, -st.pointer.y * 0.18, 4, dt)
  })
  return <group ref={ref}>{children}</group>
}

// Platform: the layers of Stepup (systems → data → modules → agents → dashboards) pull apart.
function Stack({ progress }) {
  const layers = useRef([])
  const packets = useRef([])
  const colors = ['#dfe7f1', '#ffffff', COLORS.sky, COLORS.blue, COLORS.navy]
  useFrame((st) => {
    const p = smooth(clamp01(progress.get() * 1.6))
    const t = st.clock.elapsedTime
    layers.current.forEach((l, i) => {
      if (!l) return
      l.position.y = (i - 2) * (0.42 + p * 0.42) + Math.sin(t * 1.2 + i * 0.7) * 0.04
      l.rotation.y = (i - 2) * p * 0.18
    })
    packets.current.forEach((m, i) => {
      if (!m) return
      const f = (t * 0.35 + i / packets.current.length) % 1
      m.position.y = -0.9 - p * 0.8 + f * (1.8 + p * 1.6)
      m.material.opacity = Math.sin(f * Math.PI)
    })
  })
  return (
    <Tilt progress={progress} spin={0.6}>
      <group rotation={[0.42, -0.6, 0]}>
        {colors.map((c, i) => (
          <group key={i} ref={(el) => (layers.current[i] = el)}>
            <RoundedBox args={[2.6 - i * 0.18, 0.2, 2.6 - i * 0.18]} radius={0.08} smoothness={4}>
              <Mat color={c} emissive={i === 4 ? COLORS.navy : '#000'} />
            </RoundedBox>
            {i === 3 &&
              [-0.6, 0, 0.6].map((x) => (
                <mesh key={x} position={[x, 0.13, 0]}>
                  <boxGeometry args={[0.4, 0.06, 0.4]} />
                  <Mat color="#ffffff" />
                </mesh>
              ))}
            {i === 4 && (
              <mesh position={[0, 0.12, 0]}>
                <sphereGeometry args={[0.16, 20, 16]} />
                <meshStandardMaterial color={COLORS.amber} emissive={COLORS.amber} emissiveIntensity={1.2} />
              </mesh>
            )}
          </group>
        ))}
        {[-0.8, 0.8].flatMap((x) =>
          [-0.8, 0.8].map((z) => (
            <mesh key={`${x}${z}`} ref={(el) => el && !packets.current.includes(el) && packets.current.push(el)} position={[x, 0, z]}>
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshBasicMaterial color={COLORS.amber} transparent />
            </mesh>
          )),
        )}
      </group>
    </Tilt>
  )
}

// Modules: 23 tiles that ripple, then rise and spread as you scroll.
function Grid({ progress }) {
  const tiles = useRef([])
  const cells = useMemo(() => {
    const out = []
    for (let i = 0; i < 25 && out.length < 23; i++) {
      const x = (i % 5) - 2
      const z = Math.floor(i / 5) - 2
      if ((x === -2 && z === -2) || (x === 2 && z === 2)) continue
      out.push([x, z])
    }
    return out
  }, [])
  const tint = [COLORS.blue, COLORS.navy, COLORS.sky, '#ffffff', '#ffffff', COLORS.amber]
  useFrame((st) => {
    const p = smooth(clamp01(progress.get() * 1.5))
    const t = st.clock.elapsedTime
    tiles.current.forEach((m, i) => {
      if (!m) return
      const [x, z] = cells[i]
      const d = Math.hypot(x, z)
      m.position.set(x * (0.62 + p * 0.25), Math.sin(t * 1.8 - d * 1.1) * 0.12 + p * Math.sin(i * 1.7) * 0.6, z * (0.62 + p * 0.25))
      m.rotation.y = p * (i % 2 ? 0.6 : -0.6)
    })
  })
  return (
    <Tilt progress={progress} spin={0.8}>
      <group rotation={[0.55, 0.78, 0]}>
        {cells.map((_, i) => (
          <RoundedBox key={i} ref={(el) => (tiles.current[i] = el)} args={[0.5, 0.18, 0.5]} radius={0.06} smoothness={3}>
            <Mat color={tint[(i * 7) % tint.length]} emissive={tint[(i * 7) % tint.length] === COLORS.amber ? COLORS.amber : '#000'} emissiveIntensity={0.3} />
          </RoundedBox>
        ))}
      </group>
    </Tilt>
  )
}

// One module: a cube in the family colour showing the module icon, which splits open on scroll.
function Cube({ progress, color, icon }) {
  const parts = useRef([])
  const core = useRef()
  const offsets = useMemo(() => {
    const out = []
    for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) out.push([x, y, z])
    return out
  }, [])
  useFrame((st, dt) => {
    const p = smooth(clamp01(progress.get() * 1.6))
    parts.current.forEach((m, i) => {
      if (!m) return
      const [x, y, z] = offsets[i]
      const s = 0.5 + p * 0.55
      m.position.set(x * s, y * s, z * s)
      m.rotation.set(p * x * 0.5, p * y * 0.5, 0)
    })
    core.current.rotation.y += dt * 0.8
    core.current.scale.setScalar(Math.max(0.001, p))
    core.current.rotation.x = Math.sin(st.clock.elapsedTime) * 0.3
  })
  return (
    <Tilt progress={progress} spin={1.2}>
      <group rotation={[0.5, -0.65, 0]}>
        {offsets.map((o, i) => (
          <RoundedBox key={i} ref={(el) => (parts.current[i] = el)} args={[0.98, 0.98, 0.98]} radius={0.16} smoothness={4}>
            <Mat color={i % 3 === 0 ? '#ffffff' : color} />
          </RoundedBox>
        ))}
        <mesh ref={core}>
          <icosahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial color={COLORS.amber} emissive={COLORS.amber} emissiveIntensity={0.8} flatShading />
        </mesh>
      </group>
      {icon && (
        <Html center position={[0, 0, 1.6]} zIndexRange={[4, 0]}>
          <span className="h3d-icon" style={{ background: color }}>
            {icon}
          </span>
        </Html>
      )}
    </Tilt>
  )
}

// Solutions: personas orbiting the plant; the orbits fan out as you scroll.
function Orbit({ progress }) {
  const rings = useRef([])
  const dots = useRef([])
  useFrame((st) => {
    const p = smooth(clamp01(progress.get() * 1.5))
    const t = st.clock.elapsedTime
    rings.current.forEach((r, i) => {
      if (!r) return
      r.rotation.x = Math.PI / 2 + (i - 1) * (0.35 + p * 0.5)
      r.rotation.y = (i - 1) * 0.4 + p * i * 0.3
    })
    dots.current.forEach((d, i) => {
      if (!d) return
      const a = t * (0.5 + i * 0.12) + i * 2.1
      const r = 1.5 + (i % 3) * 0.35
      d.position.set(Math.cos(a) * r, 0, Math.sin(a) * r)
    })
  })
  const dotColors = [COLORS.blue, COLORS.amber, COLORS.navy]
  return (
    <Tilt progress={progress} spin={0.8}>
      <mesh>
        <sphereGeometry args={[0.7, 40, 32]} />
        <Mat color={COLORS.navy} roughness={0.3} />
      </mesh>
      <mesh scale={1.04}>
        <sphereGeometry args={[0.7, 16, 12]} />
        <meshBasicMaterial color={COLORS.sky} wireframe transparent opacity={0.35} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <group key={i} ref={(el) => (rings.current[i] = el)}>
          <mesh>
            <torusGeometry args={[1.5 + i * 0.35, 0.012, 8, 96]} />
            <meshBasicMaterial color={COLORS.blue} transparent opacity={0.45} />
          </mesh>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh ref={(el) => (dots.current[i] = el)}>
              <sphereGeometry args={[0.16, 20, 16]} />
              <meshStandardMaterial color={dotColors[i]} emissive={dotColors[i]} emissiveIntensity={0.35} />
            </mesh>
          </group>
        </group>
      ))}
    </Tilt>
  )
}

// Pricing: stacks of coins that grow, one module at a time.
function Coins({ progress }) {
  const stacks = useRef([])
  const heights = [2, 3, 5, 7]
  useFrame((st) => {
    const p = smooth(clamp01(progress.get() * 1.4))
    const t = st.clock.elapsedTime
    stacks.current.forEach((g, i) => {
      if (!g) return
      g.children.forEach((c, k) => {
        // coins drop in one after another when the page opens; scrolling spreads the stack
        const appear = clamp01((t - 0.3) * 4 - i * 1.6 - k * 0.45)
        c.visible = appear > 0.02
        c.position.y = k * (0.16 + p * 0.12) + (1 - smooth(appear)) * 1.6
        c.rotation.y = t * 0.3 + k * 0.4
      })
    })
  })
  return (
    <Tilt progress={progress} spin={0.5}>
      <group rotation={[0.4, -0.5, 0]} position={[0, -0.8, 0]}>
        {heights.map((h, i) => (
          <group key={i} ref={(el) => (stacks.current[i] = el)} position={[(i - 1.5) * 0.85, 0, (i - 1.5) * -0.2]}>
            {Array.from({ length: h }).map((_, k) => (
              <mesh key={k}>
                <cylinderGeometry args={[0.34, 0.34, 0.13, 32]} />
                <Mat color={k === h - 1 && i === heights.length - 1 ? COLORS.amber : k % 2 ? '#ffffff' : COLORS.blue} metalness={0.2} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </Tilt>
  )
}

// Self-assessment: a maturity gauge whose needle climbs as you scroll.
function Gauge({ progress }) {
  const needle = useRef()
  const fill = useRef()
  const shown = useRef(-1)
  const arc = Math.PI * 1.25
  useFrame((st, dt) => {
    const p = clamp01(0.25 + progress.get() * 1.2) + Math.sin(st.clock.elapsedTime * 1.4) * 0.02
    needle.current.rotation.z = damp(needle.current.rotation.z, arc / 2 - p * arc, 5, dt)
    // the filled arc follows the needle (rebuilt only when it has moved)
    const q = (arc / 2 - needle.current.rotation.z) / arc
    if (Math.abs(q - shown.current) > 0.01) {
      shown.current = q
      fill.current.geometry.dispose()
      fill.current.geometry = new THREE.TorusGeometry(1.5, 0.125, 12, 48, Math.max(0.01, q * arc))
    }
  })
  return (
    <Tilt progress={progress} spin={0.3}>
      <group rotation={[0, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2 - arc / 2]}>
          <torusGeometry args={[1.5, 0.12, 12, 64, arc]} />
          <Mat color="#dfe7f1" />
        </mesh>
        <mesh ref={fill} rotation={[0, 0, Math.PI / 2 + arc / 2]} scale={[1, -1, 1]}>
          <torusGeometry args={[1.5, 0.125, 12, 64, 0.1]} />
          <meshStandardMaterial color={COLORS.blue} emissive={COLORS.blue} emissiveIntensity={0.3} />
        </mesh>
        <group ref={needle}>
          <mesh position={[0, 0.6, 0.05]}>
            <boxGeometry args={[0.08, 1.2, 0.06]} />
            <Mat color={COLORS.navy} />
          </mesh>
        </group>
        <mesh position={[0, 0, 0.06]}>
          <sphereGeometry args={[0.2, 24, 16]} />
          <meshStandardMaterial color={COLORS.amber} emissive={COLORS.amber} emissiveIntensity={0.6} />
        </mesh>
        {Array.from({ length: 6 }).map((_, i) => {
          const a = Math.PI / 2 + arc / 2 - (i / 5) * arc
          return (
            <mesh key={i} position={[Math.cos(a) * 1.85, Math.sin(a) * 1.85, 0]} rotation={[0, 0, a]}>
              <boxGeometry args={[0.18, 0.04, 0.04]} />
              <Mat color={i === 5 ? COLORS.amber : COLORS.navy} />
            </mesh>
          )
        })}
      </group>
    </Tilt>
  )
}

// FAQ: speech bubbles floating up.
function Bubbles({ progress }) {
  const items = useRef([])
  const spec = useMemo(
    () => [
      [-0.9, 0.3, 0, 1, COLORS.blue],
      [0.8, -0.4, 0.3, 0.8, '#ffffff'],
      [0.3, 0.9, -0.6, 0.6, COLORS.navy],
      [-0.4, -1.0, 0.5, 0.55, COLORS.amber],
    ],
    [],
  )
  useFrame((st) => {
    const p = progress.get()
    const t = st.clock.elapsedTime
    items.current.forEach((g, i) => {
      if (!g) return
      const [x, y, z] = spec[i]
      g.position.set(x * (1 + p * 0.6), y + Math.sin(t * 0.9 + i) * 0.12 + p * (0.8 + i * 0.3), z)
      g.rotation.z = Math.sin(t * 0.7 + i) * 0.08
      g.rotation.y = Math.sin(t * 0.5 + i * 2) * 0.25
    })
  })
  return (
    <Tilt progress={progress}>
      {spec.map(([, , , s, c], i) => (
        <group key={i} ref={(el) => (items.current[i] = el)} scale={s}>
          <RoundedBox args={[1.5, 1, 0.36]} radius={0.17} smoothness={4}>
            <Mat color={c} />
          </RoundedBox>
          <mesh position={[-0.35, -0.58, 0]} rotation={[0, 0, -0.5]}>
            <coneGeometry args={[0.16, 0.36, 4]} />
            <Mat color={c} />
          </mesh>
          {[-0.35, 0, 0.35].map((x) => (
            <mesh key={x} position={[x, 0, 0.19]}>
              <sphereGeometry args={[0.08, 16, 12]} />
              <meshBasicMaterial color={c === '#ffffff' || c === COLORS.amber ? COLORS.navy : '#ffffff'} />
            </mesh>
          ))}
        </group>
      ))}
    </Tilt>
  )
}

// Contact: a paper plane looping, then flying off as you scroll.
function Plane({ progress }) {
  const plane = useRef()
  const trail = useRef([])
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    // nose at +x; two wings and a keel
    const v = [1, 0, 0, -0.8, 0.05, 0.75, -0.6, 0, 0, 1, 0, 0, -0.6, 0, 0, -0.8, 0.05, -0.75, 1, 0, 0, -0.6, 0, 0, -0.7, -0.3, 0]
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3))
    g.computeVertexNormals()
    return g
  }, [])
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo])
  const pos = useMemo(() => new THREE.Vector3(), [])
  useFrame((st) => {
    const t = st.clock.elapsedTime
    const p = smooth(clamp01(progress.get() * 1.4))
    const a = t * 0.7
    pos.set(Math.cos(a) * 1.4 + p * 4, Math.sin(a * 2) * 0.35 + p * 1.8, Math.sin(a) * 0.9)
    plane.current.position.copy(pos)
    plane.current.rotation.set(Math.sin(a) * 0.4, -a - Math.PI / 2 + p * 1.2, Math.cos(a * 2) * 0.2)
    trail.current.forEach((d, i) => {
      if (!d) return
      const b = a - (i + 1) * 0.16
      d.position.set(Math.cos(b) * 1.4 + p * 4, Math.sin(b * 2) * 0.35 + p * 1.8, Math.sin(b) * 0.9)
      d.material.opacity = (1 - i / 10) * 0.6 * (1 - p)
    })
  })
  return (
    <Tilt progress={progress}>
      <group ref={plane} scale={1.25}>
        <mesh geometry={geo}>
          <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} roughness={0.5} />
        </mesh>
        <lineSegments geometry={edges}>
          <lineBasicMaterial color={COLORS.blue} />
        </lineSegments>
      </group>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} ref={(el) => (trail.current[i] = el)}>
          <sphereGeometry args={[0.055, 8, 6]} />
          <meshBasicMaterial color={COLORS.blue} transparent />
        </mesh>
      ))}
      <mesh position={[0, -1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.56, 48]} />
        <meshBasicMaterial color={COLORS.amber} transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, -1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.18, 32]} />
        <meshBasicMaterial color={COLORS.navy} />
      </mesh>
    </Tilt>
  )
}

const SCENES = { stack: Stack, grid: Grid, cube: Cube, orbit: Orbit, coins: Coins, gauge: Gauge, bubbles: Bubbles, plane: Plane }

export default function HeroObject({ kind, progress, color = COLORS.blue, icon }) {
  const [ref, visible] = useOnScreen('0px')
  const Scene = SCENES[kind] || Orbit
  const small = typeof window !== 'undefined' && window.innerWidth < 860
  return (
    <div ref={ref} className="h3d-canvas">
      <Canvas
        dpr={[1, small ? 1.25 : 1.75]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [0, 0, 7.5], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={0.85} />
        <hemisphereLight args={['#ffffff', '#c7d4e4', 0.6]} />
        <directionalLight position={[3, 6, 5]} intensity={1.5} />
        <pointLight position={[-3, -1, 3]} color={COLORS.sky} intensity={8} distance={9} />
        <Scene progress={progress} color={color} icon={icon} />
      </Canvas>
    </div>
  )
}
