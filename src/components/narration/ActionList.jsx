import { CheckSquare, Square, Clock, AlertTriangle, ArrowRight } from 'lucide-react'

export default function ActionList({ actions, completedActions, onToggleAction }) {
  // Group actions by domain
  const grouped = {}
  actions.forEach(a => {
    if (!grouped[a.domainId]) {
      grouped[a.domainId] = { name: a.domainName, actions: [] }
    }
    grouped[a.domainId].actions.push(a)
  })

  if (actions.length === 0) {
    return (
      <div className="action-list-empty">
        No actions scheduled for today.
      </div>
    )
  }

  return (
    <div className="action-list">
      {Object.entries(grouped).map(([domainId, group]) => (
        <div key={domainId} className="action-group">
          <div className="action-group-header">
            <span className="action-group-name">{group.name}</span>
            <span className="action-group-count">{group.actions.length}</span>
          </div>
          {group.actions.map(action => {
            const isCompleted = completedActions.includes(action.id)
            return (
              <div
                key={action.id}
                className={`action-item${isCompleted ? ' completed' : ''}${action.overdue ? ' overdue' : ''}`}
                onClick={() => onToggleAction(action.id)}
              >
                <div className="action-check">
                  {isCompleted ? <CheckSquare size={18} /> : <Square size={18} />}
                </div>
                <div className="action-content">
                  <div className="action-title">{action.title}</div>
                  {action.objectiveTitle && (
                    <div className="action-objective">
                      <ArrowRight size={12} />
                      <span>{action.objectiveTitle}</span>
                    </div>
                  )}
                  <div className="action-meta">
                    {action.time && (
                      <span className="action-time"><Clock size={12} /> {action.time}</span>
                    )}
                    {action.overdue && (
                      <span className="action-overdue"><AlertTriangle size={12} /> Overdue</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
