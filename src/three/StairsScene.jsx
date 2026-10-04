import { useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'
import { COLORS, easeOut, useOnScreen } from './common'

const STEP_W = 1.45
const STEP_H = 0.55

function Step({ i, color, label, progress, count }) {
  const ref = useRef()
  const labelRef = useRef()
  useFrame((_, dt) => {
    const p = progress.get() * count
    const k = easeOut(p - i)
    const target = Math.max(k, 0.0001)
    ref.current.scale.y = THREE.MathUtils.damp(ref.current.scale.y, target, 8, dt)
    ref.current.visible = ref.current.scale.y > 0.02
    const current = Math.min(Math.floor(p), count - 1) === i
    if (labelRef.current) labelRef.current.style.opacity = k > 0.6 && current ? 1 : 0
  })
  const h = (i + 1) * STEP_H
  return (
    <group position={[i * STEP_W - ((count - 1) * STEP_W) / 2, 0, -i * 0.15]}>
      <group ref={ref} scale={[1, 0.0001, 1]}>
        <RoundedBox args={[STEP_W - 0.08, h, 2.2]} radius={0.06} position={[0, h / 2, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </RoundedBox>
        <mesh position={[0, h + 0.01, 0]} castShadow>
          <boxGeometry args={[STEP_W - 0.1, 0.06, 2.18]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} roughness={0.5} />
        </mesh>
      </group>
      <Html center position={[0, h + 0.4, 0.9]} zIndexRange={[5, 0]}>
        <span ref={labelRef} className="stair-label" style={{ borderColor: color, opacity: 0 }}>
          {label}
        </span>
      </Html>
    </group>
  )
}

// The glowing marker that climbs to the most recent step.
function Climber({ progress, count }) {
  const ref = useRef()
  useFrame((state, dt) => {
    const p = Math.min(progress.get() * count, count - 0.001)
    const i = Math.max(Math.floor(p), 0)
    const x = i * STEP_W - ((count - 1) * STEP_W) / 2
    const y = (i + 1) * STEP_H + 0.35 + Math.sin(state.clock.elapsedTime * 3) * 0.05
    ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, x, 6, dt)
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, y, 6, dt)
    ref.current.position.z = THREE.MathUtils.damp(ref.current.position.z, -i * 0.15 - 0.4, 6, dt)
    ref.current.rotation.y += dt * 1.5
  })
  return (
    <group ref={ref} position={[-3, 1, 0]}>
      <mesh castShadow>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial color={COLORS.amber} emissive={COLORS.amber} emissiveIntensity={0.7} flatShading />
      </mesh>
      <pointLight color={COLORS.amber} intensity={2} distance={2.5} />
    </group>
  )
}

function Rig({ progress, children }) {
  const ref = useRef()
  useFrame((state, dt) => {
    const p = progress.get()
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, -0.55 + p * 0.35 + state.pointer.x * 0.08, 3, dt)
  })
  return <group ref={ref}>{children}</group>
}

export default function StairsScene({ steps, progress }) {
  const [ref, visible] = useOnScreen()
  return (
    <div ref={ref} className="stairs-canvas">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ position: [6.5, 5.6, 8.6], fov: 34 }}
        onCreated={({ camera }) => camera.lookAt(0, 1.2, 0)}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <hemisphereLight args={['#ffffff', '#c7d4e4', 0.5]} />
        <directionalLight position={[5, 10, 6]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} />
        <Rig progress={progress}>
          {steps.map((s, i) => (
            <Step key={s.when} i={i} color={s.color} label={s.when} progress={progress} count={steps.length} />
          ))}
          <Climber progress={progress} count={steps.length} />
        </Rig>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <shadowMaterial opacity={0.12} />
        </mesh>
      </Canvas>
    </div>
  )
}
