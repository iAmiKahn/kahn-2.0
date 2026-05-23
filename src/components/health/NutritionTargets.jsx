import { MEAL_STRUCTURE, SUPPLEMENTS, MICRONUTRIENT_TARGETS } from '../../utils/healthEngine.js'
import { ChevronDown, ChevronRight, Pill, Apple, Beaker } from 'lucide-react'
import { useState } from 'react'

export default function NutritionTargets({ macroTargets, isTrainingDay }) {
  const [showMicros, setShowMicros] = useState(false)
  const [showSupps, setShowSupps] = useState(false)

  if (!macroTargets) return null

  const cals = isTrainingDay ? macroTargets.calories.training : macroTargets.calories.rest
  const carbs = isTrainingDay ? macroTargets.carbs.training : macroTargets.carbs.rest
  const hydration = isTrainingDay ? macroTargets.hydration_oz.training : macroTargets.hydration_oz.base

  return (
    <div>
      {/* Day type indicator */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`badge ${isTrainingDay ? 'badge-purple' : 'badge-grey'}`}>
          {isTrainingDay ? 'Training Day' : 'Rest Day'}
        </span>
      </div>

      {/* Macro targets grid */}
      <div className="data-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <div className="data-cell">
          <div className="data-cell-label">Calories</div>
          <div className="data-cell-value">{cals.min}-{cals.max}</div>
        </div>
        <div className="data-cell">
          <div className="data-cell-label">Protein</div>
          <div className="data-cell-value">{macroTargets.protein.min}-{macroTargets.protein.max}g</div>
        </div>
        <div className="data-cell">
          <div className="data-cell-label">Carbs</div>
          <div className="data-cell-value">{carbs.min}-{carbs.max}g</div>
        </div>
        <div className="data-cell">
          <div className="data-cell-label">Fat</div>
          <div className="data-cell-value">{macroTargets.fat.min}-{macroTargets.fat.max}g</div>
        </div>
        <div className="data-cell">
          <div className="data-cell-label">Water</div>
          <div className="data-cell-value">{hydration} oz</div>
        </div>
      </div>

      {/* Meal windows */}
      <div className="section-heading">Meal Windows</div>
      <div className="meal-windows">
        {MEAL_STRUCTURE.map(meal => (
          <div key={meal.id} className={`meal-window ${meal.type}`}>
            <div className="meal-window-time">{meal.time}</div>
            <div className="meal-window-name">{meal.label}</div>
            <div className="meal-window-target">{meal.proteinTarget}g protein</div>
            <div className="meal-window-notes">{meal.notes}</div>
          </div>
        ))}
      </div>

      {/* Supplements — collapsible */}
      <div className="section-heading" style={{ cursor: 'pointer' }} onClick={() => setShowSupps(!showSupps)}>
        <span className="flex items-center gap-2">
          {showSupps ? <ChevronDown style={{ width: 12, height: 12 }} /> : <ChevronRight style={{ width: 12, height: 12 }} />}
          Supplements Protocol (~${SUPPLEMENTS.reduce((s, x) => s + x.monthlyEstCost, 0)}/mo)
        </span>
      </div>
      {showSupps && (
        <div className="supp-list">
          {SUPPLEMENTS.map(supp => (
            <div key={supp.name} className="supp-row">
              <div className="supp-name">{supp.name}</div>
              <div className="supp-dose">{supp.dose}</div>
              <div className="supp-timing">{supp.timing}</div>
            </div>
          ))}
        </div>
      )}

      {/* Micronutrients — collapsible */}
      <div className="section-heading" style={{ cursor: 'pointer' }} onClick={() => setShowMicros(!showMicros)}>
        <span className="flex items-center gap-2">
          {showMicros ? <ChevronDown style={{ width: 12, height: 12 }} /> : <ChevronRight style={{ width: 12, height: 12 }} />}
          Micronutrient Targets
        </span>
      </div>
      {showMicros && (
        <div>
          <MicroTable title="Vitamins" items={MICRONUTRIENT_TARGETS.vitamins} />
          <MicroTable title="Minerals" items={MICRONUTRIENT_TARGETS.minerals} />
          <MicroTable title="Other" items={MICRONUTRIENT_TARGETS.other} />
        </div>
      )}
    </div>
  )
}

function MicroTable({ title, items }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="text-sm font-bold" style={{ color: 'var(--text-secondary)', marginBottom: 6 }}>{title}</div>
      <table className="comp-table">
        <thead>
          <tr>
            <th>Nutrient</th>
            <th>Target</th>
            <th>Role</th>
            <th>Supplement?</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.name}>
              <td>{item.name}</td>
              <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{item.target} {item.unit}</td>
              <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{item.role}</td>
              <td>{item.supplementNeeded ? <span className="text-yellow">Yes</span> : <span className="text-muted">Food</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
