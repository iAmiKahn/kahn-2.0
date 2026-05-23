import { useState, useEffect } from 'react'
import { CheckCircle, Circle, AlertTriangle, ArrowRight, TrendingUp, Clock, Link, GitBranch } from 'lucide-react'
import { getDomain, saveDomain, getAllDomains } from '../engine/narrationStore.js'

export default function DomainView({ domainId }) {
  const [domain, setDomain] = useState(null)
  const [allDomains, setAllDomains] = useState([])

  useEffect(() => {
    Promise.all([getDomain(domainId), getAllDomains()])
      .then(([d, all]) => { setDomain(d); setAllDomains(all) })
  }, [domainId])

  if (!domain) return <div className="narration-loading">Loading domain...</div>

  const STATUS_COLORS = {
    critical: 'var(--red)', urgent: 'var(--orange)',
    active: 'var(--accent)', stable: 'var(--green)', dormant: 'var(--text-muted)'
  }

  // Resolve dependency names across all domains
  function resolveDep(depId) {
    for (const d of allDomains) {
      const obj = d.objectives?.find(o => o.id === depId)
      if (obj) return { title: obj.title, domain: d.name, status: obj.status }
    }
    return { title: depId, domain: '?', status: 'unknown' }
  }

  async function toggleObjectiveStatus(objId) {
    const updated = { ...domain }
    const obj = updated.objectives.find(o => o.id === objId)
    if (!obj) return
    obj.status = obj.status === 'completed' ? 'in_progress' : 'completed'
    await saveDomain(updated)
    setDomain({ ...updated })
  }

  return (
    <div className="domain-view">
      <div className="narration-scroll">
        {/* Header */}
        <div className="domain-header">
          <div className="domain-header-top">
            <h2 className="domain-title">{domain.name}</h2>
            <span className="domain-status-badge" style={{ '--badge-color': STATUS_COLORS[domain.status] }}>
              {domain.status.toUpperCase()}
            </span>
          </div>
          <p className="domain-current-state">{domain.currentState}</p>
        </div>

        {/* Blockers */}
        {domain.blockers?.length > 0 && (
          <div className="domain-section">
            <div className="section-label">BLOCKERS</div>
            {domain.blockers.map(b => (
              <div key={b.id} className={`blocker-item ${b.severity}`}>
                <AlertTriangle size={16} />
                <span>{b.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Metrics */}
        {domain.metrics?.length > 0 && (
          <div className="domain-section">
            <div className="section-label"><TrendingUp size={14} /> METRICS</div>
            <div className="domain-metrics">
              {domain.metrics.map(m => {
                const pct = m.target && m.target > 0 ? Math.min(100, Math.round((m.current / m.target) * 100)) : null
                return (
                  <div key={m.id} className="domain-metric">
                    <div className="domain-metric-name">{m.name}</div>
                    <div className="domain-metric-value">
                      {m.current ?? '—'}
                      {m.target != null && <span className="domain-metric-target"> / {m.target}</span>}
                      {m.unit && m.unit !== 'boolean' && m.unit !== 'count' && (
                        <span className="domain-metric-unit"> {m.unit}</span>
                      )}
                    </div>
                    {pct !== null && (
                      <div className="progress-bar" style={{ marginTop: 6 }}>
                        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--green)' : 'var(--accent)' }} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Objectives */}
        <div className="domain-section">
          <div className="section-label">OBJECTIVES</div>
          {(domain.objectives || []).map(obj => {
            const deps = (obj.dependencies || []).map(resolveDep)
            return (
              <div key={obj.id} className={`domain-objective ${obj.status}`}>
                <div className="domain-objective-header" onClick={() => toggleObjectiveStatus(obj.id)}>
                  <div className="domain-objective-status">
                    {obj.status === 'completed' ? <CheckCircle size={18} /> : <Circle size={18} />}
                  </div>
                  <div className="domain-objective-info">
                    <div className="domain-objective-title">{obj.title}</div>
                    <div className="domain-objective-meta">
                      Priority {obj.priority}
                      {obj.deadline && <> &middot; <Clock size={12} /> Due {obj.deadline}</>}
                    </div>
                  </div>
                </div>
                {obj.description && <div className="domain-objective-desc">{obj.description}</div>}

                {/* Dependencies */}
                {deps.length > 0 && (
                  <div className="domain-deps">
                    <div className="domain-deps-label"><GitBranch size={12} /> Dependencies</div>
                    {deps.map((dep, i) => (
                      <div key={i} className={`domain-dep ${dep.status}`}>
                        {dep.status === 'completed' ? <CheckCircle size={12} /> : <Circle size={12} />}
                        <span>{dep.title}</span>
                        <span className="domain-dep-from">{dep.domain}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {obj.actions?.length > 0 && (
                  <div className="domain-objective-actions">
                    {obj.actions.map(act => (
                      <div key={act.id} className={`domain-action ${act.status}`}>
                        {act.status === 'completed' ? <CheckCircle size={14} /> : <Circle size={14} />}
                        <span>{act.title}</span>
                        {act.dueDate && <span className="domain-action-date">{act.dueDate}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Recurring */}
        {domain.recurring?.length > 0 && (
          <div className="domain-section">
            <div className="section-label">RECURRING</div>
            {domain.recurring.map(rec => (
              <div key={rec.id} className="domain-recurring">
                <Clock size={14} />
                <span>{rec.title}</span>
                <span className="domain-recurring-schedule">
                  {rec.schedule.days?.join(', ')} &middot; {rec.schedule.time}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
