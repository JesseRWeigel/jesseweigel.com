'use client'

import { useRef, useMemo, useCallback, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const NODE_DATA = [
  { label: 'Workshop', href: '/workshop', x: -2.5, y: 1.2, z: 0 },
  { label: 'Transmissions', href: '/transmissions', x: 2.2, y: 0.8, z: 0.5 },
  { label: 'Log', href: '/log', x: 0.3, y: -1.5, z: -0.3 },
]

function DustParticles({ count = 200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!)
  const linesRef = useRef<THREE.LineSegments>(null!)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return arr
  }, [count])

  // Pre-allocate line geometry — max pairs we'll ever draw
  const maxLines = count * 4
  const linePositions = useMemo(() => new Float32Array(maxLines * 2 * 3), [maxLines])
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    return geo
  }, [linePositions])

  useFrame((state) => {
    if (!ref.current) return
    const time = state.clock.elapsedTime * 0.05
    const pos = ref.current.geometry.attributes.position
    const arr = pos.array as Float32Array

    // Mouse influence — pointer is normalized -1..1
    const mx = state.pointer.x * 6
    const my = state.pointer.y * 4

    for (let i = 0; i < count; i++) {
      const ix = i * 3
      // Gentle drift
      arr[ix + 1] += Math.sin(time + i * 0.1) * 0.0003
      arr[ix] += Math.cos(time + i * 0.15) * 0.0002

      // Mouse repulsion — soft push away within radius 2
      const dx = arr[ix] - mx
      const dy = arr[ix + 1] - my
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 2 && dist > 0.001) {
        const force = (2 - dist) / 2 * 0.003
        arr[ix] += (dx / dist) * force
        arr[ix + 1] += (dy / dist) * force
      }
    }
    pos.needsUpdate = true

    // Connection lines — find close pairs and write into pre-allocated buffer
    if (!linesRef.current) return
    const lineBuf = linesRef.current.geometry.attributes.position.array as Float32Array
    let lineIdx = 0
    for (let i = 0; i < count && lineIdx < maxLines * 2 - 2; i++) {
      for (let j = i + 1; j < count && lineIdx < maxLines * 2 - 2; j++) {
        const ax = arr[i * 3], ay = arr[i * 3 + 1], az = arr[i * 3 + 2]
        const bx = arr[j * 3], by = arr[j * 3 + 1], bz = arr[j * 3 + 2]
        const d2 = (ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2
        if (d2 < 1.5 * 1.5) {
          lineBuf[lineIdx * 3] = ax; lineBuf[lineIdx * 3 + 1] = ay; lineBuf[lineIdx * 3 + 2] = az
          lineIdx++
          lineBuf[lineIdx * 3] = bx; lineBuf[lineIdx * 3 + 1] = by; lineBuf[lineIdx * 3 + 2] = bz
          lineIdx++
        }
      }
    }
    // Zero out unused slots
    for (let k = lineIdx * 3; k < maxLines * 2 * 3; k++) lineBuf[k] = 0
    linesRef.current.geometry.setDrawRange(0, lineIdx)
    linesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.015} color="#f59e0b" transparent opacity={0.4} sizeAttenuation />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#f59e0b" transparent opacity={0.06} />
      </lineSegments>
    </>
  )
}

function NodeSphere({ position, label, selected, onClick }: { position: [number, number, number]; label: string; selected: boolean; onClick: () => void }) {
  const ref = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const active = hovered || selected

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * 0.3 + position[0]) * 0.08
    // Gentle scale pulse, slightly larger when active
    const baseScale = active ? 1.3 : 1
    const pulse = baseScale + Math.sin(t * 1.5 + position[0] * 2) * 0.05
    ref.current.scale.setScalar(pulse)
    if (glowRef.current) {
      glowRef.current.position.copy(ref.current.position)
      glowRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group>
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={active ? 0.25 : 0.06} />
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
        {active && (
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

function Scene({ selectedIndex }: { selectedIndex: number }) {
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
      {NODE_DATA.map((node, i) => (
        <NodeSphere
          key={node.label}
          position={[node.x, node.y, node.z]}
          label={node.label}
          selected={selectedIndex === i}
          onClick={() => handleNodeClick(node.href)}
        />
      ))}
    </>
  )
}

export function ParticleField() {
  const [selectedIndex, setSelectedIndex] = useState(-1)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % NODE_DATA.length)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + NODE_DATA.length) % NODE_DATA.length)
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        window.location.href = NODE_DATA[selectedIndex].href
      } else if (e.key === 'Escape') {
        setSelectedIndex(-1)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedIndex])

  return (
    <div className="h-screen w-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene selectedIndex={selectedIndex} />
      </Canvas>
    </div>
  )
}
