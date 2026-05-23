// narrationStore.js — Data access layer for Life Narration system.
// Handles all reads/writes for domains, roadmap, profile, goal, and daily entries.

const isElectron = typeof window !== 'undefined' && window.api !== undefined

const DOMAINS = ['legal', 'financial', 'health', 'creative', 'relational']

async function read(path) {
  if (isElectron) return window.api.readData(`life-narration/${path}`)
  const raw = localStorage.getItem(`ln_${path}`)
  return raw ? JSON.parse(raw) : null
}

async function write(path, data) {
  if (isElectron) return window.api.writeData(`life-narration/${path}`, data)
  localStorage.setItem(`ln_${path}`, JSON.stringify(data))
  return { ok: true }
}

// ─── Profile ──────────────────────────────────────────────────────────────
export async function getProfile() {
  return await read('profile') || {}
}

export async function saveProfile(profile) {
  return write('profile', { ...profile, updatedAt: new Date().toISOString() })
}

// ─── Goal ─────────────────────────────────────────────────────────────────
export async function getGoal() {
  return await read('goal') || {}
}

export async function saveGoal(goal) {
  return write('goal', { ...goal, updatedAt: new Date().toISOString() })
}

// ─── Domains ──────────────────────────────────────────────────────────────
export async function getDomain(domainId) {
  return await read(`domains/${domainId}`) || null
}

export async function getAllDomains() {
  const results = await Promise.all(DOMAINS.map(id => getDomain(id)))
  return results.filter(Boolean)
}

export async function saveDomain(domain) {
  return write(`domains/${domain.id}`, { ...domain, updatedAt: new Date().toISOString() })
}

// ─── Roadmap ──────────────────────────────────────────────────────────────
export async function getRoadmap() {
  return await read('roadmap') || { phases: [] }
}

export async function saveRoadmap(roadmap) {
  return write('roadmap', { ...roadmap, updatedAt: new Date().toISOString() })
}

// ─── Daily entries ────────────────────────────────────────────────────────
export async function getDailyEntry(date) {
  return await read(`daily/${date}`) || null
}

export async function saveDailyEntry(date, entry) {
  return write(`daily/${date}`, { ...entry, date, updatedAt: new Date().toISOString() })
}

// ─── Action completion ────────────────────────────────────────────────────
export async function toggleActionComplete(date, actionId) {
  let entry = await getDailyEntry(date)
  if (!entry) {
    entry = { date, completedActions: [], skippedActions: [], log: '', createdAt: new Date().toISOString() }
  }
  const completed = entry.completedActions || []
  const idx = completed.indexOf(actionId)
  if (idx >= 0) {
    completed.splice(idx, 1)
  } else {
    completed.push(actionId)
  }
  entry.completedActions = completed
  await saveDailyEntry(date, entry)
  return entry
}

export async function saveDailyLog(date, log) {
  let entry = await getDailyEntry(date)
  if (!entry) {
    entry = { date, completedActions: [], skippedActions: [], log: '', createdAt: new Date().toISOString() }
  }
  entry.log = log
  await saveDailyEntry(date, entry)
  return entry
}

// ─── Handoff inbox ────────────────────────────────────────────────────────
export async function getHandoff() {
  if (isElectron) {
    try {
      const result = await window.api.readData('handoff/inbox')
      return result || []
    } catch { return [] }
  }
  const raw = localStorage.getItem('ln_handoff_inbox')
  return raw ? JSON.parse(raw) : []
}

// ─── Utilities ────────────────────────────────────────────────────────────
export function getToday() {
  return new Date().toISOString().split('T')[0]
}

export function getDayNumber(startDate) {
  const start = new Date(startDate)
  const now = new Date()
  return Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1
}

export { DOMAINS }
