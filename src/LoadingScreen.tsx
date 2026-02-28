import { useEffect, useState } from 'react'

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center">
      {/* Animated background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,240,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,240,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}
      />

      {/* Logo */}
      <div className="relative mb-8 md:mb-12">
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse" />
        <h1 className="relative font-display text-5xl md:text-7xl font-black tracking-tighter">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
            NEON
          </span>
          <span className="text-white">STRIKE</span>
        </h1>
      </div>

      {/* Loading bar */}
      <div className="w-64 md:w-80">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full transition-all duration-200"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <p className="font-mono text-xs text-white/40">LOADING ASSETS</p>
          <p className="font-mono text-xs text-cyan-400">{Math.round(Math.min(progress, 100))}%</p>
        </div>
      </div>

      {/* Loading tips */}
      <div className="absolute bottom-16 md:bottom-24 text-center px-4">
        <p className="font-mono text-xs md:text-sm text-white/30 max-w-md">
          TIP: Aim for the head for faster eliminations
        </p>
      </div>

      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  )
}
