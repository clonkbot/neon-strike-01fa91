import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface WeaponProps {
  onShoot: () => void
  controlsRef: React.RefObject<any>
}

export function Weapon({ onShoot, controlsRef }: WeaponProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const [recoil, setRecoil] = useState(0)
  const [muzzleFlash, setMuzzleFlash] = useState(false)

  const handleShoot = () => {
    if (!controlsRef.current?.isLocked) return
    onShoot()
    setRecoil(1)
    setMuzzleFlash(true)
    setTimeout(() => setMuzzleFlash(false), 50)
  }

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Follow camera
    const weaponOffset = new THREE.Vector3(0.3, -0.3, -0.6)
    weaponOffset.applyQuaternion(camera.quaternion)
    groupRef.current.position.copy(camera.position).add(weaponOffset)
    groupRef.current.quaternion.copy(camera.quaternion)

    // Weapon sway
    const sway = Math.sin(state.clock.elapsedTime * 2) * 0.005
    groupRef.current.rotation.z += sway

    // Recoil animation
    if (recoil > 0) {
      groupRef.current.rotation.x -= recoil * 0.1
      groupRef.current.position.z += recoil * 0.05
      setRecoil(prev => Math.max(0, prev - delta * 10))
    }
  })

  // Handle click
  useFrame(() => {}, 0)

  return (
    <group
      ref={groupRef}
      onClick={handleShoot}
      onPointerDown={handleShoot}
    >
      {/* Main body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.08, 0.1, 0.5]} />
        <meshStandardMaterial color="#1a1a25" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Barrel */}
      <mesh position={[0, 0.02, -0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 0.3, 16]} />
        <meshStandardMaterial color="#0a0a15" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Top rail */}
      <mesh position={[0, 0.07, -0.1]}>
        <boxGeometry args={[0.04, 0.02, 0.3]} />
        <meshStandardMaterial color="#2a2a35" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Grip */}
      <mesh position={[0, -0.1, 0.1]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.06, 0.12, 0.04]} />
        <meshStandardMaterial color="#1a1a25" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Magazine */}
      <mesh position={[0, -0.1, -0.1]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.05, 0.15, 0.06]} />
        <meshStandardMaterial color="#0a0a15" metalness={0.7} roughness={0.5} />
      </mesh>

      {/* Stock */}
      <mesh position={[0, 0, 0.25]}>
        <boxGeometry args={[0.06, 0.08, 0.15]} />
        <meshStandardMaterial color="#1a1a25" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* Neon accent line */}
      <mesh position={[0.045, 0, 0]}>
        <boxGeometry args={[0.005, 0.08, 0.4]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Sight */}
      <mesh position={[0, 0.1, -0.1]}>
        <boxGeometry args={[0.03, 0.04, 0.06]} />
        <meshStandardMaterial color="#0a0a15" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.12, -0.1]}>
        <ringGeometry args={[0.008, 0.012, 16]} />
        <meshBasicMaterial color="#ff0055" side={THREE.DoubleSide} />
      </mesh>

      {/* Muzzle flash */}
      {muzzleFlash && (
        <mesh position={[0, 0.02, -0.55]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#ff6b35" transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  )
}
