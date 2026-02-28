import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float, MeshDistortMaterial } from '@react-three/drei'

// Neon emissive material
function NeonMaterial({ color, intensity = 2 }: { color: string; intensity?: number }) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={intensity}
      toneMapped={false}
    />
  )
}

// Crate component
function Crate({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[1.2 * scale, 1.2 * scale, 1.2 * scale]} />
      <meshStandardMaterial
        color="#2a2a35"
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  )
}

// Barrel component
function Barrel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 1.2, 16]} />
        <meshStandardMaterial color="#3a3a45" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* Top ring */}
      <mesh position={[0, 0.5, 0]}>
        <torusGeometry args={[0.38, 0.05, 8, 24]} />
        <meshStandardMaterial color="#1a1a25" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

// Wall segment with neon trim
function Wall({
  position,
  rotation = [0, 0, 0],
  size = [4, 3, 0.3],
  neonColor = '#00f0ff'
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  size?: [number, number, number]
  neonColor?: string
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main wall */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      {/* Neon trim */}
      <mesh position={[0, size[1] / 2 - 0.05, size[2] / 2 + 0.01]}>
        <boxGeometry args={[size[0], 0.1, 0.02]} />
        <NeonMaterial color={neonColor} intensity={3} />
      </mesh>
    </group>
  )
}

// Floating holographic element
function HoloSign({ position, text }: { position: [number, number, number]; text: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <planeGeometry args={[2, 1]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={1}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  )
}

// Energy orb
function EnergyOrb({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1)
    }
  })

  return (
    <Float speed={4} rotationIntensity={0} floatIntensity={1}>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          speed={5}
          distort={0.3}
          radius={1}
        />
      </mesh>
      {/* Glow */}
      <mesh position={position}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
    </Float>
  )
}

// Ground with grid pattern
function Ground() {
  const gridTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#0a0a15'
    ctx.fillRect(0, 0, 512, 512)
    ctx.strokeStyle = '#1a1a35'
    ctx.lineWidth = 2
    for (let i = 0; i <= 16; i++) {
      ctx.beginPath()
      ctx.moveTo(i * 32, 0)
      ctx.lineTo(i * 32, 512)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * 32)
      ctx.lineTo(512, i * 32)
      ctx.stroke()
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(8, 8)
    return texture
  }, [])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial map={gridTexture} roughness={0.8} metalness={0.2} />
    </mesh>
  )
}

export function MapGeometry() {
  return (
    <group>
      <Ground />

      {/* Central structure */}
      <Wall position={[0, 1.5, -10]} size={[8, 3, 0.3]} neonColor="#ff0055" />
      <Wall position={[-4, 1.5, -8]} rotation={[0, Math.PI / 2, 0]} size={[4, 3, 0.3]} neonColor="#ff0055" />
      <Wall position={[4, 1.5, -8]} rotation={[0, Math.PI / 2, 0]} size={[4, 3, 0.3]} neonColor="#ff0055" />

      {/* Side walls */}
      <Wall position={[-10, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} size={[20, 3, 0.3]} neonColor="#00f0ff" />
      <Wall position={[10, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} size={[20, 3, 0.3]} neonColor="#00f0ff" />

      {/* Cover positions */}
      <Wall position={[-5, 1, 3]} size={[2, 2, 0.3]} neonColor="#ff6b35" />
      <Wall position={[5, 1, 3]} size={[2, 2, 0.3]} neonColor="#ff6b35" />
      <Wall position={[-3, 1, -3]} rotation={[0, Math.PI / 4, 0]} size={[2, 2, 0.3]} neonColor="#9d4edd" />
      <Wall position={[3, 1, -3]} rotation={[0, -Math.PI / 4, 0]} size={[2, 2, 0.3]} neonColor="#9d4edd" />

      {/* Crates */}
      <Crate position={[-7, 0.6, 5]} />
      <Crate position={[-6.5, 0.6, 6]} scale={0.8} />
      <Crate position={[7, 0.6, 5]} />
      <Crate position={[7, 1.8, 5]} scale={0.7} />
      <Crate position={[0, 0.6, 8]} scale={1.2} />
      <Crate position={[1.2, 0.6, 7.5]} />

      {/* Barrels */}
      <Barrel position={[-8, 0.6, -5]} />
      <Barrel position={[-7.5, 0.6, -4]} />
      <Barrel position={[8, 0.6, -5]} />
      <Barrel position={[2, 0.6, -6]} />

      {/* Energy orbs - decorative elements */}
      <EnergyOrb position={[-8, 2.5, -8]} color="#00f0ff" />
      <EnergyOrb position={[8, 2.5, -8]} color="#ff0055" />
      <EnergyOrb position={[0, 3, -9]} color="#ff6b35" />

      {/* Platform in center */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[6, 0.3, 6]} />
        <meshStandardMaterial color="#1a1a35" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Platform neon edge */}
      <mesh position={[0, 0.31, 0]}>
        <ringGeometry args={[2.8, 3, 4]} />
        <meshBasicMaterial color="#ff6b35" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Back wall */}
      <Wall position={[0, 1.5, 10]} size={[20, 3, 0.3]} neonColor="#9d4edd" />
    </group>
  )
}
