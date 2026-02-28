import { useState, useEffect } from 'react'

interface HUDProps {
  health: number
  ammo: number
  maxAmmo: number
  kills: number
}

export function HUD({ health, ammo, maxAmmo, kills }: HUDProps) {
  const [isLocked, setIsLocked] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  useEffect(() => {
    const handleLockChange = () => {
      setIsLocked(document.pointerLockElement !== null)
      if (document.pointerLockElement !== null) {
        setShowInstructions(false)
      }
    }

    document.addEventListener('pointerlockchange', handleLockChange)
    return () => document.removeEventListener('pointerlockchange', handleLockChange)
  }, [])

  return (
    <>
      {/* Click to play overlay */}
      {showInstructions && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/70 backdrop-blur-sm">
          <div className="text-center animate-pulse">
            <div className="relative">
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-75" />
              <div className="relative bg-black/90 px-8 py-8 md:px-16 md:py-12 rounded-2xl border border-white/10">
                <h2 className="font-display text-3xl md:text-5xl font-black tracking-tighter text-white mb-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
                    CLICK TO PLAY
                  </span>
                </h2>
                <div className="space-y-2 text-sm md:text-base text-white/60 font-mono">
                  <p><span className="text-cyan-400">WASD</span> — Move</p>
                  <p><span className="text-cyan-400">Mouse</span> — Look around</p>
                  <p><span className="text-pink-400">Click</span> — Shoot</p>
                  <p><span className="text-orange-400">R</span> — Reload</p>
                  <p><span className="text-purple-400">ESC</span> — Pause</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Crosshair */}
      {isLocked && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div className="relative w-8 h-8">
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
            {/* Cross lines */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white/80" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white/80" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-0.5 bg-white/80" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-0.5 bg-white/80" />
          </div>
        </div>
      )}

      {/* Health bar - bottom left */}
      <div className="absolute bottom-16 left-4 md:left-8 z-20">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-3 md:p-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="#ff0055"
                  className="drop-shadow-[0_0_8px_rgba(255,0,85,0.8)]"
                />
              </svg>
            </div>
            <div className="w-32 md:w-48">
              <div className="h-2 md:h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full transition-all duration-300"
                  style={{ width: `${health}%` }}
                />
              </div>
              <p className="font-mono text-xs md:text-sm text-white/60 mt-1">
                <span className="text-pink-400">{health}</span> / 100
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ammo counter - bottom right */}
      <div className="absolute bottom-16 right-4 md:right-8 z-20">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-3 md:p-4">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-display text-2xl md:text-4xl font-black tracking-tight">
                <span className={`${ammo <= 5 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
                  {ammo}
                </span>
                <span className="text-white/30"> / {maxAmmo}</span>
              </p>
              <p className="font-mono text-xs text-white/40 uppercase tracking-wider">
                Ammo
              </p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
              <div className="w-2 h-6 md:w-3 md:h-8 bg-cyan-400 rounded-sm shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Kill counter - top right */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-3 md:p-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-5 h-5 md:w-6 md:h-6">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <circle cx="12" cy="12" r="10" stroke="#ff6b35" strokeWidth="2" />
                <circle cx="12" cy="12" r="6" stroke="#ff6b35" strokeWidth="2" />
                <circle cx="12" cy="12" r="2" fill="#ff6b35" />
              </svg>
            </div>
            <div>
              <p className="font-display text-xl md:text-2xl font-black text-orange-400">
                {kills}
              </p>
              <p className="font-mono text-[10px] md:text-xs text-white/40 uppercase tracking-wider">
                Eliminations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Game title - top left */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
        <h1 className="font-display text-xl md:text-2xl font-black tracking-tighter">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
            NEON
          </span>
          <span className="text-white/80">STRIKE</span>
        </h1>
        <p className="font-mono text-[10px] md:text-xs text-white/30 tracking-widest uppercase">
          Training Range
        </p>
      </div>

      {/* Paused overlay */}
      {!isLocked && !showInstructions && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <h2 className="font-display text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
              PAUSED
            </h2>
            <p className="font-mono text-sm md:text-base text-white/50">
              Click to resume
            </p>
          </div>
        </div>
      )}

      {/* Mobile touch controls hint */}
      <div className="md:hidden absolute bottom-32 left-1/2 -translate-x-1/2 z-20">
        <p className="font-mono text-[10px] text-white/30 text-center">
          Best experienced on desktop
        </p>
      </div>
    </>
  )
}
