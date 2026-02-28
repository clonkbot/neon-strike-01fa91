import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls, Sky, Stars, Float } from '@react-three/drei'
import * as THREE from 'three'
import { MapGeometry } from './MapGeometry'
import { Weapon } from './Weapon'
import { Targets } from './Targets'

interface SceneProps {
  onShoot: () => void
  onReload: () => void
  onKill: () => void
  onLoaded: () => void
}

export function Scene({ onShoot, onReload, onKill, onLoaded }: SceneProps) {
  const controlsRef = useRef<any>(null)
  const { camera } = useThree()
  const moveState = useRef({ forward: false, backward: false, left: false, right: false })
  const velocity = useRef(new THREE.Vector3())

  useEffect(() => {
    onLoaded()

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          moveState.current.forward = true
          break
        case 'KeyS':
        case 'ArrowDown':
          moveState.current.backward = true
          break
        case 'KeyA':
        case 'ArrowLeft':
          moveState.current.left = true
          break
        case 'KeyD':
        case 'ArrowRight':
          moveState.current.right = true
          break
        case 'KeyR':
          onReload()
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          moveState.current.forward = false
          break
        case 'KeyS':
        case 'ArrowDown':
          moveState.current.backward = false
          break
        case 'KeyA':
        case 'ArrowLeft':
          moveState.current.left = false
          break
        case 'KeyD':
        case 'ArrowRight':
          moveState.current.right = false
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [onReload, onLoaded])

  useFrame((_, delta) => {
    if (!controlsRef.current?.isLocked) return

    const direction = new THREE.Vector3()
    const frontVector = new THREE.Vector3(0, 0, Number(moveState.current.backward) - Number(moveState.current.forward))
    const sideVector = new THREE.Vector3(Number(moveState.current.left) - Number(moveState.current.right), 0, 0)

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(8 * delta)
      .applyEuler(camera.rotation)

    camera.position.add(direction)

    // Clamp position to map bounds
    camera.position.x = Math.max(-15, Math.min(15, camera.position.x))
    camera.position.z = Math.max(-15, Math.min(15, camera.position.z))
    camera.position.y = 1.7
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} color="#4a5568" />
      <directionalLight
        position={[10, 20, 5]}
        intensity={0.5}
        color="#ff6b35"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[-5, 3, -5]} intensity={2} color="#00f0ff" distance={15} />
      <pointLight position={[5, 3, 5]} intensity={2} color="#ff0055" distance={15} />
      <pointLight position={[0, 5, 0]} intensity={1} color="#ff6b35" distance={20} />

      {/* Sky and atmosphere */}
      <Sky
        distance={450000}
        sunPosition={[100, 10, 100]}
        inclination={0.1}
        azimuth={0.25}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
        rayleigh={0.5}
        turbidity={10}
      />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Fog for atmosphere */}
      <fog attach="fog" args={['#0a0a1a', 5, 50]} />

      {/* Controls */}
      <PointerLockControls ref={controlsRef} />

      {/* Map */}
      <MapGeometry />

      {/* Targets */}
      <Targets onKill={onKill} />

      {/* Weapon */}
      <Weapon onShoot={onShoot} controlsRef={controlsRef} />
    </>
  )
}
