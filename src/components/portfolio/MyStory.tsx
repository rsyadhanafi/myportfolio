import { useEffect, useRef, useState } from 'react'
import { storyGlow, type StoryData } from '@/data/storyData'
import { YearOdometer } from './YearOdometer'

const coordinate = (value: number) => Number(value.toFixed(4))

const defaultMilestones: StoryData[] = [
  {
    id: 1,
    year: '2026',
    range: 'JAN 2026 — PRESENT',
    start: '2026-01-01',
    title: 'Lead AI & Fullstack Developer',
    organization: 'Tech Innovation Lab & Open Source',
    points: [
      'Spearheading multimodal intelligence architectures, LLM fine-tuning, and low-latency inference pipelines.',
      'Architecting end-to-end fullstack systems using Next.js, Payload CMS, and distributed edge infrastructure.',
      'Delivering scalable production applications with high-fidelity interaction design and micro-animations.',
    ],
  },
  {
    id: 2,
    year: '2025',
    range: 'OCT 2025 — DEC 2025',
    start: '2025-10-01',
    title: 'Machine Learning Engineer Intern',
    organization: 'Autonomous Systems & Vision Lab',
    points: [
      'Trained and optimized compact edge vision models (YOLOv8/ONNX) achieving 24ms real-time inference on low-power devices.',
      'Designed automated data validation and model evaluation harnesses to benchmark hallucination and drift.',
      'Collaborated with cross-functional teams to integrate model endpoints into customer-facing mobile apps.',
    ],
  },
  {
    id: 3,
    year: '2025',
    range: 'JUL 2025 — SEP 2025',
    start: '2025-07-01',
    title: 'Front-End Engineer & UI Designer',
    organization: 'Campus Digital Ecosystem',
    points: [
      'Built responsive web applications serving 1,800+ active university students with real-time websocket updates.',
      'Formulated modular design system and accessible component library following WCAG standards.',
      'Reduced load times and cumulative layout shifts by 42% through image optimization and bundle splitting.',
    ],
  },
  {
    id: 4,
    year: '2024',
    range: 'FEB 2024 — JUN 2025',
    start: '2024-02-01',
    title: 'Keynote Speaker & Community Lead',
    organization: 'Student Tech Association',
    points: [
      'Delivered 5+ keynotes and technical workshops on machine learning fundamentals and modern web architecture.',
      'Mentored 120+ aspiring student developers through hands-on hackathons and project clinics.',
      'Organized national campus seminars bridging industry leaders with student innovators.',
    ],
  },
  {
    id: 5,
    year: '2022',
    range: 'AUG 2022 — JAN 2024',
    start: '2022-08-01',
    title: 'Computer Science Undergraduate',
    organization: 'University Academic Excellence',
    points: [
      'Focused on data structures, algorithms, machine learning theory, and database management systems.',
      'Authored research papers on multimodal retrieval augmented generation and edge computing.',
      'Maintained Dean\'s Honor List recognition across consecutive semesters.',
    ],
  },
]

export function MyStory({ storyData }: { storyData: StoryData[] }) {
  const effectiveStoryData = storyData && storyData.length > 0 ? storyData : defaultMilestones
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<Array<HTMLLIElement | null>>([])
  const count = effectiveStoryData.length
  const currentIndex = Math.min(activeIndex, Math.max(0, count - 1))
  const active = effectiveStoryData[currentIndex]
  const total = String(count).padStart(2, '0')
  const current = String(currentIndex + 1).padStart(2, '0')

  useEffect(() => {
    let frame = 0
    let disposed = false
    const mobile = window.matchMedia('(max-width: 760px)')
    const measure = () => {
      frame = 0
      const section = sectionRef.current
      const left = leftRef.current
      const list = listRef.current
      const items = itemsRef.current.slice(0, count)
      if (!section || !left || !list || !items.length) return
      const visibility = Math.max(
        0,
        Math.min(1, 1 + (section.getBoundingClientRect().bottom - window.innerHeight) / 140),
      )
      left.style.setProperty('--story-visibility', String(visibility))
      const activationLine = mobile.matches
        ? Math.min(
            window.innerHeight - 48,
            Math.max(window.innerHeight * 0.45, left.getBoundingClientRect().bottom + 28),
          )
        : window.innerHeight * 0.45
      const first = (items[0]?.getBoundingClientRect().top ?? 0) + 16
      const last = (items.at(-1)?.getBoundingClientRect().top ?? first) + 16
      const distance = Math.max(0, last - first)
      const progress = distance
        ? Math.max(0, Math.min(1, (activationLine - first) / distance))
        : Number(activationLine >= first)
      let next = 0
      items.forEach((item, index) => {
        if (item && item.getBoundingClientRect().top + 16 <= activationLine) next = index
      })
      setActiveIndex((previous) => (previous === next ? previous : next))
      left.style.setProperty('--story-compass-angle', `${progress * 150}deg`)
      if (trackRef.current) trackRef.current.style.height = `${distance}px`
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${progress})`
    }
    const schedule = () => {
      if (document.visibilityState === 'hidden') {
        cancelAnimationFrame(frame)
        measure()
      } else if (!frame) frame = requestAnimationFrame(measure)
    }
    const observer = new ResizeObserver(schedule)
    if (listRef.current) observer.observe(listRef.current)
    if (leftRef.current) observer.observe(leftRef.current)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    document.addEventListener('visibilitychange', schedule)
    schedule()
    void document.fonts.ready.then(() => {
      if (!disposed) schedule()
    })
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      document.removeEventListener('visibilitychange', schedule)
    }
  }, [count])

  return (
    <section
      ref={sectionRef}
      id="story"
      className="my-story relative isolate overflow-clip bg-[var(--paper)] px-[5vw] pb-28 pt-24 md:pt-32 [scroll-margin-top:70px] max-[760px]:pb-20 max-[760px]:pt-16"
      aria-labelledby="story-heading"
    >
      <div className="story-layout relative mx-auto grid max-w-[1320px] grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] items-start gap-[clamp(48px,6vw,100px)] max-[760px]:block">
        {/* Kolom Kiri: Sticky Header & Year Odometer */}
        <div
          ref={leftRef}
          className="story-left sticky top-28 isolate h-fit self-start opacity-[var(--story-visibility,1)] max-[760px]:top-[60px] max-[760px]:z-10 max-[760px]:grid max-[760px]:grid-cols-[minmax(0,1fr)_minmax(110px,auto)] max-[760px]:gap-x-4 max-[760px]:border-b max-[760px]:border-[var(--line)] max-[760px]:bg-[color-mix(in_srgb,var(--paper)_94%,transparent)] max-[760px]:py-4 max-[760px]:backdrop-blur-xl max-[420px]:block"
        >
          {/* Ambient Glow */}
          <div
            className="story-ambient pointer-events-none absolute -left-28 -top-12 -z-20 h-[680px] w-[680px] rounded-full blur-[120px] transition-colors duration-[1100ms] motion-reduce:transition-none max-[760px]:-left-12 max-[760px]:h-[380px] max-[760px]:w-[380px] max-[760px]:blur-[80px]"
            style={{ backgroundColor: storyGlow(active?.year ?? '') }}
            aria-hidden="true"
          />

          <div className="max-[760px]:col-span-2">
            {/* Eyebrow Status */}
            <span className="flex items-center gap-2 text-[12px] font-medium tracking-[.02em] text-[var(--ink)]">
              <i
                className="h-[6px] w-[6px] rounded-full bg-[#508b5b]"
                aria-hidden="true"
              />
              My story
            </span>
            {/* Heading */}
            <h2
              id="story-heading"
              className="mt-4 text-[clamp(28px,3vw,38px)] font-semibold leading-[1.1] tracking-[-.04em] text-[var(--ink)] whitespace-nowrap max-[900px]:whitespace-normal"
            >
              Let's go back in time.
            </h2>
          </div>

          {/* SVG Compass + Giant Year Odometer */}
          <div className="story-clock relative mt-3 mb-4 h-auto py-1 flex w-fit min-w-0 items-center">
            <svg
              className="pointer-events-none absolute -left-12 top-1/2 -z-10 w-[580px] max-w-none -translate-y-1/2 fill-none stroke-current opacity-[.11] max-[760px]:w-[320px] max-[760px]:-left-6"
              viewBox="0 0 480 480"
              strokeWidth=".8"
              aria-hidden="true"
            >
              <circle cx="240" cy="240" r="204" />
              <g className="story-compass-dial [transform-origin:240px_240px] [transform:rotate(var(--story-compass-angle,0deg))]">
                <circle cx="240" cy="240" r="184" />
                <circle cx="240" cy="240" r="140" strokeDasharray="1 8" />
                {Array.from({ length: 72 }, (_, i) => {
                  const angle = (i * Math.PI) / 36
                  const inner = i % 6 === 0 ? 163 : 176
                  return (
                    <line
                      key={i}
                      x1={coordinate(240 + Math.sin(angle) * inner)}
                      y1={coordinate(240 - Math.cos(angle) * inner)}
                      x2={coordinate(240 + Math.sin(angle) * 184)}
                      y2={coordinate(240 - Math.cos(angle) * 184)}
                    />
                  )
                })}
                <path d="M240 94v292M94 240h292" opacity=".65" />
                <path d="m240 106-8 22h16zM240 374l-8-22h16z" />
              </g>
            </svg>
            {active ? (
              <YearOdometer year={active.year} />
            ) : (
              <span className="text-[84px] font-semibold tracking-[-.06em]">—</span>
            )}
          </div>

          {/* Date Range & Step Counter dengan Garis Horizontal */}
          <div className="story-counter-meta mt-3 max-[760px]:self-end max-[760px]:pb-5 max-[420px]:flex max-[420px]:items-center max-[420px]:justify-between max-[420px]:gap-4 max-[420px]:pb-0">
            <p className="mb-2.5 font-mono text-[10px] font-medium uppercase tracking-[.08em] text-[var(--muted)]">
              {active?.range ?? 'OCT 2026 — NOW'}
            </p>
            <div
              className="flex items-center gap-3.5 font-mono text-[11px] tracking-[.08em]"
              aria-label={`Milestone ${currentIndex + 1} of ${count}`}
            >
              <svg
                className="h-[18px] w-[18px] animate-[spin_20s_linear_infinite] fill-none stroke-current opacity-70"
                viewBox="0 0 28 28"
                aria-hidden="true"
              >
                <circle cx="14" cy="14" r="10" strokeDasharray="3 3" opacity=".35" />
                <path d="M14 4a10 10 0 0 1 10 10M21 10l3 4 2-4" strokeWidth="1.6" />
              </svg>
              <span>
                <strong className="font-semibold text-[var(--ink)]">{current}</strong>
                <span className="text-[var(--muted)]"> / {total}</span>
              </span>
              <span className="h-px w-[100px] bg-[var(--line)] max-[760px]:w-[50px]" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Vertical Interactive Timeline */}
        <div className="relative min-w-0 pt-1 max-[760px]:mt-6">
          {/* Garis Vertikal Latar & Garis Isi Dinamis */}
          <div
            ref={trackRef}
            className="pointer-events-none absolute left-0 top-4 w-px bg-[var(--line)]"
            aria-hidden="true"
          >
            <div
              ref={fillRef}
              className="absolute inset-0 origin-top bg-[var(--ink)] [transform:scaleY(0)] will-change-transform"
            />
          </div>

          <ol ref={listRef} className="min-w-0">
            {effectiveStoryData.map((milestone, index) => {
              const isCurrent = index === currentIndex
              return (
                <li
                  key={milestone.id}
                  ref={(element) => {
                    itemsRef.current[index] = element
                  }}
                  data-story-index={index}
                  className={`relative min-h-[300px] pb-[68px] pl-10 pt-2.5 last:min-h-[240px] max-[760px]:pl-7 transition-opacity duration-300 ${
                    isCurrent ? 'opacity-100' : 'opacity-[0.42] hover:opacity-75'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {/* Node Bulat pada Garis Vertikal */}
                  {isCurrent ? (
                    <span
                      className="absolute -left-[9.5px] top-[14px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[color-mix(in_srgb,#508b5b_18%,transparent)] dark:bg-[color-mix(in_srgb,#508b5b_28%,transparent)] transition-all duration-300"
                      aria-hidden="true"
                    >
                      <span className="h-[8px] w-[8px] rounded-full bg-[#141413] dark:bg-[#508b5b] shadow-sm" />
                    </span>
                  ) : (
                    <span
                      className="absolute -left-[2.5px] top-[21px] h-[6px] w-[6px] rounded-full bg-[#d8d4cc] dark:bg-[#38383a] transition-all duration-300"
                      aria-hidden="true"
                    />
                  )}

                  {/* Header Item */}
                  <time
                    dateTime={milestone.start}
                    className="font-mono text-[10px] font-medium uppercase tracking-[.08em] text-[var(--muted)]"
                  >
                    {milestone.range}
                  </time>
                  <h3
                    className="mb-1 mt-2 text-[clamp(24px,2.4vw,28px)] font-semibold leading-[1.25] tracking-[-.02em] text-[var(--ink)]"
                  >
                    {milestone.title}
                  </h3>
                  <p className="text-[13px] font-normal text-[var(--muted)]">{milestone.organization}</p>

                  {/* Experience Highlights */}
                  <ul className="mt-4 grid max-w-[540px] gap-2">
                    {milestone.points.map((point, pointIndex) => (
                      <li
                        key={pointIndex}
                        className="relative pl-4 text-[13px] leading-[1.65] text-[#4a4a48] dark:text-[#b8b5ae] before:absolute before:left-0 before:top-[9px] before:h-px before:w-2 before:bg-current"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
