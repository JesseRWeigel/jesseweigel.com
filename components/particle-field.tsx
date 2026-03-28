'use client'

import { useRef, useMemo, useCallback, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const NODE_DATA = [
  { label: 'Workshop', href: '/workshop', x: -2.5, y: 1.2, z: 0 },
  { label: 'Transmissions', href: '/transmissions', x: 2.2, y: 0.8, z: 0.5 },
  { label: 'Log', href: '/log', x: 0.3, y: -1.5, z: -0.3 },
]

function DustParticles({ count = 80 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const time = state.clock.elapsedTime * 0.05
    const pos = ref.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      const ix = i * 3
      ;(pos.array as Float32Array)[ix + 1] += Math.sin(time + i * 0.1) * 0.0003
      ;(pos.array as Float32Array)[ix] += Math.cos(time + i * 0.15) * 0.0002
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#f59e0b" transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

function NodeSphere({ position, label, onClick }: { position: [number, number, number]; label: string; onClick: () => void }) {
  const ref = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * 0.3 + position[0]) * 0.08
    if (glowRef.current) glowRef.current.position.copy(ref.current.position)
  })

  return (
    <group>
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={hovered ? 0.15 : 0.06} />
      </mesh>
      <mesh
        ref={ref}
        position={position}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
      >
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#f59e0b" />
        {hovered && (
          <Html center style={{ pointerEvents: 'none' }}>
            <div className="whitespace-nowrap rounded-md border border-primary/30 bg-background/90 px-3 py-1.5 font-mono text-xs text-primary backdrop-blur-sm">
              {label}
            </div>
          </Html>
        )}
      </mesh>
    </group>
  )
}

function Scene() {
  const { camera } = useThree()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    camera.position.x = Math.sin(t * 0.02) * 0.3
    camera.position.y = Math.cos(t * 0.015) * 0.2
  })

  const handleNodeClick = useCallback((href: string) => {
    window.location.href = href
  }, [])

  return (
    <>
      <DustParticles />
      {NODE_DATA.map((node) => (
        <NodeSphere
          key={node.label}
          position={[node.x, node.y, node.z]}
          label={node.label}
          onClick={() => handleNodeClick(node.href)}
        />
      ))}
    </>
  )
}

export function ParticleField() {
  return (
    <div className="h-screen w-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
