import { useEffect, useRef } from 'react'

// A grid of small squares whose size and brightness ripple across the screen,
// like a retro display board. The waves come from a slowly drifting centre, so
// the pattern never repeats. Nothing here reacts to input.
const SPACING = 30
const MAX_SIZE = 13
const STEPS = 16

// The ripple is slow enough that 30fps looks identical to 60+, and halving the
// work matters here: every frame also forces the translucent cards above to
// re-run their backdrop blur.
const FRAME_INTERVAL = 1000 / 30

const INDIGO = [99, 102, 241]
const VIOLET = [168, 85, 247]
const LILAC = [216, 180, 254]

const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t))

// Colour and opacity are quantised up front, so drawing a cell is just a
// fillStyle swap and a fillRect - no string building in the hot loop.
const PALETTE = Array.from({ length: STEPS }, (_, i) => {
  const t = i / (STEPS - 1)
  const rgb = t < 0.5 ? mix(INDIGO, VIOLET, t * 2) : mix(VIOLET, LILAC, (t - 0.5) * 2)
  const alpha = 0.07 + 0.5 * t * t
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha.toFixed(3)})`
})

function SiteBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduceMotion = motionQuery.matches

    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let time = 0
    let animId = null
    let lastFrame = 0
    let pending = 0

    const draw = (dt) => {
      time += dt / 1000

      // the wave origin drifts in a slow figure of eight
      const originX = width * (0.5 + Math.sin(time * 0.13) * 0.28)
      const originY = height * (0.45 + Math.sin(time * 0.19) * 0.22)

      ctx.clearRect(0, 0, width, height)

      for (let gy = 0; gy < rows; gy++) {
        const y = gy * SPACING + SPACING / 2
        for (let gx = 0; gx < cols; gx++) {
          const x = gx * SPACING + SPACING / 2

          const dx = x - originX
          const dy = y - originY
          const dist = Math.sqrt(dx * dx + dy * dy)

          let v =
            Math.sin(dist * 0.011 - time * 1.5) +
            Math.sin(x * 0.009 + time * 0.6) * 0.55 +
            Math.sin(y * 0.013 - time * 0.45) * 0.55

          // normalise the summed waves into 0..1
          v = v / 4.2 + 0.5
          if (v <= 0.02) continue
          if (v > 1) v = 1

          const size = MAX_SIZE * (0.22 + 0.78 * v)
          const step = (STEPS * v) | 0
          ctx.fillStyle = PALETTE[step === STEPS ? STEPS - 1 : step]
          ctx.fillRect(x - size / 2, y - size / 2, size, size)
        }
      }
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * ratio
      canvas.height = height * ratio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      cols = Math.ceil(width / SPACING) + 1
      rows = Math.ceil(height / SPACING) + 1
      draw(0)
    }

    const step = (now) => {
      animId = requestAnimationFrame(step)
      pending += lastFrame ? Math.min(96, now - lastFrame) : 16
      lastFrame = now
      if (pending < FRAME_INTERVAL) return
      draw(pending)
      pending = 0
    }

    const start = () => {
      if (reduceMotion || animId !== null) return
      lastFrame = 0
      pending = 0
      animId = requestAnimationFrame(step)
    }

    const stop = () => {
      if (animId === null) return
      cancelAnimationFrame(animId)
      animId = null
    }

    const onVisibilityChange = () => {
      if (document.hidden) stop()
      else start()
    }

    // react to the OS motion preference being toggled while the tab is open
    const onMotionPreferenceChange = () => {
      reduceMotion = motionQuery.matches
      if (reduceMotion) stop()
      else start()
    }

    resize()
    start()

    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibilityChange)
    motionQuery.addEventListener('change', onMotionPreferenceChange)

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      motionQuery.removeEventListener('change', onMotionPreferenceChange)
    }
  }, [])

  return (
    <div className="site-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="site-bg-canvas" />
    </div>
  )
}

export default SiteBackground
