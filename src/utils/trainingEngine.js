// trainingEngine.js — Training programming engine for hypertrophy-focused body recomposition.
// 5-day modified Push/Pull/Legs split with upper-body priority.
// Progressive overload via double progression. RPE-based autoregulation.

// ─── Exercise Database ────────────────────────────────────────────────────────

export const EXERCISES = {
  // CHEST
  incline_db_press:    { name: 'Incline Dumbbell Press',     muscle: 'Chest (upper)',     type: 'compound',  equipment: 'dumbbells, incline bench', notes: '30° incline — upper pec priority' },
  flat_barbell_bench:  { name: 'Flat Barbell Bench Press',   muscle: 'Chest',             type: 'compound',  equipment: 'barbell, flat bench',      notes: 'Primary chest mass builder' },
  incline_cable_fly:   { name: 'Incline Cable Fly',          muscle: 'Chest (upper)',     type: 'isolation', equipment: 'cables, incline bench',    notes: 'Stretch-mediated hypertrophy' },
  flat_db_press:       { name: 'Flat Dumbbell Press',        muscle: 'Chest',             type: 'compound',  equipment: 'dumbbells, flat bench',    notes: 'Greater ROM than barbell' },
  cable_fly:           { name: 'Cable Fly',                  muscle: 'Chest',             type: 'isolation', equipment: 'cables',                   notes: 'Peak contraction emphasis' },

  // SHOULDERS
  overhead_press:      { name: 'Overhead Press (Barbell)',   muscle: 'Shoulders (front)', type: 'compound',  equipment: 'barbell',                  notes: 'Compound shoulder mass' },
  db_lateral_raise:    { name: 'Dumbbell Lateral Raise',     muscle: 'Shoulders (side)',  type: 'isolation', equipment: 'dumbbells',                notes: 'Shoulder width builder' },
  cable_lateral_raise: { name: 'Cable Lateral Raise',        muscle: 'Shoulders (side)',  type: 'isolation', equipment: 'cable',                    notes: 'Constant tension throughout ROM' },
  face_pull:           { name: 'Face Pull',                  muscle: 'Shoulders (rear)',  type: 'isolation', equipment: 'cable, rope',               notes: 'Non-negotiable for shoulder health' },
  reverse_pec_deck:    { name: 'Reverse Pec Deck',           muscle: 'Shoulders (rear)',  type: 'isolation', equipment: 'pec deck machine',         notes: 'Rear delt isolation' },
  db_shoulder_press:   { name: 'Dumbbell Shoulder Press',    muscle: 'Shoulders',         type: 'compound',  equipment: 'dumbbells',                notes: 'Seated or standing' },

  // TRICEPS
  overhead_cable_ext:  { name: 'Overhead Cable Extension',   muscle: 'Triceps (long)',    type: 'isolation', equipment: 'cable, rope',              notes: 'Long head stretch emphasis' },
  skullcrusher:        { name: 'EZ-Bar Skullcrusher',        muscle: 'Triceps',           type: 'isolation', equipment: 'EZ bar, flat bench',       notes: 'Heavy tricep loading' },
  cable_pushdown:      { name: 'Cable Pushdown',             muscle: 'Triceps (lateral)', type: 'isolation', equipment: 'cable, bar/rope',          notes: 'Lateral + medial heads' },
  close_grip_bench:    { name: 'Close-Grip Bench Press',     muscle: 'Triceps',           type: 'compound',  equipment: 'barbell, flat bench',      notes: 'Heaviest tricep compound' },

  // BICEPS
  barbell_curl:        { name: 'Barbell Curl',               muscle: 'Biceps',            type: 'isolation', equipment: 'barbell',                  notes: 'Primary mass builder' },
  incline_db_curl:     { name: 'Incline Dumbbell Curl',      muscle: 'Biceps (long head)',type: 'isolation', equipment: 'dumbbells, incline bench', notes: 'Long head stretch — builds peak' },
  hammer_curl:         { name: 'Hammer Curl',                muscle: 'Brachialis',        type: 'isolation', equipment: 'dumbbells',                notes: 'Arm thickness + forearm' },
  cable_curl:          { name: 'Bayesian Cable Curl',        muscle: 'Biceps (long head)',type: 'isolation', equipment: 'cable',                    notes: 'Maximizes stretched position' },
  preacher_curl:       { name: 'Preacher Curl',              muscle: 'Biceps (short head)',type: 'isolation',equipment: 'EZ bar, preacher bench',   notes: 'Short head / width emphasis' },

  // FOREARMS
  wrist_curl:          { name: 'Wrist Curl',                 muscle: 'Forearm (flexor)',  type: 'isolation', equipment: 'barbell/dumbbells',        notes: 'Inner forearm, 15-25 reps' },
  reverse_wrist_curl:  { name: 'Reverse Wrist Curl',         muscle: 'Forearm (extensor)',type: 'isolation', equipment: 'barbell/dumbbells',        notes: 'Outer forearm + elbow health' },
  reverse_curl:        { name: 'Reverse Curl (EZ Bar)',      muscle: 'Brachioradialis',   type: 'isolation', equipment: 'EZ bar',                   notes: 'Forearm size bridge' },
  farmer_carry:        { name: "Farmer's Carry",             muscle: 'Forearms + grip',   type: 'compound',  equipment: 'dumbbells/trap bar',       notes: '30-60 sec walks' },

  // BACK
  pullup:              { name: 'Pull-Up',                    muscle: 'Lats (width)',      type: 'compound',  equipment: 'pull-up bar',              notes: 'Bodyweight or weighted' },
  lat_pulldown:        { name: 'Lat Pulldown',               muscle: 'Lats (width)',      type: 'compound',  equipment: 'cable, lat bar',           notes: 'Alternative to pull-ups' },
  barbell_row:         { name: 'Barbell Row',                muscle: 'Back (thickness)',  type: 'compound',  equipment: 'barbell',                  notes: 'Primary horizontal pull' },
  seated_cable_row:    { name: 'Seated Cable Row',           muscle: 'Back (mid)',        type: 'compound',  equipment: 'cable, close-grip handle', notes: 'Complements barbell row' },
  chest_supported_row: { name: 'Chest-Supported Row',        muscle: 'Upper back',        type: 'compound',  equipment: 'dumbbells, incline bench', notes: 'No lower back fatigue' },

  // LEGS
  barbell_squat:       { name: 'Barbell Back Squat',         muscle: 'Quads, glutes',     type: 'compound',  equipment: 'barbell, squat rack',      notes: 'King of lower body' },
  leg_press:           { name: 'Leg Press',                  muscle: 'Quads, glutes',     type: 'compound',  equipment: 'leg press machine',        notes: 'Alternative to squat' },
  romanian_deadlift:   { name: 'Romanian Deadlift',          muscle: 'Hamstrings, glutes',type: 'compound',  equipment: 'barbell',                  notes: 'Posterior chain' },
  leg_curl:            { name: 'Seated Leg Curl',            muscle: 'Hamstrings',        type: 'isolation', equipment: 'leg curl machine',         notes: 'Hamstring isolation' },
  calf_raise:          { name: 'Standing Calf Raise',        muscle: 'Calves',            type: 'isolation', equipment: 'calf raise machine',       notes: 'High reps (12-20)' },

  // ABS
  cable_crunch:        { name: 'Cable Crunch',               muscle: 'Rectus abdominis',  type: 'isolation', equipment: 'cable, rope',              notes: 'Loadable — progressive overload possible' },
  hanging_leg_raise:   { name: 'Hanging Leg Raise',          muscle: 'Rectus abdominis',  type: 'isolation', equipment: 'pull-up bar',              notes: 'Lower ab emphasis' },
  ab_wheel:            { name: 'Ab Wheel Rollout',           muscle: 'Core (anterior)',   type: 'compound',  equipment: 'ab wheel',                 notes: 'Anti-extension, excellent overall' },
  pallof_press:        { name: 'Pallof Press',               muscle: 'Obliques',          type: 'isolation', equipment: 'cable, D-handle',          notes: 'Anti-rotation — waist-safe' },
}

// ─── 5-Day Training Split ─────────────────────────────────────────────────────
// Upper Push / Upper Pull / Legs+Abs / Upper Push (shoulder) / Upper Pull (arm)
// Upper body muscles hit 2x/week. Legs 1x (maintenance). Abs 2x.

export const TRAINING_SPLIT = {
  1: { // Monday — Upper Push A (Chest focus)
    name: 'Upper Push A — Chest Focus',
    dayOfWeek: 1,
    focus: 'Chest, Front/Side Delts, Triceps',
    exercises: [
      { exerciseId: 'incline_db_press',    sets: 4, repRange: '8-12',  rpe: '7-8',  rest: '2-3 min', notes: 'Primary chest builder — 30° incline' },
      { exerciseId: 'flat_barbell_bench',  sets: 3, repRange: '6-10',  rpe: '7-8',  rest: '2-3 min', notes: 'Heaviest chest compound' },
      { exerciseId: 'incline_cable_fly',   sets: 3, repRange: '10-15', rpe: '8-9',  rest: '1.5-2 min', notes: 'Stretch position — controlled eccentric' },
      { exerciseId: 'db_lateral_raise',    sets: 4, repRange: '12-20', rpe: '8-9',  rest: '1-1.5 min', notes: 'Shoulder width — slight lean-away' },
      { exerciseId: 'overhead_cable_ext',  sets: 3, repRange: '10-15', rpe: '8-9',  rest: '1.5-2 min', notes: 'Long head stretch' },
      { exerciseId: 'cable_pushdown',      sets: 3, repRange: '10-15', rpe: '8-9',  rest: '1.5 min', notes: 'Lateral/medial heads' },
    ],
  },
  2: { // Tuesday — Upper Pull A (Back focus)
    name: 'Upper Pull A — Back Focus',
    dayOfWeek: 2,
    focus: 'Back, Rear Delts, Biceps, Forearms',
    exercises: [
      { exerciseId: 'pullup',              sets: 4, repRange: '6-12',  rpe: '7-8',  rest: '2-3 min', notes: 'Weighted if bodyweight is easy' },
      { exerciseId: 'barbell_row',         sets: 4, repRange: '8-12',  rpe: '7-8',  rest: '2-3 min', notes: 'Primary horizontal pull' },
      { exerciseId: 'chest_supported_row', sets: 3, repRange: '10-12', rpe: '8-9',  rest: '1.5-2 min', notes: 'Upper back thickness' },
      { exerciseId: 'face_pull',           sets: 4, repRange: '15-20', rpe: '7-8',  rest: '1-1.5 min', notes: 'Shoulder health — every pull day' },
      { exerciseId: 'barbell_curl',        sets: 3, repRange: '8-12',  rpe: '7-8',  rest: '1.5-2 min', notes: 'Primary bicep mass builder' },
      { exerciseId: 'incline_db_curl',     sets: 3, repRange: '10-15', rpe: '8-9',  rest: '1.5 min', notes: 'Long head — builds the peak' },
      { exerciseId: 'reverse_curl',        sets: 3, repRange: '10-15', rpe: '8-9',  rest: '1 min', notes: 'Forearm bridge to biceps' },
    ],
  },
  3: { // Wednesday — Legs + Abs
    name: 'Legs + Abs',
    dayOfWeek: 3,
    focus: 'Quads, Hamstrings, Glutes, Calves, Core',
    exercises: [
      { exerciseId: 'barbell_squat',       sets: 4, repRange: '8-12',  rpe: '7-8',  rest: '2-3 min', notes: 'Maintenance volume — good depth' },
      { exerciseId: 'romanian_deadlift',   sets: 3, repRange: '8-12',  rpe: '7-8',  rest: '2-3 min', notes: 'Posterior chain — stretch hamstrings' },
      { exerciseId: 'leg_curl',            sets: 3, repRange: '10-15', rpe: '8-9',  rest: '1.5 min', notes: 'Hamstring isolation' },
      { exerciseId: 'calf_raise',          sets: 4, repRange: '12-20', rpe: '8-9',  rest: '1-1.5 min', notes: 'Full ROM — pause at bottom' },
      { exerciseId: 'cable_crunch',        sets: 3, repRange: '10-15', rpe: '8-9',  rest: '1-1.5 min', notes: 'Loadable ab exercise' },
      { exerciseId: 'hanging_leg_raise',   sets: 3, repRange: '10-15', rpe: '8-9',  rest: '1-1.5 min', notes: 'Knee raises as regression' },
      { exerciseId: 'pallof_press',        sets: 2, repRange: '10-12/side', rpe: '7-8', rest: '1 min', notes: 'Anti-rotation — waist-safe oblique work' },
    ],
  },
  4: { // Thursday — Upper Push B (Shoulder focus)
    name: 'Upper Push B — Shoulder Focus',
    dayOfWeek: 4,
    focus: 'Shoulders, Chest, Triceps',
    exercises: [
      { exerciseId: 'overhead_press',      sets: 4, repRange: '6-10',  rpe: '7-8',  rest: '2-3 min', notes: 'Primary shoulder compound' },
      { exerciseId: 'flat_db_press',       sets: 3, repRange: '8-12',  rpe: '7-8',  rest: '2-3 min', notes: 'Chest volume — greater ROM' },
      { exerciseId: 'cable_lateral_raise', sets: 4, repRange: '12-20', rpe: '8-9',  rest: '1-1.5 min', notes: 'Constant tension lateral raise' },
      { exerciseId: 'reverse_pec_deck',    sets: 3, repRange: '12-15', rpe: '8-9',  rest: '1-1.5 min', notes: 'Rear delt isolation' },
      { exerciseId: 'close_grip_bench',    sets: 3, repRange: '8-12',  rpe: '7-8',  rest: '2 min', notes: 'Heaviest tricep compound' },
      { exerciseId: 'skullcrusher',        sets: 3, repRange: '10-15', rpe: '8-9',  rest: '1.5 min', notes: 'EZ bar — wrist-friendly at 42' },
    ],
  },
  5: { // Friday — Upper Pull B (Arm focus)
    name: 'Upper Pull B — Arm Focus',
    dayOfWeek: 5,
    focus: 'Biceps, Forearms, Back, Rear Delts',
    exercises: [
      { exerciseId: 'lat_pulldown',        sets: 3, repRange: '8-12',  rpe: '7-8',  rest: '2 min', notes: 'Lat width — controlled eccentric' },
      { exerciseId: 'seated_cable_row',    sets: 3, repRange: '10-12', rpe: '7-8',  rest: '2 min', notes: 'Mid-back thickness' },
      { exerciseId: 'face_pull',           sets: 3, repRange: '15-20', rpe: '7-8',  rest: '1 min', notes: 'Shoulder health + rear delt' },
      { exerciseId: 'cable_curl',          sets: 3, repRange: '10-15', rpe: '8-9',  rest: '1.5 min', notes: 'Long head stretch under load' },
      { exerciseId: 'preacher_curl',       sets: 3, repRange: '10-15', rpe: '8-9',  rest: '1.5 min', notes: 'Short head — arm width' },
      { exerciseId: 'hammer_curl',         sets: 3, repRange: '10-12', rpe: '8-9',  rest: '1.5 min', notes: 'Brachialis + forearm thickness' },
      { exerciseId: 'wrist_curl',          sets: 2, repRange: '15-25', rpe: '8',    rest: '1 min', notes: 'Inner forearm' },
      { exerciseId: 'farmer_carry',        sets: 2, repRange: '30-60 sec', rpe: '7-8', rest: '1.5 min', notes: 'Grip + forearm finisher' },
    ],
  },
}

// Days 6-7 (Sat/Sun) = Rest days — walking only

// ─── Warm-Up Protocol ─────────────────────────────────────────────────────────

export const WARMUP_PROTOCOL = [
  { phase: 'Raise',     duration: '5 min',   description: 'Light walking/cycling to increase body temperature and heart rate' },
  { phase: 'Activate',  duration: '3-5 min', description: 'Band pull-aparts, face pulls, external rotations, scapular push-ups' },
  { phase: 'Mobilize',  duration: '3-5 min', description: 'Dynamic stretches for target areas — shoulder circles, arm swings, thoracic rotations' },
  { phase: 'Potentiate', duration: '2-3 sets', description: 'Ramp up to working weight: empty bar x12, 50% x8, 75% x5, then working sets' },
]

// ─── Get Today's Workout ──────────────────────────────────────────────────────

export function getTodayWorkout(dayOfWeek) {
  const workout = TRAINING_SPLIT[dayOfWeek]
  if (!workout) return null // rest day (0 = Sunday, 6 = Saturday)

  return {
    ...workout,
    exercises: workout.exercises.map(ex => ({
      ...ex,
      exercise: EXERCISES[ex.exerciseId],
    })),
    warmup: WARMUP_PROTOCOL,
    cooldown: 'Static stretching 5-10 min — focus on pecs, lats, hip flexors. Foam roll if desired.',
    estimatedDuration: '60-75 min (excluding warm-up)',
    cardio: {
      type: 'Walk',
      duration: '60 min',
      timing: 'After dinner',
      intensity: 'Conversational pace — 3.0-3.5 mph',
      notes: 'Daily LISS — near-zero interference with hypertrophy',
    },
  }
}

// ─── Deload Workout ───────────────────────────────────────────────────────────

export function getDeloadWorkout(dayOfWeek) {
  const workout = getTodayWorkout(dayOfWeek)
  if (!workout) return null

  return {
    ...workout,
    isDeload: true,
    name: `DELOAD — ${workout.name}`,
    exercises: workout.exercises.map(ex => ({
      ...ex,
      sets: Math.ceil(ex.sets / 2), // 50% volume reduction
      notes: `DELOAD: ${ex.notes}. Same weight, half the sets.`,
    })),
  }
}

// ─── Re-Adaptation Phase (Weeks 1-4) ─────────────────────────────────────────

export function getAdaptationWorkout(dayOfWeek) {
  const workout = getTodayWorkout(dayOfWeek)
  if (!workout) return null

  return {
    ...workout,
    isAdaptation: true,
    name: `ADAPTATION — ${workout.name}`,
    exercises: workout.exercises.map(ex => ({
      ...ex,
      rpe: '5-6',
      notes: `ADAPTATION: 60-70% intensity. Focus on form and mind-muscle connection. Tendons need 4 weeks to re-adapt. ${ex.notes}`,
    })),
  }
}

// ─── Training Phase Detection ─────────────────────────────────────────────

export function getTrainingPhase(profileCreatedAt) {
  if (!profileCreatedAt) return { phase: 'normal', weekNumber: 1, cycleWeek: 1, isDeload: false, isAdaptation: false, weeksUntilDeload: 3 }

  const startDate = new Date(profileCreatedAt)
  const now = new Date()
  const daysSinceStart = Math.floor((now - startDate) / 86400000)
  const weekNumber = Math.floor(daysSinceStart / 7) + 1

  // Weeks 1-4: Adaptation phase (tendon re-adaptation at 60-70% intensity)
  const isAdaptation = weekNumber <= 4

  // After adaptation, every 4th week is deload (week 8, 12, 16, etc.)
  // Cycle starts at week 5: cycle weeks 1-3 normal, cycle week 4 deload
  const postAdaptationWeek = weekNumber - 4
  const cycleWeek = isAdaptation ? weekNumber : ((postAdaptationWeek - 1) % 4) + 1
  const isDeload = !isAdaptation && cycleWeek === 4
  const weeksUntilDeload = isAdaptation ? (8 - weekNumber) : isDeload ? 0 : (4 - cycleWeek)

  let phase = 'normal'
  if (isAdaptation) phase = 'adaptation'
  else if (isDeload) phase = 'deload'

  return { phase, weekNumber, cycleWeek, isDeload, isAdaptation, weeksUntilDeload }
}

// ─── Performance Entry Template ───────────────────────────────────────────────

export function createPerformanceEntry(workout) {
  if (!workout) return null
  return {
    date: new Date().toISOString().slice(0, 10),
    dayOfWeek: workout.dayOfWeek,
    workoutName: workout.name,
    exercises: workout.exercises.map(ex => ({
      exerciseId: ex.exerciseId,
      exerciseName: ex.exercise.name,
      targetSets: ex.sets,
      targetRepRange: ex.repRange,
      targetRPE: ex.rpe,
      sets: Array.from({ length: ex.sets }, () => ({
        weight: null,
        reps: null,
        rpe: null,
      })),
    })),
    notes: '',
    sessionRPE: null,
    completed: false,
  }
}
