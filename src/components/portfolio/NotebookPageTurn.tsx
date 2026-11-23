import { useLayoutEffect, useRef } from 'react'

const smoothstep = (value: number) => {
  const t = Math.max(0, Math.min(1, value))
  return t * t * (3 - 2 * t)
}

/** A flexible paper surface, projected one narrow horizontal strip at a time. */
export function NotebookPageTurn({
  outgoingRole,
  outgoingIndex,
}: {
  outgoingRole: string
  outgoingIndex: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const page = canvas?.parentElement?.querySelector<HTMLElement>('.current-page')
    const context = canvas?.getContext('2d')
    if (!canvas || !page || !context) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let disposed = false
    let started = 0
    let width = 0
    let height = 0
    let lastProgress = 0
    let shadowRGB = '39,30,16'
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    const front = document.createElement('canvas')
    const duration = 1380

    const prepare = () => {
      const bounds = page.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      if (!width || !height) return
      canvas.width = Math.ceil((width + 160) * ratio)
      canvas.height = Math.ceil((height + 40) * ratio)

      const style = getComputedStyle(page)
      const color = (name: string, fallback: string) =>
        style.getPropertyValue(name).trim() || fallback
      shadowRGB = color('--pad-fold-shadow-rgb', '39,30,16')
      for (const texture of [front]) {
        texture.width = Math.ceil(width * ratio)
        texture.height = Math.ceil(height * ratio)
        const pen = texture.getContext('2d')
        if (!pen) continue
        pen.scale(ratio, ratio)
        pen.beginPath()
        pen.roundRect(0.5, 0.5, width - 1, height - 1, 8)
        pen.clip()
        const paper = pen.createLinearGradient(0, 0, 0, height)
        paper.addColorStop(0, color('--pad-paper-top', '#fffefa'))
        paper.addColorStop(0.45, color('--pad-paper-mid', '#f6f4ee'))
        paper.addColorStop(1, color('--pad-paper-bottom', '#eeeae0'))
        pen.fillStyle = paper
        pen.fillRect(0, 0, width, height)
        // Subtle paper fibres are deterministic, so they never flicker between frames.
        for (let i = 0; i < 500; i++) {
          pen.fillStyle = i % 2 ? 'rgba(82,70,45,.028)' : 'rgba(255,255,255,.18)'
          pen.fillRect((i * 73.17) % width, (i * 31.73) % height, 1.4, 0.6)
        }
        pen.strokeStyle = color('--pad-paper-edge', '#b3ad9f')
        pen.lineWidth = 1
        pen.stroke()
        pen.fillStyle = 'rgba(113,102,81,.2)'
        pen.fillRect(0, height - 1.5, width, 1)

        {
          pen.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
          pen.fillStyle = style.color
          pen.textBaseline = 'middle'
          const spacing = parseFloat(style.letterSpacing) || 0
          let x = parseFloat(style.paddingLeft) + 1
          const fontSize = parseFloat(style.fontSize)
          const baseline = parseFloat(style.paddingTop) + fontSize * 0.51
          for (let i = 0; i < outgoingRole.length; i++) {
            const character = outgoingRole[i]
            pen.fillText(character, x, baseline)
            // Pair widths preserve kerning while applying the selected CSS tracking.
            const pair = outgoingRole.slice(i, i + 2)
            const advance =
              pair.length === 2
                ? pen.measureText(pair).width - pen.measureText(pair[1]).width
                : pen.measureText(character).width
            x += advance + spacing
          }
        }
        const index = page.querySelector<HTMLElement>('.flip-count')
        if (index) {
          const indexStyle = getComputedStyle(index)
          pen.font = `${indexStyle.fontWeight} ${indexStyle.fontSize} ${indexStyle.fontFamily}`
          pen.fillStyle = indexStyle.color
          pen.textBaseline = 'bottom'
          pen.textAlign = 'right'
          const label = `0${outgoingIndex + 1} / 04`
          const tracking = parseFloat(indexStyle.letterSpacing) || 0
          let right = width - 12
          for (let i = label.length - 1; i >= 0; i--) {
            pen.fillText(label[i], right, height - 7)
            right -= pen.measureText(label[i]).width + tracking
          }
        }
        for (let i = 0; i < 9; i++) {
          pen.beginPath()
          pen.ellipse(18 + ((width - 36) * (i + 0.5)) / 9, 7, 2.5, 2, 0, 0, Math.PI * 2)
          pen.fillStyle = '#81796b'
          pen.fill()
        }
      }
    }

    const draw = (progress: number) => {
      if (!width || !height) return
      const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2
      const angle = eased * Math.PI
      const fade = 1 - smoothstep((angle - Math.PI * 0.4) / (Math.PI * 0.1))
      const flex = Math.sin(progress * Math.PI) * fade
      const hingeX = 80
      const hingeY = 0
      const focalLength = Math.max(1100, width * 2.8)

      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.clearRect(0, 0, width + 160, height + 40)
      // A turned page disappears at 90°; nothing can be painted above the spiral hinge.
      if (angle >= Math.PI / 2) return
      context.save()
      context.translate(hingeX, hingeY)

      // The moving sheet casts a soft shadow onto the page underneath.
      context.save()
      context.beginPath()
      context.roundRect(0, 0, width, height, 8)
      context.clip()
      const shadow = context.createLinearGradient(0, 0, 0, height)
      shadow.addColorStop(0, `rgba(${shadowRGB},${0.25 * flex})`)
      shadow.addColorStop(0.3, `rgba(${shadowRGB},${0.14 * flex})`)
      shadow.addColorStop(1, `rgba(${shadowRGB},0)`)
      context.fillStyle = shadow
      context.fillRect(0, 0, width, height)
      context.restore()

      const strips = 100
      const segment = height / strips
      let y = 0
      let z = 0
      context.globalAlpha = fade
      for (let i = 0; i < strips; i++) {
        const along = (i + 0.5) / strips
        // The free edge lags behind the hinge, then relaxes with a small travelling ripple.
        const curl = -0.72 * flex * along ** 1.45
        const ripple =
          Math.sin(along * Math.PI * 2.2 - progress * Math.PI * 3) *
          Math.sin(progress * Math.PI) ** 2 *
          along ** 2 *
          0.12
        const localAngle = angle + curl + ripple
        const nextY = y + Math.cos(localAngle) * segment
        const nextZ = z + Math.sin(localAngle) * segment
        const scale0 = focalLength / (focalLength - z)
        const scale1 = focalLength / (focalLength - nextZ)
        const top = y * scale0
        const bottom = nextY * scale1
        const projectedHeight = bottom - top
        const scale = (scale0 + scale1) / 2
        const x = (width * (1 - scale)) / 2
        const light = Math.min(0.32, Math.abs(Math.sin(localAngle)) * 0.25 + Math.abs(curl) * 0.1)

        // Reject edge-on/back-facing strips instead of reflecting their text.
        if (projectedHeight > 0.025 && Math.cos(localAngle) > 0) {
          context.save()
          context.translate(x, top)
          context.scale(scale, projectedHeight / segment)
          context.drawImage(
            front,
            0,
            i * segment * ratio,
            width * ratio,
            segment * ratio,
            0,
            0,
            width,
            segment + 0.35,
          )
          context.fillStyle = `rgba(54,44,27,${light})`
          context.fillRect(0, 0, width, segment + 0.35)
          context.restore()
        }
        y = nextY
        z = nextZ
      }
      context.restore()
    }

    const tick = (time: number) => {
      if (!started) started = time
      const progress = Math.min(1, (time - started) / duration)
      lastProgress = progress
      draw(progress)
      if (progress < 0.5) frame = requestAnimationFrame(tick)
      else context.clearRect(0, 0, canvas.width, canvas.height)
    }
    const refresh = () => {
      prepare()
      draw(lastProgress)
    }
    refresh()
    frame = requestAnimationFrame(tick)
    const observer = new ResizeObserver(refresh)
    observer.observe(page)
    const themeObserver = new MutationObserver(refresh)
    const app = page.closest('.app')
    if (app) themeObserver.observe(app, { attributes: true, attributeFilter: ['class'] })
    void document.fonts.ready.then(() => {
      if (!disposed) refresh()
    })
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      themeObserver.disconnect()
    }
  }, [outgoingRole, outgoingIndex])

  return <canvas ref={canvasRef} className="notebook-turn-canvas" aria-hidden="true" />
}
