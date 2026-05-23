import {
  LayoutDashboard, Compass, Map, Scale, DollarSign, Heart, Lightbulb, Users,
  Calculator, Activity, BookOpen, TrendingUp, AlertCircle, Briefcase
} from 'lucide-react'

const NAV = [
  { id: 'dashboard',  label: 'Dashboard',       icon: LayoutDashboard, section: 'MAIN' },
  { id: 'narration',  label: 'Life Narration',   icon: Compass,         section: 'MAIN' },
  { id: 'roadmap',    label: 'Roadmap',          icon: Map,             section: 'MAIN' },
  { id: 'domain:legal',      label: 'Legal',      icon: Scale,      section: 'DOMAINS' },
  { id: 'domain:financial',  label: 'Financial',  icon: DollarSign,  section: 'DOMAINS' },
  { id: 'domain:health',     label: 'Health',     icon: Heart,       section: 'DOMAINS' },
  { id: 'domain:creative',   label: 'Creative',   icon: Lightbulb,   section: 'DOMAINS' },
  { id: 'domain:relational', label: 'Relational', icon: Users,       section: 'DOMAINS' },
  { id: 'health',     label: 'Health Tracker',    icon: Activity,    section: 'SYSTEMS' },
  { id: 'knowledge',  label: 'Knowledge',         icon: BookOpen,    section: 'SYSTEMS' },
  { id: 'crm',        label: 'CRM',               icon: Users,       section: 'SYSTEMS' },
  { id: 'valuation',  label: 'Valuations',        icon: Calculator,  section: 'SYSTEMS' },
  { id: 'portfolio',  label: 'Portfolio',         icon: Briefcase,   section: 'SYSTEMS' },
]

export default function Sidebar({ activeView, activeDomain, onNavigate, onNavigateDomain, narrationStats }) {
  const sections = ['MAIN', 'DOMAINS', 'SYSTEMS']

  function handleClick(item) {
    if (item.id.startsWith('domain:')) {
      onNavigateDomain(item.id.replace('domain:', ''))
    } else {
      onNavigate(item.id)
    }
  }

  function isActive(item) {
    if (item.id.startsWith('domain:')) {
      return activeView === 'domain' && activeDomain === item.id.replace('domain:', '')
    }
    return activeView === item.id
  }

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">LN</div>
        <span className="sidebar-logo-text">Life Narration</span>
      </div>

      <nav className="sidebar-nav">
        {sections.map(section => (
          <div key={section}>
            <div className="sidebar-section-label">{section}</div>
            {NAV.filter(n => n.section === section).map(item => {
              const Icon = item.icon
              return (
                <div
                  key={item.id}
                  className={`nav-item${isActive(item) ? ' active' : ''}`}
                  onClick={() => handleClick(item)}
                >
                  <Icon size={16} />
                  {item.label}
                </div>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-stats">
        {narrationStats && (
          <>
            <div className="stat-row">
              <span className="stat-label">Day</span>
              <span className="stat-value accent">{narrationStats.dayNumber}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Phase</span>
              <span className="stat-value" style={{ fontSize: '11px' }}>{narrationStats.phase}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Today</span>
              <span className={`stat-value${narrationStats.todayCompleted === narrationStats.todayTotal && narrationStats.todayTotal > 0 ? ' text-green' : ''}`}>
                {narrationStats.todayCompleted}/{narrationStats.todayTotal}
              </span>
            </div>
            {narrationStats.criticalDomains > 0 && (
              <div className="stat-row">
                <span className="stat-label">Critical</span>
                <span className="stat-value" style={{ color: 'var(--red)' }}>{narrationStats.criticalDomains}</span>
              </div>
            )}
            {narrationStats.nextDeadline && (
              <div className="stat-row">
                <span className="stat-label">Next deadline</span>
                <span className="stat-value" style={{ color: narrationStats.nextDeadline.daysUntil <= 3 ? 'var(--red)' : 'var(--yellow)', fontSize: '11px' }}>
                  {narrationStats.nextDeadline.daysUntil}d
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
