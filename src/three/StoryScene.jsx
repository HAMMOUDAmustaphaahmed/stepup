import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, QuadraticBezierLine, RoundedBox } from '@react-three/drei'
import { COLORS, useOnScreen } from './common'
import { CoolingTower, Hub, Mat, Office, Packets, SawtoothFactory, Tanks, TrainingCenter, Tree } from './HeroScene'

// The plant from the hero, filmed along the story: the camera stops on each building in turn
// (the reader reads while it is still) and glides to the next one. `state.current.current` is
// the smoothed story position, 0 (overview) → chapters.length, driven by the page scroll.

const HUB = new THREE.Vector3(0.6, 4.3, 0.9)

// One camera stop per chapter: 0 = overview, then one building per step of the story.
const STOPS = [
  { pos: [13.5, 10.5, 15], look: [0, 1.4, 0] }, //        overview
  { pos: [-1.2, 3.4, 7.2], look: [-3.1, 1.3, -1.4] }, //  1 audit on the shop floor
  { pos: [9.6, 4.2, 3.2], look: [3.4, 1.1, -2.2] }, //    2 PDCA on the process line
  { pos: [8.4, 3.8, 8.8], look: [3.4, 1.6, 2.1] }, //     3 meeting in the office
  { pos: [-7.8, 3.2, 8.4], look: [-2.6, 0.7, 2.3] }, //   4 training centre
  { pos: [0.62, 19, 6.5], look: [0.6, 1.2, 0.4] }, //     5 the whole plant, on the dashboard
]
const LAST = STOPS.length - 1

// Where each chapter's building sits (focus ring) and where its module card floats.
const FOCUS = [
  { ring: [-3.1, -1.4], r: 2.3, card: [-3.1, 3.0, -1.4], color: COLORS.amber },
  { ring: [3.4, -2.2], r: 1.6, card: [3.4, 3.0, -2.2], color: COLORS.blue },
  { ring: [3.4, 2.1], r: 1.3, card: [3.4, 3.2, 2.1], color: COLORS.blue },
  { ring: [-2.6, 2.3], r: 1.7, card: [-2.6, 2.3, 2.3], color: COLORS.blue },
  { ring: [0.6, 0.9], r: 0.95, card: [0.6, 6.1, 0.9], color: COLORS.green },
]

// Building ↔ hub links (same buildings as the hero scene).
const LINKS = [
  [-4.1, 1.5, -0.4],
  [0.9, 2.2, -2.5],
  [3.4, 2.8, 1.3],
  [3.4, 1.4, -2.2],
  [-2.6, 1.1, 2.2],
]

// Progress with a hold in the middle of each chapter, so the camera is still while reading.
function dwell(s) {
  const i = Math.min(Math.floor(s), LAST - 1)
  const f = s - i
  const hold = 0.22
  let u = (f - hold) / (1 - 2 * hold)
  u = Math.min(1, Math.max(0, u))
  u = u * u * (3 - 2 * u)
  return (i + u) / LAST
}

// How much chapter k is "on" at story position s (1 at its stop, 0 half a chapter away).
const weight = (s, k, spread = 0.6) => Math.max(0, 1 - Math.abs(s - k) / spread)

function CameraRig({ state, rtl }) {
  const { camera, size } = useThree()
  const curves = useMemo(
    () => ({
      pos: new THREE.CatmullRomCurve3(STOPS.map((s) => new THREE.Vector3(...s.pos)), false, 'centripetal'),
      look: new THREE.CatmullRomCurve3(STOPS.map((s) => new THREE.Vector3(...s.look)), false, 'centripetal'),
      p: new THREE.Vector3(),
      l: new THREE.Vector3(),
    }),
    [],
  )

  // Wide screens: the image centre moves right so the left half stays free for the text
  // (left in Arabic). Portrait screens get a wider lens to keep the plant in frame.
  useEffect(() => {
    const { width: w, height: h } = size
    camera.fov = w / h < 0.8 ? 48 : 32
    if (w / h > 1.1) camera.setViewOffset(w, h, (rtl ? 1 : -1) * w * 0.17, 0, w, h)
    else camera.clearViewOffset()
    camera.updateProjectionMatrix()
  }, [camera, size, rtl])

  useFrame((st) => {
    const p = dwell(state.current.current)
    // getPoint (not getPointAt): p = i / LAST lands exactly on stop i.
    curves.pos.getPoint(p, curves.p)
    curves.look.getPoint(p, curves.l)
    const t = st.clock.elapsedTime
    curves.p.x += Math.sin(t * 0.25) * 0.22 // slight drift so the still image breathes
    curves.p.y += Math.sin(t * 0.33) * 0.1
    camera.position.copy(curves.p)
    camera.lookAt(curves.l)
  })
  return null
}

// Ground ring under the building of the current chapter.
function FocusRing({ state, index, focus }) {
  const mesh = useRef()
  useFrame((st) => {
    const k = weight(state.current.current, index + 1)
    mesh.current.visible = k > 0.01
    mesh.current.material.opacity = k * 0.55
    mesh.current.scale.setScalar(0.85 + k * 0.15 + Math.sin(st.clock.elapsedTime * 2) * 0.02)
  })
  return (
    <mesh ref={mesh} position={[focus.ring[0], 0.02, focus.ring[1]]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[focus.r, focus.r + 0.12, 64]} />
      <meshBasicMaterial color={focus.color} transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

// The finding from chapter 1 (missing guard on the press): an amber beacon that pulses
// until the action is closed in the last chapter.
function Beacon({ state }) {
  const group = useRef()
  const wave = useRef()
  useFrame((st) => {
    const s = state.current.current
    const k = Math.min(1, Math.max(0, (s - 0.5) * 2)) * Math.min(1, Math.max(0, (LAST - 0.5 - s) * 2))
    group.current.visible = k > 0.01
    group.current.scale.setScalar(Math.max(k, 0.001))
    const w = (st.clock.elapsedTime * 0.8) % 1
    wave.current.scale.setScalar(1 + w * 2.2)
    wave.current.material.opacity = (1 - w) * 0.6 * k
  })
  return (
    <group ref={group} position={[-2.4, 2.45, -0.7]}>
      <mesh>
        <sphereGeometry args={[0.16, 24, 16]} />
        <meshStandardMaterial color={COLORS.amber} emissive={COLORS.amber} emissiveIntensity={1.1} />
      </mesh>
      <mesh ref={wave}>
        <sphereGeometry args={[0.16, 24, 16]} />
        <meshBasicMaterial color={COLORS.amber} transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

// Floating module card (screen-space HTML so it stays sharp and translated).
function ModuleCard({ state, index, focus, title, tone }) {
  const el = useRef()
  useFrame((st) => {
    const k = weight(state.current.current, index + 1)
    if (!el.current) return
    el.current.style.opacity = k.toFixed(3)
    el.current.style.visibility = k > 0.01 ? 'visible' : 'hidden'
    const bob = Math.sin(st.clock.elapsedTime * 1.2 + index) * 3
    el.current.style.transform = `translate3d(0, ${((1 - k) * 24 + bob).toFixed(1)}px, 0)`
  })
  return (
    <Html center position={focus.card} zIndexRange={[4, 0]}>
      <div ref={el} className={`ps-card tone-${tone}`} style={{ opacity: 0, visibility: 'hidden' }}>
        <div className="ps-card-head">
          <i />
          <strong>{title}</strong>
        </div>
        <div className="ps-card-rows">
          {[0.82, 0.6, 0.72].map((w, r) => (
            <span key={r}>
              <b style={{ width: `${w * 100}%` }} />
              <em />
            </span>
          ))}
        </div>
      </div>
    </Html>
  )
}

function Links({ labels }) {
  return LINKS.map((at, i) => {
    const a = new THREE.Vector3(...at)
    const mid = a.clone().lerp(HUB, 0.5).add(new THREE.Vector3(0, 1.1, 0))
    return (
      <group key={i}>
        <QuadraticBezierLine start={a} end={HUB} mid={mid} color="#8fb1e8" lineWidth={1.4} dashed dashSize={0.12} gapSize={0.08} />
        {/* only shown on the overview (opacity follows --overview set by the section) */}
        <Html center position={[at[0], at[1] + 0.32, at[2]]} zIndexRange={[3, 0]}>
          <span className="scene-label ps-overview-label">
            <i />
            {labels[i]}
          </span>
        </Html>
      </group>
    )
  })
}

function Plant({ state, labels, modules, small }) {
  return (
    <>
      <ambientLight intensity={0.75} />
      <hemisphereLight args={['#ffffff', '#c7d4e4', 0.6]} />
      <directionalLight
        position={[6, 11, 5]}
        intensity={1.5}
        castShadow={!small}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <group>
        <RoundedBox args={[11.5, 0.4, 8]} radius={0.18} position={[0, -0.2, 0]} receiveShadow>
          <Mat color={COLORS.slab} />
        </RoundedBox>
        <mesh position={[0.2, 0.005, 0.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[10.5, 0.7]} />
          <Mat color="#e3e9f1" />
        </mesh>
        {Array.from({ length: 9 }).map((_, i) => (
          <mesh key={i} position={[-4.4 + i * 1.15, 0.01, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.5, 0.06]} />
            <meshBasicMaterial color={COLORS.amber} />
          </mesh>
        ))}
        <SawtoothFactory position={[-3.1, 0, -1.4]} />
        <CoolingTower position={[0.9, 0, -2.5]} />
        <Tanks position={[3.4, 0, -2.2]} />
        <Office position={[3.4, 0, 2.1]} />
        <TrainingCenter position={[-2.6, 0, 2.3]} />
        <Tree position={[-5, 0, 3.3]} />
        <Tree position={[-4.4, 0, 3.5]} s={0.8} />
        <Tree position={[5, 0, 0.2]} s={0.9} />
        <Tree position={[5.1, 0, 3.4]} />
        <Tree position={[-0.6, 0, 3.4]} s={0.7} />
        <Tree position={[1.8, 0, -3.4]} s={0.8} />
        <Hub />
        <Links labels={labels} />
        <Packets />
        <Beacon state={state} />
        {FOCUS.map((f, i) => (
          <FocusRing key={i} state={state} index={i} focus={f} />
        ))}
        {FOCUS.map((f, i) => (
          <ModuleCard key={i} state={state} index={i} focus={f} title={modules[i]} tone={i === 0 ? 'amber' : i === LAST - 1 ? 'green' : 'blue'} />
        ))}
      </group>
      <mesh position={[0, -0.41, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <shadowMaterial opacity={0.12} />
      </mesh>
    </>
  )
}

export default function StoryScene({ state, rtl, labels, modules }) {
  const [ref, visible] = useOnScreen('0px')
  const small = typeof window !== 'undefined' && window.innerWidth < 860
  return (
    <div ref={ref} className="ps-canvas">
      <Canvas
        shadows={!small}
        dpr={[1, small ? 1.25 : 1.5]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: STOPS[0].pos, fov: 32, near: 0.1, far: 120 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <CameraRig state={state} rtl={rtl} />
        <Plant state={state} labels={labels} modules={modules} small={small} />
      </Canvas>
    </div>
  )
}
