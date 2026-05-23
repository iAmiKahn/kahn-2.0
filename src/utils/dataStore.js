// dataStore.js — thin wrapper over the Electron IPC bridge for data persistence.
// Falls back to localStorage when running in browser dev mode (no Electron API).

const isElectron = typeof window !== 'undefined' && window.api !== undefined

// ─── Generic store helpers ─────────────────────────────────────────────────
async function readStore(name) {
  if (isElectron) return window.api.readData(name)
  const raw = localStorage.getItem(`kahn_re_${name}`)
  return raw ? JSON.parse(raw) : []
}

async function writeStore(name, data) {
  if (isElectron) return window.api.writeData(name, data)
  localStorage.setItem(`kahn_re_${name}`, JSON.stringify(data))
  return { ok: true }
}

// ─── ID generator ──────────────────────────────────────────────────────────
function genId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// ─── PROSPECTS ─────────────────────────────────────────────────────────────
export async function getProspects() {
  return readStore('prospects')
}

export async function saveProspect(prospect) {
  const all = await getProspects()
  if (prospect.id) {
    const idx = all.findIndex(p => p.id === prospect.id)
    if (idx >= 0) all[idx] = { ...all[idx], ...prospect, updatedAt: new Date().toISOString() }
    else all.push(prospect)
  } else {
    all.push({ ...prospect, id: genId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
  }
  await writeStore('prospects', all)
  return all
}

export async function deleteProspect(id) {
  const all = await getProspects()
  await writeStore('prospects', all.filter(p => p.id !== id))
}

// ─── PROPERTIES ────────────────────────────────────────────────────────────
export async function getProperties() {
  return readStore('properties')
}

export async function saveProperty(property) {
  const all = await getProperties()
  if (property.id) {
    const idx = all.findIndex(p => p.id === property.id)
    if (idx >= 0) all[idx] = { ...all[idx], ...property, updatedAt: new Date().toISOString() }
    else all.push(property)
  } else {
    all.push({ ...property, id: genId(), createdAt: new Date().toISOString() })
  }
  await writeStore('properties', all)
  return all
}

export async function getPropertiesForProspect(prospectId) {
  const all = await getProperties()
  return all.filter(p => p.prospectId === prospectId)
}

// ─── VALUATIONS ────────────────────────────────────────────────────────────
export async function getValuations() {
  return readStore('valuations')
}

export async function saveValuation(valuation) {
  const all = await getValuations()
  if (valuation.id) {
    const idx = all.findIndex(v => v.id === valuation.id)
    if (idx >= 0) all[idx] = { ...all[idx], ...valuation, updatedAt: new Date().toISOString() }
    else all.push(valuation)
  } else {
    all.push({ ...valuation, id: genId(), requestedAt: new Date().toISOString() })
  }
  await writeStore('valuations', all)
  return all
}

export async function getValuationsForProperty(propertyId) {
  const all = await getValuations()
  return all.filter(v => v.propertyId === propertyId)
}

export async function updateValuationOutcome(id, actualSalePrice, actualSaleDate) {
  const all = await getValuations()
  const v = all.find(v => v.id === id)
  if (!v) return
  v.actualSalePrice = actualSalePrice
  v.actualSaleDate = actualSaleDate
  v.variance = actualSalePrice && v.result?.pointEstimate
    ? Math.round(((actualSalePrice - v.result.pointEstimate) / v.result.pointEstimate) * 10000) / 100
    : null
  v.outcomeRecordedAt = new Date().toISOString()
  await writeStore('valuations', all)
  // Log learning from outcome
  await logLearning({
    type: 'valuation_outcome',
    source: 'outcome_comparison',
    insight: `Valuation #${id}: estimated ${v.result?.pointEstimate}, actual ${actualSalePrice}, variance ${v.variance}%`,
    propertyId: v.propertyId,
    prospectId: v.prospectId,
    variance: v.variance,
  })
  return all
}

// ─── INTERACTIONS ──────────────────────────────────────────────────────────
export async function getInteractions() {
  return readStore('interactions')
}

export async function saveInteraction(interaction) {
  const all = await getInteractions()
  if (interaction.id) {
    const idx = all.findIndex(i => i.id === interaction.id)
    if (idx >= 0) all[idx] = { ...all[idx], ...interaction }
    else all.push(interaction)
  } else {
    all.push({ ...interaction, id: genId(), createdAt: new Date().toISOString() })
  }
  await writeStore('interactions', all)
  return all
}

export async function getInteractionsForProspect(prospectId) {
  const all = await getInteractions()
  return all.filter(i => i.prospectId === prospectId).sort((a, b) => new Date(b.date) - new Date(a.date))
}

export async function deleteInteraction(id) {
  const all = await getInteractions()
  await writeStore('interactions', all.filter(i => i.id !== id))
}

// ─── LEARNING LOG ──────────────────────────────────────────────────────────
export async function getLearningLog() {
  return readStore('learning')
}

export async function logLearning(entry) {
  const all = await getLearningLog()
  all.push({ ...entry, id: genId(), loggedAt: new Date().toISOString() })
  await writeStore('learning', all)
}

// ─── SUMMARY STATS ─────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const [prospects, valuations, interactions] = await Promise.all([
    getProspects(),
    getValuations(),
    getInteractions(),
  ])

  const activeProspects = prospects.filter(p => p.status === 'active').length
  const totalValuations = valuations.length
  const completedValuations = valuations.filter(v => v.actualSalePrice).length
  const avgVariance = completedValuations
    ? valuations.filter(v => v.variance != null).reduce((sum, v) => sum + Math.abs(v.variance), 0) / completedValuations
    : null

  const nextFollowUps = interactions
    .filter(i => i.nextActionDate && new Date(i.nextActionDate) >= new Date())
    .sort((a, b) => new Date(a.nextActionDate) - new Date(b.nextActionDate))
    .slice(0, 5)

  return { activeProspects, totalProspects: prospects.length, totalValuations, completedValuations, avgVariance, nextFollowUps }
}
