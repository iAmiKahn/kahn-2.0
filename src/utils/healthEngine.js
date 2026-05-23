// healthEngine.js — Pure calculation functions for the Total Human Optimization system.
// No side effects, no data persistence. All functions take inputs and return outputs.

// ─── Constants ────────────────────────────────────────────────────────────────

export const MEAL_STRUCTURE = [
  { id: 'breakfast',  label: 'Breakfast',                    time: '08:00', type: 'main',  proteinTarget: 45, notes: 'Foundation meal — hit leucine threshold' },
  { id: 'snack_am',   label: 'Mid-Morning Snack',            time: '10:30', type: 'snack', proteinTarget: 15, notes: 'Micro/macro gap filler' },
  { id: 'lunch',      label: 'Lunch (Pre-Workout)',           time: '11:30', type: 'main',  proteinTarget: 45, notes: 'High carb, moderate protein, low fat — 90 min before training' },
  { id: 'snack_pm',   label: 'Afternoon Snack (Post-Workout)', time: '15:00', type: 'snack', proteinTarget: 25, notes: 'Protein + carbs — capitalize on elevated MPS' },
  { id: 'dinner',     label: 'Dinner',                       time: '18:30', type: 'main',  proteinTarget: 45, notes: 'Balanced macro meal' },
  { id: 'snack_bed',  label: 'Pre-Bedtime Snack',            time: '21:30', type: 'snack', proteinTarget: 35, notes: 'Slow protein — casein/cottage cheese for overnight MPS' },
]

export const SUPPLEMENTS = [
  { name: 'Vitamin D3',            dose: '4,000-5,000 IU',    timing: 'With breakfast (fat-containing meal)', priority: 'critical', monthlyEstCost: 5 },
  { name: 'Magnesium Glycinate',   dose: '300-400mg',         timing: '30-60 min before bed',                 priority: 'critical', monthlyEstCost: 8 },
  { name: 'Omega-3 (EPA focus)',   dose: '2-3g EPA/DHA',      timing: 'With meals, split AM/PM',              priority: 'critical', monthlyEstCost: 12 },
  { name: 'Zinc + Copper',         dose: '25-30mg Zn, 1-2mg Cu', timing: 'With dinner',                      priority: 'critical', monthlyEstCost: 5 },
  { name: 'Creatine Monohydrate',  dose: '5g',                timing: 'Any time, daily',                      priority: 'critical', monthlyEstCost: 6 },
  { name: 'Vitamin K2 (MK-7)',     dose: '100-200mcg',        timing: 'With Vitamin D',                       priority: 'important', monthlyEstCost: 5 },
  { name: 'Brazil Nuts',           dose: '2 nuts/day',        timing: 'Any time (selenium ~100-200mcg)',       priority: 'important', monthlyEstCost: 3 },
  { name: 'Vitamin C + Gelatin',   dose: '500mg C + 15g gelatin', timing: '30-60 min before training',        priority: 'important', monthlyEstCost: 6 },
]

export const MICRONUTRIENT_TARGETS = {
  vitamins: [
    { name: 'Vitamin D3',    target: '4,000-5,000 IU', unit: 'IU',   role: 'Testosterone, mood, immune', supplementNeeded: true },
    { name: 'Vitamin B6',    target: '2-5',     unit: 'mg',   role: 'Dopamine synthesis (ADHD)', supplementNeeded: false },
    { name: 'Vitamin B12',   target: '100-500', unit: 'mcg',  role: 'Energy, nervous system', supplementNeeded: false },
    { name: 'Folate (B9)',   target: '400-800', unit: 'mcg',  role: 'Neurotransmitter synthesis', supplementNeeded: false },
    { name: 'Vitamin C',     target: '500-1,000', unit: 'mg', role: 'Cortisol regulation, collagen, iron absorption', supplementNeeded: false },
    { name: 'Vitamin A',     target: '900',     unit: 'mcg',  role: 'Immune function, testosterone', supplementNeeded: false },
    { name: 'Vitamin E',     target: '15-30',   unit: 'mg',   role: 'Antioxidant, cell protection', supplementNeeded: false },
    { name: 'Vitamin K2',    target: '100-200', unit: 'mcg',  role: 'Calcium metabolism, cardiovascular', supplementNeeded: true },
  ],
  minerals: [
    { name: 'Magnesium',   target: '400-600', unit: 'mg',  role: 'Sleep, recovery, 300+ enzymatic reactions', supplementNeeded: true },
    { name: 'Zinc',         target: '25-40',   unit: 'mg',  role: 'Testosterone, immune, protein synthesis', supplementNeeded: true },
    { name: 'Iron',         target: '8-18',    unit: 'mg',  role: 'Dopamine synthesis, oxygen transport', supplementNeeded: false },
    { name: 'Selenium',     target: '100-200', unit: 'mcg', role: 'Thyroid, testosterone, antioxidant', supplementNeeded: false },
    { name: 'Chromium',     target: '200-500', unit: 'mcg', role: 'Insulin sensitivity (Abilify offset)', supplementNeeded: false },
    { name: 'Calcium',      target: '1,000',   unit: 'mg',  role: 'Bone density, muscle contraction', supplementNeeded: false },
    { name: 'Potassium',    target: '3,500-4,700', unit: 'mg', role: 'Blood pressure, muscle function', supplementNeeded: false },
    { name: 'Sodium',       target: '2,000-4,000', unit: 'mg', role: 'Electrolyte balance, training', supplementNeeded: false },
    { name: 'Iodine',       target: '150-300', unit: 'mcg', role: 'Thyroid hormone production', supplementNeeded: false },
    { name: 'Copper',       target: '1-2',     unit: 'mg',  role: 'Iron metabolism (required with zinc)', supplementNeeded: true },
  ],
  other: [
    { name: 'Omega-3 EPA/DHA', target: '2-3',  unit: 'g',   role: 'Anti-inflammatory, ADHD, brain health', supplementNeeded: true },
    { name: 'Creatine',        target: '5',     unit: 'g',   role: 'Strength, cognitive function', supplementNeeded: true },
    { name: 'Fiber',            target: '30-40', unit: 'g',   role: 'Blood sugar stability, gut health', supplementNeeded: false },
  ],
}

export const SLEEP_TARGETS = {
  bedTime: '21:30',
  wakeTime: '06:00',
  timeInBed_hrs: 8.5,
  actualSleep_hrs: 7.75,
  caffeineCutoff: '13:00',
  caffeineMax_mg: 250,
  caffeineTiming: '12:00-12:30 (pre-workout)',
  preSleepProtocol: [
    { time: '20:00', action: 'Warm shower (10 min, 104-109°F)' },
    { time: '20:30', action: 'Brain dump — write tomorrow\'s tasks on paper' },
    { time: '21:00', action: 'Magnesium glycinate (300-400mg)' },
    { time: '21:00', action: 'Dim lights, no stimulating screens' },
    { time: '21:15', action: 'Pre-bed protein (cottage cheese / casein)' },
    { time: '21:30', action: 'Lights out' },
  ],
  morningProtocol: [
    { time: '06:00', action: 'Wake — consistent time, ±30 min including weekends' },
    { time: '06:05', action: 'Morning resting heart rate (before standing)' },
    { time: '06:10', action: '10,000 lux bright light (20-30 min)' },
    { time: '06:15', action: 'Recovery score self-assessment (5 questions)' },
  ],
  roomTemp_f: '65-68',
  alcoholPolicy: 'ZERO — non-negotiable (Abilify + sleep aid + IOP + recomp)',
}

export const RECOVERY_QUESTIONS = [
  { id: 'sleep_quality', label: 'Sleep Quality',     scale: '1=terrible, 5=excellent' },
  { id: 'soreness',      label: 'Muscle Soreness',   scale: '1=severe, 5=none' },
  { id: 'stress',        label: 'Stress Level',      scale: '1=extreme, 5=calm' },
  { id: 'energy',        label: 'Energy Level',      scale: '1=exhausted, 5=energized' },
  { id: 'mood',          label: 'Mood',              scale: '1=very low, 5=great' },
]

// ─── Body Composition Calculations ────────────────────────────────────────────

export function calculateFFMI(leanMassLbs, heightInches) {
  const leanMassKg = leanMassLbs * 0.453592
  const heightM = heightInches * 0.0254
  return leanMassKg / (heightM * heightM)
}

export function calculateLeanMass(weightLbs, bodyFatPct) {
  return weightLbs * (1 - bodyFatPct / 100)
}

export function calculateFatMass(weightLbs, bodyFatPct) {
  return weightLbs * (bodyFatPct / 100)
}

export function analyzeBodyComp(profile) {
  const { weight_lbs, bodyFat_pct, height_in } = profile.personal
  const targets = profile.targets

  const currentLean = calculateLeanMass(weight_lbs, bodyFat_pct)
  const currentFat = calculateFatMass(weight_lbs, bodyFat_pct)
  const currentFFMI = calculateFFMI(currentLean, height_in)

  const targetBF = (targets.bodyFat_pct_min + targets.bodyFat_pct_max) / 2
  const targetLean = calculateLeanMass(targets.weight_lbs, targetBF)
  const targetFat = calculateFatMass(targets.weight_lbs, targetBF)
  const targetFFMI = calculateFFMI(targetLean, height_in)

  const leanDelta = targetLean - currentLean
  const fatDelta = currentFat - targetFat

  return {
    current: { weight: weight_lbs, bodyFat: bodyFat_pct, leanMass: Math.round(currentLean * 10) / 10, fatMass: Math.round(currentFat * 10) / 10, ffmi: Math.round(currentFFMI * 10) / 10 },
    target:  { weight: targets.weight_lbs, bodyFat: targetBF, leanMass: Math.round(targetLean * 10) / 10, fatMass: Math.round(targetFat * 10) / 10, ffmi: Math.round(targetFFMI * 10) / 10 },
    delta:   { leanToGain: Math.round(leanDelta * 10) / 10, fatToLose: Math.round(fatDelta * 10) / 10 },
  }
}

// ─── Metabolic Calculations ───────────────────────────────────────────────────

export function calculateBMR(weightLbs, heightInches, age, sex = 'male') {
  // Mifflin-St Jeor (most validated for overweight individuals)
  const weightKg = weightLbs * 0.453592
  const heightCm = heightInches * 2.54
  const base = (10 * weightKg) + (6.25 * heightCm) - (5 * age)
  return Math.round(sex === 'male' ? base + 5 : base - 161)
}

export function calculateBMR_KatchMcArdle(weightLbs, bodyFatPct) {
  // More accurate at higher body fat — uses lean body mass
  const leanMassKg = calculateLeanMass(weightLbs, bodyFatPct) * 0.453592
  return Math.round(370 + (21.6 * leanMassKg))
}

export function calculateTDEE(bmr, isTrainingDay) {
  // Activity multipliers for structured resistance training + daily walking
  const multiplier = isTrainingDay ? 1.6 : 1.35
  return Math.round(bmr * multiplier)
}

export function calculateMacroTargets(profile) {
  const { weight_lbs, bodyFat_pct, height_in, age } = profile.personal

  const bmrMSJ = calculateBMR(weight_lbs, height_in, age)
  const bmrKM = calculateBMR_KatchMcArdle(weight_lbs, bodyFat_pct)
  const bmr = Math.round((bmrMSJ + bmrKM) / 2) // average both methods

  const tdeeTraining = calculateTDEE(bmr, true)
  const tdeeRest = calculateTDEE(bmr, false)

  // Caloric cycling: slight surplus on training days, moderate deficit on rest days
  const calTraining = { min: tdeeTraining, max: tdeeTraining + 200 }
  const calRest = { min: tdeeRest - 500, max: tdeeRest - 300 }

  // Protein: 0.9-1.0g per lb body weight (high end for recomp at 42)
  const protein = { min: Math.round(weight_lbs * 0.88), max: Math.round(weight_lbs * 1.0) }
  const proteinCals = { min: protein.min * 4, max: protein.max * 4 }

  // Fat: 0.32-0.44g per lb (maintains hormonal health)
  const fat = { min: Math.round(weight_lbs * 0.32), max: Math.round(weight_lbs * 0.44) }
  const fatCals = { min: fat.min * 9, max: fat.max * 9 }

  // Carbs: fill remaining calories
  const carbsTrainingMin = Math.round((calTraining.min - proteinCals.max - fatCals.max) / 4)
  const carbsTrainingMax = Math.round((calTraining.max - proteinCals.min - fatCals.min) / 4)
  const carbsRestMin = Math.round((calRest.min - proteinCals.max - fatCals.max) / 4)
  const carbsRestMax = Math.round((calRest.max - proteinCals.min - fatCals.min) / 4)

  return {
    bmr,
    tdee: { training: tdeeTraining, rest: tdeeRest },
    calories: { training: calTraining, rest: calRest },
    protein,
    fat,
    carbs: {
      training: { min: Math.max(carbsTrainingMin, 150), max: carbsTrainingMax },
      rest: { min: Math.max(carbsRestMin, 100), max: carbsRestMax },
    },
    hydration_oz: {
      base: Math.round(weight_lbs * 0.55),
      training: Math.round(weight_lbs * 0.55) + 32,
    },
    fiber: { min: 30, max: 40 },
  }
}

// ─── Compliance Calculations ──────────────────────────────────────────────────

export function calculateComplianceScore(dayEntry) {
  const domains = {
    nutrition: { items: ['breakfast', 'snack_am', 'lunch', 'snack_pm', 'dinner', 'snack_bed', 'hydration'], checked: 0 },
    training:  { items: ['workout', 'cardio', 'logged_performance'], checked: 0 },
    sleep:     { items: ['bedtime', 'waketime', 'sleep_quality'], checked: 0 },
    recovery:  { items: ['discomfort_check', 'energy_level', 'rpe'], checked: 0 },
  }

  for (const [domain, info] of Object.entries(domains)) {
    for (const item of info.items) {
      if (dayEntry?.[domain]?.[item]) info.checked++
    }
  }

  const results = {}
  let totalChecked = 0
  let totalItems = 0

  for (const [domain, info] of Object.entries(domains)) {
    results[domain] = Math.round((info.checked / info.items.length) * 100)
    totalChecked += info.checked
    totalItems += info.items.length
  }

  results.overall = Math.round((totalChecked / totalItems) * 100)
  return results
}

export function calculateWeeklyCompliance(weekEntries) {
  const dailyScores = weekEntries.map(calculateComplianceScore)
  const domains = ['nutrition', 'training', 'sleep', 'recovery', 'overall']
  const weekly = {}

  for (const domain of domains) {
    const scores = dailyScores.map(s => s[domain]).filter(s => s !== undefined)
    weekly[domain] = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  }

  return weekly
}

// ─── Recovery Assessment ──────────────────────────────────────────────────────

export function assessRecovery(recoveryScores) {
  // recoveryScores: { sleep_quality, soreness, stress, energy, mood } — each 1-5
  const total = Object.values(recoveryScores).reduce((a, b) => a + b, 0)
  const max = Object.keys(recoveryScores).length * 5

  let status, recommendation
  if (total >= 20) {
    status = 'optimal'
    recommendation = 'Full training — execute as prescribed'
  } else if (total >= 15) {
    status = 'adequate'
    recommendation = 'Train normally — monitor RPE, back off if RPE exceeds targets by 1+'
  } else if (total >= 12) {
    status = 'suboptimal'
    recommendation = 'Reduce volume 30% — compound lifts only, skip accessories'
  } else {
    status = 'poor'
    recommendation = 'Bad Day Protocol — 15-20 min mobility work or full rest day'
  }

  return { total, max, percentage: Math.round((total / max) * 100), status, recommendation }
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

export function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function getWeekKey(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const dayNum = d.getDay() || 7
  d.setDate(d.getDate() + 4 - dayNum)
  const yearStart = new Date(d.getFullYear(), 0, 1)
  const weekNum = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

export function getWeekDates(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  const monday = new Date(d)
  monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  monday.setHours(0, 0, 0, 0)

  const dates = []
  for (let i = 0; i < 7; i++) {
    const dd = new Date(monday)
    dd.setDate(monday.getDate() + i)
    dates.push(dd.toISOString().slice(0, 10))
  }
  return dates
}

export function isTrainingDay(dayOfWeek) {
  // 5-day training split: Mon-Fri (0=Mon in getWeekDates)
  // Days 0-4 = training, 5-6 = rest
  // Or by JS day: 1-5 = training, 0,6 = rest
  return dayOfWeek >= 1 && dayOfWeek <= 5
}

// ─── Phase Timeline ───────────────────────────────────────────────────────────

export const RECOMP_PHASES = [
  {
    phase: 1,
    name: 'Re-Adaptation + Initial Recomp',
    months: '1-3',
    description: 'Tendon re-adaptation (weeks 1-4 at 60-70% intensity). Muscle memory activation. Neural re-adaptation.',
    expectedFatLoss: '5-10 lbs',
    expectedMuscleGain: '3-6 lbs (muscle memory)',
    targetWeight: '200-205 lbs',
    targetBF: '26-28%',
  },
  {
    phase: 2,
    name: 'Dedicated Hypertrophy + Slow Cut',
    months: '4-12',
    description: 'Full progressive overload. Caloric cycling established. Fat loss accelerates as training intensity increases.',
    expectedFatLoss: '15-25 lbs',
    expectedMuscleGain: '6-10 lbs',
    targetWeight: '185-195 lbs',
    targetBF: '18-22%',
  },
  {
    phase: 3,
    name: 'Continued Hypertrophy + Cut',
    months: '13-24',
    description: 'Approaching natural ceiling for new muscle. Continued fat loss. Lean bulk periods mixed with mini-cuts.',
    expectedFatLoss: '10-15 lbs',
    expectedMuscleGain: '4-6 lbs',
    targetWeight: '180-190 lbs',
    targetBF: '14-16%',
  },
  {
    phase: 4,
    name: 'Final Optimization',
    months: '25-30',
    description: 'Maintain muscle, shed remaining fat to target. Fine-tune nutrition and training for sustainable maintenance.',
    expectedFatLoss: '5-10 lbs',
    expectedMuscleGain: '1-3 lbs',
    targetWeight: '185-190 lbs',
    targetBF: '12-15%',
  },
]

// ─── Default Profile ──────────────────────────────────────────────────────────

export function createDefaultProfile() {
  return {
    personal: {
      name: 'Dan Kahn',
      age: 42,
      sex: 'male',
      height_in: 71, // 5'11"
      weight_lbs: 205,
      bodyFat_pct: 30,
    },
    targets: {
      weight_lbs: 190,
      bodyFat_pct_min: 12,
      bodyFat_pct_max: 15,
      timeline_months: 24,
    },
    medical: {
      medications: [
        { name: 'Abilify (Aripiprazole)', dosage: null, timing: 'morning', notes: 'Partial D2 agonist — 10-20% metabolic headwind, possible appetite effects' },
        { name: 'Sleep Aid', type: null, dosage: null, timing: 'bedtime', notes: 'Specific medication TBD' },
      ],
      conditions: ['ADHD (confirmed)', 'Suspected Autism Spectrum (Tier 1)'],
      allergies: [],
      injuries: [],
    },
    schedule: {
      iopDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
      iopTime: { start: '09:00', end: '11:45' },
      trainingWindow: { start: '13:00', end: '15:00' },
      walkTime: 'After dinner, 1 hour',
    },
    outstanding: {
      testosterone_total: null,
      testosterone_free: null,
      sleepAidName: null,
      sleepAidDosage: null,
      abilifyDosage: null,
      baselineLifts: null,
      mileTime: null,
      caloricIntakeEstimate: null,
      waistCircumference: null,
      neckCircumference: null,
      kitchenEquipment: null,
      weeklyFoodBudget: null,
      wearableDevice: null,
      currentSupplements: null,
      bloodwork: null,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function createEmptyDayEntry(dateKey) {
  const dayOfWeek = new Date(dateKey + 'T12:00:00').getDay()
  return {
    date: dateKey,
    isTrainingDay: isTrainingDay(dayOfWeek),
    dayOfWeek,
    nutrition: {
      breakfast: false,
      snack_am: false,
      lunch: false,
      snack_pm: false,
      dinner: false,
      snack_bed: false,
      hydration: false,
    },
    training: {
      workout: false,
      cardio: false,
      logged_performance: false,
    },
    sleep: {
      bedtime: false,
      waketime: false,
      sleep_quality: null, // 'good' | 'okay' | 'poor'
    },
    recovery: {
      discomfort_check: false,
      discomfort_location: null,
      energy_level: null, // 'high' | 'moderate' | 'low'
      rpe: null, // 1-10
      morning_scores: null, // { sleep_quality, soreness, stress, energy, mood }
      morning_rhr: null,
    },
    badDayProtocol: false,
    notes: '',
  }
}
