import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'
import { COLORS, useOnScreen } from './common'

// Kai, the Stepup agent, as a small hovering robot. It listens (looks at the chat), works
// (squints, antenna pulses, holograms appear) and presents the result, in step with the
// conversation. `state.current.current` is the smoothed story position: 0 = hello,
// 1..n = one exchange each, n + 1 = the closing promise.

const GREEN = '#22a06b'
const clamp01 = (x) => Math.min(1, Math.max(0, x))
// 1 at c, 0 beyond ±w
const bump = (s, c, w) => clamp01(1 - Math.abs(s - c) / w)
// 0 → 1 between a and b, then 1 → 0 between c and d
const windowed = (s, a, b, c, d) => clamp01((s - a) / (b - a)) * clamp01((d - s) / (d - c))
const smooth = (x) => x * x * (3 - 2 * x)

function Mat({ color, ...props }) {
  return <meshStandardMaterial color={color} roughness={0.45} metalness={0.05} {...props} />
}

function Robot({ state, dir }) {
  const body = useRef()
  const head = useRef()
  const eyes = useRef([])
  const mouth = useRef()
  const antenna = useRef()
  const armL = useRef()
  const armR = useRef()
  const status = useRef()
  const pad = useRef()
  const statusColor = useMemo(() => new THREE.Color(COLORS.blue), [])
  const tmp = useMemo(() => new THREE.Color(), [])

  useFrame((st, dt) => {
    const s = state.current.current
    const t = st.clock.elapsedTime
    let listen = 0
    let work = 0
    let talk = 0
    for (let k = 1; k <= 4; k++) {
      listen = Math.max(listen, bump(s, k - 0.62, 0.16))
      work = Math.max(work, bump(s, k - 0.38, 0.15))
      talk = Math.max(talk, bump(s, k - 0.12, 0.14))
    }
    const hello = clamp01(1 - s * 2.4)
    const done = clamp01((s - 4.35) * 3)

    // hover
    body.current.position.y = 1.15 + Math.sin(t * 1.6) * 0.06
    body.current.rotation.z = Math.sin(t * 0.8) * 0.02
    pad.current.material.opacity = 0.35 + Math.sin(t * 1.6) * 0.08 + work * 0.3

    // head: looks at the chat while listening, follows the pointer otherwise
    const lookChat = -0.55 * dir
    const yaw = listen * lookChat + (1 - listen) * (st.pointer.x * 0.35 + work * 0.35 * dir)
    head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, yaw, 6, dt)
    const pitch = work * 0.18 - st.pointer.y * 0.12 - done * 0.05
    head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, pitch, 6, dt)
    head.current.rotation.z = THREE.MathUtils.damp(head.current.rotation.z, listen * 0.12 * dir, 5, dt)

    // eyes: blink every few seconds, squint while working, happy at the end
    const blink = (t % 4.2) > 4.05 ? 0.1 : 1
    eyes.current.forEach((e) => {
      if (!e) return
      e.scale.y = THREE.MathUtils.damp(e.scale.y, Math.min(blink, 1 - work * 0.65) * (1 - done * 0.45), 18, dt)
    })
    mouth.current.scale.x = 1 + talk * Math.abs(Math.sin(t * 14)) * 0.9 + done * 0.6
    mouth.current.scale.y = 1 + talk * Math.abs(Math.sin(t * 11)) * 1.4

    antenna.current.material.emissiveIntensity = 0.9 + work * (1.2 + Math.sin(t * 16) * 0.8) + Math.sin(t * 3) * 0.2

    // arms: wave hello, raise the arm on the hologram side while working, thumbs up at the end
    const wave = hello * (0.9 + Math.sin(t * 7) * 0.35)
    const reach = Math.max(work, talk * 0.6)
    armL.current.rotation.z = THREE.MathUtils.damp(armL.current.rotation.z, dir > 0 ? -wave * 1.6 - 0.12 : -(reach * 1.25 + done * 1.6) - 0.12, 7, dt)
    armR.current.rotation.z = THREE.MathUtils.damp(armR.current.rotation.z, dir > 0 ? reach * 1.25 + done * 1.6 + 0.12 : wave * 1.6 + 0.12, 7, dt)
    armL.current.rotation.x = THREE.MathUtils.damp(armL.current.rotation.x, -reach * 0.4 * (dir < 0), 6, dt)
    armR.current.rotation.x = THREE.MathUtils.damp(armR.current.rotation.x, -reach * 0.4 * (dir > 0), 6, dt)

    // chest light: blue, amber while waiting for approval, green once the work is done
    const waiting = windowed(s, 2.55, 2.85, 3.3, 3.5)
    tmp.set(s > 3.4 ? GREEN : COLORS.blue).lerp(new THREE.Color(COLORS.amber), waiting)
    statusColor.lerp(tmp, 1 - Math.exp(-dt * 6))
    status.current.material.color.copy(statusColor)
    status.current.material.emissive.copy(statusColor)
  })

  const white = '#ffffff'
  return (
    <group>
      {/* hover pad */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.25, 48]} />
        <meshBasicMaterial color="#0d2d4e" transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh ref={pad} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 1.0, 64]} />
        <meshBasicMaterial color={COLORS.blue} transparent opacity={0.35} depthWrite={false} />
      </mesh>

      <group ref={body} position={[0, 1.15, 0]}>
        {/* torso */}
        <RoundedBox args={[1.25, 1.3, 0.95]} radius={0.32} smoothness={6}>
          <Mat color={white} />
        </RoundedBox>
        <RoundedBox args={[0.72, 0.5, 0.06]} radius={0.12} position={[0, 0.08, 0.47]}>
          <Mat color={COLORS.navy} roughness={0.25} />
        </RoundedBox>
        <mesh ref={status} position={[0, 0.08, 0.51]}>
          <boxGeometry args={[0.4, 0.07, 0.02]} />
          <meshStandardMaterial color={COLORS.blue} emissive={COLORS.blue} emissiveIntensity={1.6} />
        </mesh>
        {[-0.14, 0, 0.14].map((x) => (
          <mesh key={x} position={[x, -0.06, 0.505]}>
            <circleGeometry args={[0.03, 16]} />
            <meshBasicMaterial color={COLORS.sky} />
          </mesh>
        ))}
        {/* skirt that glows above the pad */}
        <mesh position={[0, -0.74, 0]}>
          <cylinderGeometry args={[0.36, 0.22, 0.22, 32]} />
          <Mat color="#dfe7f1" />
        </mesh>
        <mesh position={[0, -0.87, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 32]} />
          <meshStandardMaterial color={COLORS.sky} emissive={COLORS.blue} emissiveIntensity={1.4} />
        </mesh>

        {/* arms, pivoting at the shoulders */}
        <group ref={armL} position={[-0.72, 0.38, 0]}>
          <mesh position={[0, -0.36, 0]}>
            <capsuleGeometry args={[0.13, 0.48, 6, 16]} />
            <Mat color={white} />
          </mesh>
          <mesh position={[0, -0.74, 0]}>
            <sphereGeometry args={[0.15, 20, 16]} />
            <Mat color="#dfe7f1" />
          </mesh>
        </group>
        <group ref={armR} position={[0.72, 0.38, 0]}>
          <mesh position={[0, -0.36, 0]}>
            <capsuleGeometry args={[0.13, 0.48, 6, 16]} />
            <Mat color={white} />
          </mesh>
          <mesh position={[0, -0.74, 0]}>
            <sphereGeometry args={[0.15, 20, 16]} />
            <Mat color="#dfe7f1" />
          </mesh>
        </group>

        {/* neck + head */}
        <mesh position={[0, 0.74, 0]}>
          <cylinderGeometry args={[0.16, 0.2, 0.2, 20]} />
          <Mat color="#c9d5e4" />
        </mesh>
        <group ref={head} position={[0, 1.3, 0]}>
          <RoundedBox args={[1.45, 1.02, 1.05]} radius={0.34} smoothness={6}>
            <Mat color={white} />
          </RoundedBox>
          {/* visor */}
          <RoundedBox args={[1.18, 0.66, 0.1]} radius={0.22} smoothness={5} position={[0, -0.02, 0.5]}>
            <Mat color={COLORS.navy} roughness={0.15} metalness={0.2} />
          </RoundedBox>
          {[-0.27, 0.27].map((x, i) => (
            <mesh key={x} ref={(el) => (eyes.current[i] = el)} position={[x, 0.06, 0.56]}>
              <capsuleGeometry args={[0.075, 0.1, 4, 12]} />
              <meshStandardMaterial color={COLORS.sky} emissive={COLORS.sky} emissiveIntensity={2.2} toneMapped={false} />
            </mesh>
          ))}
          <mesh ref={mouth} position={[0, -0.18, 0.56]}>
            <boxGeometry args={[0.2, 0.035, 0.01]} />
            <meshStandardMaterial color={COLORS.sky} emissive={COLORS.sky} emissiveIntensity={1.8} toneMapped={false} />
          </mesh>
          {/* ears */}
          {[-1, 1].map((side) => (
            <group key={side} position={[side * 0.75, 0, 0]} rotation={[0, 0, (side * Math.PI) / 2]}>
              <mesh>
                <cylinderGeometry args={[0.2, 0.2, 0.12, 24]} />
                <Mat color="#dfe7f1" />
              </mesh>
              <mesh position={[0, side * -0.065, 0]}>
                <torusGeometry args={[0.13, 0.025, 8, 24]} />
                <meshStandardMaterial color={COLORS.blue} emissive={COLORS.blue} emissiveIntensity={0.8} />
              </mesh>
            </group>
          ))}
          {/* antenna */}
          <mesh position={[0, 0.64, 0]}>
            <cylinderGeometry args={[0.025, 0.035, 0.3, 10]} />
            <Mat color="#c9d5e4" />
          </mesh>
          <mesh ref={antenna} position={[0, 0.82, 0]}>
            <sphereGeometry args={[0.09, 20, 16]} />
            <meshStandardMaterial color={COLORS.amber} emissive={COLORS.amber} emissiveIntensity={1} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

// Chapter 1: scanning the modules (radar wave + module tiles orbiting the robot).
function Scan({ state }) {
  const group = useRef()
  const wave = useRef()
  useFrame((st, dt) => {
    const k = smooth(windowed(state.current.current, 0.35, 0.6, 1.4, 1.65))
    group.current.visible = k > 0.01
    group.current.scale.setScalar(0.6 + k * 0.4)
    group.current.rotation.y += dt * 0.6
    const w = (st.clock.elapsedTime * 0.7) % 1
    wave.current.scale.setScalar(0.6 + w * 1.5)
    wave.current.material.opacity = (1 - w) * 0.5 * k
    group.current.children.forEach((c) => c.material && c !== wave.current && (c.material.opacity = 0.9 * k))
  })
  return (
    <group ref={group} position={[0, 1.6, 0]}>
      <mesh ref={wave} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.56, 64]} />
        <meshBasicMaterial color={COLORS.blue} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 2.05, Math.sin(a * 2) * 0.25, Math.sin(a) * 2.05]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.36, 0.36, 0.06]} />
            <meshStandardMaterial color={i % 3 === 0 ? COLORS.amber : COLORS.blue} transparent opacity={0} />
          </mesh>
        )
      })}
    </group>
  )
}

// Chapter 3: one reminder per owner, held until the user approves, then sent.
function Reminders({ state, dir }) {
  const items = useRef([])
  useFrame((st) => {
    const s = state.current.current
    const appear = smooth(clamp01((s - 2.45) / 0.3))
    const go = smooth(clamp01((s - 3.25) / 0.45)) // approved → they fly out
    items.current.forEach((m, i) => {
      if (!m) return
      // a 3 × 3 stack beside the robot, under the status card
      const col = i % 3
      const row = Math.floor(i / 3)
      const fly = go * (3 + i * 0.35)
      m.position.set(
        dir * (1.55 + col * 0.46 + fly),
        0.9 + row * 0.36 + go * (1.2 + row * 0.5) + Math.sin(st.clock.elapsedTime * 2 + i) * 0.03,
        0.7 + go * 1.2,
      )
      m.rotation.set(0, -0.3 * dir, go * 0.5 * dir)
      const k = appear * (1 - go)
      m.visible = k > 0.01
      m.scale.setScalar(Math.max(0.001, k * (0.8 + 0.2 * Math.sin(st.clock.elapsedTime * 3 + i) * (s < 3.25))))
    })
  })
  return Array.from({ length: 9 }).map((_, i) => (
    <group key={i} ref={(el) => (items.current[i] = el)} visible={false}>
      <mesh>
        <boxGeometry args={[0.38, 0.26, 0.03]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.04, 0.02]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.19, 0.19, 0.005]} />
        <meshStandardMaterial color={COLORS.amber} emissive={COLORS.amber} emissiveIntensity={0.3} />
      </mesh>
    </group>
  ))
}

// Chapter 4: the report builds itself (bars rise), then the closing shield.
function Report({ state, dir }) {
  const bars = useRef([])
  const group = useRef()
  useFrame(() => {
    const s = state.current.current
    const k = smooth(windowed(s, 3.4, 3.7, 4.4, 4.7))
    group.current.visible = k > 0.01
    bars.current.forEach((b, i) => {
      const h = [0.45, 0.7, 0.55, 0.95, 1.2][i] * smooth(clamp01((s - 3.55 - i * 0.06) / 0.25)) * k
      b.scale.y = Math.max(h, 0.001)
      b.position.y = h / 2
    })
  })
  return (
    <group ref={group} position={[dir * 2.15, 0.35, 0.4]} rotation={[0, -0.35 * dir, 0]}>
      <mesh position={[0, -0.02, 0]}>
        <boxGeometry args={[1.5, 0.04, 0.6]} />
        <meshStandardMaterial color="#dbe6f5" />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} ref={(el) => (bars.current[i] = el)} position={[-0.56 + i * 0.28, 0, 0]}>
          <boxGeometry args={[0.18, 1, 0.18]} />
          <meshStandardMaterial color={i === 4 ? GREEN : COLORS.blue} emissive={i === 4 ? GREEN : COLORS.blue} emissiveIntensity={0.25} />
        </mesh>
      ))}
    </group>
  )
}

function Shield({ state }) {
  const ref = useRef()
  useFrame((st, dt) => {
    const k = smooth(clamp01((state.current.current - 4.3) / 0.45))
    ref.current.visible = k > 0.01
    ref.current.scale.setScalar(0.7 + k * 0.3)
    ref.current.rotation.y += dt * 0.25
    ref.current.material.opacity = k * 0.1
  })
  return (
    <mesh ref={ref} position={[0, 1.75, 0]}>
      <icosahedronGeometry args={[1.9, 1]} />
      <meshBasicMaterial color={COLORS.blue} wireframe transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

// Floating "what Kai is doing" card for each exchange (screen-space HTML: sharp and translated).
function WorkCard({ state, index, step, dir }) {
  const el = useRef()
  const rows = useRef([])
  useFrame((st) => {
    const s = state.current.current
    const c = index + 1
    const k = smooth(windowed(s, c - 0.55, c - 0.3, c + 0.45, c + 0.65))
    if (!el.current) return
    el.current.style.opacity = k.toFixed(3)
    el.current.style.visibility = k > 0.01 ? 'visible' : 'hidden'
    el.current.style.transform = `translate3d(0, ${((1 - k) * 18 + Math.sin(st.clock.elapsedTime * 1.3 + index) * 3).toFixed(1)}px, 0)`
    rows.current.forEach((r, i) => r && r.classList.toggle('on', s > c - 0.3 + i * 0.09))
  })
  const tone = index === 2 ? 'amber' : index === 3 ? 'green' : 'blue'
  return (
    <Html center position={[dir * 2.15, index === 3 ? 2.6 : 3.05, 0.2]} zIndexRange={[6, 0]}>
      <div ref={el} className={`ag-card tone-${tone}`} style={{ opacity: 0, visibility: 'hidden' }}>
        <span className="ag-card-agent">{step.agent}</span>
        <strong>{step.work}</strong>
        <div className="ag-card-rows">
          {[0.85, 0.62, 0.74].map((w, r) => (
            <span key={r} ref={(x) => (rows.current[r] = x)}>
              <i />
              <b style={{ width: `${w * 100}%` }} />
            </span>
          ))}
        </div>
      </div>
    </Html>
  )
}

function CameraRig({ state, dir, last }) {
  const { camera, size } = useThree()
  const look = useMemo(() => new THREE.Vector3(), [])
  useEffect(() => {
    camera.fov = size.width / size.height < 0.9 ? 40 : 32
    camera.updateProjectionMatrix()
  }, [camera, size])
  useFrame((st, dt) => {
    const p = state.current.current / last
    const x = dir * (1.6 - p * 2.4) + st.pointer.x * 0.5
    const y = 2.7 - p * 0.3 + st.pointer.y * 0.25
    const z = 10.4 - p * 1.2
    camera.position.x = THREE.MathUtils.damp(camera.position.x, x, 3, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 3, dt)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 3, dt)
    look.set(dir * 0.75, 1.95, 0)
    camera.lookAt(look)
  })
  return null
}

export default function AgentScene({ state, rtl, steps, last }) {
  const [ref, visible] = useOnScreen('0px')
  const dir = rtl ? -1 : 1
  const small = typeof window !== 'undefined' && window.innerWidth < 860
  return (
    <div ref={ref} className="ag-canvas">
      <Canvas
        dpr={[1, small ? 1.25 : 1.75]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [dir * 1.6, 2.7, 10.4], fov: 32, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.8} />
        <hemisphereLight args={['#ffffff', '#c7d4e4', 0.7]} />
        <directionalLight position={[4, 8, 6]} intensity={1.6} />
        <pointLight position={[0, 1.6, 2.2]} color={COLORS.sky} intensity={6} distance={5} />
        <CameraRig state={state} dir={dir} last={last} />
        <Robot state={state} dir={dir} />
        <Scan state={state} />
        <Reminders state={state} dir={dir} />
        <Report state={state} dir={dir} />
        <Shield state={state} />
        {steps.map((s, i) => (
          <WorkCard key={i} state={state} index={i} step={s} dir={dir} />
        ))}
      </Canvas>
    </div>
  )
}
