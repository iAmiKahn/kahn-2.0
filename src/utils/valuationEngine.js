// valuationEngine.js — Comparative Market Analysis (CMA) engine.
// Implements standard appraiser methodology: Sales Comparison Approach.
// Every valuation is logged with full input/output for knowledge system feedback.

// ─── Condition scoring ─────────────────────────────────────────────────────
const CONDITION_SCORES = {
  excellent: 5,
  good:      4,
  average:   3,
  fair:      2,
  poor:      1,
}

// ─── Standard adjustment constants (configurable per market) ───────────────
const DEFAULT_ADJUSTMENTS = {
  conditionPerGrade:   0.05,   // 5% of comp price per condition grade difference
  garagePerSpace:      15000,  // $ per garage space
  bathroomFull:        8000,   // $ per full bath difference
  bathroomHalf:        4000,   // $ per half bath difference
  basement:            15,     // $ per finished sqft below grade
  pool:                20000,
  deck:                8000,
  fireplace:           5000,
}

// ─── Confidence scoring weights ────────────────────────────────────────────
function scoreConfidence(subject, comps, marketContext) {
  let score = 0
  const reasons = []
  const gaps = []

  // Comp count (max 40 pts)
  if (comps.length >= 4)      { score += 40; reasons.push('4+ comps provided') }
  else if (comps.length === 3) { score += 30; reasons.push('3 comps provided') }
  else if (comps.length === 2) { score += 18; reasons.push('only 2 comps') }
  else if (comps.length === 1) { score += 8;  reasons.push('only 1 comp — add more for accuracy') }
  else { gaps.push('No comparable sales provided — valuation cannot be calculated') }

  // Recency (max 25 pts)
  if (comps.length > 0) {
    const avgAgeMonths = comps.reduce((sum, c) => sum + getMonthsAgo(c.saleDate), 0) / comps.length
    if (avgAgeMonths <= 2)       { score += 25; reasons.push('Very recent comps (<2 months)') }
    else if (avgAgeMonths <= 4)  { score += 20; reasons.push('Recent comps (<4 months)') }
    else if (avgAgeMonths <= 6)  { score += 12; reasons.push('Moderately recent comps (<6 months)') }
    else                         { score += 5;  gaps.push('Comps are >6 months old — market may have shifted') }
  }

  // Subject property completeness (max 20 pts)
  const required = ['sqft', 'beds', 'bathsFull', 'yearBuilt', 'condition']
  const missing = required.filter(f => !subject[f])
  if (missing.length === 0)       { score += 20; reasons.push('Complete subject data') }
  else if (missing.length <= 1)   { score += 14 }
  else if (missing.length <= 2)   { score += 8 }
  missing.forEach(f => gaps.push(`Subject property missing: ${f}`))

  // Market context (max 15 pts)
  if (marketContext?.condition)         score += 5
  if (marketContext?.monthlyAppreciation != null) score += 5
  if (marketContext?.listToSaleRatio)   score += 5
  if (!marketContext?.condition)        gaps.push('Market condition not specified (seller/balanced/buyer)')
  if (marketContext?.monthlyAppreciation == null) gaps.push('Monthly appreciation rate not provided')

  // Confidence label
  let label, color
  if (score >= 80)      { label = 'Very High'; color = 'green' }
  else if (score >= 60) { label = 'High';      color = 'green' }
  else if (score >= 40) { label = 'Medium';    color = 'yellow' }
  else if (score >= 20) { label = 'Low';       color = 'orange' }
  else                  { label = 'Insufficient Data'; color = 'red' }

  return { score, label, color, reasons, gaps }
}

// ─── Time helpers ──────────────────────────────────────────────────────────
export function getMonthsAgo(dateStr) {
  if (!dateStr) return 12
  const then = new Date(dateStr)
  const now = new Date()
  return (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth())
}

// ─── Core adjustment calculator ────────────────────────────────────────────
function adjustComp(subject, comp, marketContext, adj = DEFAULT_ADJUSTMENTS) {
  const adjustments = {}
  let adjusted = comp.salePrice

  // 1. Size (GLA)
  const sqftDiff = (subject.sqft || 0) - (comp.sqft || 0)
  // Determine local price/sqft from comp, apply 30% adjustment rate (standard practice)
  const pricePerSqft = (comp.salePrice / (comp.sqft || subject.sqft || 1500))
  const sqftAdj = sqftDiff * (pricePerSqft * 0.30)
  adjustments.sqft = Math.round(sqftAdj)
  adjusted += adjustments.sqft

  // 2. Condition
  const condDiff = (CONDITION_SCORES[subject.condition] || 3) - (CONDITION_SCORES[comp.condition] || 3)
  const condAdj = adjusted * condDiff * adj.conditionPerGrade
  adjustments.condition = Math.round(condAdj)
  adjusted += adjustments.condition

  // 3. Full bathrooms
  const bathDiff = (subject.bathsFull || 0) - (comp.bathsFull || 0)
  adjustments.bathsFull = bathDiff * adj.bathroomFull
  adjusted += adjustments.bathsFull

  // 4. Half bathrooms
  const halfBathDiff = (subject.bathsHalf || 0) - (comp.bathsHalf || 0)
  adjustments.bathsHalf = halfBathDiff * adj.bathroomHalf
  adjusted += adjustments.bathsHalf

  // 5. Garage spaces
  const garageDiff = (subject.garageSpaces || 0) - (comp.garageSpaces || 0)
  adjustments.garage = garageDiff * adj.garagePerSpace
  adjusted += adjustments.garage

  // 6. Below-grade finished sqft
  const bgDiff = (subject.basementFinishedSqft || 0) - (comp.basementFinishedSqft || 0)
  adjustments.basement = bgDiff * adj.basement
  adjusted += adjustments.basement

  // 7. Pool
  if ((subject.pool || false) !== (comp.pool || false)) {
    adjustments.pool = subject.pool ? adj.pool : -adj.pool
    adjusted += adjustments.pool
  }

  // 8. Time adjustment (market appreciation)
  const monthsAgo = getMonthsAgo(comp.saleDate)
  const monthlyRate = marketContext?.monthlyAppreciation ?? 0
  const timeAdj = adjusted * monthsAgo * monthlyRate
  adjustments.time = Math.round(timeAdj)
  adjusted += adjustments.time

  return {
    ...comp,
    adjustedPrice: Math.round(adjusted),
    adjustments,
    totalNetAdj: Math.round(adjusted - comp.salePrice),
    totalGrossAdj: Math.round(Object.values(adjustments).reduce((s, v) => s + Math.abs(v), 0)),
    monthsAgo,
  }
}

// ─── Weighting ─────────────────────────────────────────────────────────────
function weightComp(comp) {
  let w = 1.0

  // Recency
  if (comp.monthsAgo <= 1)      w *= 1.5
  else if (comp.monthsAgo <= 3) w *= 1.3
  else if (comp.monthsAgo <= 6) w *= 1.0
  else if (comp.monthsAgo <= 9) w *= 0.7
  else                          w *= 0.5

  // Proximity
  const dist = comp.distanceMiles || 0.5
  if (dist <= 0.25)      w *= 1.4
  else if (dist <= 0.5)  w *= 1.2
  else if (dist <= 1.0)  w *= 1.0
  else if (dist <= 2.0)  w *= 0.8
  else                   w *= 0.6

  // Gross adjustment ratio (lower adj = more similar = more reliable)
  const grossRatio = comp.totalGrossAdj / comp.salePrice
  if (grossRatio <= 0.05)      w *= 1.3
  else if (grossRatio <= 0.10) w *= 1.1
  else if (grossRatio <= 0.15) w *= 0.9
  else                         w *= 0.7

  return Math.max(0.1, w)
}

// ─── Main export ───────────────────────────────────────────────────────────
export function calculateValuation(subjectProperty, comps, marketContext) {
  const confidence = scoreConfidence(subjectProperty, comps, marketContext)

  if (comps.length === 0) {
    return {
      pointEstimate: null,
      rangeLow: null,
      rangeHigh: null,
      confidence,
      adjustedComps: [],
      methodology: 'Sales Comparison Approach (CMA)',
      error: 'Cannot calculate — no comparable sales provided',
    }
  }

  // Adjust each comp
  const adjustedComps = comps.map(c => adjustComp(subjectProperty, c, marketContext))

  // Weight and compute weighted average
  const weights = adjustedComps.map(weightComp)
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  const weightedAvg = adjustedComps.reduce((sum, comp, i) =>
    sum + comp.adjustedPrice * weights[i], 0) / totalWeight

  // Market condition overlay
  let finalValue = weightedAvg
  const condition = marketContext?.condition
  if (condition === 'seller')   finalValue *= 1.015
  else if (condition === 'buyer') finalValue *= 0.985

  // Recent improvements uplift
  const improvements = subjectProperty.improvements || []
  const improvementUplift = improvements.reduce((sum, imp) => {
    const factor = IMP_ROI[imp.type] || 0.6
    return sum + (imp.estimatedCost || 0) * factor
  }, 0)

  finalValue += improvementUplift * 0.4 // blend: market already knows about good condition

  // Round to nearest $500
  const rounded = Math.round(finalValue / 500) * 500

  // Uncertainty band — tighter for high confidence
  const bandFactor = confidence.score >= 70 ? 0.04 : confidence.score >= 50 ? 0.06 : 0.08

  return {
    pointEstimate: rounded,
    rangeLow:  Math.round((rounded * (1 - bandFactor)) / 500) * 500,
    rangeHigh: Math.round((rounded * (1 + bandFactor)) / 500) * 500,
    confidence,
    adjustedComps: adjustedComps.map((c, i) => ({ ...c, weight: Math.round(weights[i] * 100) / 100 })),
    methodology: 'Sales Comparison Approach (CMA) — weighted average of adjusted comparables',
    weightedAverage: Math.round(weightedAvg),
    marketConditionAdj: condition ? `${condition} market overlay applied` : 'none',
  }
}

// ─── Improvement ROI map ───────────────────────────────────────────────────
export const IMP_ROI = {
  kitchen_remodel:     0.70,
  bathroom_remodel:    0.65,
  addition:            0.60,
  basement_finish:     0.65,
  roof_replacement:    0.68,
  hvac_replacement:    0.60,
  windows:             0.55,
  flooring:            0.72,
  fresh_paint:         0.80,
  landscaping:         0.75,
  deck_addition:       0.65,
  garage_addition:     0.70,
  other:               0.50,
}

// ─── Data gap analysis ─────────────────────────────────────────────────────
export function analyzeDataGaps(subject, comps, marketContext) {
  const critical = []
  const recommended = []
  const nice = []

  // Critical
  if (!subject.address)     critical.push({ field: 'Property address', impact: 'Cannot proceed without address' })
  if (!subject.sqft)        critical.push({ field: 'Above-grade sqft', impact: 'Primary size adjustment impossible' })
  if (!subject.beds)        critical.push({ field: 'Bedroom count', impact: 'Comp selection accuracy affected' })
  if (!subject.bathsFull)   critical.push({ field: 'Full bath count', impact: 'Standard adjustment missing' })
  if (comps.length === 0)   critical.push({ field: 'Comparable sales', impact: 'No calculation possible' })
  else if (comps.length < 3) critical.push({ field: `Need ${3 - comps.length} more comp(s)`, impact: 'Minimum 3 comps for reliable valuation' })

  // Recommended
  if (!subject.yearBuilt)    recommended.push({ field: 'Year built', impact: 'Age adjustment omitted' })
  if (!subject.condition)    recommended.push({ field: 'Condition rating', impact: 'Condition adjustment omitted — major factor' })
  if (!subject.garageSpaces) recommended.push({ field: 'Garage spaces', impact: '$15K+ per space — frequently omitted' })
  if (!marketContext?.condition) recommended.push({ field: 'Market condition (seller/balanced/buyer)', impact: '±1.5% on final value' })
  if (marketContext?.monthlyAppreciation == null) recommended.push({ field: 'Monthly appreciation rate', impact: 'Time adjustments will be zero' })

  // Nice to have
  if (!subject.lotSize)      nice.push({ field: 'Lot size', impact: 'Lot size adjustment omitted' })
  if (!subject.basementFinishedSqft && subject.hasBasement) nice.push({ field: 'Finished basement sqft', impact: '$15/sqft below grade' })
  if (subject.improvements?.length === 0) nice.push({ field: 'Recent improvements list', impact: 'Cannot model condition uplift' })
  if (!marketContext?.listToSaleRatio) nice.push({ field: 'List-to-sale ratio', impact: 'Pricing strategy calibration' })
  if (!marketContext?.avgDom)          nice.push({ field: 'Average DOM in area', impact: 'Market velocity context' })

  return { critical, recommended, nice, completeness: calcCompleteness(critical, recommended) }
}

function calcCompleteness(critical, recommended) {
  const critBlocks = critical.length
  const recBlocks = recommended.length
  if (critBlocks > 1)    return { level: 'insufficient', pct: 15 }
  if (critBlocks === 1)  return { level: 'partial', pct: 35 }
  if (recBlocks >= 3)    return { level: 'moderate', pct: 55 }
  if (recBlocks >= 1)    return { level: 'good', pct: 75 }
  return { level: 'complete', pct: 95 }
}

// ─── Improvement value estimator ────────────────────────────────────────────
export function estimateImprovementValue(improvements) {
  return improvements.reduce((sum, imp) => {
    const roi = IMP_ROI[imp.type] || 0.6
    return sum + (imp.estimatedCost || 0) * roi
  }, 0)
}

// ─── Format helpers ─────────────────────────────────────────────────────────
export function formatCurrency(val) {
  if (val == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
}

export function formatVariance(pct) {
  if (pct == null) return '—'
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct.toFixed(1)}%`
}
