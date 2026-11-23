import { useEffect, type CSSProperties } from 'react'

export type DoorOrigin = {
  left: number
  top: number
  width: number
  height: number
  angle?: number
  nameplateFontSize?: number
  panelFontWeight?: number
}

export function DoorLeaf({
  title,
  color,
  nameplateFontSize,
  panelFontWeight,
}: {
  title: string
  color: string
  nameplateFontSize?: number
  panelFontWeight?: number
}) {
  return (
    <span className="door-panel" style={{ background: color, fontWeight: panelFontWeight }}>
      <span className="door-wood-grain" aria-hidden="true" />
      <span className="door-inset top" />
      <span className="door-inset bottom" />
      <span
        className="nameplate"
        style={nameplateFontSize ? { fontSize: nameplateFontSize } : undefined}
      >
        <i className="screw top-left" aria-hidden="true" />
        <i className="screw top-right" aria-hidden="true" />
        <span className="nameplate-title">{title.toUpperCase()}</span>
        <i className="screw bottom-left" aria-hidden="true" />
        <i className="screw bottom-right" aria-hidden="true" />
      </span>
      <span className="door-hardware" aria-hidden="true">
        <span className="door-lever-handle">
          <i className="lever-stem" />
          <i className="lever-bar" />
        </span>
        <span className="door-keyhole-escutcheon">
          <i className="keyhole-slot" />
        </span>
      </span>
    </span>
  )
}

export function DoorTransition({
  origin,
  title,
  color,
  onEntered,
}: {
  origin: DoorOrigin
  title: string
  color: string
  onEntered: () => void
}) {
  useEffect(() => {
    const previous = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = previous
    }
  }, [])

  const scale = Math.max(window.innerWidth / origin.width, window.innerHeight / origin.height) * 1.9
  const style = {
    left: origin.left,
    top: origin.top,
    width: origin.width,
    height: origin.height,
    '--camera-x': `${window.innerWidth / 2 - origin.left - origin.width * 0.6}px`,
    '--camera-y': `${window.innerHeight / 2 - origin.top - origin.height / 2}px`,
    '--camera-scale': scale,
    '--door-start-angle': `${origin.angle ?? -36}deg`,
  } as CSSProperties

  return (
    <div className="door-transition-overlay" role="status" aria-label={`Entering ${title}`}>
      <div
        className="door-camera"
        style={style}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget && event.animationName === 'doorCameraEnter') {
            onEntered()
          }
        }}
      >
        <div className="door-frame transition-door-frame" aria-hidden="true">
          <span className="door-light" />
          <DoorLeaf
            title={title}
            color={color}
            nameplateFontSize={origin.nameplateFontSize}
            panelFontWeight={origin.panelFontWeight}
          />
        </div>
      </div>
      <div className="door-transition-veil" aria-hidden="true" />
    </div>
  )
}
