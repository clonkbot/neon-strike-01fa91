import { useRef, useState, useCallback, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float } from '@react-three/drei'

interface TargetProps {
  position: [number, number, number]
  onHit: () => void
  id: number
}

function Target({ position, onHit, id }: TargetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [isHit, setIsHit] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [respawnTimer, setRespawnTimer] = useState(0)

  const handleClick = useCallback(() => {
    if (isHit) return
    setIsHit(true)
    onHit()
    setRespawnTimer(3)
  }, [isHit, onHit])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Idle animation
    if (!isHit) {
      meshRef.current.rotation.y += delta * 0.5
    }

    // Respawn timer
    if (respawnTimer > 0) {
      setRespawnTimer(prev => {
        const newTime = prev - delta
        if (newTime <= 0) {
          setIsHit(false)
          return 0
        }
        return newTime
      })
    }

    // Hit animation - fall down
    if (isHit && meshRef.current.rotation.x > -Math.PI / 2) {
      meshRef.current.rotation.x -= delta * 5
    }

    // Respawn animation - stand up
    if (!isHit && meshRef.current.rotation.x < 0) {
      meshRef.current.rotation.x += delta * 3
    }
  })

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0} floatIntensity={isHit ? 0 : 0.2}>
        <group
          ref={meshRef as any}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {/* Body */}
          <mesh castShadow>
            <capsuleGeometry args={[0.3, 1, 8, 16]} />
            <meshStandardMaterial
              color={isHit ? '#333' : hovered ? '#ff3366' : '#ff0055'}
              emissive={isHit ? '#000' : hovered ? '#ff3366' : '#ff0055'}
              emissiveIntensity={isHit ? 0 : hovered ? 1 : 0.5}
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>

          {/* Head */}
          <mesh position={[0, 0.9, 0]} castShadow>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial
              color={isHit ? '#333' : hovered ? '#ff6699' : '#ff0055'}
              emissive={isHit ? '#000' : '#ff0055'}
              emissiveIntensity={isHit ? 0 : 0.8}
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>

          {/* Target ring on chest */}
          <mesh position={[0, 0.3, 0.31]} rotation={[0, 0, 0]}>
            <ringGeometry args={[0.1, 0.15, 32]} />
            <meshBasicMaterial
              color={isHit ? '#333' : '#fff'}
              transparent
              opacity={isHit ? 0.3 : 0.9}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Eyes */}
          <mesh position={[-0.08, 0.95, 0.22]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={isHit ? '#333' : '#00f0ff'} />
          </mesh>
          <mesh position={[0.08, 0.95, 0.22]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color={isHit ? '#333' : '#00f0ff'} />
          </mesh>

          {/* Base */}
          <mesh position={[0, -0.8, 0]}>
            <cylinderGeometry args={[0.4, 0.5, 0.1, 16]} />
            <meshStandardMaterial color="#1a1a25" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      </Float>

      {/* Ground glow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.6, 32]} />
        <meshBasicMaterial
          color={isHit ? '#333' : '#ff0055'}
          transparent
          opacity={isHit ? 0.1 : 0.3}
        />
      </mesh>
    </group>
  )
}

interface TargetsProps {
  onKill: () => void
}

export function Targets({ onKill }: TargetsProps) {
  const targetPositions: [number, number, number][] = [
    [-6, 1, -6],
    [6, 1, -6],
    [0, 1, -8],
    [-4, 1, 0],
    [4, 1, 0],
    [-8, 1, 3],
    [8, 1, 3],
    [0, 1, -4],
  ]

  return (
    <group>
      {targetPositions.map((pos, i) => (
        <Target key={i} position={pos} onHit={onKill} id={i} />
      ))}
    </group>
  )
}
