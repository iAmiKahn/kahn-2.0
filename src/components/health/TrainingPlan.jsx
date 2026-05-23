import { useState, useEffect } from 'react'
import { Clock, ChevronDown, ChevronUp, Save, CheckCircle, AlertTriangle, Shield } from 'lucide-react'
import { getTodayWorkout, getDeloadWorkout, getAdaptationWorkout, createPerformanceEntry, getTrainingPhase } from '../../utils/trainingEngine.js'
import { assessRecovery } from '../../utils/healthEngine.js'

export default function TrainingPlan({ performance, onSavePerformance, profile, dayEntry }) {
  const dayOfWeek = new Date().getDay()
  const splitDay = dayOfWeek >= 1 && dayOfWeek <= 5 ? dayOfWeek : null

  // Determine training phase from profile creation date
  const trainingPhase = getTrainingPhase(profile?.createdAt)

  // Get phase-appropriate workout
  let workout = null
  if (splitDay) {
    if (trainingPhase.isAdaptation) {
      workout = getAdaptationWorkout(splitDay)
    } else if (trainingPhase.isDeload) {
      workout = getDeloadWorkout(splitDay)
    } else {
      workout = getTodayWorkout(splitDay)
    }
  }

  // Assess recovery from morning scores
  const morningScores = dayEntry?.recovery?.morning_scores
  const recoveryAssessment = morningScores ? assessRecovery(morningScores) : null
  const isBadDay = dayEntry?.badDayProtocol || (recoveryAssessment && recoveryAssessment.status === 'poor')

  // If Bad Day Protocol, override to deload-style workout
  const effectiveWorkout = isBadDay && workout && !workout.isDeload
    ? getDeloadWorkout(splitDay)
    : workout

  const [perfEntry, setPerfEntry] = useState(null)
  const [showWarmup, setShowWarmup] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (performance) {
      setPerfEntry(performance)
    } else if (effectiveWorkout) {
      setPerfEntry(createPerformanceEntry(effectiveWorkout))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!effectiveWorkout) {
    return (
      <div className="training-plan">
        <div className="training-rest-day">
          <div className="training-rest-title">Rest Day</div>
          <div className="training-rest-detail">
            Active recovery only. 60-minute walk at conversational pace.
            Focus on sleep quality and nutrition compliance.
          </div>
          <div className="training-rest-checklist">
            <div className="training-rest-item">60 min walk (3.0-3.5 mph)</div>
            <div className="training-rest-item">Foam roll / mobility (10-15 min)</div>
            <div className="training-rest-item">Stretch: hip flexors, pecs, lats</div>
          </div>
        </div>
      </div>
    )
  }

  function updateSet(exerciseIdx, setIdx, field, value) {
    setPerfEntry(prev => {
      const updated = { ...prev }
      updated.exercises = updated.exercises.map((ex, i) => {
        if (i !== exerciseIdx) return ex
        return {
          ...ex,
          sets: ex.sets.map((s, j) => {
            if (j !== setIdx) return s
            return { ...s, [field]: value === '' ? null : Number(value) }
          }),
        }
      })
      return updated
    })
  }

  function updateSessionRPE(val) {
    setPerfEntry(prev => ({ ...prev, sessionRPE: val }))
  }

  function updateNotes(val) {
    setPerfEntry(prev => ({ ...prev, notes: val }))
  }

  async function handleSave() {
    if (!onSavePerformance || !perfEntry) return
    setSaving(true)
    await onSavePerformance(perfEntry)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const loggedSets = perfEntry
    ? perfEntry.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.weight != null && s.reps != null).length, 0)
    : 0
  const totalSets = perfEntry
    ? perfEntry.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)
    : 0

  return (
    <div className="training-plan">
      {/* Training phase context bar */}
      <div className="training-phase-bar">
        <div className="training-phase-info">
          <span className={`badge ${trainingPhase.isAdaptation ? 'badge-yellow' : trainingPhase.isDeload ? 'badge-orange' : 'badge-purple'}`}>
            {trainingPhase.isAdaptation ? 'ADAPTATION' : trainingPhase.isDeload ? 'DELOAD WEEK' : `Week ${trainingPhase.weekNumber}`}
          </span>
          <span className="text-sm text-muted">
            Cycle week {trainingPhase.cycleWeek}/4
            {trainingPhase.weeksUntilDeload > 0 && !trainingPhase.isAdaptation && ` \u2014 ${trainingPhase.weeksUntilDeload} week${trainingPhase.weeksUntilDeload > 1 ? 's' : ''} to deload`}
          </span>
        </div>
        {trainingPhase.isAdaptation && (
          <div className="text-sm" style={{ color: 'var(--yellow)' }}>
            60-70% intensity. Tendon re-adaptation. Focus on form.
          </div>
        )}
        {trainingPhase.isDeload && (
          <div className="text-sm" style={{ color: 'var(--orange)' }}>
            50% volume. Same weight, half the sets. Recovery week.
          </div>
        )}
      </div>

      {/* Recovery-driven alert */}
      {recoveryAssessment && recoveryAssessment.status !== 'optimal' && recoveryAssessment.status !== 'adequate' && (
        <div className={`gap-box ${recoveryAssessment.status === 'poor' ? '' : 'warn'}`} style={{ marginBottom: 12 }}>
          <div className="gap-box-title">
            <AlertTriangle style={{ width: 12, height: 12, display: 'inline', verticalAlign: 'middle' }} />
            {' '}Recovery: {recoveryAssessment.status.toUpperCase()} ({recoveryAssessment.total}/25)
          </div>
          <ul>
            <li>{recoveryAssessment.recommendation}</li>
            {isBadDay && <li>Bad Day Protocol active — volume reduced 50%, compound lifts only</li>}
          </ul>
        </div>
      )}

      {/* Bad Day Protocol banner */}
      {isBadDay && !recoveryAssessment?.status?.match(/suboptimal|poor/) && (
        <div className="gap-box warn" style={{ marginBottom: 12 }}>
          <div className="gap-box-title">
            <Shield style={{ width: 12, height: 12, display: 'inline', verticalAlign: 'middle' }} />
            {' '}Bad Day Protocol Active
          </div>
          <ul>
            <li>Volume reduced 50% — compound lifts only, skip accessories</li>
            <li>Maintain nutrition targets — your body still needs fuel</li>
            <li>Goal: keep the streak alive, not break records</li>
          </ul>
        </div>
      )}

      {/* Workout header */}
      <div className="training-header">
        <div>
          <div className="training-name">{effectiveWorkout.name}</div>
          <div className="training-focus">{effectiveWorkout.focus}</div>
        </div>
        <div className="training-meta">
          <span className="badge badge-purple">
            <Clock style={{ width: 10, height: 10 }} /> {effectiveWorkout.estimatedDuration}
          </span>
          <span className="badge badge-grey">{effectiveWorkout.exercises.length} exercises</span>
          {loggedSets > 0 && (
            <span className="badge badge-green">{loggedSets}/{totalSets} sets logged</span>
          )}
        </div>
      </div>

      {/* Warmup protocol (collapsible) */}
      <div className="training-section" onClick={() => setShowWarmup(!showWarmup)} style={{ cursor: 'pointer' }}>
        <div className="training-section-header">
          <span className="section-heading" style={{ margin: 0, border: 'none', paddingBottom: 0 }}>RAMP Warm-Up Protocol</span>
          {showWarmup
            ? <ChevronUp style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
            : <ChevronDown style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
          }
        </div>
        {showWarmup && (
          <div className="training-warmup-steps">
            {effectiveWorkout.warmup.map((step, i) => (
              <div key={i} className="training-warmup-step">
                <span className="training-warmup-phase">{step.phase}</span>
                <span className="training-warmup-dur">{step.duration}</span>
                <span className="training-warmup-desc">{step.description}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exercises */}
      <div className="training-exercises">
        {effectiveWorkout.exercises.map((ex, exIdx) => (
          <div key={ex.exerciseId} className="training-exercise">
            <div className="training-exercise-header">
              <div className="training-exercise-num">{exIdx + 1}</div>
              <div className="training-exercise-info">
                <div className="training-exercise-name">{ex.exercise.name}</div>
                <div className="training-exercise-muscle">{ex.exercise.muscle} &middot; {ex.exercise.type}</div>
              </div>
              <div className="training-exercise-targets">
                <span className="training-target">{ex.sets} &times; {ex.repRange}</span>
                <span className="training-target rpe">RPE {ex.rpe}</span>
                <span className="training-target rest">{ex.rest}</span>
              </div>
            </div>
            {ex.notes && <div className="training-exercise-notes">{ex.notes}</div>}

            {/* Performance logging grid */}
            {perfEntry && perfEntry.exercises[exIdx] && (
              <div className="training-sets">
                <div className="training-sets-header">
                  <span>Set</span>
                  <span>Weight (lbs)</span>
                  <span>Reps</span>
                  <span>RPE</span>
                </div>
                {perfEntry.exercises[exIdx].sets.map((set, setIdx) => (
                  <div key={setIdx} className="training-set-row">
                    <span className="training-set-num">{setIdx + 1}</span>
                    <input
                      type="number"
                      className="training-set-input"
                      placeholder="\u2014"
                      value={set.weight ?? ''}
                      onChange={e => updateSet(exIdx, setIdx, 'weight', e.target.value)}
                    />
                    <input
                      type="number"
                      className="training-set-input"
                      placeholder="\u2014"
                      value={set.reps ?? ''}
                      onChange={e => updateSet(exIdx, setIdx, 'reps', e.target.value)}
                    />
                    <input
                      type="number"
                      className="training-set-input"
                      placeholder="\u2014"
                      value={set.rpe ?? ''}
                      onChange={e => updateSet(exIdx, setIdx, 'rpe', e.target.value)}
                      step="0.5"
                      min="1"
                      max="10"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Session RPE + Notes */}
      <div className="training-session-footer">
        <div className="training-session-rpe">
          <span className="training-footer-label">Session RPE</span>
          <div className="compliance-rpe-row">
            {[1,2,3,4,5,6,7,8,9,10].map(v => (
              <button
                key={v}
                className={`compliance-rpe${perfEntry?.sessionRPE === v ? ' active' : ''}${v >= 9 ? ' high' : v >= 7 ? ' moderate' : ''}`}
                onClick={() => updateSessionRPE(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="training-session-notes">
          <span className="training-footer-label">Session Notes</span>
          <textarea
            className="training-notes-input"
            placeholder="How did the session feel? Any pain, fatigue, or PRs?"
            value={perfEntry?.notes || ''}
            onChange={e => updateNotes(e.target.value)}
            rows={2}
          />
        </div>
      </div>

      {/* Cooldown + Cardio */}
      <div className="training-footer-info">
        <div className="training-footer-block">
          <div className="training-footer-label">Cooldown</div>
          <div className="training-footer-text">{effectiveWorkout.cooldown}</div>
        </div>
        <div className="training-footer-block">
          <div className="training-footer-label">Daily Cardio</div>
          <div className="training-footer-text">
            {effectiveWorkout.cardio.type} &mdash; {effectiveWorkout.cardio.duration} &middot; {effectiveWorkout.cardio.intensity}
          </div>
        </div>
      </div>

      {/* Save button */}
      <button className="btn btn-accent training-save-btn" onClick={handleSave} disabled={saving}>
        {saved ? <CheckCircle style={{ width: 14, height: 14 }} /> : <Save style={{ width: 14, height: 14 }} />}
        {saving ? 'Saving...' : saved ? 'Saved' : 'Save Performance Log'}
      </button>
    </div>
  )
}
