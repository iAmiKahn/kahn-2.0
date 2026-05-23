const STATUS_COLORS = {
  critical: 'var(--red)',
  urgent: 'var(--orange)',
  active: 'var(--accent)',
  stable: 'var(--green)',
  dormant: 'var(--text-muted)'
}

const STATUS_LABELS = {
  critical: 'CRITICAL',
  urgent: 'URGENT',
  active: 'ACTIVE',
  stable: 'STABLE',
  dormant: 'DORMANT'
}

export default function DomainStatusBar({ domainStatuses, onDomainClick }) {
  return (
    <div className="domain-status-bar">
      {domainStatuses.map(ds => (
        <div
          key={ds.id}
          className="domain-status-pill"
          onClick={() => onDomainClick?.(ds.id)}
          style={{ '--status-color': STATUS_COLORS[ds.status] }}
        >
          <span className="domain-status-dot" />
          <span className="domain-status-name">{ds.name}</span>
          <span className="domain-status-label">{STATUS_LABELS[ds.status]}</span>
        </div>
      ))}
    </div>
  )
}
