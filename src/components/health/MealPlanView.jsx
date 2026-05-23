import { useState } from 'react'
import { ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react'
import { generateDayMealPlan, generateWeekMealPlan, compareMealPlanToTargets, generateShoppingList } from '../../utils/mealPlanEngine.js'

const SLOT_LABELS = {
  breakfast: 'Breakfast',
  snack_am: 'Mid-Morning Snack',
  lunch: 'Lunch (Pre-Workout)',
  snack_pm: 'Post-Workout Snack',
  dinner: 'Dinner',
  snack_bed: 'Pre-Bed Snack',
}

const SLOT_TIMES = {
  breakfast: '8:00 AM',
  snack_am: '10:30 AM',
  lunch: '11:30 AM',
  snack_pm: '3:00 PM',
  dinner: '6:30 PM',
  snack_bed: '9:30 PM',
}

export default function MealPlanView({ macroTargets, isTrainingDay }) {
  const jsDay = new Date().getDay()
  const dayIndex = jsDay === 0 ? 6 : jsDay - 1

  const [expandedMeal, setExpandedMeal] = useState(null)
  const [showWeekly, setShowWeekly] = useState(false)
  const [showShoppingList, setShowShoppingList] = useState(false)

  const dayPlan = generateDayMealPlan(dayIndex)
  const weekPlan = showWeekly ? generateWeekMealPlan() : null
  const shoppingList = showShoppingList ? generateShoppingList(dayIndex) : null

  // Compare meal plan macros against targets
  const comparison = macroTargets ? compareMealPlanToTargets(dayPlan, macroTargets, isTrainingDay) : null

  function toggleMeal(idx) {
    setExpandedMeal(expandedMeal === idx ? null : idx)
  }

  function ComparisonIndicator({ data }) {
    if (!data) return null
    const color = data.inRange ? 'var(--green)' : 'var(--yellow)'
    const symbol = data.delta > 0 ? '+' : ''
    return (
      <span style={{ fontSize: 10, color, fontWeight: 600, marginLeft: 4 }}>
        ({symbol}{Math.round(data.delta)})
      </span>
    )
  }

  return (
    <div className="meal-plan">
      {/* Daily totals header */}
      <div className="meal-plan-header">
        <div>
          <div className="meal-plan-title">Today's Meal Plan</div>
          <div className="meal-plan-subtitle">
            6 meals &middot; Brett's prep list
            {isTrainingDay != null && (
              <span className={`badge ${isTrainingDay ? 'badge-purple' : 'badge-grey'}`} style={{ marginLeft: 8 }}>
                {isTrainingDay ? 'Training Day' : 'Rest Day'}
              </span>
            )}
          </div>
        </div>
        <div className="meal-plan-totals">
          <div className="meal-total">
            <span className="meal-total-value">{dayPlan.dailyTotals.calories}</span>
            <span className="meal-total-label">cal{comparison && <ComparisonIndicator data={comparison.calories} />}</span>
          </div>
          <div className="meal-total">
            <span className="meal-total-value accent">{dayPlan.dailyTotals.protein}g</span>
            <span className="meal-total-label">protein{comparison && <ComparisonIndicator data={comparison.protein} />}</span>
          </div>
          <div className="meal-total">
            <span className="meal-total-value">{dayPlan.dailyTotals.carbs}g</span>
            <span className="meal-total-label">carbs{comparison && <ComparisonIndicator data={comparison.carbs} />}</span>
          </div>
          <div className="meal-total">
            <span className="meal-total-value">{dayPlan.dailyTotals.fat}g</span>
            <span className="meal-total-label">fat{comparison && <ComparisonIndicator data={comparison.fat} />}</span>
          </div>
          <div className="meal-total">
            <span className="meal-total-value" style={{ color: 'var(--green)' }}>${dayPlan.dailyTotals.cost.toFixed(2)}</span>
            <span className="meal-total-label">cost</span>
          </div>
        </div>
      </div>

      {/* Target comparison alert */}
      {comparison && (!comparison.calories.inRange || !comparison.protein.inRange) && (
        <div className="gap-box warn" style={{ marginBottom: 12 }}>
          <div className="gap-box-title">Macro Target Check</div>
          <ul>
            {!comparison.calories.inRange && (
              <li>Calories: {dayPlan.dailyTotals.calories} vs target {comparison.calories.target.min}-{comparison.calories.target.max} ({comparison.calories.delta > 0 ? '+' : ''}{Math.round(comparison.calories.delta)})</li>
            )}
            {!comparison.protein.inRange && (
              <li>Protein: {dayPlan.dailyTotals.protein}g vs target {comparison.protein.target.min}-{comparison.protein.target.max}g ({comparison.protein.delta > 0 ? '+' : ''}{Math.round(comparison.protein.delta)}g)</li>
            )}
            {!comparison.carbs.inRange && (
              <li>Carbs: {dayPlan.dailyTotals.carbs}g vs target {comparison.carbs.target.min}-{comparison.carbs.target.max}g</li>
            )}
            {!comparison.fat.inRange && (
              <li>Fat: {dayPlan.dailyTotals.fat}g vs target {comparison.fat.target.min}-{comparison.fat.target.max}g</li>
            )}
          </ul>
        </div>
      )}

      {/* Meals list */}
      <div className="meal-list">
        {dayPlan.meals.map((meal, idx) => (
          <div key={meal.slot} className={`meal-card${expandedMeal === idx ? ' expanded' : ''}`}>
            <div className="meal-card-header" onClick={() => toggleMeal(idx)}>
              <div className="meal-card-time">{SLOT_TIMES[meal.slot]}</div>
              <div className="meal-card-info">
                <div className="meal-card-slot">{SLOT_LABELS[meal.slot]}</div>
                <div className="meal-card-name">{meal.name}</div>
              </div>
              <div className="meal-card-macros">
                <span>{meal.macros.calories} cal</span>
                <span className="accent">{meal.macros.protein}g P</span>
              </div>
              {expandedMeal === idx
                ? <ChevronUp style={{ width: 14, height: 14, flexShrink: 0, color: 'var(--text-muted)' }} />
                : <ChevronDown style={{ width: 14, height: 14, flexShrink: 0, color: 'var(--text-muted)' }} />
              }
            </div>

            {expandedMeal === idx && (
              <div className="meal-card-detail">
                <div className="meal-ingredients">
                  <div className="meal-ingredients-title">Ingredients</div>
                  {meal.ingredients.map((ing, i) => (
                    <div key={i} className="meal-ingredient">
                      <span className="meal-ing-qty">{ing.quantity}</span>
                      <span className="meal-ing-name">{ing.name}</span>
                      <span className="meal-ing-macro">{ing.macros.protein}p &middot; {ing.macros.carbs}c &middot; {ing.macros.fat}f</span>
                    </div>
                  ))}
                </div>
                <div className="meal-macro-bar">
                  <div className="meal-macro-item">
                    <span className="meal-macro-label">Protein</span>
                    <span className="meal-macro-val">{meal.macros.protein}g</span>
                  </div>
                  <div className="meal-macro-item">
                    <span className="meal-macro-label">Carbs</span>
                    <span className="meal-macro-val">{meal.macros.carbs}g</span>
                  </div>
                  <div className="meal-macro-item">
                    <span className="meal-macro-label">Fat</span>
                    <span className="meal-macro-val">{meal.macros.fat}g</span>
                  </div>
                  <div className="meal-macro-item">
                    <span className="meal-macro-label">Cost</span>
                    <span className="meal-macro-val">${meal.macros.cost.toFixed(2)}</span>
                  </div>
                </div>
                <div className="meal-prep">
                  <div className="meal-prep-title">Prep Instructions</div>
                  <div className="meal-prep-text">{meal.prep}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowShoppingList(!showShoppingList)}>
          <ShoppingCart style={{ width: 12, height: 12 }} />
          {showShoppingList ? 'Hide Shopping List' : "Brett's Shopping List"}
        </button>
        <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowWeekly(!showWeekly)}>
          {showWeekly ? 'Hide Weekly Plan' : 'Full Week Plan'}
        </button>
      </div>

      {/* Shopping list for Brett */}
      {showShoppingList && shoppingList && (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="section-heading" style={{ marginTop: 0 }}>
            Today's Shopping List (All 6 Meals)
          </div>
          <div className="shopping-list">
            {shoppingList.map((item, i) => (
              <div key={i} className="shopping-list-item">
                <span className="shopping-list-name">{item.name}</span>
                <span className="shopping-list-qty">{item.quantity}</span>
                <span className="shopping-list-macro">{item.totalProtein}g P &middot; {item.totalCal} cal</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly plan */}
      {showWeekly && weekPlan && (
        <div className="meal-weekly">
          <div className="meal-weekly-summary">
            <div className="meal-weekly-title">Weekly Summary</div>
            <div className="meal-weekly-stats">
              <span>Avg: {weekPlan.avgDaily.calories} cal/day</span>
              <span className="accent">{weekPlan.avgDaily.protein}g protein/day</span>
              <span style={{ color: 'var(--green)' }}>Est. monthly: <strong>${weekPlan.estimatedMonthlyCost.toFixed(2)}</strong></span>
            </div>
          </div>
          {weekPlan.weekPlan.map((day, i) => (
            <div key={i} className="meal-weekly-day">
              <div className="meal-weekly-day-name">{day.day}</div>
              <div className="meal-weekly-day-meals">
                {day.meals.map((m, j) => (
                  <span key={j} className="meal-weekly-meal-chip">{m.name}</span>
                ))}
              </div>
              <div className="meal-weekly-day-totals">
                {day.dailyTotals.calories} cal &middot; {day.dailyTotals.protein}g P &middot; ${day.dailyTotals.cost.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
