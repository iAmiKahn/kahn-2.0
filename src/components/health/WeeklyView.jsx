import { useState, useEffect } from 'react'
import { getWeekDates, getWeekKey, calculateComplianceScore, calculateWeeklyCompliance } from '../../utils/healthEngine.js'
import { getWeekEntries } from '../../utils/healthStore.js'
import { generateWeekMealPlan } from '../../utils/mealPlanEngine.js'
import { SUPPLEMENTS } from '../../utils/healthEngine.js'

const DAY_ABBREVS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getComplianceColor(score) {
  if (score >= 80) return 'var(--green)'
  if (score >= 50) return 'var(--yellow)'
  return 'var(--red)'
}

export default function WeeklyView() {
  const [weekEntries, setWeekEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const weekDates = getWeekDates()
  const weekPlan = generateWeekMealPlan()
  const suppMonthlyCost = SUPPLEMENTS.reduce((a, s) => a + s.monthlyEstCost, 0)

  useEffect(() => {
    getWeekEntries(weekDates).then(entries => {
      setWeekEntries(entries)
      setLoading(false)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <div className="empty-state"><p>Loading weekly data...</p></div>
  }

  const dailyCompliance = weekEntries.map(entry => calculateComplianceScore(entry))
  const weeklyAvg = calculateWeeklyCompliance(weekEntries)

  const totalDaysLogged = weekEntries.filter(e => {
    let checked = 0
    for (const domain of ['nutrition', 'training', 'sleep', 'recovery']) {
      if (!e[domain]) continue
      for (const val of Object.values(e[domain])) {
        if (val === true) checked++
      }
    }
    return checked > 0
  }).length

  return (
    <div className="weekly-view">
      {/* Weekly overview header */}
      <div className="weekly-header">
        <div className="weekly-title">Week of {weekDates[0]}</div>
        <div className="weekly-header-stats">
          <div className="weekly-stat">
            <span className="weekly-stat-value" style={{ color: getComplianceColor(weeklyAvg.overall) }}>
              {weeklyAvg.overall}%
            </span>
            <span className="weekly-stat-label">Overall</span>
          </div>
          <div className="weekly-stat">
            <span className="weekly-stat-value">{totalDaysLogged}/7</span>
            <span className="weekly-stat-label">Days Logged</span>
          </div>
          <div className="weekly-stat">
            <span className="weekly-stat-value" style={{ color: 'var(--green)' }}>
              ${weekPlan.estimatedMonthlyCost.toFixed(0)}
            </span>
            <span className="weekly-stat-label">Est. Monthly Food</span>
          </div>
        </div>
      </div>

      {/* Daily compliance grid */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="section-heading" style={{ marginTop: 0 }}>Daily Compliance</div>
        <div className="weekly-grid">
          <div className="weekly-grid-header">
            <span></span>
            {DAY_ABBREVS.map(d => <span key={d} className="weekly-grid-day">{d}</span>)}
          </div>
          {['nutrition', 'training', 'sleep', 'recovery'].map(domain => (
            <div key={domain} className="weekly-grid-row">
              <span className="weekly-grid-label">{domain.charAt(0).toUpperCase() + domain.slice(1)}</span>
              {dailyCompliance.map((dc, i) => (
                <span
                  key={i}
                  className="weekly-grid-cell"
                  style={{
                    background: dc[domain] > 0 ? getComplianceColor(dc[domain]) : 'var(--bg-hover)',
                    opacity: dc[domain] > 0 ? 1 : 0.3,
                  }}
                >
                  {dc[domain] > 0 ? `${dc[domain]}%` : '\u2014'}
                </span>
              ))}
            </div>
          ))}
          <div className="weekly-grid-row weekly-grid-total">
            <span className="weekly-grid-label">Overall</span>
            {dailyCompliance.map((dc, i) => (
              <span
                key={i}
                className="weekly-grid-cell total"
                style={{ color: getComplianceColor(dc.overall) }}
              >
                {dc.overall > 0 ? `${dc.overall}%` : '\u2014'}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Domain breakdown */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="section-heading" style={{ marginTop: 0 }}>Domain Averages</div>
        <div className="weekly-domains">
          {[
            { key: 'nutrition', label: 'Nutrition' },
            { key: 'training', label: 'Training' },
            { key: 'sleep', label: 'Sleep' },
            { key: 'recovery', label: 'Recovery' },
          ].map(d => (
            <div key={d.key} className="weekly-domain-card">
              <div className="weekly-domain-info">
                <div className="weekly-domain-label">{d.label}</div>
                <div className="weekly-domain-score" style={{ color: getComplianceColor(weeklyAvg[d.key] || 0) }}>
                  {weeklyAvg[d.key] || 0}%
                </div>
              </div>
              <div className="weekly-domain-bar">
                <div
                  className="weekly-domain-fill"
                  style={{
                    width: `${weeklyAvg[d.key] || 0}%`,
                    background: getComplianceColor(weeklyAvg[d.key] || 0),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost tracking */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="section-heading" style={{ marginTop: 0 }}>Cost Tracking</div>
        <div className="weekly-cost">
          <div className="weekly-cost-row">
            <span>Avg daily food cost</span>
            <span className="weekly-cost-value">${weekPlan.avgDaily.cost.toFixed(2)}</span>
          </div>
          <div className="weekly-cost-row">
            <span>Weekly food cost</span>
            <span className="weekly-cost-value">${weekPlan.weeklyTotals.cost.toFixed(2)}</span>
          </div>
          <div className="weekly-cost-row">
            <span>Est. monthly food</span>
            <span className="weekly-cost-value">${weekPlan.estimatedMonthlyCost.toFixed(2)}</span>
          </div>
          <div className="weekly-cost-row">
            <span>Supplements (est.)</span>
            <span className="weekly-cost-value">~${suppMonthlyCost}/mo</span>
          </div>
          <div className="weekly-cost-row total">
            <span>Est. monthly total</span>
            <span className="weekly-cost-value">${(weekPlan.estimatedMonthlyCost + suppMonthlyCost).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Weekly nutrition totals */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="section-heading" style={{ marginTop: 0 }}>Weekly Nutrition Averages</div>
        <div className="weekly-nutrition-grid">
          <div className="weekly-nutrition-item">
            <span className="weekly-nutrition-label">Calories</span>
            <span className="weekly-nutrition-val">{weekPlan.avgDaily.calories}</span>
            <span className="weekly-nutrition-unit">cal/day</span>
          </div>
          <div className="weekly-nutrition-item">
            <span className="weekly-nutrition-label">Protein</span>
            <span className="weekly-nutrition-val accent">{weekPlan.avgDaily.protein}g</span>
            <span className="weekly-nutrition-unit">/day</span>
          </div>
          <div className="weekly-nutrition-item">
            <span className="weekly-nutrition-label">Carbs</span>
            <span className="weekly-nutrition-val">{weekPlan.avgDaily.carbs}g</span>
            <span className="weekly-nutrition-unit">/day</span>
          </div>
          <div className="weekly-nutrition-item">
            <span className="weekly-nutrition-label">Fat</span>
            <span className="weekly-nutrition-val">{weekPlan.avgDaily.fat}g</span>
            <span className="weekly-nutrition-unit">/day</span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {weeklyAvg.overall < 80 && totalDaysLogged >= 3 && (
        <div className="card" style={{ background: 'var(--yellow-dim)', border: '1px solid var(--yellow)' }}>
          <div className="section-heading" style={{ marginTop: 0, color: 'var(--yellow)' }}>Mid-Week Alert</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            Overall compliance is at {weeklyAvg.overall}% &mdash; below the 80% target.
            {weeklyAvg.nutrition < 80 && ' Nutrition compliance needs attention.'}
            {weeklyAvg.training < 80 && ' Training sessions may have been missed.'}
            {weeklyAvg.sleep < 80 && ' Sleep protocol adherence is slipping.'}
            {weeklyAvg.recovery < 80 && ' Recovery assessments are incomplete.'}
          </p>
        </div>
      )}
    </div>
  )
}
