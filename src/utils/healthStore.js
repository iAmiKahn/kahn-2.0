// healthStore.js — Data persistence layer for the health optimization system.
// Follows the same pattern as dataStore.js — thin wrapper over Electron IPC.

import { createDefaultProfile, createEmptyDayEntry, getTodayKey, calculateMacroTargets } from './healthEngine.js'

const isElectron = typeof window !== 'undefined' && window.api !== undefined

// ─── Generic helpers ──────────────────────────────────────────────────────────

async function readHealthStore(name) {
  if (isElectron) return window.api.readData(`health/${name}`)
  const raw = localStorage.getItem(`kahn_health_${name}`)
  return raw ? JSON.parse(raw) : null
}

async function writeHealthStore(name, data) {
  if (isElectron) return window.api.writeData(`health/${name}`, data)
  localStorage.setItem(`kahn_health_${name}`, JSON.stringify(data))
  return { ok: true }
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────

export async function getProfile() {
  const data = await readHealthStore('profile')
  if (!data) {
    const profile = createDefaultProfile()
    await writeHealthStore('profile', profile)
    return profile
  }
  return data
}

export async function saveProfile(profile) {
  profile.updatedAt = new Date().toISOString()
  await writeHealthStore('profile', profile)
  return profile
}

export async function updateProfileField(path, value) {
  const profile = await getProfile()
  const keys = path.split('.')
  let obj = profile
  for (let i = 0; i < keys.length - 1; i++) {
    obj = obj[keys[i]]
  }
  obj[keys[keys.length - 1]] = value
  return saveProfile(profile)
}

// ─── COMPLIANCE (daily entries) ───────────────────────────────────────────────

export async function getCompliance() {
  const data = await readHealthStore('compliance')
  return data || {}
}

export async function getDayEntry(dateKey) {
  const all = await getCompliance()
  return all[dateKey] || createEmptyDayEntry(dateKey)
}

export async function saveDayEntry(dateKey, entry) {
  const all = await getCompliance()
  all[dateKey] = { ...entry, updatedAt: new Date().toISOString() }
  await writeHealthStore('compliance', all)
  return all[dateKey]
}

export async function toggleComplianceItem(dateKey, domain, item) {
  const entry = await getDayEntry(dateKey)
  entry[domain][item] = !entry[domain][item]
  return saveDayEntry(dateKey, entry)
}

export async function updateComplianceField(dateKey, domain, item, value) {
  const entry = await getDayEntry(dateKey)
  entry[domain][item] = value
  return saveDayEntry(dateKey, entry)
}

// ─── RECOVERY SCORES ─────────────────────────────────────────────────────────

export async function saveRecoveryScores(dateKey, scores) {
  const entry = await getDayEntry(dateKey)
  entry.recovery.morning_scores = scores
  entry.recovery.discomfort_check = true
  return saveDayEntry(dateKey, entry)
}

export async function saveMorningRHR(dateKey, rhr) {
  const entry = await getDayEntry(dateKey)
  entry.recovery.morning_rhr = rhr
  return saveDayEntry(dateKey, entry)
}

// ─── BAD DAY PROTOCOL ────────────────────────────────────────────────────────

export async function toggleBadDayProtocol(dateKey) {
  const entry = await getDayEntry(dateKey)
  entry.badDayProtocol = !entry.badDayProtocol
  return saveDayEntry(dateKey, entry)
}

// ─── WEEKLY DATA ─────────────────────────────────────────────────────────────

export async function getWeekEntries(weekDates) {
  const all = await getCompliance()
  return weekDates.map(d => all[d] || createEmptyDayEntry(d))
}

// ─── TRAINING PERFORMANCE ────────────────────────────────────────────

export async function getTrainingPerformance(dateKey) {
  const data = await readHealthStore('training-performance')
  return data?.[dateKey] || null
}

export async function saveTrainingPerformance(dateKey, performance) {
  const data = await readHealthStore('training-performance') || {}
  data[dateKey] = { ...performance, updatedAt: new Date().toISOString() }
  await writeHealthStore('training-performance', data)
  return data[dateKey]
}

export async function getAllTrainingPerformance() {
  return await readHealthStore('training-performance') || {}
}

// ─── MEAL PLANS ──────────────────────────────────────────────────────────────

export async function getMealPlans() {
  const data = await readHealthStore('meal-plans')
  return data || {}
}

export async function saveMealPlan(weekKey, plan) {
  const all = await getMealPlans()
  all[weekKey] = { ...plan, updatedAt: new Date().toISOString() }
  await writeHealthStore('meal-plans', all)
  return all[weekKey]
}

// ─── HEALTH DASHBOARD STATS ─────────────────────────────────────────────────

export async function getHealthStats() {
  const profile = await getProfile()
  const compliance = await getCompliance()
  const today = getTodayKey()

  const todayEntry = compliance[today] || null
  const macroTargets = calculateMacroTargets(profile)

  // Calculate current streak (consecutive days with 80%+ overall compliance)
  let streak = 0
  const d = new Date()
  d.setDate(d.getDate() - 1) // start from yesterday (today may be incomplete)
  while (true) {
    const key = d.toISOString().slice(0, 10)
    const entry = compliance[key]
    if (!entry) break
    // Count checked items
    let checked = 0, total = 0
    for (const domain of ['nutrition', 'training', 'sleep', 'recovery']) {
      if (!entry[domain]) continue
      for (const val of Object.values(entry[domain])) {
        if (typeof val === 'boolean') {
          total++
          if (val) checked++
        }
      }
    }
    if (total === 0 || (checked / total) < 0.8) break
    streak++
    d.setDate(d.getDate() - 1)
  }

  // Total logged days
  const totalDays = Object.keys(compliance).length

  // Outstanding data count
  const outstandingCount = profile.outstanding
    ? Object.values(profile.outstanding).filter(v => v === null).length
    : 0

  return { profile, macroTargets, todayEntry, streak, totalDays, outstandingCount }
}
