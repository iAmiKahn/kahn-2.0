import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import DashboardView from './views/DashboardView.jsx'
import NarrationView from './views/NarrationView.jsx'
import RoadmapView from './views/RoadmapView.jsx'
import DomainView from './views/DomainView.jsx'
import HealthView from './views/HealthView.jsx'
import KnowledgeView from './views/KnowledgeView.jsx'
import CRMView from './views/CRMView.jsx'
import ValuationView from './views/ValuationView.jsx'
import PortfolioView from './views/PortfolioView.jsx'
import { getDashboardStats } from './utils/dataStore.js'
import { getHealthStats } from './utils/healthStore.js'
import { getAllDomains, getProfile, getRoadmap, getToday, getDailyEntry } from './engine/narrationStore.js'
import { generateDailyNarration } from './engine/narrationEngine.js'

export default function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [activeDomain, setActiveDomain] = useState(null)
  const [stats, setStats] = useState({ activeProspects: 0, totalProspects: 0, totalValuations: 0 })
  const [healthStats, setHealthStats] = useState(null)
  const [narrationStats, setNarrationStats] = useState(null)
  const [crmRefreshKey, setCrmRefreshKey] = useState(0)

  useEffect(() => { refreshStats() }, [crmRefreshKey])
  useEffect(() => { getHealthStats().then(setHealthStats).catch(() => {}) }, [activeView])
  useEffect(() => { loadNarrationStats() }, [activeView])

  async function refreshStats() {
    try {
      const s = await getDashboardStats()
      setStats(s)
    } catch {}
  }

  async function loadNarrationStats() {
    try {
      const date = getToday()
      const [profile, domains, roadmap, daily] = await Promise.all([
        getProfile(), getAllDomains(), getRoadmap(), getDailyEntry(date)
      ])
      if (profile?.startDate && domains.length > 0) {
        const narration = generateDailyNarration(profile, domains, roadmap, daily, date)
        setNarrationStats({
          dayNumber: narration.dayNumber,
          phase: narration.phase,
          todayTotal: narration.todayActions.length,
          todayCompleted: narration.completedActions.length,
          criticalDomains: narration.domainStatuses.filter(d => d.status === 'critical').length,
          blockerCount: narration.blockers.length,
          nextDeadline: narration.deadlines[0] || null
        })
      }
    } catch {}
  }

  function onDataChange() { setCrmRefreshKey(k => k + 1) }

  function navigateDomain(domainId) {
    setActiveDomain(domainId)
    setActiveView('domain')
  }

  function navigate(view) {
    setActiveView(view)
    if (view !== 'domain') setActiveDomain(null)
  }

  return (
    <div className="app">
      <Sidebar
        activeView={activeView}
        activeDomain={activeDomain}
        onNavigate={navigate}
        onNavigateDomain={navigateDomain}
        stats={stats}
        healthStats={healthStats}
        narrationStats={narrationStats}
      />
      <div className="main">
        {activeView === 'dashboard'  && <DashboardView onNavigate={navigate} onNavigateDomain={navigateDomain} />}
        {activeView === 'narration'  && <NarrationView onNavigateDomain={navigateDomain} />}
        {activeView === 'roadmap'    && <RoadmapView />}
        {activeView === 'domain'     && activeDomain && <DomainView domainId={activeDomain} />}
        {activeView === 'health'     && <HealthView />}
        {activeView === 'knowledge'  && <KnowledgeView />}
        {activeView === 'crm'        && <CRMView onDataChange={onDataChange} refreshKey={crmRefreshKey} />}
        {activeView === 'valuation'  && <ValuationView onDataChange={onDataChange} refreshKey={crmRefreshKey} />}
        {activeView === 'portfolio'  && <PortfolioView stats={stats} />}
      </div>
    </div>
  )
}
