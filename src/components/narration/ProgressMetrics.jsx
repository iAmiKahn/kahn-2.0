import { TrendingUp } from 'lucide-react'

export default function ProgressMetrics({ progress, todayActions, completedActions }) {
  const todayCompleted = todayActions.filter(a => completedActions.includes(a.id)).length
  const todayTotal = todayActions.length
  const todayPercent = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0

  return (
    <div className="progress-metrics">
      <div className="progress-card">
        <div className="progress-card-label">Today</div>
        <div className="progress-card-value">
          <span className="progress-big">{todayCompleted}</span>
          <span className="progress-sep">/</span>
          <span className="progress-total">{todayTotal}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${todayPercent}%` }} />
        </div>
      </div>
      <div className="progress-card">
        <div className="progress-card-label">{progress.phase || 'Phase'}</div>
        <div className="progress-card-value">
          <span className="progress-big">{progress.completed}</span>
          <span className="progress-sep">/</span>
          <span className="progress-total">{progress.total} obj</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progress.percent}%` }} />
        </div>
      </div>
    </div>
  )
}
