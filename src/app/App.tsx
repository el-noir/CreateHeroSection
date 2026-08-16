import { useEffect, useMemo } from "react"
import { Dithering } from "@paper-design/shaders-react"

function mix(a: string, b: string, t: number): string {
  const ah = a.replace("#", "")
  const bh = b.replace("#", "")
  const ai = parseInt(ah, 16)
  const bi = parseInt(bh, 16)
  const ar = (ai >> 16) & 0xff; const ag = (ai >> 8) & 0xff; const ab = ai & 0xff
  const br = (bi >> 16) & 0xff; const bg = (bi >> 8) & 0xff; const bb = bi & 0xff
  const rr = Math.round(ar + (br - ar) * t)
  const rg = Math.round(ag + (bg - ag) * t)
  const rb = Math.round(ab + (bb - ab) * t)
  return `#${((1 << 24) + (rr << 16) + (rg << 8) + rb).toString(16).slice(1)}`
}

export default function App() {
  const config = useMemo(() => {
    const t = 0.85
    return {
      back: "#00000000",
      front: mix("#0d4a2a", "#1d9758", t * 0.35),
      speed: 0.28 + t * 0.35,
      size: Math.round(2 + t * 2),
      scale: 1.05 + t * 0.15,
    }
  }, [])

  useEffect(() => {
    const root = document.getElementById("neon-bg-parallax")
    if (!root) return
    const strength = 10
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      root.style.setProperty("--px", `${(-x * strength).toFixed(2)}px`)
      root.style.setProperty("--py", `${(-y * strength).toFixed(2)}px`)
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <div
      id="neon-bg-parallax"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundColor: "#000",
        transform: "translate3d(var(--px,0), var(--py,0), 0)",
        willChange: "transform",
      }}
    >
      <Dithering
        colorBack={config.back}
        colorFront={config.front}
        speed={config.speed}
        shape="wave"
        type="4x4"
        size={config.size}
        scale={config.scale}
        style={{ height: "100vh", width: "100vw" }}
      />

      {/* green glow */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(60% 40% at 50% 40%, rgba(29,151,88,0.10), transparent 70%)",
          mixBlendMode: "screen",
        }}
      />

      {/* vignette */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "radial-gradient(120% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.25' numOctaves='2' stitchTiles='stitch'/%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.11'/%3E%3C/filter%3E%3C/svg%3E\")",
          backgroundSize: "cover",
          mixBlendMode: "screen",
        }}
      />

      {/* top shine */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-25"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 35%)" }}
      />
    </div>
  )
}
