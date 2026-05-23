import { useState, useEffect, useCallback } from 'react'
import { Settings, RefreshCw } from 'lucide-react'
import DailyDashboard from '../components/health/DailyDashboard.jsx'
import TrainingPlan from '../components/health/TrainingPlan.jsx'
import MealPlanView from '../components/health/MealPlanView.jsx'
import WeeklyView from '../components/health/WeeklyView.jsx'
import ProfileSetup from '../components/health/ProfileSetup.jsx'
import { getTodayKey, calculateMacroTargets, assessRecovery } from '../utils/healthEngine.js'
import {
  getProfile, saveProfile,
  getDayEntry, toggleComplianceItem, updateComplianceField,
  toggleBadDayProtocol, saveRecoveryScores, saveMorningRHR,
  getHealthStats,
  getTrainingPerformance, saveTrainingPerformance,
} from '../utils/healthStore.js'

const TABS = [
  { id: 'today',    label: 'Today' },
  { id: 'training', label: 'Training' },
  { id: 'meals',    label: 'Meals' },
  { id: 'weekly',   label: 'Weekly' },
]

export default function HealthView() {
  const [activeTab, setActiveTab] = useState('today')
  const [profile, setProfile] = useState(null)
  const [dayEntry, setDayEntry] = useState(null)
  const [macroTargets, setMacroTargets] = useState(null)
  const [stats, setStats] = useState(null)
  const [performance, setPerformance] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [loading, setLoading] = useState(true)

  const todayKey = getTodayKey()

  const loadData = useCallback(async () => {
    const [p, d, s, perf] = await Promise.all([
      getProfile(),
      getDayEntry(todayKey),
      getHealthStats(),
      getTrainingPerformance(todayKey),
    ])
    setProfile(p)
    setDayEntry(d)
    setMacroTargets(calculateMacroTargets(p))
    setStats(s)
    setPerformance(perf)
    setLoading(false)
  }, [todayKey])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleToggle(domain, item) {
    const updated = await toggleComplianceItem(todayKey, domain, item)
    setDayEntry(updated)
  }

  async function handleUpdate(domain, item, value) {
    const updated = await updateComplianceField(todayKey, domain, item, value)
    setDayEntry(updated)
  }

  async function handleBadDay() {
    const updated = await toggleBadDayProtocol(todayKey)
    setDayEntry(updated)
  }

  async function handleSaveRecovery(scores) {
    let updated = await saveRecoveryScores(todayKey, scores)
    // Auto-trigger Bad Day Protocol if recovery is poor
    const assessment = assessRecovery(scores)
    if (assessment.status === 'poor' && !updated.badDayProtocol) {
      updated = await toggleBadDayProtocol(todayKey)
    }
    setDayEntry(updated)
  }

  async function handleSaveRHR(rhr) {
    const updated = await saveMorningRHR(todayKey, rhr)
    setDayEntry(updated)
  }

  async function handleSaveProfile(updatedProfile) {
    const saved = await saveProfile(updatedProfile)
    setProfile(saved)
    setMacroTargets(calculateMacroTargets(saved))
    setShowProfile(false)
    const s = await getHealthStats()
    setStats(s)
  }

  async function handleSavePerformance(perfData) {
    const saved = await saveTrainingPerformance(todayKey, perfData)
    setPerformance(saved)
    // Mark training as logged in compliance
    await updateComplianceField(todayKey, 'training', 'logged_performance', true)
    const updated = await getDayEntry(todayKey)
    setDayEntry(updated)
  }

  if (loading) {
    return (
      <>
        <div className="topbar">
          <span className="topbar-title">Total Human Optimization</span>
        </div>
        <div className="content">
          <div className="empty-state">
            <RefreshCw style={{ animation: 'spin 1s linear infinite' }} />
            <p>Loading health system...</p>
          </div>
        </div>
      </>
    )
  }

  const outstandingCount = profile?.outstanding
    ? Object.values(profile.outstanding).filter(v => v === null || v === '').length
    : 0

  return (
    <>
      <div className="topbar">
        <span className="topbar-title">Total Human Optimization</span>
        <div className="topbar-actions">
          {stats?.streak > 0 && (
            <span className="badge badge-green" style={{ fontSize: 11 }}>
              {stats.streak} day streak
            </span>
          )}
          {outstandingCount > 0 && (
            <span className="badge badge-yellow" style={{ fontSize: 11, cursor: 'pointer' }} onClick={() => setShowProfile(true)}>
              {outstandingCount} data points needed
            </span>
          )}
          <button className="btn btn-ghost btn-sm" onClick={() => setShowProfile(true)}>
            <Settings style={{ width: 12, height: 12 }} />
            Profile
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="tabs">
        {TABS.map(tab => (
          <div
            key={tab.id}
            className={`tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className="content" style={{ overflowY: 'auto' }}>
        <div style={{ padding: '16px 20px' }}>
          {activeTab === 'today' && (
            <DailyDashboard
              profile={profile}
              macroTargets={macroTargets}
              dayEntry={dayEntry}
              onToggle={handleToggle}
              onUpdate={handleUpdate}
              onBadDay={handleBadDay}
              onSaveRecovery={handleSaveRecovery}
              onSaveRHR={handleSaveRHR}
              onSwitchTab={setActiveTab}
            />
          )}
          {activeTab === 'training' && (
            <TrainingPlan
              performance={performance}
              onSavePerformance={handleSavePerformance}
              profile={profile}
              dayEntry={dayEntry}
            />
          )}
          {activeTab === 'meals' && (
            <MealPlanView
              macroTargets={macroTargets}
              isTrainingDay={dayEntry?.isTrainingDay}
            />
          )}
          {activeTab === 'weekly' && <WeeklyView />}
        </div>
      </div>

      {showProfile && (
        <ProfileSetup
          profile={profile}
          onSave={handleSaveProfile}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  )
}
