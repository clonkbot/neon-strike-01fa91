import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { Scene } from './Scene'
import { HUD } from './HUD'
import { LoadingScreen } from './LoadingScreen'

export default function App() {
  const [health, setHealth] = useState(100)
  const [ammo, setAmmo] = useState(30)
  const [maxAmmo] = useState(30)
  const [kills, setKills] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleShoot = () => {
    if (ammo > 0) {
      setAmmo(prev => prev - 1)
    }
  }

  const handleReload = () => {
    setAmmo(maxAmmo)
  }

  const handleKill = () => {
    setKills(prev => prev + 1)
  }

  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden">
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-40"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.8) 100%)'
        }}
      />

      <Canvas
        shadows
        camera={{ position: [0, 1.7, 5], fov: 75 }}
        style={{ background: '#0a0a0f' }}
      >
        <Suspense fallback={null}>
          <Scene
            onShoot={handleShoot}
            onReload={handleReload}
            onKill={handleKill}
            onLoaded={() => setIsLoaded(true)}
          />
        </Suspense>
      </Canvas>

      {!isLoaded && <LoadingScreen />}

      {isLoaded && (
        <HUD
          health={health}
          ammo={ammo}
          maxAmmo={maxAmmo}
          kills={kills}
        />
      )}

      {/* Footer */}
      <footer className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50">
        <p className="text-[10px] md:text-xs text-white/30 font-mono tracking-wider">
          Requested by @brandonn2221 · Built by @clonkbot
        </p>
      </footer>
    </div>
  )
}
