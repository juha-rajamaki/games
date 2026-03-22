import { useRef, useEffect, useState, useCallback } from 'react'

function CanvasBackground({ type, gradient }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const particlesRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const hoveredRef = useRef(false)

  useEffect(() => {
    hoveredRef.current = hovered
  }, [hovered])

  const initParticles = useCallback((w, h) => {
    switch (type) {
      case 'platforms':
        return Array.from({ length: 12 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          width: 30 + Math.random() * 40,
          height: 8 + Math.random() * 4,
          speed: 0.3 + Math.random() * 0.5,
          drift: 0.2 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
          color: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'][Math.floor(Math.random() * 4)],
        }))

      case 'starfield':
        return Array.from({ length: 80 }, () => ({
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
          z: Math.random() * 2,
          size: Math.random() * 2 + 0.5,
        }))

      case 'matrix':
        return Array.from({ length: 35 }, () => ({
          x: Math.floor(Math.random() * (w / 14)) * 14,
          y: Math.random() * h,
          speed: 1 + Math.random() * 3,
          chars: Array.from({ length: 6 + Math.floor(Math.random() * 10) }, () =>
            String.fromCharCode(0x30A0 + Math.random() * 96)
          ),
          opacity: 0.6 + Math.random() * 0.4,
        }))

      case 'fire':
        return Array.from({ length: 40 }, () => ({
          x: Math.random() * w,
          y: h + Math.random() * 20,
          size: 2 + Math.random() * 4,
          speed: 0.5 + Math.random() * 1.5,
          drift: (Math.random() - 0.5) * 0.5,
          opacity: 0.5 + Math.random() * 0.5,
          color: ['#f97316', '#ea580c', '#fdba74', '#fbbf24', '#ef4444'][Math.floor(Math.random() * 5)],
          life: Math.random(),
        }))

      default:
        return []
    }
  }, [type])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      particlesRef.current = initParticles(rect.width, rect.height)
    }

    resize()
    window.addEventListener('resize', resize)

    let time = 0

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio
      const h = canvas.height / window.devicePixelRatio
      const speed = hoveredRef.current ? 2.5 : 1
      const particles = particlesRef.current
      if (!particles) return

      ctx.clearRect(0, 0, w, h)
      time += 0.016 * speed

      switch (type) {
        case 'platforms':
          particles.forEach((p) => {
            const bobY = Math.sin(time * p.speed * 2 + p.phase) * 15
            p.x += p.drift * speed
            if (p.x > w + p.width) p.x = -p.width
            ctx.fillStyle = p.color
            ctx.globalAlpha = 0.6
            ctx.beginPath()
            ctx.roundRect(p.x, p.y + bobY, p.width, p.height, 4)
            ctx.fill()
          })
          ctx.globalAlpha = 1
          break

        case 'starfield': {
          const cx = w / 2
          const cy = h / 2
          particles.forEach((p) => {
            p.z -= 0.02 * speed
            if (p.z <= 0) {
              p.z = 2
              p.x = (Math.random() - 0.5) * 2
              p.y = (Math.random() - 0.5) * 2
            }
            const sx = cx + (p.x / p.z) * w * 0.5
            const sy = cy + (p.y / p.z) * h * 0.5
            const r = (1 - p.z / 2) * 3 + p.size
            if (sx < -10 || sx > w + 10 || sy < -10 || sy > h + 10) return
            ctx.beginPath()
            ctx.arc(sx, sy, r, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255, 255, 255, ${1 - p.z / 2})`
            ctx.fill()

            // draw streak
            const prevZ = p.z + 0.02 * speed
            const prevSx = cx + (p.x / prevZ) * w * 0.5
            const prevSy = cy + (p.y / prevZ) * h * 0.5
            ctx.beginPath()
            ctx.moveTo(sx, sy)
            ctx.lineTo(prevSx, prevSy)
            ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - p.z / 2) * 0.4})`
            ctx.lineWidth = r * 0.5
            ctx.stroke()
          })
          break
        }

        case 'matrix':
          ctx.font = 'bold 16px monospace'
          particles.forEach((p) => {
            p.y += p.speed * speed
            if (p.y > h + 100) {
              p.y = -p.chars.length * 18
              p.x = Math.floor(Math.random() * (w / 18)) * 18
            }
            p.chars.forEach((char, i) => {
              const cy = p.y + i * 18
              if (cy < -18 || cy > h + 18) return
              const isHead = i === p.chars.length - 1
              if (isHead) {
                ctx.fillStyle = '#ffffff'
                ctx.shadowColor = '#4ade80'
                ctx.shadowBlur = 8
              } else {
                ctx.shadowBlur = 0
                const fade = 0.3 + 0.7 * (i / p.chars.length)
                ctx.fillStyle = `rgba(74, 222, 128, ${p.opacity * fade})`
              }
              ctx.fillText(char, p.x, cy)
            })
            ctx.shadowBlur = 0
            // randomly change chars
            if (Math.random() < 0.05) {
              const idx = Math.floor(Math.random() * p.chars.length)
              p.chars[idx] = String.fromCharCode(0x30A0 + Math.random() * 96)
            }
          })
          break

        case 'fire':
          particles.forEach((p) => {
            p.y -= p.speed * speed
            p.x += p.drift
            p.life -= 0.008 * speed
            if (p.life <= 0) {
              p.x = Math.random() * w
              p.y = h + Math.random() * 10
              p.life = 0.8 + Math.random() * 0.2
              p.speed = 0.5 + Math.random() * 1.5
              p.size = 2 + Math.random() * 4
            }
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
            ctx.fillStyle = p.color
            ctx.globalAlpha = p.life * p.opacity
            ctx.fill()
          })
          ctx.globalAlpha = 1
          break
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [type, initParticles])

  return (
    <canvas
      ref={canvasRef}
      className="canvas-bg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
  )
}

export default CanvasBackground
