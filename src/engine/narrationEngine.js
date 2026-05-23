// narrationEngine.js — Business logic for Life Narration.
// Generates daily narration, calculates domain status, resolves actions and deadlines.

const DAY_MAP = { 0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat' }

// ─── Utilities (must be before functions that use them) ───────────────────
function daysBetween(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1 + 'T00:00:00')
  const d2 = new Date(dateStr2 + 'T00:00:00')
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24))
}

function getDayNumber(startDate, currentDate) {
  return daysBetween(startDate, currentDate) + 1
}

function timesOverlap(time1, time2) {
  const parse = t => {
    const parts = t.split('-').map(p => {
      const [h, m] = p.trim().split(':').map(Number)
      return h * 60 + (m || 0)
    })
    return parts.length === 2 ? parts : [parts[0], parts[0] + 60]
  }
  const [s1, e1] = parse(time1)
  const [s2, e2] = parse(time2)
  return s1 < e2 && s2 < e1
}

function getNextDeadlineForDomain(domain, date) {
  let nearest = null
  ;(domain.objectives || []).forEach(obj => {
    if (!obj.deadline || obj.status === 'completed') return
    const daysUntil = daysBetween(date, obj.deadline)
    if (daysUntil >= 0 && (!nearest || daysUntil < nearest.daysUntil)) {
      nearest = { title: obj.title, deadline: obj.deadline, daysUntil }
    }
  })
  return nearest
}

// ─── Daily narration generation ───────────────────────────────────────────
export function generateDailyNarration(profile, domains, roadmap, dailyEntry, date) {
  const today = new Date(date + 'T12:00:00')
  const dayOfWeek = DAY_MAP[today.getDay()]
  const dayNumber = getDayNumber(profile.startDate, date)
  const activePhase = roadmap.phases?.find(p => p.status === 'active')

  const domainStatuses = domains.map(d => ({
    id: d.id,
    name: d.name,
    status: calculateDomainStatus(d, date),
    actionCount: getTodayActionsForDomain(d, dayOfWeek, date).length,
    nextDeadline: getNextDeadlineForDomain(d, date)
  }))

  const todayActions = domains.flatMap(d =>
    getTodayActionsForDomain(d, dayOfWeek, date).map(a => ({ ...a, domainId: d.id, domainName: d.name }))
  ).sort((a, b) => (a.priority || 99) - (b.priority || 99))

  const deadlines = getUpcomingDeadlines(domains, date, 14)
  const blockers = domains.flatMap(d => (d.blockers || []).map(b => ({ ...b, domainId: d.id, domainName: d.name })))
  const completedActions = dailyEntry?.completedActions || []
  const headline = generateHeadline(dayNumber, activePhase, deadlines, blockers, domainStatuses)

  return {
    date,
    dayNumber,
    phase: activePhase?.name || 'Unknown',
    phaseId: activePhase?.id,
    headline,
    domainStatuses,
    todayActions,
    completedActions,
    deadlines,
    blockers,
    log: dailyEntry?.log || '',
    progress: calculateOverallProgress(domains, roadmap)
  }
}

// ─── Domain status calculation ────────────────────────────────────────────
export function calculateDomainStatus(domain, date) {
  if (domain.status === 'critical') return 'critical'

  const hasHighBlockers = (domain.blockers || []).some(b => b.severity === 'high' || b.severity === 'critical')
  if (hasHighBlockers) return 'critical'

  const hasUrgentDeadlines = (domain.objectives || []).some(obj => {
    if (!obj.deadline || obj.status === 'completed') return false
    const daysUntil = daysBetween(date, obj.deadline)
    return daysUntil >= 0 && daysUntil <= 7
  })
  if (hasUrgentDeadlines) return 'urgent'

  const hasActiveWork = (domain.objectives || []).some(obj => obj.status === 'in_progress')
  if (hasActiveWork) return 'active'

  return 'stable'
}

// ─── Today's actions for a domain ─────────────────────────────────────────
export function getTodayActionsForDomain(domain, dayOfWeek, date) {
  const actions = []

  // Recurring items for today
  ;(domain.recurring || []).forEach(rec => {
    if (rec.schedule?.days?.includes(dayOfWeek)) {
      actions.push({
        id: rec.id,
        title: rec.title,
        type: 'recurring',
        time: rec.schedule.time,
        priority: 3,
        objectiveId: null
      })
    }
  })

  // Actions from objectives that are due today or overdue
  ;(domain.objectives || []).forEach(obj => {
    if (obj.status === 'completed') return
    ;(obj.actions || []).forEach(act => {
      if (act.status === 'completed') return
      if (!act.dueDate || act.dueDate === date || act.dueDate < date || act.recurring) {
        actions.push({
          id: act.id,
          title: act.title,
          type: 'action',
          priority: obj.priority || 3,
          objectiveId: obj.id,
          objectiveTitle: obj.title,
          dueDate: act.dueDate,
          overdue: act.dueDate && act.dueDate < date
        })
      }
    })
  })

  return actions
}

// ─── Upcoming deadlines ──────────────────────────────────────────────────
export function getUpcomingDeadlines(domains, date, daysAhead = 14) {
  const deadlines = []

  domains.forEach(domain => {
    ;(domain.objectives || []).forEach(obj => {
      if (!obj.deadline || obj.status === 'completed') return
      const daysUntil = daysBetween(date, obj.deadline)
      if (daysUntil >= 0 && daysUntil <= daysAhead) {
        deadlines.push({
          id: obj.id,
          title: obj.title,
          deadline: obj.deadline,
          daysUntil,
          domainId: domain.id,
          domainName: domain.name,
          priority: obj.priority
        })
      }
    })
  })

  return deadlines.sort((a, b) => a.daysUntil - b.daysUntil)
}

// ─── Headline generation ──────────────────────────────────────────────────
function generateHeadline(dayNumber, phase, deadlines, blockers, domainStatuses) {
  const criticalCount = domainStatuses.filter(d => d.status === 'critical').length
  const urgentDeadline = deadlines[0]

  if (urgentDeadline && urgentDeadline.daysUntil <= 3) {
    return `${urgentDeadline.daysUntil}d to ${urgentDeadline.title}. Execute.`
  }
  if (criticalCount >= 2) {
    return `${criticalCount} domains critical. Focus on highest priority.`
  }
  if (urgentDeadline) {
    return `${urgentDeadline.daysUntil}d until ${urgentDeadline.title}. Stay on track.`
  }
  if (blockers.length > 0) {
    return `${blockers.length} active blocker${blockers.length > 1 ? 's' : ''}. Clear the path.`
  }
  return `Day ${dayNumber}. ${phase || 'Moving forward'}.`
}

// ─── Progress calculation ─────────────────────────────────────────────────
export function calculateOverallProgress(domains, roadmap) {
  const activePhase = roadmap.phases?.find(p => p.status === 'active')
  if (!activePhase) return { phase: null, percent: 0 }

  let total = 0
  let completed = 0

  domains.forEach(domain => {
    ;(domain.objectives || []).forEach(obj => {
      if (activePhase.objectiveIds?.includes(obj.id)) {
        total++
        if (obj.status === 'completed') completed++
      }
    })
  })

  return {
    phase: activePhase.name,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    completed,
    total
  }
}

// ─── Conflict detection ──────────────────────────────────────────────────
export function detectScheduleConflicts(todayActions) {
  const timed = todayActions.filter(a => a.time)
  const conflicts = []

  for (let i = 0; i < timed.length; i++) {
    for (let j = i + 1; j < timed.length; j++) {
      if (timesOverlap(timed[i].time, timed[j].time)) {
        conflicts.push({
          action1: timed[i],
          action2: timed[j],
          message: `"${timed[i].title}" and "${timed[j].title}" overlap at ${timed[i].time}`
        })
      }
    }
  }

  return conflicts
}

