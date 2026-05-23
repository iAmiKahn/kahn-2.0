import { useState, useEffect, useCallback } from 'react'
import DayHeader from '../components/narration/DayHeader.jsx'
import DomainStatusBar from '../components/narration/DomainStatusBar.jsx'
import ActionList from '../components/narration/ActionList.jsx'
import DeadlineTracker from '../components/narration/DeadlineTracker.jsx'
import BlockerPanel from '../components/narration/BlockerPanel.jsx'
import DailyLog from '../components/narration/DailyLog.jsx'
import ProgressMetrics from '../components/narration/ProgressMetrics.jsx'
import {
  getProfile, getAllDomains, getRoadmap, getDailyEntry,
  toggleActionComplete, saveDailyLog, getToday
} from '../engine/narrationStore.js'
import { generateDailyNarration } from '../engine/narrationEngine.js'

export default function NarrationView({ onNavigateDomain }) {
  const [narration, setNarration] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadNarration = useCallback(async () => {
    try {
      const date = getToday()
      const [profile, domains, roadmap, dailyEntry] = await Promise.all([
        getProfile(),
        getAllDomains(),
        getRoadmap(),
        getDailyEntry(date)
      ])

      if (!profile.startDate || domains.length === 0) {
        setNarration(null)
        setLoading(false)
        return
      }

      const result = generateDailyNarration(profile, domains, roadmap, dailyEntry, date)
      setNarration(result)
    } catch (err) {
      console.error('Narration generation error:', err)
      setNarration(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadNarration() }, [loadNarration])

  async function handleToggleAction(actionId) {
    const date = getToday()
    await toggleActionComplete(date, actionId)
    await loadNarration()
  }

  async function handleSaveLog(log) {
    const date = getToday()
    await saveDailyLog(date, log)
    await loadNarration()
  }

  if (loading) {
    return <div className="narration-loading">Loading narration...</div>
  }

  if (!narration) {
    return (
      <div className="narration-empty">
        <div className="narration-empty-title">Life Narration</div>
        <div className="narration-empty-text">No data loaded. Domain files may be missing.</div>
      </div>
    )
  }

  return (
    <div className="narration-view">
      <div className="narration-scroll">
        <DayHeader
          date={narration.date}
          dayNumber={narration.dayNumber}
          phase={narration.phase}
          headline={narration.headline}
        />

        <ProgressMetrics
          progress={narration.progress}
          todayActions={narration.todayActions}
          completedActions={narration.completedActions}
        />

        <DomainStatusBar
          domainStatuses={narration.domainStatuses}
          onDomainClick={onNavigateDomain}
        />

        <div className="narration-section">
          <div className="section-label">TODAY'S ACTIONS</div>
          <ActionList
            actions={narration.todayActions}
            completedActions={narration.completedActions}
            onToggleAction={handleToggleAction}
          />
        </div>

        <div className="narration-columns">
          <DeadlineTracker deadlines={narration.deadlines} />
          <BlockerPanel blockers={narration.blockers} />
        </div>

        <DailyLog log={narration.log} onSaveLog={handleSaveLog} />
      </div>
    </div>
  )
}
