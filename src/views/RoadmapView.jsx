import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, CheckCircle, Circle, Lock, Target } from 'lucide-react'
import { getRoadmap, getGoal, getAllDomains } from '../engine/narrationStore.js'

export default function RoadmapView() {
  const [roadmap, setRoadmap] = useState(null)
  const [goal, setGoal] = useState(null)
  const [domains, setDomains] = useState([])
  const [expandedPhase, setExpandedPhase] = useState(null)

  useEffect(() => {
    Promise.all([getRoadmap(), getGoal(), getAllDomains()])
      .then(([r, g, d]) => {
        setRoadmap(r)
        setGoal(g)
        setDomains(d)
        const active = r.phases?.find(p => p.status === 'active')
        if (active) setExpandedPhase(active.id)
      })
  }, [])

  if (!roadmap) return <div className="narration-loading">Loading roadmap...</div>

  function getObjectiveById(id) {
    for (const d of domains) {
      const obj = d.objectives?.find(o => o.id === id)
      if (obj) return { ...obj, domainName: d.name }
    }
    return null
  }

  const STATUS_ICON = {
    completed: <CheckCircle size={16} className="text-green" />,
    in_progress: <Circle size={16} className="text-accent" />,
    not_started: <Circle size={16} className="text-muted" />,
    blocked: <Circle size={16} className="text-red" />
  }

  return (
    <div className="roadmap-view">
      <div className="narration-scroll">
        {/* Goal Banner */}
        {goal?.title && (
          <div className="roadmap-goal">
            <Target size={20} />
            <div>
              <div className="roadmap-goal-title">{goal.title}</div>
              <div className="roadmap-goal-summary">{goal.summary}</div>
            </div>
          </div>
        )}

        {/* Phase Timeline */}
        <div className="roadmap-phases">
          {roadmap.phases?.map((phase, idx) => {
            const isExpanded = expandedPhase === phase.id
            const isActive = phase.status === 'active'
            const isLocked = phase.status === 'locked'
            const objectives = (phase.objectiveIds || []).map(getObjectiveById).filter(Boolean)
            const completedCount = objectives.filter(o => o.status === 'completed').length

            return (
              <div key={phase.id} className={`roadmap-phase${isActive ? ' active' : ''}${isLocked ? ' locked' : ''}`}>
                <div
                  className="roadmap-phase-header"
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                >
                  <div className="roadmap-phase-indicator">
                    <div className={`roadmap-phase-dot ${phase.status}`} />
                    {idx < roadmap.phases.length - 1 && <div className="roadmap-phase-line" />}
                  </div>
                  <div className="roadmap-phase-info">
                    <div className="roadmap-phase-name">
                      {isLocked && <Lock size={14} />}
                      {phase.name}
                    </div>
                    <div className="roadmap-phase-dates">
                      {phase.startDate} &mdash; {phase.targetEndDate || 'Ongoing'}
                    </div>
                    {objectives.length > 0 && (
                      <div className="roadmap-phase-progress">
                        {completedCount}/{objectives.length} objectives
                      </div>
                    )}
                  </div>
                  <div className="roadmap-phase-expand">
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="roadmap-phase-body">
                    <div className="roadmap-phase-desc">{phase.description}</div>

                    {objectives.length > 0 && (
                      <div className="roadmap-objectives">
                        {objectives.map(obj => (
                          <div key={obj.id} className={`roadmap-objective ${obj.status}`}>
                            {STATUS_ICON[obj.status] || STATUS_ICON.not_started}
                            <div className="roadmap-objective-info">
                              <div className="roadmap-objective-title">{obj.title}</div>
                              <div className="roadmap-objective-domain">{obj.domainName}{obj.deadline ? ` \u00b7 Due ${obj.deadline}` : ''}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {phase.exitCriteria?.length > 0 && (
                      <div className="roadmap-exit-criteria">
                        <div className="roadmap-exit-label">Exit Criteria</div>
                        {phase.exitCriteria.map((c, i) => (
                          <div key={i} className="roadmap-exit-item">{c}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
