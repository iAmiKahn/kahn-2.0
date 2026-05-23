import { useState, useEffect } from 'react'
import {
  Compass, Scale, DollarSign, Heart, Lightbulb, Users,
  AlertTriangle, Clock, CheckCircle, Circle, TrendingUp,
  Target, BookOpen, Activity, ArrowRight
} from 'lucide-react'
import {
  getProfile, getAllDomains, getRoadmap, getDailyEntry, getToday
} from '../engine/narrationStore.js'
import { generateDailyNarration } from '../engine/narrationEngine.js'
import { getHealthStats } from '../utils/healthStore.js'
import { getDashboardStats } from '../utils/dataStore.js'

const DOMAIN_ICONS = {
  legal: Scale, financial: DollarSign, health: Heart,
  creative: Lightbulb, relational: Users
}

const STATUS_COLORS = {
  critical: 'var(--red)', urgent: 'var(--orange)',
  active: 'var(--accent)', stable: 'var(--green)', dormant: 'var(--text-muted)'
}

export default function DashboardView({ onNavigate, onNavigateDomain }) {
  const [narration, setNarration] = useState(null)
  const [healthStats, setHealthStats] = useState(null)
  const [reStats, setReStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    try {
      const date = getToday()
      const [profile, domains, roadmap, daily, hs, rs] = await Promise.all([
        getProfile(), getAllDomains(), getRoadmap(), getDailyEntry(date),
        getHealthStats().catch(() => null),
        getDashboardStats().catch(() => ({ activeProspects: 0, totalProspects: 0, totalValuations: 0 }))
      ])
      if (profile?.startDate && domains.length > 0) {
        setNarration(generateDailyNarration(profile, domains, roadmap, daily, date))
      }
      setHealthStats(hs)
      setReStats(rs)
    } catch (err) {
      console.error('Dashboard load error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="narration-loading">Loading dashboard...</div>

  return (
    <div className="dashboard-view">
      <div className="narration-scroll">
        {/* Header */}
        <div className="dash-header">
          <h1 className="dash-title">Dashboard</h1>
          {narration && (
            <div className="dash-meta">
              <span className="day-number">Day {narration.dayNumber}</span>
              <span className="day-phase">{narration.phase}</span>
            </div>
          )}
        </div>

        {/* Headline Banner */}
        {narration && (
          <div className="dash-banner" onClick={() => onNavigate('narration')}>
            <Compass size={18} />
            <div className="dash-banner-text">
              <div className="dash-banner-headline">{narration.headline}</div>
              <div className="dash-banner-sub">
                {narration.todayActions.length} actions today &middot;
                {narration.completedActions.length} completed &middot;
                {narration.deadlines.length} upcoming deadlines
              </div>
            </div>
            <ArrowRight size={16} className="dash-banner-arrow" />
          </div>
        )}

        {/* Domain Cards */}
        <div className="dash-section-label">DOMAINS</div>
        <div className="dash-domain-grid">
          {narration?.domainStatuses.map(ds => {
            const Icon = DOMAIN_ICONS[ds.id] || Circle
            const domain = narration.todayActions.filter(a => a.domainId === ds.id)
            const completed = domain.filter(a => narration.completedActions.includes(a.id)).length
            const blockers = narration.blockers.filter(b => b.domainId === ds.id)

            return (
              <div
                key={ds.id}
                className="dash-domain-card"
                onClick={() => onNavigateDomain(ds.id)}
                style={{ '--card-accent': STATUS_COLORS[ds.status] }}
              >
                <div className="dash-domain-card-head">
                  <Icon size={18} />
                  <span className="dash-domain-card-name">{ds.name}</span>
                  <span className="dash-domain-card-status">{ds.status.toUpperCase()}</span>
                </div>
                <div className="dash-domain-card-body">
                  {domain.length > 0 && (
                    <div className="dash-domain-stat">
                      <CheckCircle size={13} />
                      <span>{completed}/{domain.length} actions today</span>
                    </div>
                  )}
                  {ds.nextDeadline && (
                    <div className="dash-domain-stat">
                      <Clock size={13} />
                      <span>{ds.nextDeadline.daysUntil}d — {ds.nextDeadline.title}</span>
                    </div>
                  )}
                  {blockers.length > 0 && (
                    <div className="dash-domain-stat blocker">
                      <AlertTriangle size={13} />
                      <span>{blockers.length} blocker{blockers.length > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {domain.length === 0 && !ds.nextDeadline && blockers.length === 0 && (
                    <div className="dash-domain-stat muted">No actions today</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Systems Row */}
        <div className="dash-section-label">SYSTEMS</div>
        <div className="dash-systems-grid">
          {/* Health Card */}
          <div className="dash-system-card" onClick={() => onNavigate('health')}>
            <div className="dash-system-head">
              <Activity size={16} />
              <span>Health Tracker</span>
            </div>
            <div className="dash-system-body">
              {healthStats ? (
                <>
                  <div className="dash-system-stat">
                    <span>Streak</span>
                    <span className={healthStats.streak > 0 ? 'accent' : ''}>{healthStats.streak > 0 ? `${healthStats.streak}d` : '—'}</span>
                  </div>
                  <div className="dash-system-stat">
                    <span>Days tracked</span>
                    <span>{healthStats.totalDays}</span>
                  </div>
                  {healthStats.outstandingCount > 0 && (
                    <div className="dash-system-stat warn">
                      <span>Data needed</span>
                      <span>{healthStats.outstandingCount}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="dash-system-empty">No data yet</div>
              )}
            </div>
          </div>

          {/* Knowledge Card */}
          <div className="dash-system-card" onClick={() => onNavigate('knowledge')}>
            <div className="dash-system-head">
              <BookOpen size={16} />
              <span>Knowledge System</span>
            </div>
            <div className="dash-system-body">
              <div className="dash-system-stat">
                <span>Location</span>
                <span style={{ fontSize: '11px' }}>C:\Kahn\</span>
              </div>
              <div className="dash-system-stat">
                <span>Domains</span>
                <span>10 directories</span>
              </div>
            </div>
          </div>

          {/* CRM Card */}
          <div className="dash-system-card" onClick={() => onNavigate('crm')}>
            <div className="dash-system-head">
              <Users size={16} />
              <span>CRM</span>
            </div>
            <div className="dash-system-body">
              <div className="dash-system-stat">
                <span>Active prospects</span>
                <span className={reStats?.activeProspects > 0 ? 'accent' : ''}>{reStats?.activeProspects || 0}</span>
              </div>
              <div className="dash-system-stat">
                <span>Total prospects</span>
                <span>{reStats?.totalProspects || 0}</span>
              </div>
            </div>
          </div>

          {/* Valuations Card */}
          <div className="dash-system-card" onClick={() => onNavigate('valuation')}>
            <div className="dash-system-head">
              <TrendingUp size={16} />
              <span>Valuations</span>
            </div>
            <div className="dash-system-body">
              <div className="dash-system-stat">
                <span>Total run</span>
                <span>{reStats?.totalValuations || 0}</span>
              </div>
              {reStats?.avgVariance != null && (
                <div className="dash-system-stat">
                  <span>Avg variance</span>
                  <span>{`±${reStats.avgVariance.toFixed(1)}%`}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Roadmap Progress */}
        {narration?.progress && (
          <div className="dash-roadmap-card" onClick={() => onNavigate('roadmap')}>
            <div className="dash-section-label">ROADMAP</div>
            <div className="dash-roadmap-inner">
              <Target size={16} />
              <div className="dash-roadmap-info">
                <div className="dash-roadmap-phase">{narration.progress.phase}</div>
                <div className="dash-roadmap-count">{narration.progress.completed}/{narration.progress.total} objectives complete</div>
              </div>
              <div className="dash-roadmap-pct">{narration.progress.percent}%</div>
            </div>
            <div className="progress-bar" style={{ marginTop: 8 }}>
              <div className="progress-bar-fill" style={{ width: `${narration.progress.percent}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
