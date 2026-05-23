import { useState } from 'react'
import { Heart, Activity } from 'lucide-react'
import { RECOVERY_QUESTIONS, assessRecovery } from '../../utils/healthEngine.js'

export default function RecoveryScore({ dayEntry, onSaveScores, onSaveRHR }) {
  const existingScores = dayEntry?.recovery?.morning_scores
  const existingRHR = dayEntry?.recovery?.morning_rhr

  const [scores, setScores] = useState(
    existingScores || RECOVERY_QUESTIONS.reduce((acc, q) => ({ ...acc, [q.id]: 3 }), {})
  )
  const [rhr, setRhr] = useState(existingRHR || '')
  const [saved, setSaved] = useState(!!existingScores)

  function handleScoreChange(id, value) {
    setScores(prev => ({ ...prev, [id]: value }))
    setSaved(false)
  }

  function handleSave() {
    onSaveScores(scores)
    if (rhr) onSaveRHR(parseInt(rhr))
    setSaved(true)
  }

  const assessment = assessRecovery(scores)

  const statusColors = {
    optimal: 'var(--green)',
    adequate: 'var(--accent)',
    suboptimal: 'var(--yellow)',
    poor: 'var(--red)',
  }

  return (
    <div className="recovery-panel">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity style={{ width: 14, height: 14, color: statusColors[assessment.status] }} />
          <span className="text-sm font-bold">Morning Recovery Check</span>
        </div>
        <span className={`badge badge-${assessment.status === 'optimal' ? 'green' : assessment.status === 'adequate' ? 'purple' : assessment.status === 'suboptimal' ? 'yellow' : 'red'}`}>
          {assessment.total}/25 — {assessment.status}
        </span>
      </div>

      <div className="recovery-recommendation" style={{ borderColor: statusColors[assessment.status] }}>
        {assessment.recommendation}
      </div>

      {/* RHR */}
      <div className="recovery-rhr-row">
        <Heart style={{ width: 12, height: 12, color: 'var(--red)' }} />
        <span className="text-sm">Resting HR</span>
        <input
          type="number"
          value={rhr}
          onChange={e => { setRhr(e.target.value); setSaved(false) }}
          placeholder="bpm"
          style={{ width: 70, padding: '4px 8px', fontSize: 12 }}
        />
        <span className="text-sm text-muted">bpm (measure before standing)</span>
      </div>

      {/* Score sliders */}
      <div className="recovery-scores">
        {RECOVERY_QUESTIONS.map(q => (
          <div key={q.id} className="recovery-score-row">
            <div className="recovery-score-label">
              <span>{q.label}</span>
              <span className="text-muted" style={{ fontSize: 10 }}>{q.scale}</span>
            </div>
            <div className="recovery-score-buttons">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  className={`recovery-score-btn${scores[q.id] === n ? ' active' : ''}${n <= 2 ? ' low' : n >= 4 ? ' high' : ''}`}
                  onClick={() => handleScoreChange(q.id, n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        className={`btn ${saved ? 'btn-ghost' : 'btn-primary'} w-full`}
        style={{ marginTop: 10, justifyContent: 'center' }}
        onClick={handleSave}
      >
        {saved ? 'Saved' : 'Save Recovery Scores'}
      </button>
    </div>
  )
}
