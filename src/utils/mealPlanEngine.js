// mealPlanEngine.js — Meal plan generator with specific meals, exact ingredients,
// quantities, macros per meal, and estimated costs.
// Designed for budget optimization (~$250-350/month).
// Brett (Dan's brother, a chef) cooks all meals — needs exact ingredients + quantities.

// ─── Ingredient Database (cost per unit, macros per unit) ─────────────────────

const INGREDIENTS = {
  // PROTEINS
  chicken_breast:    { name: 'Chicken Breast',         unit: 'oz', protein: 7.8, carbs: 0, fat: 0.9,  cal: 39,  costPer: 0.19, category: 'protein' },
  chicken_thigh:     { name: 'Chicken Thigh (boneless)', unit: 'oz', protein: 6.5, carbs: 0, fat: 2.6, cal: 52,  costPer: 0.12, category: 'protein' },
  ground_beef_80:    { name: 'Ground Beef (80/20)',     unit: 'oz', protein: 7.0, carbs: 0, fat: 5.0,  cal: 72,  costPer: 0.28, category: 'protein' },
  ground_turkey:     { name: 'Ground Turkey (93/7)',    unit: 'oz', protein: 7.0, carbs: 0, fat: 2.0,  cal: 45,  costPer: 0.22, category: 'protein' },
  eggs:              { name: 'Whole Eggs',              unit: 'large', protein: 6.0, carbs: 0.6, fat: 5.0, cal: 72, costPer: 0.25, category: 'protein' },
  egg_whites:        { name: 'Egg Whites',              unit: 'large', protein: 3.6, carbs: 0.2, fat: 0.1, cal: 17, costPer: 0.15, category: 'protein' },
  cottage_cheese:    { name: 'Cottage Cheese (2%)',     unit: 'cup', protein: 26, carbs: 8, fat: 3, cal: 180, costPer: 0.95, category: 'protein' },
  greek_yogurt:      { name: 'Greek Yogurt (plain, 0%)', unit: 'cup', protein: 20, carbs: 9, fat: 0, cal: 120, costPer: 0.75, category: 'protein' },
  canned_tuna:       { name: 'Canned Tuna (in water)',  unit: 'can', protein: 20, carbs: 0, fat: 1, cal: 90, costPer: 0.90, category: 'protein' },
  whey_protein:      { name: 'Whey Protein Powder',     unit: 'scoop', protein: 24, carbs: 3, fat: 1.5, cal: 120, costPer: 0.60, category: 'protein' },

  // CARBS
  white_rice:        { name: 'White Rice (cooked)',      unit: 'cup', protein: 4, carbs: 45, fat: 0.4, cal: 206, costPer: 0.15, category: 'carb' },
  brown_rice:        { name: 'Brown Rice (cooked)',      unit: 'cup', protein: 5, carbs: 45, fat: 1.8, cal: 216, costPer: 0.18, category: 'carb' },
  oats:              { name: 'Old-Fashioned Oats (dry)', unit: 'cup', protein: 10, carbs: 54, fat: 5, cal: 300, costPer: 0.20, category: 'carb' },
  sweet_potato:      { name: 'Sweet Potato',             unit: 'medium', protein: 4, carbs: 37, fat: 0, cal: 162, costPer: 0.50, category: 'carb' },
  banana:            { name: 'Banana',                   unit: 'medium', protein: 1.3, carbs: 27, fat: 0.4, cal: 105, costPer: 0.20, category: 'carb' },
  whole_wheat_bread: { name: 'Whole Wheat Bread',        unit: 'slice', protein: 4, carbs: 12, fat: 1, cal: 80, costPer: 0.12, category: 'carb' },
  lentils:           { name: 'Lentils (cooked)',         unit: 'cup', protein: 18, carbs: 40, fat: 0.8, cal: 230, costPer: 0.25, category: 'carb' },
  black_beans:       { name: 'Black Beans (cooked)',     unit: 'cup', protein: 15, carbs: 41, fat: 1, cal: 227, costPer: 0.22, category: 'carb' },
  potato:            { name: 'Potato (baked)',            unit: 'medium', protein: 4, carbs: 37, fat: 0.2, cal: 161, costPer: 0.35, category: 'carb' },

  // FATS
  olive_oil:         { name: 'Olive Oil',                unit: 'tbsp', protein: 0, carbs: 0, fat: 14, cal: 119, costPer: 0.10, category: 'fat' },
  peanut_butter:     { name: 'Natural Peanut Butter',    unit: 'tbsp', protein: 4, carbs: 3, fat: 8, cal: 95, costPer: 0.10, category: 'fat' },
  almonds:           { name: 'Almonds',                  unit: 'oz', protein: 6, carbs: 6, fat: 14, cal: 164, costPer: 0.25, category: 'fat' },
  avocado:           { name: 'Avocado',                  unit: 'half', protein: 2, carbs: 6, fat: 11, cal: 120, costPer: 0.75, category: 'fat' },
  cheese_cheddar:    { name: 'Cheddar Cheese',           unit: 'oz', protein: 7, carbs: 0.4, fat: 9, cal: 113, costPer: 0.22, category: 'fat' },
  brazil_nuts:       { name: 'Brazil Nuts',              unit: 'nut', protein: 2, carbs: 0.6, fat: 4, cal: 33, costPer: 0.10, category: 'fat' },

  // VEGETABLES
  broccoli:          { name: 'Broccoli',                 unit: 'cup', protein: 3, carbs: 6, fat: 0.3, cal: 31, costPer: 0.30, category: 'vegetable' },
  spinach:           { name: 'Spinach',                  unit: 'cup (raw)', protein: 1, carbs: 1, fat: 0, cal: 7, costPer: 0.20, category: 'vegetable' },
  mixed_greens:      { name: 'Mixed Salad Greens',       unit: 'cup', protein: 1, carbs: 2, fat: 0, cal: 10, costPer: 0.25, category: 'vegetable' },
  bell_pepper:       { name: 'Bell Pepper',              unit: 'medium', protein: 1.3, carbs: 7, fat: 0.3, cal: 31, costPer: 0.50, category: 'vegetable' },
  frozen_veg_mix:    { name: 'Frozen Mixed Vegetables',  unit: 'cup', protein: 4, carbs: 12, fat: 0.5, cal: 60, costPer: 0.25, category: 'vegetable' },
  tomato:            { name: 'Tomato',                   unit: 'medium', protein: 1, carbs: 5, fat: 0.2, cal: 22, costPer: 0.30, category: 'vegetable' },

  // OTHER
  gelatin:           { name: 'Gelatin Powder',           unit: 'tbsp', protein: 6, carbs: 0, fat: 0, cal: 23, costPer: 0.15, category: 'other' },
  honey:             { name: 'Honey',                    unit: 'tbsp', protein: 0, carbs: 17, fat: 0, cal: 64, costPer: 0.12, category: 'other' },
  salsa:             { name: 'Salsa',                    unit: 'tbsp', protein: 0, carbs: 1, fat: 0, cal: 5, costPer: 0.05, category: 'other' },
}

// ─── Meal Templates ───────────────────────────────────────────────────────────
// Each template specifies exact ingredients and quantities.
// Templates are organized by meal slot and rotated weekly for variety.

const MEAL_TEMPLATES = {
  breakfast: [
    {
      name: 'Loaded Egg & Oat Bowl',
      ingredients: [
        { id: 'eggs', qty: 4 },
        { id: 'egg_whites', qty: 2 },
        { id: 'oats', qty: 0.75 },
        { id: 'banana', qty: 1 },
        { id: 'peanut_butter', qty: 1 },
        { id: 'spinach', qty: 1 },
      ],
      prep: 'Scramble eggs + whites with spinach. Cook oats separately. Top oats with sliced banana and PB.',
    },
    {
      name: 'Turkey & Sweet Potato Hash',
      ingredients: [
        { id: 'ground_turkey', qty: 6 },
        { id: 'eggs', qty: 3 },
        { id: 'sweet_potato', qty: 1 },
        { id: 'bell_pepper', qty: 0.5 },
        { id: 'olive_oil', qty: 1 },
      ],
      prep: 'Dice sweet potato, cook in oil. Add turkey, cook through. Scramble eggs on top. Add peppers.',
    },
    {
      name: 'Protein Oatmeal Power Bowl',
      ingredients: [
        { id: 'oats', qty: 1 },
        { id: 'whey_protein', qty: 1 },
        { id: 'eggs', qty: 3 },
        { id: 'banana', qty: 1 },
        { id: 'almonds', qty: 0.5 },
      ],
      prep: 'Cook oats, stir in whey when warm (not boiling). Scramble eggs on side. Top oats with banana and almonds.',
    },
  ],
  snack_am: [
    {
      name: 'Greek Yogurt & Almonds',
      ingredients: [
        { id: 'greek_yogurt', qty: 0.75 },
        { id: 'almonds', qty: 0.5 },
        { id: 'brazil_nuts', qty: 2 },
      ],
      prep: 'Combine. No cooking needed.',
    },
    {
      name: 'Cottage Cheese & Banana',
      ingredients: [
        { id: 'cottage_cheese', qty: 0.5 },
        { id: 'banana', qty: 0.5 },
        { id: 'brazil_nuts', qty: 2 },
      ],
      prep: 'Slice banana, top cottage cheese.',
    },
    {
      name: 'Egg & Toast',
      ingredients: [
        { id: 'eggs', qty: 2 },
        { id: 'whole_wheat_bread', qty: 2 },
        { id: 'peanut_butter', qty: 1 },
      ],
      prep: 'Hard boil eggs. Toast bread with PB.',
    },
  ],
  lunch: [
    {
      name: 'Chicken Breast & Rice Bowl',
      ingredients: [
        { id: 'chicken_breast', qty: 8 },
        { id: 'white_rice', qty: 1.5 },
        { id: 'broccoli', qty: 1 },
        { id: 'olive_oil', qty: 0.5 },
      ],
      prep: 'Grill or bake chicken. Season rice. Steam broccoli. Drizzle oil.',
    },
    {
      name: 'Turkey & Potato Plate',
      ingredients: [
        { id: 'ground_turkey', qty: 8 },
        { id: 'potato', qty: 1.5 },
        { id: 'frozen_veg_mix', qty: 1 },
        { id: 'olive_oil', qty: 0.5 },
      ],
      prep: 'Brown turkey with seasoning. Bake potato. Microwave vegetables.',
    },
    {
      name: 'Beef & Lentil Power Bowl',
      ingredients: [
        { id: 'ground_beef_80', qty: 6 },
        { id: 'lentils', qty: 0.75 },
        { id: 'spinach', qty: 2 },
        { id: 'tomato', qty: 1 },
      ],
      prep: 'Brown beef, drain. Mix with cooked lentils. Serve over spinach with diced tomato.',
    },
  ],
  snack_pm: [
    {
      name: 'Post-Workout Shake + Rice Cake',
      ingredients: [
        { id: 'whey_protein', qty: 1.5 },
        { id: 'banana', qty: 1 },
        { id: 'oats', qty: 0.25 },
      ],
      prep: 'Blend whey, banana, oats with water or milk. Drink within 30 min of training.',
    },
    {
      name: 'Tuna & Crackers',
      ingredients: [
        { id: 'canned_tuna', qty: 1 },
        { id: 'whole_wheat_bread', qty: 2 },
        { id: 'tomato', qty: 0.5 },
      ],
      prep: 'Mix tuna with diced tomato. Serve on toast. Quick post-workout option.',
    },
    {
      name: 'Chicken & Rice Quick Bowl',
      ingredients: [
        { id: 'chicken_thigh', qty: 4 },
        { id: 'white_rice', qty: 1 },
        { id: 'salsa', qty: 4 },
      ],
      prep: 'Use pre-cooked chicken from meal prep. Reheat with rice. Top with salsa.',
    },
  ],
  dinner: [
    {
      name: 'Grilled Chicken Thigh & Bean Bowl',
      ingredients: [
        { id: 'chicken_thigh', qty: 8 },
        { id: 'black_beans', qty: 0.75 },
        { id: 'brown_rice', qty: 1 },
        { id: 'frozen_veg_mix', qty: 1 },
        { id: 'olive_oil', qty: 1 },
        { id: 'avocado', qty: 0.5 },
      ],
      prep: 'Grill or pan-sear thighs. Season beans with cumin. Serve over rice with veggies and avocado.',
    },
    {
      name: 'Beef & Sweet Potato Plate',
      ingredients: [
        { id: 'ground_beef_80', qty: 8 },
        { id: 'sweet_potato', qty: 1 },
        { id: 'broccoli', qty: 1.5 },
        { id: 'olive_oil', qty: 1 },
        { id: 'cheese_cheddar', qty: 1 },
      ],
      prep: 'Brown beef with seasoning. Bake sweet potato. Steam broccoli. Top with cheese.',
    },
    {
      name: 'Turkey Lentil Stew',
      ingredients: [
        { id: 'ground_turkey', qty: 8 },
        { id: 'lentils', qty: 1 },
        { id: 'potato', qty: 1 },
        { id: 'frozen_veg_mix', qty: 1.5 },
        { id: 'olive_oil', qty: 1 },
        { id: 'tomato', qty: 1 },
      ],
      prep: 'Brown turkey. Add diced potato, lentils, tomato, vegetables, and water. Simmer 25-30 min.',
    },
  ],
  snack_bed: [
    {
      name: 'Cottage Cheese & PB',
      ingredients: [
        { id: 'cottage_cheese', qty: 1 },
        { id: 'peanut_butter', qty: 1.5 },
      ],
      prep: 'Mix PB into cottage cheese. Slow casein protein + fat = sustained overnight release.',
    },
    {
      name: 'Greek Yogurt Protein Bowl',
      ingredients: [
        { id: 'greek_yogurt', qty: 1 },
        { id: 'whey_protein', qty: 0.5 },
        { id: 'almonds', qty: 0.5 },
      ],
      prep: 'Mix whey into yogurt. Top with almonds. Thick, dessert-like texture.',
    },
    {
      name: 'Casein Shake',
      ingredients: [
        { id: 'cottage_cheese', qty: 0.75 },
        { id: 'peanut_butter', qty: 1 },
        { id: 'banana', qty: 0.5 },
      ],
      prep: 'Blend cottage cheese, PB, and half banana with ice. Slow-digesting protein shake.',
    },
  ],
}

// ─── Meal Plan Generator ──────────────────────────────────────────────────────

function calculateMealMacros(meal) {
  let protein = 0, carbs = 0, fat = 0, calories = 0, cost = 0

  for (const item of meal.ingredients) {
    const ing = INGREDIENTS[item.id]
    if (!ing) continue
    protein  += ing.protein * item.qty
    carbs    += ing.carbs * item.qty
    fat      += ing.fat * item.qty
    calories += ing.cal * item.qty
    cost     += ing.costPer * item.qty
  }

  return {
    protein:  Math.round(protein),
    carbs:    Math.round(carbs),
    fat:      Math.round(fat),
    calories: Math.round(calories),
    cost:     Math.round(cost * 100) / 100,
  }
}

function formatIngredient(item) {
  const ing = INGREDIENTS[item.id]
  if (!ing) return null

  let qtyStr = ''
  if (item.qty === 0.25) qtyStr = '¼'
  else if (item.qty === 0.5) qtyStr = '½'
  else if (item.qty === 0.75) qtyStr = '¾'
  else if (item.qty === 1.5) qtyStr = '1½'
  else qtyStr = String(item.qty)

  return {
    name: ing.name,
    quantity: `${qtyStr} ${ing.unit}${item.qty > 1 && !ing.unit.endsWith('s') ? 's' : ''}`,
    macros: {
      protein: Math.round(ing.protein * item.qty),
      carbs: Math.round(ing.carbs * item.qty),
      fat: Math.round(ing.fat * item.qty),
      calories: Math.round(ing.cal * item.qty),
    },
  }
}

export function generateDayMealPlan(dayIndex = 0) {
  // dayIndex rotates meal selection: 0-6 maps to template index 0, 1, 2, 0, 1, 2, 0
  const slots = ['breakfast', 'snack_am', 'lunch', 'snack_pm', 'dinner', 'snack_bed']
  const meals = []
  let dailyTotals = { protein: 0, carbs: 0, fat: 0, calories: 0, cost: 0 }

  for (const slot of slots) {
    const templates = MEAL_TEMPLATES[slot]
    const templateIdx = dayIndex % templates.length
    const template = templates[templateIdx]

    const macros = calculateMealMacros(template)
    const ingredients = template.ingredients.map(formatIngredient).filter(Boolean)

    dailyTotals.protein  += macros.protein
    dailyTotals.carbs    += macros.carbs
    dailyTotals.fat      += macros.fat
    dailyTotals.calories += macros.calories
    dailyTotals.cost     += macros.cost

    meals.push({
      slot,
      name: template.name,
      prep: template.prep,
      ingredients,
      macros,
    })
  }

  dailyTotals.cost = Math.round(dailyTotals.cost * 100) / 100

  return { meals, dailyTotals }
}

// ─── Shopping List Aggregation (for Brett) ───────────────────────────────

export function generateShoppingList(dayIndex = 0) {
  const dayPlan = generateDayMealPlan(dayIndex)
  const agg = {}

  for (const meal of dayPlan.meals) {
    for (const ing of meal.ingredients) {
      const key = ing.name
      if (!agg[key]) {
        agg[key] = { name: ing.name, quantity: ing.quantity, totalProtein: ing.macros.protein, totalCal: ing.macros.calories, count: 1 }
      } else {
        agg[key].totalProtein += ing.macros.protein
        agg[key].totalCal += ing.macros.calories
        agg[key].count += 1
        // Append quantity info
        agg[key].quantity += ` + ${ing.quantity}`
      }
    }
  }

  return Object.values(agg).sort((a, b) => b.totalProtein - a.totalProtein)
}

export function generateWeeklyShoppingList() {
  const agg = {}

  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const dayPlan = generateDayMealPlan(dayIndex)
    for (const meal of dayPlan.meals) {
      for (const rawItem of meal.ingredients) {
        // Re-resolve from the raw template to get quantities
        // rawItem has: name, quantity (string), macros
        const key = rawItem.name
        if (!agg[key]) {
          agg[key] = { name: rawItem.name, occurrences: 0, totalProtein: 0, totalCal: 0, totalCost: 0 }
        }
        agg[key].occurrences += 1
        agg[key].totalProtein += rawItem.macros.protein
        agg[key].totalCal += rawItem.macros.calories
      }
    }
  }

  return Object.values(agg).sort((a, b) => b.occurrences - a.occurrences)
}

// ─── Macro Target Comparison ─────────────────────────────────────────────

export function compareMealPlanToTargets(dayPlan, macroTargets, isTrainingDay) {
  const targets = {
    calories: isTrainingDay ? macroTargets.calories.training : macroTargets.calories.rest,
    protein: macroTargets.protein,
    fat: macroTargets.fat,
    carbs: isTrainingDay ? macroTargets.carbs.training : macroTargets.carbs.rest,
  }

  const actual = dayPlan.dailyTotals

  return {
    calories: {
      actual: actual.calories,
      target: targets.calories,
      delta: actual.calories - ((targets.calories.min + targets.calories.max) / 2),
      inRange: actual.calories >= targets.calories.min && actual.calories <= targets.calories.max,
    },
    protein: {
      actual: actual.protein,
      target: targets.protein,
      delta: actual.protein - ((targets.protein.min + targets.protein.max) / 2),
      inRange: actual.protein >= targets.protein.min && actual.protein <= targets.protein.max,
    },
    carbs: {
      actual: actual.carbs,
      target: targets.carbs,
      delta: actual.carbs - ((targets.carbs.min + targets.carbs.max) / 2),
      inRange: actual.carbs >= targets.carbs.min && actual.carbs <= targets.carbs.max,
    },
    fat: {
      actual: actual.fat,
      target: targets.fat,
      delta: actual.fat - ((targets.fat.min + targets.fat.max) / 2),
      inRange: actual.fat >= targets.fat.min && actual.fat <= targets.fat.max,
    },
  }
}

export function generateWeekMealPlan() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const weekPlan = []
  let weeklyTotals = { protein: 0, carbs: 0, fat: 0, calories: 0, cost: 0 }

  for (let i = 0; i < 7; i++) {
    const dayPlan = generateDayMealPlan(i)
    weekPlan.push({ day: days[i], ...dayPlan })

    weeklyTotals.protein  += dayPlan.dailyTotals.protein
    weeklyTotals.carbs    += dayPlan.dailyTotals.carbs
    weeklyTotals.fat      += dayPlan.dailyTotals.fat
    weeklyTotals.calories += dayPlan.dailyTotals.calories
    weeklyTotals.cost     += dayPlan.dailyTotals.cost
  }

  weeklyTotals.cost = Math.round(weeklyTotals.cost * 100) / 100

  return {
    weekPlan,
    weeklyTotals,
    avgDaily: {
      protein:  Math.round(weeklyTotals.protein / 7),
      carbs:    Math.round(weeklyTotals.carbs / 7),
      fat:      Math.round(weeklyTotals.fat / 7),
      calories: Math.round(weeklyTotals.calories / 7),
      cost:     Math.round(weeklyTotals.cost / 7 * 100) / 100,
    },
    estimatedMonthlyCost: Math.round(weeklyTotals.cost * 4.33 * 100) / 100,
  }
}
