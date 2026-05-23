import { AlertCircle } from 'lucide-react'

export default function DeadlineTracker({ deadlines }) {
  if (deadlines.length === 0) return null

  return (
    <div className="deadline-tracker">
      <div className="section-label">UPCOMING DEADLINES</div>
      <div className="deadline-list">
        {deadlines.map(dl => (
          <div
            key={dl.id}
            className={`deadline-item${dl.daysUntil <= 3 ? ' urgent' : dl.daysUntil <= 7 ? ' soon' : ''}`}
          >
            <div className="deadline-days">
              {dl.daysUntil === 0 ? (
                <span className="deadline-today">TODAY</span>
              ) : (
                <><span className="deadline-number">{dl.daysUntil}</span><span className="deadline-unit">d</span></>
              )}
            </div>
            <div className="deadline-info">
              <div className="deadline-title">{dl.title}</div>
              <div className="deadline-domain">{dl.domainName} &middot; {dl.deadline}</div>
            </div>
            {dl.daysUntil <= 3 && <AlertCircle size={16} className="deadline-alert" />}
          </div>
        ))}
      </div>
    </div>
  )
}
