import { useEffect, useState } from 'react'

type Room = 'ai' | 'software' | 'design' | 'speaking'

export function TopNavigation({
  room,
  onRoom,
  onHomeSection,
  onContact,
}: {
  room: Room | null
  onRoom: (room: Room) => void
  onHomeSection: (section: string) => void
  onContact: () => void
}) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const update = () => setNow(new Date())
    update()
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') update()
    }
    const timer = window.setInterval(update, 1000)
    window.addEventListener('focus', update)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', update)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
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
  const date = now
    ? `${new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', timeZone }).format(now)}, ${new Intl.DateTimeFormat('en-GB', { year: 'numeric', timeZone }).format(now)}`
    : '21 November, 2026'

  return (
    <nav className="topbar shared-topbar" aria-label="Main navigation">
      <div className="nav-links">
        <button onClick={() => onHomeSection('top')} className="nav-item">
          Home
        </button>
        <button
          onClick={() => onRoom('ai')}
          className="nav-item"
          aria-current={room === 'ai' ? 'page' : undefined}
        >
          ML / AI Engineer
        </button>
        <button
          onClick={() => onRoom('software')}
          className="nav-item"
          aria-current={room === 'software' ? 'page' : undefined}
        >
          Web Developer
        </button>
        <button
          onClick={() => onRoom('design')}
          className="nav-item"
          aria-current={room === 'design' ? 'page' : undefined}
        >
          Graphic Designer
        </button>
        <button
          onClick={() => onRoom('speaking')}
          className="nav-item"
          aria-current={room === 'speaking' ? 'page' : undefined}
        >
          Keynote Speaker
        </button>
        <button onClick={() => onHomeSection('story')} className="nav-item">
          My Story
        </button>
        <button onClick={onContact} className="nav-item">
          Contact
        </button>
      </div>
      <div className="local-clock">
        <span className="clock-v-divider" aria-hidden="true" />
        <span className="clock-label">Local time</span>
        <span className="clock-pill">
          <time dateTime={now?.toISOString()}>{time}</time>
        </span>
        <span className="clock-date">{date}</span>
      </div>
    </nav>
  )
}
