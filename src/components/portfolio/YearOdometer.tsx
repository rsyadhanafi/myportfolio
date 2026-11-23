export function YearOdometer({ year }: { year: string }) {
  return (
    <span
      className="story-year inline-flex text-[clamp(84px,9.5vw,124px)] font-bold leading-[0.95] tracking-[-0.05em] tabular-nums"
      role="img"
      aria-label={year}
    >
      {year
        .padStart(4, '0')
        .split('')
        .map((digit, index) => (
          <span
            key={index}
            className="relative block h-[1em] w-[0.59em] overflow-hidden"
            aria-hidden="true"
          >
            <span
              className="block transition-transform duration-700 ease-[cubic-bezier(.22,.75,.18,1)] will-change-transform motion-reduce:transition-none"
              style={{ transform: `translate3d(0, -${Number(digit)}em, 0)` }}
            >
              {Array.from({ length: 10 }, (_, number) => (
                <span key={number} className="block h-[1em] text-center leading-none">
                  {number}
                </span>
              ))}
            </span>
          </span>
        ))}
    </span>
  )
}
