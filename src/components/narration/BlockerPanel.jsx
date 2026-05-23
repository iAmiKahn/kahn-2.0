import { AlertTriangle } from 'lucide-react'

export default function BlockerPanel({ blockers }) {
  if (blockers.length === 0) return null

  return (
    <div className="blocker-panel">
      <div className="section-label">ACTIVE BLOCKERS</div>
      <div className="blocker-list">
        {blockers.map(b => (
          <div key={b.id} className={`blocker-item ${b.severity}`}>
            <AlertTriangle size={16} />
            <div className="blocker-content">
              <div className="blocker-title">{b.title}</div>
              <div className="blocker-domain">{b.domainName}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
