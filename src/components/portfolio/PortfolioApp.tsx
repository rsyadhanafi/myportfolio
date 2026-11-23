'use client'

import NextImage from 'next/image'
import type { StoryData } from '@/data/storyData'
import type { ProjectItem } from '@/lib/projects'
import type { TalkItem } from '@/lib/talks'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { NotebookPageTurn } from './NotebookPageTurn'
import { TopNavigation } from './TopNavigation'
import { DoorLeaf, DoorTransition, type DoorOrigin } from './DoorTransition'
import { MyStory } from './MyStory'

type RoomKey = 'ai' | 'software' | 'design' | 'speaking'

const roles = ['ML / AI Engineer', 'Web Developer', 'Graphic Designer', 'Keynote Speaker']

const rooms: Array<{
  key: RoomKey
  number: string
  title: string
  short: string
  heading: string
  subtitle: string
  color: string
  skills: string[]
}> = [
  {
    key: 'ai',
    number: '01',
    title: 'ML / AI Engineer',
    short: 'MACHINE INTELLIGENCE',
    heading: 'Machine Learning & AI',
    subtitle: 'DATA TO INTELLIGENT PRODUCTION MODELS',
    color: '#1B263B',
    skills: [
      'Data preprocessing & exploratory analysis',
      'Model architecture & neural network training',
      'LLM fine-tuning & RAG pipeline integration',
      'Model evaluation, optimization & quantization',
      'End-to-end API deployment & monitoring',
    ],
  },
  {
    key: 'software',
    number: '02',
    title: 'Web Developer',
    short: 'SYSTEMS & PRODUCTS',
    heading: 'Web Development',
    subtitle: 'END TO END, FROM ARCHITECTURE TO LIVE APP',
    color: '#3D1E36',
    skills: [
      'System design & database schema modeling',
      'Responsive front-end & interactive UI development',
      'Scalable back-end APIs & authentication',
      'Cloud deployment & automated workflows',
      'Performance tuning, debugging & maintenance',
    ],
  },
  {
    key: 'design',
    number: '03',
    title: 'Graphic Designer',
    short: 'VISUAL STORYTELLING',
    heading: 'Graphic Design',
    subtitle: 'VISUAL CONTENT TRUE TO THE BRAND OR ORGANIZATIONS',
    color: '#2D4739',
    skills: [
      'Brand identity, logo & visual guideline systems',
      'Editorial posters, key visuals & event merchandise',
      'UI/UX wireframing & interactive prototyping',
      'Typography hierarchy & motion graphics direction',
      'Print-ready assets & social media campaign kits',
    ],
  },
  {
    key: 'speaking',
    number: '04',
    title: 'Keynote Speaker',
    short: 'IDEAS IN PUBLIC',
    heading: 'Keynote Speaker',
    subtitle: 'SHARING KNOWLEDGE ON STAGE & COMMUNITIES',
    color: '#8C3B2B',
    skills: [
      'Technical talks on leadership, student organizations & school events',
      'Panel discussions & campus seminars',
      'Mentoring emerging student leaders',
      'Community building & event moderation',
      'Interactive workshops & audience facilitation',
    ],
  },
]

const aiProjects: Omit<ProjectItem, 'id' | 'room'>[] = [
  {
    index: '01',
    title: 'Sift',
    kicker: 'MULTIMODAL RESEARCH ASSISTANT',
    description:
      'A retrieval pipeline that reads papers, diagrams, and tables together—turning dense research into cited, explorable answers.',
    tags: ['Python', 'PyTorch', 'Qdrant'],
    metric: '92.4% recall',
    accent: '#dfe8ff',
    visual: 'network',
    liveUrl: 'https://github.com',
    repoUrl: 'https://github.com',
  },
  {
    index: '02',
    title: 'Pulse',
    kicker: 'EDGE VISION SYSTEM',
    description:
      'A compact vision model for real-time urban mobility insights, optimized to run locally on low-power hardware.',
    tags: ['YOLOv8', 'ONNX', 'OpenCV'],
    metric: '24ms inference',
    accent: '#d8eadc',
    visual: 'vision',
    repoUrl: 'https://github.com',
  },
  {
    index: '03',
    title: 'Guardrail',
    kicker: 'MODEL EVALUATION TOOLKIT',
    description:
      'An open evaluation harness for testing hallucination, bias, and regression across language model releases.',
    tags: ['Python', 'FastAPI', 'LLM evals'],
    metric: '18 test suites',
    accent: '#f0ddc7',
    visual: 'bars',
  },
]

const softwareProjects: Omit<ProjectItem, 'id' | 'room'>[] = [
  {
    index: '01',
    title: 'Relay',
    kicker: 'REAL-TIME COLLABORATION',
    description:
      'A fast, multiplayer workspace for student teams with presence, comments, and conflict-free editing built in.',
    tags: ['Next.js', 'Supabase', 'WebSockets'],
    metric: '99.9% uptime',
    accent: '#ead9e8',
    visual: 'terminal',
    liveUrl: 'https://github.com',
    repoUrl: 'https://github.com',
  },
  {
    index: '02',
    title: 'Campus OS',
    kicker: 'STUDENT COMMUNITY PLATFORM',
    description:
      'One calm home for events, clubs, peer opportunities, and the useful fragments usually lost in group chats.',
    tags: ['React', 'TypeScript', 'Postgres'],
    metric: '1.8k students',
    accent: '#dce8f2',
    visual: 'dashboard',
    liveUrl: 'https://github.com',
  },
  {
    index: '03',
    title: 'Plotline',
    kicker: 'DATA STORY BUILDER',
    description:
      'A visual toolkit that helps non-technical teams turn raw spreadsheets into clear, publishable narratives.',
    tags: ['Vite', 'D3.js', 'Cloudflare'],
    metric: '42% faster',
    accent: '#eee0c7',
    visual: 'chart',
  },
]

const defaultTalks = [
  {
    year: '2026',
    type: 'KEYNOTE',
    title: 'Building AI that earns trust',
    place: 'Student Tech Summit',
    number: '01',
  },
  {
    year: '2026',
    type: 'WORKSHOP',
    title: 'From notebook to production',
    place: 'ML Collective',
    number: '02',
  },
  {
    year: '2025',
    type: 'TALK',
    title: 'The interface is part of the system',
    place: 'Design × Code',
    number: '03',
  },
  {
    year: '2025',
    type: 'FACILITATION',
    title: 'Open source, open doors',
    place: 'Campus DevFest',
    number: '04',
  },
  {
    year: '2024',
    type: 'WORKSHOP',
    title: 'Make your first model',
    place: 'Community Lab',
    number: '05',
  },
]

function ArrowIcon({ direction = 'right' }: { direction?: 'right' | 'left' | 'down' }) {
  const rotation = direction === 'left' ? 180 : direction === 'down' ? 90 : 0
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function Lamp({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLButtonElement>(null)
  const wakeRef = useRef<() => void>(() => {})
  const state = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    wave: 0,
    waveVelocity: 0,
    dragging: false,
    pointer: -1,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
    suppressClick: false,
  })

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let frame = 0
    let previousTime = 0
    let height = root.clientHeight - 48
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const draw = () => {
      const s = state.current
      const endX = 110 + s.x
      const endY = height + s.y
      const controlX = 110 + s.x * 0.57 + s.wave
      const controlY = endY * 0.71
      const path = `M 110 0 C 110 ${height * 0.36}, ${controlX} ${controlY}, ${endX} ${endY}`
      root.querySelectorAll<SVGPathElement>('[data-rope]').forEach((element) => {
        element.setAttribute('d', path)
      })
      if (knobRef.current) {
        const angle = (-Math.atan2(endX - controlX, endY - controlY) * 180) / Math.PI
        knobRef.current.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${angle}deg)`
      }
    }
    const tick = (time: number) => {
      const dt = previousTime ? Math.min((time - previousTime) / 1000, 0.032) : 1 / 60
      previousTime = time
      const s = state.current
      if (!s.dragging) {
        const damping = reducedMotion.matches ? 30 : 6.5
        s.vx += (-s.x * 75 - s.vx * damping) * dt
        s.vy += (-s.y * 155 - s.vy * (reducedMotion.matches ? 32 : 10)) * dt
        s.x += s.vx * dt
        s.y += s.vy * dt
      }
      s.waveVelocity += ((s.vx * 0.07 - s.wave) * 95 - s.waveVelocity * 9) * dt
      s.wave += s.waveVelocity * dt
      draw()
      if (
        s.dragging ||
        Math.abs(s.x) +
          Math.abs(s.y) +
          Math.abs(s.vx) +
          Math.abs(s.vy) +
          Math.abs(s.wave) +
          Math.abs(s.waveVelocity) >
          0.15
      ) {
        frame = requestAnimationFrame(tick)
      } else {
        s.x = s.y = s.vx = s.vy = s.wave = s.waveVelocity = 0
        draw()
        frame = 0
        previousTime = 0
      }
    }
    wakeRef.current = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const observer = new ResizeObserver(() => {
      height = root.clientHeight - 48
      draw()
    })
    observer.observe(root)
    draw()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      wakeRef.current = () => {}
    }
  }, [])

  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return
    const s = state.current
    s.dragging = true
    s.pointer = event.pointerId
    s.startX = event.clientX
    s.startY = event.clientY
    s.originX = s.x
    s.originY = s.y
    s.vx = s.vy = 0
    s.moved = false
    s.suppressClick = false
    event.currentTarget.setPointerCapture(event.pointerId)
    wakeRef.current()
  }
  const pointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || state.current.dragging) return
    const rect = event.currentTarget.getBoundingClientRect()
    const depth = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
    const direction = event.clientX >= rect.left + 110 ? -1 : 1
    const strength = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 8 : 145
    state.current.vx = Math.max(
      -260,
      Math.min(260, state.current.vx + direction * strength * (0.12 + 0.88 * depth ** 2)),
    )
    state.current.waveVelocity += direction * strength * depth * 0.14
    wakeRef.current()
  }
  const pointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const s = state.current
    if (s.dragging && s.pointer === event.pointerId) {
      const dx = event.clientX - s.startX
      const dy = event.clientY - s.startY
      s.moved ||= Math.hypot(dx, dy) > 6
      s.x = Math.max(-85, Math.min(85, s.originX + dx * 0.8))
      s.y = Math.max(-24, Math.min(100, s.originY + dy * 0.7))
    } else if (!s.dragging && event.pointerType === 'mouse') {
      const rect = event.currentTarget.getBoundingClientRect()
      const depth = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
      const direction = event.movementX || (event.clientX > rect.left + 110 ? -2 : 2)
      s.vx = Math.max(-260, Math.min(260, s.vx + direction * 5 * depth ** 2))
      s.waveVelocity += direction * depth * 0.5
    }
    wakeRef.current()
  }
  const release = (event: ReactPointerEvent<HTMLDivElement>) => {
    const s = state.current
    if (!s.dragging || s.pointer !== event.pointerId) return
    s.dragging = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    if (s.moved && event.type === 'pointerup') {
      s.suppressClick = true
      s.vx += s.x >= 0 ? 185 : -185
      s.vy -= 130
      onToggle()
    }
    wakeRef.current()
  }
  const activate = () => {
    const s = state.current
    if (s.suppressClick) {
      s.suppressClick = false
      return
    }
    s.y += 20
    s.vy += 80
    s.vx += s.x >= 0 ? 180 : -180
    wakeRef.current()
    onToggle()
  }

  return (
    <div
      className="lamp-physics"
      ref={rootRef}
      onClick={activate}
      onPointerEnter={pointerEnter}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={(event) => {
        if (state.current.dragging) release(event)
      }}
    >
      <svg className="rope-svg" aria-hidden="true">
        <path data-rope className="rope-outline" />
        <path data-rope className="rope-core" />
        <path data-rope className="rope-braid" />
        <path data-rope className="rope-hit-area" />
      </svg>
      <button
        ref={knobRef}
        className="rope-knob"
        aria-label={dark ? 'Turn on the light' : 'Turn off the light'}
        aria-pressed={dark}
        title="Pull or click to switch the light"
      >
        <span className="rope-knob-wood" />
      </button>
    </div>
  )
}

function FlipNotebook({ roleIndex, onFlip }: { roleIndex: number; onFlip: () => void }) {
  const [page, setPage] = useState({ current: roleIndex, previous: roleIndex, turn: 0 })
  if (page.current !== roleIndex) {
    setPage({ current: roleIndex, previous: page.current, turn: page.turn + 1 })
  }

  return (
    <button className="flip-wrap" onClick={onFlip} aria-label="Change role">
      <span className="spiral" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <i key={i} />
        ))}
      </span>
      <span className="flip-pages">
        <span className="notebook-page current-page">
          <span className="spiral-holes" aria-hidden="true">
            {Array.from({ length: 9 }).map((_, i) => (
              <i key={i} />
            ))}
          </span>
          {roles[roleIndex]}
          <span className="flip-count">0{roleIndex + 1} / 04</span>
        </span>
        {page.turn > 0 && (
          <NotebookPageTurn
            key={page.turn}
            outgoingRole={roles[page.previous]}
            outgoingIndex={page.previous}
          />
        )}
      </span>
      <span className="flip-note">CLICK TO FLIP</span>
    </button>
  )
}

function BrushPortrait() {
  const portraitRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sketchRef = useRef<HTMLImageElement | null>(null)
  const previousPoint = useRef<{ x: number; y: number } | null>(null)
  const restoreFrame = useRef(0)
  const idleTimer = useRef<number | null>(null)

  useEffect(() => {
    const portrait = portraitRef.current
    const hero = portrait?.closest('.hero')
    const heading = hero?.querySelector('h1')
    const copy = hero?.querySelector('.hero-copy')
    if (!portrait || !hero || !heading || !copy) return
    const desktop = window.matchMedia('(min-width: 851px)')
    const alignPortrait = () => {
      if (!desktop.matches) {
        portrait.style.removeProperty('--portrait-desktop-width')
        return
      }
      const bottomInset = parseFloat(getComputedStyle(portrait).bottom) || 0
      const bottom = hero.getBoundingClientRect().bottom - bottomInset
      const height = (bottom - heading.getBoundingClientRect().top) / (1 - 128 / 3012)
      portrait.style.setProperty('--portrait-desktop-width', `${(height * 462) / 467}px`)
    }
    const observer = new ResizeObserver(alignPortrait)
    observer.observe(hero)
    observer.observe(copy)
    desktop.addEventListener('change', alignPortrait)
    alignPortrait()
    return () => {
      observer.disconnect()
      desktop.removeEventListener('change', alignPortrait)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let disposed = false
    let initialized = false
    let bounds = { x: 0, y: 0, width: 0, height: 0 }
    const image = new Image()
    sketchRef.current = image
    const resize = () => {
      if (disposed || !image.complete || !image.naturalWidth) return
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const snapshot = document.createElement('canvas')
      if (initialized) {
        snapshot.width = canvas.width
        snapshot.height = canvas.height
        snapshot.getContext('2d')?.drawImage(canvas, 0, 0)
      }
      canvas.width = Math.round(rect.width * ratio)
      canvas.height = Math.round(rect.height * ratio)
      const context = canvas.getContext('2d')
      if (!context) return
      const scale = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight)
      const width = image.naturalWidth * scale
      const height = image.naturalHeight * scale
      const nextBounds = {
        x: (canvas.width - width) / 2,
        y: canvas.height - height,
        width,
        height,
      }
      if (initialized) {
        context.drawImage(
          snapshot,
          bounds.x,
          bounds.y,
          bounds.width,
          bounds.height,
          nextBounds.x,
          nextBounds.y,
          width,
          height,
        )
      } else {
        context.drawImage(image, (canvas.width - width) / 2, canvas.height - height, width, height)
        initialized = true
      }
      bounds = nextBounds
      previousPoint.current = null
    }
    image.onload = resize
    image.src = '/naff1-cropped.webp'
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    return () => {
      disposed = true
      observer.disconnect()
      image.onload = null
      cancelAnimationFrame(restoreFrame.current)
      if (idleTimer.current !== null) window.clearTimeout(idleTimer.current)
    }
  }, [])

  const restoreSketch = () => {
    previousPoint.current = null
    if (idleTimer.current !== null) window.clearTimeout(idleTimer.current)
    cancelAnimationFrame(restoreFrame.current)
    const canvas = canvasRef.current
    const image = sketchRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context || !image?.naturalWidth) return
    const snapshot = document.createElement('canvas')
    snapshot.width = canvas.width
    snapshot.height = canvas.height
    snapshot.getContext('2d')?.drawImage(canvas, 0, 0)
    const started = performance.now()
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 850
    const frame = (now: number) => {
      const progress = duration === 0 ? 1 : Math.min(1, (now - started) / duration)
      const eased = progress * progress * (3 - 2 * progress)
      const scale = Math.min(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight)
      const width = image.naturalWidth * scale
      const height = image.naturalHeight * scale
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.save()
      context.globalAlpha = 1 - eased
      context.drawImage(snapshot, 0, 0, canvas.width, canvas.height)
      context.globalCompositeOperation = 'lighter'
      context.globalAlpha = eased
      context.drawImage(image, (canvas.width - width) / 2, canvas.height - height, width, height)
      context.restore()
      if (progress < 1) {
        restoreFrame.current = requestAnimationFrame(frame)
      } else {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, (canvas.width - width) / 2, canvas.height - height, width, height)
      }
    }
    restoreFrame.current = requestAnimationFrame(frame)
  }

  const paint = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType !== 'mouse' && event.buttons === 0) return
    cancelAnimationFrame(restoreFrame.current)
    if (idleTimer.current !== null) window.clearTimeout(idleTimer.current)
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const rect = canvas.getBoundingClientRect()
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    const start = previousPoint.current ?? point
    const distance = Math.hypot(point.x - start.x, point.y - start.y)
    const steps = Math.max(1, Math.ceil(distance / 8))
    const radius =
      Math.max(38, Math.min(76, rect.width * 0.16)) *
      (event.pointerType === 'pen' ? 0.7 + event.pressure : 1)
    context.save()
    context.scale(canvas.width / rect.width, canvas.height / rect.height)
    context.globalCompositeOperation = 'destination-out'
    for (let step = 0; step <= steps; step++) {
      const x = start.x + ((point.x - start.x) * step) / steps
      const y = start.y + ((point.y - start.y) * step) / steps
      const organicRadius = radius * (1 + Math.sin(x * 0.13 + y * 0.09) * 0.08)
      const brush = context.createRadialGradient(x, y, 0, x, y, organicRadius)
      brush.addColorStop(0, 'rgba(0,0,0,0.75)')
      brush.addColorStop(0.2, 'rgba(0,0,0,0.6)')
      brush.addColorStop(0.45, 'rgba(0,0,0,0.29)')
      brush.addColorStop(0.7, 'rgba(0,0,0,0.08)')
      brush.addColorStop(0.9, 'rgba(0,0,0,0.008)')
      brush.addColorStop(1, 'rgba(0,0,0,0)')
      context.fillStyle = brush
      context.fillRect(x - organicRadius, y - organicRadius, organicRadius * 2, organicRadius * 2)
    }
    context.restore()
    previousPoint.current = point
    idleTimer.current = window.setTimeout(restoreSketch, 650)
  }

  return (
    <div ref={portraitRef} className="hero-portrait" aria-label="Interactive portrait of Hanafi">
      <span className="portrait-halo" />
      <NextImage
        className="portrait-base"
        src="/naff2-cropped.webp"
        alt="Hanafi"
        width={1200}
        height={1213}
        sizes="(max-width: 560px) 84vw, 50vw"
        loading="eager"
        unoptimized
      />
      <canvas
        ref={canvasRef}
        className="portrait-canvas"
        aria-label="Brush over the black-and-white portrait to reveal its original colors"
        onPointerDown={(event) => {
          previousPoint.current = null
          event.currentTarget.setPointerCapture(event.pointerId)
          paint(event)
        }}
        onPointerMove={paint}
        onPointerLeave={restoreSketch}
        onPointerUp={restoreSketch}
        onPointerCancel={restoreSketch}
      />
    </div>
  )
}

function Door({
  room,
  active,
  dimmed,
  onEnter,
  onLeave,
  onOpen,
  opening,
  busy,
}: {
  room: (typeof rooms)[number]
  active: boolean
  dimmed: boolean
  onEnter: () => void
  onLeave: () => void
  onOpen: (button: HTMLButtonElement) => void
  opening: boolean
  busy: boolean
}) {
  const badgeRef = useRef<HTMLSpanElement>(null)
  const cursor = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, frame: 0, last: 0 })
  const [showBadge, setShowBadge] = useState(false)

  const hideBadge = useCallback(() => {
    cancelAnimationFrame(cursor.current.frame)
    cursor.current.frame = 0
    cursor.current.last = 0
    if (badgeRef.current) {
      badgeRef.current.style.opacity = '0'
      badgeRef.current.style.scale = '0.8'
      badgeRef.current.style.transition = 'none'
    }
    setShowBadge(false)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', hideBadge, { capture: true, passive: true })
    window.addEventListener('blur', hideBadge)
    return () => {
      cancelAnimationFrame(cursor.current.frame)
      window.removeEventListener('scroll', hideBadge, true)
      window.removeEventListener('blur', hideBadge)
    }
  }, [hideBadge])

  const positionBadge = (event: ReactPointerEvent<HTMLButtonElement>, enter = false) => {
    if (event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const point = cursor.current
    point.targetX = event.clientX - bounds.left + 12
    point.targetY = event.clientY - bounds.top + 16
    if (enter || !showBadge) {
      point.x = point.targetX
      point.y = point.targetY
      if (badgeRef.current) {
        badgeRef.current.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`
        badgeRef.current.style.removeProperty('opacity')
        badgeRef.current.style.removeProperty('scale')
        badgeRef.current.style.removeProperty('transition')
      }
      setShowBadge(true)
    }
    const tick = (time: number) => {
      const dt = point.last ? Math.min((time - point.last) / 1000, 0.05) : 1 / 60
      point.last = time
      const ease = 1 - Math.exp(-22 * dt)
      point.x += (point.targetX - point.x) * ease
      point.y += (point.targetY - point.y) * ease
      if (badgeRef.current) {
        badgeRef.current.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`
      }
      if (Math.abs(point.x - point.targetX) + Math.abs(point.y - point.targetY) > 0.1) {
        point.frame = requestAnimationFrame(tick)
      } else {
        point.frame = 0
        point.last = 0
      }
    }
    if (!point.frame) point.frame = requestAnimationFrame(tick)
  }

  return (
    <article
      className={`door-bay ${active ? 'active' : ''} ${dimmed ? 'dimmed' : ''} ${opening ? 'is-opening' : ''}`}
      onMouseEnter={onEnter}
      onMouseLeave={() => {
        hideBadge()
        onLeave()
      }}
    >
      <button
        className="door-frame"
        disabled={busy}
        onClick={(event) => {
          hideBadge()
          onOpen(event.currentTarget)
        }}
        onPointerEnter={(event) => positionBadge(event, true)}
        onPointerMove={(event) => positionBadge(event)}
        onPointerLeave={hideBadge}
        onMouseLeave={hideBadge}
        onPointerCancel={hideBadge}
        onFocus={onEnter}
        onBlur={() => {
          hideBadge()
          onLeave()
        }}
        aria-label={`Open ${room.title} room`}
      >
        <span className="door-shadow" />
        <span className="door-light" />
        <DoorLeaf
          title={room.title}
          color={room.color}
          nameplateFontSize={10}
          panelFontWeight={room.key === 'ai' ? 600 : undefined}
        />
        <span
          ref={badgeRef}
          className={`enter-pill cursor-badge ${showBadge && !busy ? 'is-visible' : ''}`}
          aria-hidden="true"
        >
          Click to enter <ArrowIcon />
        </span>
      </button>
    </article>
  )
}

function ProjectVisual({ type }: { type: string }) {
  if (type === 'network')
    return (
      <div className="visual network-visual">
        {Array.from({ length: 10 }).map((_, i) => (
          <i key={i} style={{ '--i': i } as React.CSSProperties} />
        ))}
        <b>INPUT</b>
        <b>EMBED</b>
        <b>RETRIEVE</b>
      </div>
    )
  if (type === 'vision')
    return (
      <div className="visual vision-visual">
        <span className="scan-line" />
        <div className="target-box">
          PERSON <b>0.98</b>
        </div>
        <div className="target-box small">
          BIKE <b>0.91</b>
        </div>
        <small>LIVE / CAM 04</small>
      </div>
    )
  if (type === 'bars' || type === 'chart')
    return (
      <div className="visual bars-visual">
        {[52, 78, 46, 88, 66, 94, 73].map((h, i) => (
          <i key={i} style={{ height: `${h}%` }} />
        ))}
        <span>MODEL PERFORMANCE / 7 DAYS</span>
      </div>
    )
  if (type === 'terminal')
    return (
      <div className="visual terminal-visual">
        <span>relay / session.ts</span>
        <code>
          <b>const</b> room = <em>await</em> sync.join(id){'\n'}room.on(<i>'change'</i>, patch)
          {'\n'} {'{'} apply(patch) {'}'}
          {'\n'}
          <strong>✓ 12 peers connected</strong>
        </code>
      </div>
    )
  return (
    <div className="visual dashboard-visual">
      <nav />
      <aside />
      <main>
        <i />
        <i />
        <i />
        <div />
      </main>
    </div>
  )
}

function StudioMonitorMockup({
  project,
  isRightSide,
}: {
  project: Omit<ProjectItem, 'id' | 'room'>
  isRightSide: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const monitorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const monitor = monitorRef.current
    if (!container || !monitor) return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      monitor.style.transform = 'none'
      return
    }

    let rafId = 0
    let isIntersecting = false

    const easeOutCubic = (t: number) => {
      const t1 = 1 - t
      return 1 - t1 * t1 * t1
    }

    const update = () => {
      if (!container || !monitor) return
      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight || 800

      // Progress: 0 when card is entering at bottom of viewport, 1 when in focus area
      const start = windowHeight
      const end = Math.min(240, windowHeight * 0.32)
      const rawProgress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))
      const p = easeOutCubic(rawProgress)

      const baseRotY = isRightSide ? -16 : 16
      const rotY = baseRotY * (1 - p)
      const rotX = 4 * (1 - p)
      const scale = 0.95 + 0.05 * p

      monitor.style.transform = `rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) scale(${scale.toFixed(3)})`
    }

    const onScroll = () => {
      if (!isIntersecting) return
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting
        if (isIntersecting) {
          update()
        }
      },
      { rootMargin: '120px 0px 120px 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    )

    observer.observe(container)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [isRightSide])

  return (
    <div ref={containerRef} className="studio-monitor-wrap">
      <div ref={monitorRef} className="studio-monitor-housing">
        {/* Apple Studio Display Bezel & Screen */}
        <div className="studio-bezel">
          <span className="studio-webcam" aria-hidden="true" />
          <div className="studio-screen">
            <span className="studio-reflection" aria-hidden="true" />
            {project.coverUrl ? (
              <NextImage
                src={project.coverUrl}
                alt={project.coverAlt || project.title}
                width={1280}
                height={800}
                className="studio-screen-img"
              />
            ) : (
              <div className="studio-screen-visual">
                <ProjectVisual type={project.visual} />
              </div>
            )}
          </div>
        </div>

        {/* Leher Aluminium + Plat Kaki + Bayangan Kontak */}
        <div className="studio-stand" aria-hidden="true">
          <div className="studio-neck" />
          <div className="studio-foot" />
          <div className="studio-shadow" />
        </div>
      </div>
    </div>
  )
}

function StackingRoom({
  type,
  aiProjects,
  softwareProjects,
}: {
  type: 'ai' | 'software'
  aiProjects: Omit<ProjectItem, 'id' | 'room'>[]
  softwareProjects: Omit<ProjectItem, 'id' | 'room'>[]
}) {
  const projects = type === 'ai' ? aiProjects : softwareProjects
  return (
    <div className="room-content project-room">
      <header className="room-heading">
        <span className="eyebrow">
          {type === 'ai' ? '01 / MACHINE INTELLIGENCE' : '02 / SYSTEMS & PRODUCTS'}
        </span>
        <h1>
          {type === 'ai' ? (
            <>
              Models that <em>understand</em>
              <br />
              and ship cleanly.
            </>
          ) : (
            <>
              Software built for
              <br />
              <em>clarity and speed.</em>
            </>
          )}
        </h1>
        <p>Scroll down to stack each case study.</p>
      </header>
      <div className="stack">
        {projects.map((project, i) => {
          const isReversed = i % 2 === 1
          return (
            <article
              className={`project-card ${isReversed ? 'is-reversed' : ''}`}
              key={project.title}
              style={
                {
                  '--i': i,
                  zIndex: i + 1,
                } as React.CSSProperties
              }
            >
              <div className="project-copy">
                <span className="project-kicker-label">{project.kicker}</span>
                <h2 className="project-title">{project.title}</h2>
                {project.metric && (
                  <span className="project-tagline">{project.metric}</span>
                )}
                <p className="project-description">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="project-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="project-actions">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-action-btn live"
                    >
                      <span>Visit live site</span>
                      <span className="btn-circle-arrow" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          width="12"
                          height="12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M7 17L17 7M17 7H9M17 7V15" />
                        </svg>
                      </span>
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-action-btn outline"
                    >
                      <span>Source code ↗</span>
                    </a>
                  )}
                  {!project.liveUrl && !project.repoUrl && project.metric && (
                    <span className="project-metric-indicator">
                      <i className="metric-dot" /> {project.metric}
                    </span>
                  )}
                </div>
              </div>

              <StudioMonitorMockup project={project} isRightSide={!isReversed} />
            </article>
          )
        })}
      </div>
    </div>
  )
}

const gallery = [
  { cls: 'poster-a', label: 'ALGORITHM / 01', title: 'Think in systems.', meta: 'POSTER SERIES' },
  { cls: 'poster-b', label: 'KINETIC TYPE / 02', title: 'MOVE', meta: 'VISUAL IDENTITY' },
  { cls: 'poster-c', label: 'MESH / 03', title: 'Between signals', meta: 'EDITORIAL' },
  { cls: 'poster-d', label: 'COMMON / 04', title: 'Built together.', meta: 'BRAND SYSTEM' },
  { cls: 'poster-e', label: 'ORBIT / 05', title: 'New ideas need space', meta: 'CAMPAIGN' },
]

function splitDisplayTitle(title: string): [string, string] {
  const parts = title.trim().split(/\s+/)
  if (parts.length <= 1) return [title, '']
  const last = parts.pop()!
  return [parts.join(' '), last]
}

function DesignRoom({ designProjects = [] }: { designProjects?: ProjectItem[] }) {
  const posterClasses = ['poster-a', 'poster-b', 'poster-c', 'poster-d', 'poster-e']
  const rotations = [-2.2, 1.6, -1.3, 2.0, -1.6]

  const seriesList =
    designProjects.length > 0
      ? designProjects.map((project) => {
          const images =
            project.gallery && project.gallery.length > 0
              ? project.gallery
              : project.coverUrl
                ? [{ url: project.coverUrl, alt: project.coverAlt || project.title }]
                : []

          return {
            id: project.id,
            index: project.index,
            kicker: project.kicker,
            title: project.title,
            description: project.description,
            tags: project.tags,
            pieces:
              images.length > 0
                ? images.map((img, idx) => ({
                    key: `${project.id}-${idx}`,
                    cls: posterClasses[idx % posterClasses.length],
                    label: `${project.kicker} / 0${idx + 1}`,
                    title: project.title,
                    meta: img.caption || project.tags[0] || 'POSTER',
                    coverUrl: img.url,
                    coverAlt: img.alt,
                  }))
                : gallery.map((g, idx) => ({
                    key: `${project.id}-fallback-${idx}`,
                    ...g,
                    coverUrl: undefined,
                    coverAlt: g.title,
                  })),
          }
        })
      : [
          {
            id: 'default-design-series',
            index: '01',
            kicker: 'VISUAL STORYTELLING',
            title: 'Selected Posters',
            description: 'Identity, editorial, and interface work—hung out to air.',
            tags: ['Brand identity', 'Editorial layouts', 'Posters'],
            pieces: gallery.map((g, idx) => ({
              key: `default-${idx}`,
              ...g,
              coverUrl: undefined,
              coverAlt: g.title,
            })),
          },
        ]

  return (
    <div className="room-content design-room">
      {seriesList.map((series) => {
        const [leadTitle, italicTail] = splitDisplayTitle(series.title)
        return (
          <section className="design-series" key={series.id}>
            <div className="design-series-header">
              <div className="design-series-title-block">
                <span className="eyebrow">
                  {series.index} — {series.kicker}
                </span>
                <h2>
                  <strong>{leadTitle}</strong>
                  {italicTail && (
                    <>
                      {' '}
                      <em>{italicTail}</em>
                    </>
                  )}
                </h2>
              </div>

              <div className="design-series-meta">
                <p>{series.description}</p>
                {series.tags.length > 0 && (
                  <div className="design-series-tags">
                    {series.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="clothesline">
              <div
                className="line"
                style={{ width: `${Math.max(2200, series.pieces.length * 380)}px` }}
              />
              <div className="gallery-track">
                {series.pieces.map((item, i) => (
                  <article
                    className={`hanging-piece ${item.cls} ${item.coverUrl ? 'has-artwork' : ''}`}
                    key={item.key}
                    style={{ '--r': `${rotations[i % rotations.length]}deg` } as React.CSSProperties}
                  >
                    <i className="pin left" />
                    <i className="pin right" />
                    <div className="poster-art">
                      {item.coverUrl ? (
                        <NextImage
                          src={item.coverUrl}
                          alt={item.coverAlt}
                          width={800}
                          height={1060}
                          className="poster-artwork-img"
                        />
                      ) : (
                        <div className="poster-fallback-inner">
                          <small>{item.label}</small>
                          <strong>{item.title}</strong>
                          <span>{item.meta}</span>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="design-series-footer">
              <span>{series.title.toUpperCase()}</span>
            </div>
          </section>
        )
      })}
    </div>
  )
}

function SpeakingRoom({ talks }: { talks: Omit<TalkItem, 'id'>[] }) {
  const [activeYear, setActiveYear] = useState(talks[0]?.year || '2026')
  const [preview, setPreview] = useState({ show: false, x: 0, y: 0 })
  return (
    <div className="room-content speaking-room">
      <header className="room-heading">
        <span className="eyebrow">04 / IDEAS IN PUBLIC</span>
        <h1>
          Turning complex ideas
          <br />
          into <em>shared energy.</em>
        </h1>
        <p>Talks, workshops, and rooms designed for curiosity.</p>
      </header>
      <div className="timeline">
        <aside>
          <span>YEAR</span>
          <strong key={activeYear}>{activeYear}</strong>
          <p>Scroll through the archive</p>
        </aside>
        <div className="talk-list">
          {talks.map((talk) => (
            <article
              key={talk.number}
              onMouseEnter={() => {
                setActiveYear(talk.year)
                setPreview((p) => ({ ...p, show: true }))
              }}
              onMouseLeave={() => setPreview((p) => ({ ...p, show: false }))}
              onMouseMove={(e) => setPreview({ show: true, x: e.clientX, y: e.clientY })}
            >
              <span>{talk.number}</span>
              <div>
                <small>
                  {talk.type} / {talk.year}
                </small>
                <h2>{talk.title}</h2>
                <p>{talk.place}</p>
              </div>
              <ArrowIcon />
            </article>
          ))}
        </div>
      </div>
      <div
        className={`stage-preview ${preview.show ? 'show' : ''}`}
        style={{ left: preview.x, top: preview.y }}
      >
        <NextImage
          src="/stage-speaker.png"
          alt="Speaker presenting at a technology event"
          width={1536}
          height={1024}
          sizes="280px"
          loading="eager"
          unoptimized
        />
        <span>FROM THE ARCHIVE</span>
      </div>
    </div>
  )
}

function RoomView({
  room,
  aiProjects,
  softwareProjects,
  designProjects,
  talks,
  onBack,
}: {
  room: RoomKey
  aiProjects: Omit<ProjectItem, 'id' | 'room'>[]
  softwareProjects: Omit<ProjectItem, 'id' | 'room'>[]
  designProjects: ProjectItem[]
  talks: Omit<TalkItem, 'id'>[]
  onBack: () => void
}) {
  return (
    <div className="room-view">
      <button className="back-button" onClick={onBack}>
        <ArrowIcon direction="left" /> Back to the doors
      </button>
      {room === 'ai' && (
        <StackingRoom
          type="ai"
          aiProjects={aiProjects}
          softwareProjects={softwareProjects}
        />
      )}
      {room === 'software' && (
        <StackingRoom
          type="software"
          aiProjects={aiProjects}
          softwareProjects={softwareProjects}
        />
      )}
      {room === 'design' && <DesignRoom designProjects={designProjects} />}
      {room === 'speaking' && <SpeakingRoom talks={talks} />}
    </div>
  )
}

function Footer({
  onRoom,
  onHomeSection,
  onDoors,
}: {
  onRoom?: (room: RoomKey) => void
  onHomeSection?: (section: string) => void
  onDoors?: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const update = () => setNow(new Date())
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Jakarta'
  const time = now
    ? new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone,
      })
        .format(now)
        .toUpperCase()
    : '07:10 PM'

  const copyEmail = async () => {
    await navigator.clipboard?.writeText('hello@hanafi.dev')
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <footer id="contact" className="site-footer">
      {/* Top Section: Eyebrow + Dual Headline + Paragraph + Dual CTA */}
      <div className="footer-top">
        <span className="footer-eyebrow">
          <i className="status-dot" aria-hidden="true" />
          AVAILABLE FOR NEW WORK
        </span>
        <h2 className="footer-heading">
          <span className="footer-title-line-1">Need something built?</span>
          <span className="footer-title-line-2">Let's make it happen.</span>
        </h2>
        <p className="footer-lead">
          I'm available for AI/ML engineering, scalable web products, visual design systems, and
          speaking engagements. Tell me what you're building and let's ship something memorable.
        </p>
        <div className="footer-cta-row">
          <button
            onClick={copyEmail}
            className="footer-btn-primary"
            aria-label="Copy contact email"
          >
            <span>{copied ? 'Email copied!' : 'Hire me'}</span>
            <span className="btn-circle-arrow" aria-hidden="true">
              →
            </span>
          </button>
          <button
            onClick={() => {
              if (onDoors) onDoors()
              else document.getElementById('doors')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="footer-btn-secondary"
          >
            See my work
          </button>
        </div>
      </div>

      {/* Middle Section: 3-Column Grid */}
      <div className="footer-columns">
        <div className="footer-col">
          <h3 className="footer-col-title">WORK</h3>
          <ul className="footer-col-links">
            <li>
              <button onClick={() => onRoom?.('ai')}>ML / AI Engineer</button>
            </li>
            <li>
              <button onClick={() => onRoom?.('software')}>Web Developer</button>
            </li>
            <li>
              <button onClick={() => onRoom?.('design')}>Graphic Designer</button>
            </li>
            <li>
              <button onClick={() => onRoom?.('speaking')}>Keynote Speaker</button>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h3 className="footer-col-title">NAVIGATE</h3>
          <ul className="footer-col-links">
            <li>
              <button onClick={() => onHomeSection?.('top')}>Home</button>
            </li>
            <li>
              <button onClick={() => onHomeSection?.('story')}>My story</button>
            </li>
            <li>
              <button
                onClick={() =>
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Contact
              </button>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h3 className="footer-col-title">STATUS</h3>
          <ul className="footer-col-links footer-status-list">
            <li>
              <span className="status-badge">
                <i className="status-dot-pulse" aria-hidden="true" />
                Available for work
              </span>
            </li>
            <li>
              <span>Remote-first, worldwide</span>
            </li>
            <li>
              <span>Local time {time}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="footer-bottom-bar">
        <span className="footer-copyright">
          © 2026 Muhammad Irsyad Hanafi. Designed and built by Hanafi.
        </span>
        <span className="footer-credits">Privacy & credits</span>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="footer-back-to-top"
          aria-label="Back to top"
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  )
}

function Preloader({ progress, leaving }: { progress: number; leaving: boolean }) {
  return (
    <div className={`preloader ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <div className="loader-stack">
        {rooms.map((item, index) => (
          <i
            key={item.key}
            style={{ background: item.color, '--n': index } as React.CSSProperties}
          />
        ))}
        <b>LOADING FOLIO</b>
      </div>
      <strong>{String(progress).padStart(3, '0')}</strong>
    </div>
  )
}

export default function PortfolioApp({
  storyData,
  projects = [],
  talks = [],
}: {
  storyData: StoryData[]
  projects?: ProjectItem[]
  talks?: TalkItem[]
}) {
  const [dark, setDark] = useState(false)
  const [roleIndex, setRoleIndex] = useState(0)
  const [hoveredDoor, setHoveredDoor] = useState<RoomKey | null>(null)
  const [room, setRoom] = useState<RoomKey | null>(null)
  const [progress, setProgress] = useState(0)
  const [preloading, setPreloading] = useState(true)
  const [homeTarget, setHomeTarget] = useState<string | null>(null)
  const [opening, setOpening] = useState<{ key: RoomKey; origin: DoorOrigin } | null>(null)
  const openingLock = useRef(false)
  const doorsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (room || !homeTarget) return
    const frame = requestAnimationFrame(() => {
      document.getElementById(homeTarget)?.scrollIntoView({ behavior: 'smooth' })
      setHomeTarget(null)
    })
    return () => cancelAnimationFrame(frame)
  }, [room, homeTarget])

  useEffect(() => {
    const interval = window.setInterval(
      () => setRoleIndex((current) => (current + 1) % roles.length),
      2500,
    )
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const started = performance.now()
    const duration = 1450
    let frame = 0
    const tick = (now: number) => {
      const next = Math.min(100, Math.floor(((now - started) / duration) * 100))
      setProgress(next)
      if (next < 100) frame = requestAnimationFrame(tick)
      else window.setTimeout(() => setPreloading(false), 800)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  const openRoom = (key: RoomKey) => {
    if (openingLock.current) return
    setHomeTarget(null)
    setHoveredDoor(null)
    setRoom(key)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const goHome = (section: string) => {
    if (openingLock.current) return
    setRoom(null)
    setHoveredDoor(null)
    setHomeTarget(section)
  }

  const enterDoor = (key: RoomKey, button: HTMLButtonElement) => {
    if (openingLock.current) return
    openingLock.current = true
    const { left, top, width, height } = button.getBoundingClientRect()
    const panel = button.querySelector('.door-panel')
    const transform = panel ? getComputedStyle(panel).transform : 'none'
    const matrix = transform === 'none' ? null : new DOMMatrixReadOnly(transform)
    const angle = matrix ? (Math.atan2(-matrix.m13, matrix.m11) * 180) / Math.PI : 0
    const plate = button.querySelector('.nameplate')
    const nameplateFontSize = plate ? parseFloat(getComputedStyle(plate).fontSize) : undefined
    setOpening({
      key,
      origin: {
        left,
        top,
        width,
        height,
        angle,
        nameplateFontSize,
        panelFontWeight: key === 'ai' ? 600 : undefined,
      },
    })
  }

  const finishDoorEntry = () => {
    if (!opening) return
    openingLock.current = false
    openRoom(opening.key)
    setOpening(null)
  }

  const cmsAi = projects.filter((p) => p.room === 'ai')
  const cmsSoftware = projects.filter((p) => p.room === 'software')
  const cmsDesign = projects.filter((p) => p.room === 'design')

  const activeAiProjects = cmsAi.length > 0 ? cmsAi : aiProjects
  const activeSoftwareProjects = cmsSoftware.length > 0 ? cmsSoftware : softwareProjects
  const activeDesignProjects = cmsDesign
  const activeTalks = talks.length > 0 ? talks : defaultTalks

  return (
    <div className={dark ? 'app dark' : 'app'}>
      {preloading && <Preloader progress={progress} leaving={progress === 100} />}
      <div className="spotlight" />
      {room === null && <Lamp dark={dark} onToggle={() => setDark(!dark)} />}
      <TopNavigation
        room={room}
        onRoom={openRoom}
        onHomeSection={goHome}
        onContact={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
      />
      {room ? (
        <>
          <RoomView
            key={room}
            room={room}
            aiProjects={activeAiProjects}
            softwareProjects={activeSoftwareProjects}
            designProjects={activeDesignProjects}
            talks={activeTalks}
            onBack={() => goHome('doors')}
          />
          <Footer
            onRoom={openRoom}
            onHomeSection={goHome}
            onDoors={() => goHome('doors')}
          />
        </>
      ) : (
        <>
          <main id="top">
            <section className="hero">
              <div className="hero-copy">
                <span className="eyebrow">COMPUTER SCIENCE STUDENT / INDONESIA</span>
                <h1>
                  Hi, I'm <em>Hanafi.</em>
                </h1>
                <span className="hero-role-intro">I am a</span>
                <FlipNotebook
                  roleIndex={roleIndex}
                  onFlip={() => setRoleIndex((roleIndex + 1) % roles.length)}
                />
                <div className="hero-cta-row">
                  <button
                    className="hero-hire-btn"
                    onClick={() =>
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                    }
                  >
                    <span>Hire me</span>
                    <span className="btn-arrow-circle" aria-hidden="true">
                      →
                    </span>
                  </button>
                  <button
                    className="hero-work-link"
                    onClick={() => doorsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    See my work
                  </button>
                </div>
                <p>
                  Computer Science student bridging intelligent systems, scalable code, visual
                  craft, and community stages.
                </p>
              </div>
              <BrushPortrait />
              <div className="hero-meta">
                <span>
                  <i /> AVAILABLE FOR INTERN, WORK
                </span>
                <span>INDONESIA</span>
                <button onClick={() => doorsRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                  SCROLL TO EXPLORE <b>↓</b>
                </button>
              </div>
            </section>

            <section className="doors-section" id="doors" ref={doorsRef}>
              <div className="section-heading">
                <h2 className="doors-heading">
                  <em>Magic</em> happens
                  <br />
                  <em>behind</em> the doors.
                </h2>
              </div>
              <div
                className={`doors ${hoveredDoor ? 'has-hover' : ''}`}
                onMouseLeave={() => setHoveredDoor(null)}
              >
                {rooms.map((item) => (
                  <Door
                    key={item.key}
                    room={item}
                    active={hoveredDoor === item.key}
                    dimmed={hoveredDoor !== null && hoveredDoor !== item.key}
                    onEnter={() => setHoveredDoor(item.key)}
                    onLeave={() => setHoveredDoor(null)}
                    onOpen={(button) => enterDoor(item.key, button)}
                    opening={opening?.key === item.key}
                    busy={opening !== null}
                  />
                ))}
                {hoveredDoor && (
                  <div
                    key={hoveredDoor}
                    data-room={hoveredDoor}
                    className={`door-detail-panel side-${rooms.findIndex((item) => item.key === hoveredDoor) < 2 ? 'right' : 'left'}`}
                    style={
                      {
                        '--door-index': rooms.findIndex((item) => item.key === hoveredDoor),
                      } as React.CSSProperties
                    }
                  >
                    <h3>{rooms.find((item) => item.key === hoveredDoor)?.heading}</h3>
                    <span>{rooms.find((item) => item.key === hoveredDoor)?.subtitle}</span>
                    <ul>
                      {rooms
                        .find((item) => item.key === hoveredDoor)
                        ?.skills.map((skill, index) => (
                          <li
                            key={skill}
                            style={{ '--skill-index': index } as React.CSSProperties}
                          >
                            <i>✓</i>
                            {skill}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            <MyStory storyData={storyData} />
          </main>
          <Footer
            onRoom={openRoom}
            onHomeSection={goHome}
            onDoors={() => doorsRef.current?.scrollIntoView({ behavior: 'smooth' })}
          />
        </>
      )}
      {opening && (
        <DoorTransition
          origin={opening.origin}
          title={rooms.find((item) => item.key === opening.key)!.title}
          color={rooms.find((item) => item.key === opening.key)!.color}
          onEntered={finishDoorEntry}
        />
      )}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="floating-back-to-top"
        aria-label="Back to top"
        title="Back to top"
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </div>
  )
}