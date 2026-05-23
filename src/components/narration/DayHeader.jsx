import { Calendar, Flame } from 'lucide-react'

export default function DayHeader({ date, dayNumber, phase, headline }) {
  const formatted = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <div className="day-header">
      <div className="day-header-top">
        <div className="day-header-date">
          <Calendar size={16} />
          <span>{formatted}</span>
        </div>
        <div className="day-header-meta">
          <span className="day-number">Day {dayNumber}</span>
          <span className="day-phase">{phase}</span>
        </div>
      </div>
      <div className="day-header-headline">{headline}</div>
    </div>
  )
}
