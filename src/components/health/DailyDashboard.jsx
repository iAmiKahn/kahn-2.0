import { useState, useEffect } from 'react'
import { Calendar, TrendingUp, Target, Clock, AlertTriangle, Flame, Dumbbell, UtensilsCrossed } from 'lucide-react'
import ComplianceChecklist from './ComplianceChecklist.jsx'
import NutritionTargets from './NutritionTargets.jsx'
import RecoveryScore from './RecoveryScore.jsx'
import { analyzeBodyComp, calculateComplianceScore, calculateWeeklyCompliance, getWeekDates, SLEEP_TARGETS, RECOMP_PHASES, isTrainingDay as checkTrainingDay, assessRecovery } from '../../utils/healthEngine.js'
import { getTodayWorkout, getTrainingPhase } from '../../utils/trainingEngine.js'
import { generateDayMealPlan, compareMealPlanToTargets } from '../../utils/mealPlanEngine.js'
import { getWeekEntries } from '../../utils/healthStore.js'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function DailyDashboard({ profile, macroTargets, dayEntry, onToggle, onUpdate, onBadDay, onSaveRecovery, onSaveRHR, onSwitchTab }) {
  const today = new Date()
  const dayName = DAY_NAMES[today.getDay()]
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const trainingDay = dayEntry.isTrainingDay

  const bodyComp = analyzeBodyComp(profile)
  const compliance = calculateComplianceScore(dayEntry)

  // Get today's workout and meal plan for summary cards
  const todayWorkout = getTodayWorkout(today.getDay())
  const jsDay = today.getDay()
  const dayIndex = jsDay === 0 ? 6 : jsDay - 1
  const todayMeals = generateDayMealPlan(dayIndex)

  // Training phase
  const trainingPhase = getTrainingPhase(profile?.createdAt)

  // Macro target comparison
  const macroComparison = macroTargets ? compareMealPlanToTargets(todayMeals, macroTargets, trainingDay) : null

  // Recovery assessment
  const morningScores = dayEntry?.recovery?.morning_scores
  const recoveryAssessment = morningScores ? assessRecovery(morningScores) : null

  // Mid-week compliance (async loaded)
  const [weeklyAvg, setWeeklyAvg] = useState(null)
  useEffect(() => {
    const weekDates = getWeekDates()
    getWeekEntries(weekDates).then(entries => {
      setWeeklyAvg(calculateWeeklyCompliance(entries))
    })
  }, [dayEntry])

  // Determine current recomp phase based on profile creation date
  const daysSinceStart = profile.createdAt
    ? Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / 86400000)
    : 0
  const monthsSinceStart = Math.floor(daysSinceStart / 30)
  const currentPhase = RECOMP_PHASES.find(p => {
    const [start] = p.months.split('-').map(Number)
    const end = p.months.includes('-') ? parseInt(p.months.split('-')[1]) : start
    return monthsSinceStart >= start - 1 && monthsSinceStart <= end
  }) || RECOMP_PHASES[0]

  return (
    <div className="daily-dashboard">
      {/* Header bar */}
      <div className="daily-header">
        <div>
          <div className="daily-date">{dayName}, {dateStr}</div>
          <div className="daily-phase">
            Phase {currentPhase.phase}: {currentPhase.name}
            <span className="text-muted"> — Month {monthsSinceStart || 1}</span>
          </div>
        </div>
        <div className="daily-header-stats">
          <div className="daily-stat">
            <span className="daily-stat-value" style={{ color: compliance.overall >= 80 ? 'var(--green)' : compliance.overall >= 50 ? 'var(--yellow)' : 'var(--red)' }}>
              {compliance.overall}%
            </span>
            <span className="daily-stat-label">Today</span>
          </div>
          <div className="daily-stat">
            <span className={`badge ${trainingDay ? 'badge-purple' : 'badge-grey'}`}>
              {trainingDay ? 'Training' : 'Rest'}
            </span>
          </div>
        </div>
      </div>

      {/* Mid-week compliance alert */}
      {weeklyAvg && weeklyAvg.overall < 80 && today.getDay() >= 3 && today.getDay() <= 5 && (
        <div className="gap-box warn" style={{ marginBottom: 12 }}>
          <div className="gap-box-title">
            <AlertTriangle style={{ width: 12, height: 12, display: 'inline', verticalAlign: 'middle' }} />
            {' '}Mid-Week Compliance Alert
          </div>
          <ul>
            <li>Weekly compliance at {weeklyAvg.overall}% — below 80% target</li>
            {weeklyAvg.nutrition < 80 && <li>Nutrition needs attention ({weeklyAvg.nutrition}%)</li>}
            {weeklyAvg.training < 80 && <li>Training sessions may have been missed ({weeklyAvg.training}%)</li>}
            {weeklyAvg.sleep < 80 && <li>Sleep protocol adherence slipping ({weeklyAvg.sleep}%)</li>}
          </ul>
        </div>
      )}

      {/* Recovery-driven alert */}
      {recoveryAssessment && (recoveryAssessment.status === 'suboptimal' || recoveryAssessment.status === 'poor') && (
        <div className={`gap-box ${recoveryAssessment.status === 'poor' ? '' : 'warn'}`} style={{ marginBottom: 12 }}>
          <div className="gap-box-title">
            Recovery: {recoveryAssessment.status.toUpperCase()} ({recoveryAssessment.total}/25)
          </div>
          <ul>
            <li>{recoveryAssessment.recommendation}</li>
          </ul>
        </div>
      )}

      {/* Macro target alert */}
      {macroComparison && (!macroComparison.calories.inRange || !macroComparison.protein.inRange) && (
        <div className="gap-box info" style={{ marginBottom: 12 }}>
          <div className="gap-box-title">Meal Plan vs Targets</div>
          <ul>
            {!macroComparison.calories.inRange && (
              <li>Calories: {todayMeals.dailyTotals.calories} vs target {macroComparison.calories.target.min}-{macroComparison.calories.target.max}</li>
            )}
            {!macroComparison.protein.inRange && (
              <li>Protein: {todayMeals.dailyTotals.protein}g vs target {macroComparison.protein.target.min}-{macroComparison.protein.target.max}g</li>
            )}
          </ul>
        </div>
      )}

      <div className="daily-grid">
        {/* Left column: compliance + recovery */}
        <div className="daily-col-left">
          {/* Recovery score (morning check) */}
          <div className="card" style={{ marginBottom: 12 }}>
            <RecoveryScore
              dayEntry={dayEntry}
              onSaveScores={onSaveRecovery}
              onSaveRHR={onSaveRHR}
            />
          </div>

          {/* Today's Training — summary card */}
          <div className="card" style={{ marginBottom: 12, cursor: 'pointer' }} onClick={() => onSwitchTab && onSwitchTab('training')}>
            <div className="section-heading" style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Dumbbell style={{ width: 12, height: 12 }} />
              Today's Training
            </div>
            {todayWorkout ? (
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{todayWorkout.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>{todayWorkout.focus}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {todayWorkout.exercises.slice(0, 4).map(ex => (
                    <span key={ex.exerciseId} className="badge badge-grey" style={{ fontSize: 9 }}>{ex.exercise.name}</span>
                  ))}
                  {todayWorkout.exercises.length > 4 && (
                    <span className="badge badge-grey" style={{ fontSize: 9 }}>+{todayWorkout.exercises.length - 4} more</span>
                  )}
                </div>
                <div className="text-sm text-muted" style={{ marginTop: 6 }}>Click to view full workout &amp; log performance</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Rest Day</div>
                <div className="text-sm text-muted">Active recovery &middot; 60 min walk</div>
              </div>
            )}
          </div>

          {/* Compliance checklist */}
          <div className="card">
            <ComplianceChecklist
              dayEntry={dayEntry}
              onToggle={onToggle}
              onUpdate={onUpdate}
              onBadDay={onBadDay}
            />
          </div>
        </div>

        {/* Right column: targets + body comp */}
        <div className="daily-col-right">
          {/* Today's Meals — summary card */}
          <div className="card" style={{ marginBottom: 12, cursor: 'pointer' }} onClick={() => onSwitchTab && onSwitchTab('meals')}>
            <div className="section-heading" style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <UtensilsCrossed style={{ width: 12, height: 12 }} />
              Today's Meals
            </div>
            <div className="meal-summary-totals" style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{todayMeals.dailyTotals.calories} cal</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-text)' }}>{todayMeals.dailyTotals.protein}g protein</span>
              <span style={{ fontSize: 13, color: 'var(--green)' }}>${todayMeals.dailyTotals.cost.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {todayMeals.meals.map(m => (
                <div key={m.slot} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)' }}>
                  <span>{m.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{m.macros.protein}g P</span>
                </div>
              ))}
            </div>
            <div className="text-sm text-muted" style={{ marginTop: 6 }}>Click to view ingredients &amp; prep instructions</div>
          </div>

          {/* Body composition snapshot */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="section-heading" style={{ marginTop: 0 }}>Body Composition</div>
            <div className="body-comp-grid">
              <div className="body-comp-col">
                <div className="body-comp-label">Current</div>
                <div className="body-comp-stat">
                  <span className="body-comp-value">{bodyComp.current.weight}</span>
                  <span className="body-comp-unit">lbs</span>
                </div>
                <div className="body-comp-detail">{bodyComp.current.bodyFat}% BF · {bodyComp.current.leanMass} lean · FFMI {bodyComp.current.ffmi}</div>
              </div>
              <div className="body-comp-arrow">→</div>
              <div className="body-comp-col">
                <div className="body-comp-label">Target</div>
                <div className="body-comp-stat">
                  <span className="body-comp-value accent">{bodyComp.target.weight}</span>
                  <span className="body-comp-unit">lbs</span>
                </div>
                <div className="body-comp-detail">{bodyComp.target.bodyFat}% BF · {bodyComp.target.leanMass} lean · FFMI {bodyComp.target.ffmi}</div>
              </div>
            </div>
            <div className="body-comp-delta">
              <span className="text-green">+{bodyComp.delta.leanToGain} lbs lean</span>
              <span className="text-muted">·</span>
              <span className="text-red">-{bodyComp.delta.fatToLose} lbs fat</span>
            </div>
          </div>

          {/* Nutrition targets */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="section-heading" style={{ marginTop: 0 }}>Nutrition Targets</div>
            <NutritionTargets macroTargets={macroTargets} isTrainingDay={trainingDay} />
          </div>

          {/* Sleep protocol */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="section-heading" style={{ marginTop: 0 }}>Sleep Protocol</div>
            <div className="form-row">
              <div>
                <div className="detail-field-label">Bedtime</div>
                <div className="detail-field-value">{SLEEP_TARGETS.bedTime}</div>
              </div>
              <div>
                <div className="detail-field-label">Wake Time</div>
                <div className="detail-field-value">{SLEEP_TARGETS.wakeTime}</div>
              </div>
              <div>
                <div className="detail-field-label">Time in Bed</div>
                <div className="detail-field-value">{SLEEP_TARGETS.timeInBed_hrs} hrs</div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div className="detail-field-label" style={{ marginBottom: 6 }}>Pre-Sleep Protocol</div>
              {SLEEP_TARGETS.preSleepProtocol.map((step, i) => (
                <div key={i} className="flex gap-2 items-center mb-1">
                  <span className="text-muted" style={{ fontSize: 10, fontFamily: 'var(--font-mono)', width: 40, flexShrink: 0 }}>{step.time}</span>
                  <span className="text-sm">{step.action}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10 }}>
              <div className="detail-field-label" style={{ marginBottom: 6 }}>Morning Protocol</div>
              {SLEEP_TARGETS.morningProtocol.map((step, i) => (
                <div key={i} className="flex gap-2 items-center mb-1">
                  <span className="text-muted" style={{ fontSize: 10, fontFamily: 'var(--font-mono)', width: 40, flexShrink: 0 }}>{step.time}</span>
                  <span className="text-sm">{step.action}</span>
                </div>
              ))}
            </div>
            <div className="gap-box" style={{ marginTop: 12, background: 'var(--red-dim)', borderColor: 'var(--red)' }}>
              <div className="gap-box-title">Caffeine & Alcohol</div>
              <ul>
                <li>Caffeine: Max {SLEEP_TARGETS.caffeineMax_mg}mg, last dose by {SLEEP_TARGETS.caffeineCutoff} ({SLEEP_TARGETS.caffeineTiming})</li>
                <li>Alcohol: {SLEEP_TARGETS.alcoholPolicy}</li>
              </ul>
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <div className="section-heading" style={{ marginTop: 0 }}>Recomposition Timeline</div>
            {RECOMP_PHASES.map(phase => (
              <div key={phase.phase} className={`timeline-phase${phase.phase === currentPhase.phase ? ' current' : ''}`}>
                <div className="timeline-phase-header">
                  <span className={`timeline-phase-num${phase.phase === currentPhase.phase ? ' active' : ''}`}>{phase.phase}</span>
                  <div>
                    <div className="text-sm font-bold">{phase.name}</div>
                    <div className="text-sm text-muted">Months {phase.months} — Target: {phase.targetWeight} at {phase.targetBF}% BF</div>
                  </div>
                </div>
                {phase.phase === currentPhase.phase && (
                  <div className="timeline-phase-detail">
                    <div className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 6 }}>
                      {phase.description}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <span className="badge badge-green">Fat: {phase.expectedFatLoss}</span>
                      <span className="badge badge-purple">Muscle: {phase.expectedMuscleGain}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
