import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Html, QuadraticBezierLine, RoundedBox } from '@react-three/drei'
import { COLORS, Rise, useOnScreen } from './common'

const HUB = new THREE.Vector3(0.6, 4.3, 0.9)

// Where each building connects to the hub, and the label it shows.
const LINKS = [
  { at: [-4.1, 1.5, -0.4], delay: 1.4 },
  { at: [0.9, 2.2, -2.5], delay: 1.6 },
  { at: [3.4, 2.8, 1.3], delay: 1.8 },
  { at: [3.4, 1.4, -2.2], delay: 2.0 },
  { at: [-2.6, 1.1, 2.2], delay: 2.2 },
]

export function Mat({ color = COLORS.wall, ...p }) {
  return <meshStandardMaterial color={color} roughness={0.75} metalness={0.05} {...p} />
}

export function SawtoothFactory({ position, instant }) {
  const roof = useMemo(() => {
    const s = new THREE.Shape()
    const teeth = 4
    const w = 3.2
    s.moveTo(-w / 2, 0)
    for (let i = 0; i < teeth; i++) {
      const x = -w / 2 + (i * w) / teeth
      s.lineTo(x, 0.55)
      s.lineTo(x + w / teeth, 0)
    }
    s.lineTo(-w / 2, 0)
    const g = new THREE.ExtrudeGeometry(s, { depth: 2.2, bevelEnabled: false })
    g.translate(0, 0, -1.1)
    return g
  }, [])
  return (
    <Rise position={position} delay={0.1} instant={instant}>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 1.4, 2.2]} />
        <Mat />
      </mesh>
      <mesh geometry={roof} position={[0, 1.4, 0]} castShadow>
        <Mat color={COLORS.roof} />
      </mesh>
      {/* glazed strip and loading doors */}
      <mesh position={[0, 0.95, 1.105]}>
        <boxGeometry args={[2.8, 0.22, 0.02]} />
        <Mat color={COLORS.sky} emissive={COLORS.blue} emissiveIntensity={0.25} />
      </mesh>
      {[-0.9, 0, 0.9].map((x) => (
        <mesh key={x} position={[x, 0.32, 1.105]}>
          <boxGeometry args={[0.6, 0.62, 0.02]} />
          <Mat color={COLORS.roof} />
        </mesh>
      ))}
      {/* chimney */}
      <mesh position={[-1.1, 1.9, -0.6]} castShadow>
        <cylinderGeometry args={[0.16, 0.2, 2.4, 20]} />
        <Mat />
      </mesh>
      <mesh position={[-1.1, 2.75, -0.6]}>
        <cylinderGeometry args={[0.171, 0.171, 0.2, 20]} />
        <Mat color={COLORS.navy} />
      </mesh>
    </Rise>
  )
}

export function CoolingTower({ position, instant }) {
  const geo = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 12; i++) {
      const t = i / 12
      const r = 0.55 + 0.38 * Math.pow(Math.abs(t - 0.62) / 0.62, 1.6)
      pts.push(new THREE.Vector2(r, t * 2))
    }
    return new THREE.LatheGeometry(pts, 32)
  }, [])
  return (
    <Rise position={position} delay={0.25} instant={instant}>
      <mesh geometry={geo} castShadow receiveShadow>
        <Mat side={THREE.DoubleSide} color={COLORS.wallShade} />
      </mesh>
    </Rise>
  )
}

export function Tanks({ position, instant }) {
  return (
    <Rise position={position} delay={0.35} instant={instant}>
      {[-0.65, 0.65].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.52, 0.52, 1.2, 32]} />
            <Mat />
          </mesh>
          <mesh position={[0, 1.2, 0]} castShadow>
            <sphereGeometry args={[0.52, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <Mat color={COLORS.roof} />
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <cylinderGeometry args={[0.53, 0.53, 0.08, 32]} />
            <Mat color={COLORS.blue} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 1.3, 8]} />
        <Mat color={COLORS.navy} />
      </mesh>
    </Rise>
  )
}

export function Office({ position, instant }) {
  return (
    <Rise position={position} delay={0.45} instant={instant}>
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 2.5, 1.4]} />
        <Mat />
      </mesh>
      {[0.5, 0.95, 1.4, 1.85, 2.3].map((y) => (
        <group key={y}>
          <mesh position={[0, y, 0.705]}>
            <boxGeometry args={[1.15, 0.2, 0.02]} />
            <Mat color={COLORS.sky} emissive={COLORS.blue} emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0.705, y, 0]}>
            <boxGeometry args={[0.02, 0.2, 1.15]} />
            <Mat color={COLORS.sky} emissive={COLORS.blue} emissiveIntensity={0.2} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 2.56, 0]}>
        <boxGeometry args={[1.46, 0.12, 1.46]} />
        <Mat color={COLORS.navy} />
      </mesh>
    </Rise>
  )
}

export function TrainingCenter({ position, instant }) {
  return (
    <Rise position={position} delay={0.55} instant={instant}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.9, 1.6]} />
        <Mat />
      </mesh>
      <mesh position={[0, 0.93, 0]}>
        <boxGeometry args={[2.26, 0.08, 1.66]} />
        <Mat color={COLORS.roof} />
      </mesh>
      <mesh position={[0.5, 0.3, 0.805]}>
        <boxGeometry args={[0.45, 0.6, 0.02]} />
        <Mat color={COLORS.navy} />
      </mesh>
      <mesh position={[-0.45, 0.55, 0.805]}>
        <boxGeometry args={[0.9, 0.22, 0.02]} />
        <Mat color={COLORS.sky} emissive={COLORS.blue} emissiveIntensity={0.25} />
      </mesh>
    </Rise>
  )
}

export function Tree({ position, s = 1 }) {
  return (
    <group position={position} scale={s}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.3, 6]} />
        <Mat color="#b9a58f" />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <coneGeometry args={[0.28, 0.7, 7]} />
        <Mat color={COLORS.green} flatShading />
      </mesh>
    </group>
  )
}

export function Hub({ reduce }) {
  const ring1 = useRef()
  const ring2 = useRef()
  const core = useRef()
  useFrame((_, dt) => {
    if (reduce) return
    ring1.current.rotation.z += dt * 0.6
    ring2.current.rotation.x += dt * 0.4
    core.current.rotation.y += dt * 0.5
  })
  return (
    <Float speed={reduce ? 0 : 2} floatIntensity={reduce ? 0 : 0.6} rotationIntensity={0}>
      <group position={HUB}>
        <mesh ref={core}>
          <icosahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial color={COLORS.blue} emissive={COLORS.blue} emissiveIntensity={0.55} flatShading roughness={0.3} />
        </mesh>
        <mesh ref={ring1} rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[0.75, 0.025, 12, 80]} />
          <meshStandardMaterial color={COLORS.navy} />
        </mesh>
        <mesh ref={ring2} rotation={[0, Math.PI / 3, 0]}>
          <torusGeometry args={[0.95, 0.018, 12, 80]} />
          <meshStandardMaterial color={COLORS.amber} emissive={COLORS.amber} emissiveIntensity={0.4} />
        </mesh>
        <Html center position={[0, 0.95, 0]} className="scene-hub-label" zIndexRange={[5, 0]}>
          Stepup
        </Html>
      </group>
    </Float>
  )
}

// Data packets travelling between each building and the hub.
export function Packets({ reduce }) {
  const curves = useMemo(
    () =>
      LINKS.map(({ at }) => {
        const a = new THREE.Vector3(...at)
        const mid = a.clone().lerp(HUB, 0.5).add(new THREE.Vector3(0, 1.1, 0))
        return new THREE.QuadraticBezierCurve3(a, mid, HUB)
      }),
    [],
  )
  const refs = useRef([])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    curves.forEach((c, i) => {
      for (let k = 0; k < 2; k++) {
        const m = refs.current[i * 2 + k]
        if (!m) continue
        const start = 2.4 + i * 0.2
        if (t < start) {
          m.visible = false
          continue
        }
        m.visible = true
        let u = ((t - start) * 0.35 + k * 0.5 + i * 0.13) % 1
        if (k === 1) u = 1 - u // one packet flows back down to the floor
        if (reduce) u = 0.5
        m.position.copy(c.getPoint(u))
      }
    })
  })
  return curves.map((c, i) =>
    [0, 1].map((k) => (
      <mesh key={`${i}-${k}`} ref={(el) => (refs.current[i * 2 + k] = el)} visible={false}>
        <sphereGeometry args={[k ? 0.06 : 0.085, 16, 16]} />
        <meshStandardMaterial
          color={k ? COLORS.amber : COLORS.blue}
          emissive={k ? COLORS.amber : COLORS.blue}
          emissiveIntensity={1.2}
        />
      </mesh>
    )),
  )
}

function Links({ labels }) {
  return LINKS.map(({ at, delay }, i) => {
    const label = labels[i]
    const a = new THREE.Vector3(...at)
    const mid = a.clone().lerp(HUB, 0.5).add(new THREE.Vector3(0, 1.1, 0))
    return (
      <group key={i}>
        <QuadraticBezierLine start={a} end={HUB} mid={mid} color="#8fb1e8" lineWidth={1.4} dashed dashSize={0.12} gapSize={0.08} />
        <Html center position={[at[0], at[1] + 0.32, at[2]]} zIndexRange={[5, 0]}>
          <span className="scene-label" style={{ animationDelay: `${delay}s` }}>
            <i />
            {label}
          </span>
        </Html>
      </group>
    )
  })
}

function Rig({ progress, reduce, children }) {
  const group = useRef()
  useFrame((state, dt) => {
    const p = progress ? progress.get() : 0
    const px = reduce ? 0 : state.pointer.x
    const py = reduce ? 0 : state.pointer.y
    const targetY = -0.35 + px * 0.18 + p * 1.1
    const targetX = py * -0.05
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 4, dt)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, dt)
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, -p * 1.6, 4, dt)
  })
  return <group ref={group}>{children}</group>
}

function Scene({ progress, reduce, labels }) {
  return (
    <>
      <ambientLight intensity={0.75} />
      <hemisphereLight args={['#ffffff', '#c7d4e4', 0.6]} />
      <directionalLight
        position={[6, 11, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <Rig progress={progress} reduce={reduce}>
        <RoundedBox args={[11.5, 0.4, 8]} radius={0.18} position={[0, -0.2, 0]} receiveShadow>
          <Mat color={COLORS.slab} />
        </RoundedBox>
        {/* road markings */}
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
        <SawtoothFactory position={[-3.1, 0, -1.4]} instant={reduce} />
        <CoolingTower position={[0.9, 0, -2.5]} instant={reduce} />
        <Tanks position={[3.4, 0, -2.2]} instant={reduce} />
        <Office position={[3.4, 0, 2.1]} instant={reduce} />
        <TrainingCenter position={[-2.6, 0, 2.3]} instant={reduce} />
        <mesh position={[0.6, 0.03, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.85, 48]} />
          <meshBasicMaterial color={COLORS.blue} transparent opacity={0.35} />
        </mesh>
        <Tree position={[-5, 0, 3.3]} />
        <Tree position={[-4.4, 0, 3.5]} s={0.8} />
        <Tree position={[5, 0, 0.2]} s={0.9} />
        <Tree position={[5.1, 0, 3.4]} />
        <Tree position={[-0.6, 0, 3.4]} s={0.7} />
        <Tree position={[1.8, 0, -3.4]} s={0.8} />
        <Hub reduce={reduce} />
        <Links labels={labels} />
        <Packets reduce={reduce} />
      </Rig>
      <mesh position={[0, -0.41, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial opacity={0.12} />
      </mesh>
    </>
  )
}

export default function HeroScene({ progress, reduce, labels }) {
  const [ref, visible] = useOnScreen()
  return (
    <div ref={ref} className="hero-canvas">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [13.5, 10.5, 15], fov: 30, near: 0.1, far: 100 }}
        onCreated={({ camera }) => camera.lookAt(0, 1.4, 0)}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene progress={progress} reduce={reduce} labels={labels} />
      </Canvas>
    </div>
  )
}
