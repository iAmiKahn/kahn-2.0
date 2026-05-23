import { useState } from 'react'
import { CheckCircle, Lock, Zap, ChevronDown, ChevronRight } from 'lucide-react'

const PHASES = [
  {
    num: 1,
    title: 'Foundation Infrastructure',
    subtitle: 'CRM + Manual Valuation Engine + Project Portfolio',
    status: 'current',
    trigger: 'Active now',
    completion: '5 test properties evaluated with outcomes tracked',
    rationale: 'Before automating anything, the manual system must prove its accuracy and surface what data inputs matter most. Every valuation run in Phase 1 trains the methodology for Phase 2 automation. Every CRM interaction reveals what fields and workflows actually matter during live prospect calls.',
    deliverables: [
      { label: 'CRM — prospect tracking, interaction logs, valuation history', done: true },
      { label: 'Valuation Engine — structured CMA with confidence scoring and gap analysis', done: true },
      { label: 'Project Portfolio — phase roadmap with visible sequencing logic', done: true },
      { label: 'Local data persistence (JSON) — machine-readable, GitHub-compatible', done: true },
      { label: 'Knowledge system integration architecture — read from C:\\Kahn\\', done: true },
      { label: 'Learning log — every outcome comparison auto-logged', done: true },
    ],
    learningObjectives: [
      'Which data inputs most consistently predict accurate valuations',
      'Which CRM fields matter during live prospect calls vs. noise',
      'Expectation gap patterns by motivation type and market segment',
      'What comp characteristics most affect adjustment accuracy',
    ],
    phaseTwo_requirements: [
      'Minimum 5 valuations with outcomes compared',
      "Dan approval via review conversation — explicit Dan sign-off required",
      'Estimated token cost presented and approved',
    ],
    dependencies: [],
  },
  {
    num: 2,
    title: 'Data Integration Layer',
    subtitle: 'Public records + MLS feeds + AVM comparison',
    status: 'locked',
    trigger: 'Dan approves after Phase 1 completion criteria met',
    completion: 'Automated comp pulling for any IL address within 2 miles',
    rationale: 'Once Phase 1 proves the methodology works manually, Phase 2 automates the data collection. Manual comp entry is the bottleneck — agents spend 30–45 minutes per CMA on data gathering. Automated data integration collapses that to under 5 minutes, making the engine viable at scale.',
    deliverables: [
      { label: 'County assessor API integration (Cook, McHenry, Kane, DuPage)', done: false },
      { label: 'MLS RETS/IDX feed integration (requires board membership)', done: false },
      { label: 'Automated comp identification within configurable radius', done: false },
      { label: 'Zillow / Redfin AVM comparison layer — calibration reference', done: false },
      { label: 'Market trend data feeds (inventory, DOM, L/S ratio by zip)', done: false },
      { label: 'Auto-populated valuation wizard from address input only', done: false },
    ],
    learningObjectives: [
      'How automated comp selection compares to manual comp selection',
      'What data the public records miss vs. agent knowledge',
      'Which AVM tools are closest to actual sale prices in target markets',
    ],
    phaseTwo_requirements: null,
    dependencies: ['Phase 1 methodology proven', 'MLS board membership or data partnership secured', 'API credentials obtained'],
  },
  {
    num: 3,
    title: 'Autonomous Lead Generation',
    subtitle: 'Off-market identification + seller signal detection',
    status: 'locked',
    trigger: 'Phase 2 operational + data sources stable',
    completion: 'Automated weekly lead list of pre-motivated sellers in target zip codes',
    rationale: 'With the valuation engine automated, Phase 3 inverts the workflow — instead of waiting for prospects to call, the system identifies them. Probate filings, expired listings, pre-foreclosure notices, and divorce public records are all accessible signals. Most agents never tap this systematically.',
    deliverables: [
      { label: 'Probate / estate filing scraper (county courthouse)', done: false },
      { label: 'Expired listing monitor (auto-detect at day 8 post-expiration)', done: false },
      { label: 'Pre-foreclosure notice integration (lis pendens, NOD)', done: false },
      { label: 'FSBO tracker (Zillow, Craigslist, Facebook Marketplace)', done: false },
      { label: 'Lead scoring algorithm (motivation × timeline × equity)', done: false },
      { label: 'Automated outreach template generation', done: false },
    ],
    learningObjectives: [
      'Which lead source converts at highest rate per effort invested',
      'What scoring weights produce highest-quality leads',
      'Optimal timing window for each lead source type',
    ],
    phaseTwo_requirements: null,
    dependencies: ['Phase 2 data layer', 'Legal review of scraping methodology for IL compliance'],
  },
  {
    num: 4,
    title: 'Intelligence & Prediction',
    subtitle: 'ML pricing models + buyer profiling + timing intelligence',
    status: 'locked',
    trigger: '50+ valuations with outcomes + Phase 3 lead volume',
    completion: 'Predicted sale price within 1.5% variance — better than Zillow Zestimate',
    rationale: 'With 50+ outcome-validated valuations, the system has training data. A lightweight ML model replacing or augmenting the CMA approach can consistently outperform manual adjustments — especially in volatile micro-markets where patterns aren\'t obvious. This is the point where the system becomes a genuine competitive advantage.',
    deliverables: [
      { label: 'ML model training pipeline on validated valuation outcomes', done: false },
      { label: 'Predictive pricing — point estimate + confidence interval', done: false },
      { label: 'Buyer profiling from transaction data (who buys what, where, why)', done: false },
      { label: 'Timing intelligence — optimal list date by property type + season', done: false },
      { label: 'Negotiation playbook generator', done: false },
      { label: 'Price reduction trigger alerts (DOM threshold × market condition)', done: false },
    ],
    learningObjectives: [
      'Which features predict sale price with highest weight in IL suburban markets',
      'How buyer profile shifts by neighborhood and price point',
      'What market signals predict optimal list timing',
    ],
    phaseTwo_requirements: null,
    dependencies: ['50+ validated valuations', 'Phase 3 lead volume for buyer data', 'ML infrastructure setup'],
  },
  {
    num: 5,
    title: 'Full Agent Replacement Platform',
    subtitle: 'Multi-offer orchestration + full seller journey automation',
    status: 'locked',
    trigger: 'Phase 4 proven + regulatory review completed',
    completion: 'End-to-end seller representation from lead identification to close',
    rationale: 'This is the endgame: a system that can run the full seller side of a real estate transaction with minimal human intervention — from off-market identification through negotiation and close. This is what Dan built toward at the 450-agent org, but now without a brokerage extracting value. The IP belongs to the system.',
    deliverables: [
      { label: 'Automated MLS listing management + photography workflow', done: false },
      { label: 'Multi-offer orchestration + counteroffer strategy engine', done: false },
      { label: 'Digital transaction coordinator integration', done: false },
      { label: 'Performance analytics + learning dashboard', done: false },
      { label: 'Market intelligence monitoring + alert system', done: false },
      { label: 'White-label capability for licensing to other agents', done: false },
    ],
    learningObjectives: [
      'Full performance audit against traditional agent outcomes',
      'Revenue model validation (flat fee vs. % vs. licensing)',
      'Regulatory risk assessment per state for expansion',
    ],
    phaseTwo_requirements: null,
    dependencies: ['Phases 1–4 complete', 'IL real estate license compliance review', 'Business entity structure finalized'],
  },
]

export default function PortfolioView({ stats }) {
  const [expanded, setExpanded] = useState(1)

  const phase1TestsComplete = stats.completedValuations >= 5
  const phase1Progress = Math.min(stats.completedValuations / 5 * 100, 100)

  return (
    <>
      <div className="topbar">
        <span className="topbar-title">Project Portfolio — Phase Roadmap</span>
        <div className="topbar-actions">
          <span className="text-sm text-muted">Phase 1 active — {5 - stats.completedValuations > 0 ? `${5 - stats.completedValuations} test properties needed` : 'completion criteria met'}</span>
        </div>
      </div>

      <div className="content" style={{ overflowY: 'auto' }}>
        <div style={{ padding: '20px 28px', maxWidth: 860 }}>

          {/* Phase 1 progress bar */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 13, fontWeight: 600 }}>Phase 1 Completion Progress</span>
              <span className={`badge ${phase1TestsComplete ? 'badge-green' : 'badge-yellow'}`}>
                {phase1TestsComplete ? 'Ready for Phase 2 Review' : 'In Progress'}
              </span>
            </div>
            <div className="confidence-bar-wrap" style={{ marginBottom: 8 }}>
              <div className="confidence-bar-fill"
                style={{ width: `${phase1Progress}%`, background: phase1TestsComplete ? 'var(--green)' : 'var(--accent)' }} />
            </div>
            <div className="text-sm text-muted">
              Test properties with outcomes: {stats.completedValuations}/5 required
              {stats.avgVariance != null && ` · Average variance: ±${stats.avgVariance.toFixed(1)}%`}
            </div>
            {phase1TestsComplete && (
              <div className="gap-box info" style={{ marginTop: 12 }}>
                <div className="gap-box-title">Phase 2 Approval Checkpoint</div>
                <ul>
                  <li>5 test properties with outcome comparisons: ✓ Complete</li>
                  <li>System performance and learning outcomes: review below</li>
                  <li>To unlock Phase 2: explicitly tell Claude Code "Approve Phase 2"</li>
                  <li>You will receive: evidence, resource estimate, and full Phase 2 roadmap before any build begins</li>
                </ul>
              </div>
            )}
          </div>

          {/* Why this order */}
          <div className="card-sm mb-4">
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: 'var(--accent-text)' }}>Why This Sequence</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Each phase is gated by the previous phase's learning outcomes. Phase 1 proves the manual methodology and reveals which data inputs matter most — that knowledge directly shapes Phase 2's API integration priorities. You can't automate what you haven't yet proven manually. Phase 3 requires Phase 2's data layer or lead generation produces noise. Phase 4 requires Phase 3's volume to train models. Phase 5 is the compound of all previous phases. Skipping phases creates technical debt that compounds backwards.
            </div>
          </div>

          {/* Phase cards */}
          {PHASES.map(phase => (
            <PhaseCard
              key={phase.num}
              phase={phase}
              isExpanded={expanded === phase.num}
              onToggle={() => setExpanded(expanded === phase.num ? null : phase.num)}
            />
          ))}

          {/* Learning outcomes section */}
          <div className="section-heading">Phase 1 Learning Outcomes</div>
          <div className="card-sm">
            <div className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {stats.totalValuations === 0 ? (
                'No valuations run yet. Learning outcomes will appear here as you use the Valuation Engine and record outcomes.'
              ) : stats.completedValuations === 0 ? (
                `${stats.totalValuations} valuation(s) run. Record actual sale outcomes to generate learning data. Navigate to Valuation → History to record results.`
              ) : (
                <>
                  <strong>{stats.completedValuations}</strong> outcome(s) recorded.
                  {stats.avgVariance != null && (
                    <> Average variance: <strong className={stats.avgVariance < 3 ? 'text-green' : 'text-yellow'}>±{stats.avgVariance.toFixed(1)}%</strong>.
                    {stats.avgVariance < 3 ? ' Engine is accurate — Phase 2 criteria met on precision.' : ' Phase 2 readiness depends on closing the variance gap before approving automation.'}</>
                  )}
                </>
              )}
            </div>
          </div>

          <div style={{ height: 40 }} />
        </div>
      </div>
    </>
  )
}

function PhaseCard({ phase, isExpanded, onToggle }) {
  const isCurrent = phase.status === 'current'
  const isLocked  = phase.status === 'locked'
  const completedItems = phase.deliverables.filter(d => d.done).length

  return (
    <div className={`phase-card${isCurrent ? ' current' : ''}${isLocked ? ' locked' : ''}`}>
      <div className="phase-card-header" onClick={onToggle}>
        <div className={`phase-num${isCurrent ? ' current' : ''}${phase.deliverables.every(d => d.done) ? ' complete' : ''}`}>
          {isCurrent ? <Zap style={{ width: 14, height: 14 }} /> : isLocked ? <Lock style={{ width: 12, height: 12 }} /> : phase.num}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center gap-2">
            <span className="phase-card-title">Phase {phase.num} — {phase.title}</span>
            {isCurrent && <span className="badge badge-purple">Active</span>}
            {isLocked && <span className="badge badge-grey">Locked</span>}
          </div>
          <div className="phase-card-sub">{phase.subtitle}</div>
          {isCurrent && (
            <div style={{ marginTop: 4, fontSize: 10, color: 'var(--accent-text)' }}>
              {completedItems}/{phase.deliverables.length} deliverables complete
            </div>
          )}
        </div>
        {isExpanded ? <ChevronDown style={{ width: 16, height: 16, color: 'var(--text-muted)', flexShrink: 0 }} /> : <ChevronRight style={{ width: 16, height: 16, color: 'var(--text-muted)', flexShrink: 0 }} />}
      </div>

      {isExpanded && (
        <div className="phase-card-body">
          {/* Rationale */}
          <div className="section-heading" style={{ marginTop: 0 }}>Why This Phase Comes Here</div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 16 }}>
            {phase.rationale}
          </div>

          {/* Trigger */}
          <div className="form-row" style={{ marginBottom: 16 }}>
            <div>
              <div className="detail-field-label">Trigger</div>
              <div className="detail-field-value" style={{ fontSize: 12, marginTop: 2 }}>{phase.trigger}</div>
            </div>
            <div>
              <div className="detail-field-label">Completion Criteria</div>
              <div className="detail-field-value" style={{ fontSize: 12, marginTop: 2 }}>{phase.completion}</div>
            </div>
          </div>

          {/* Dependencies */}
          {phase.dependencies?.length > 0 && (
            <>
              <div className="section-heading">Prerequisites</div>
              {phase.dependencies.map((d, i) => (
                <div key={i} className="flex gap-2 items-center text-sm mb-1">
                  <span style={{ color: 'var(--yellow)' }}>◆</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{d}</span>
                </div>
              ))}
            </>
          )}

          {/* Deliverables */}
          <div className="section-heading">Deliverables</div>
          {phase.deliverables.map((d, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              <div style={{
                width: 16, height: 16, borderRadius: 3, flexShrink: 0,
                border: `1px solid ${d.done ? 'var(--green)' : 'var(--border-strong)'}`,
                background: d.done ? 'var(--green-dim)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {d.done && <CheckCircle style={{ width: 10, height: 10, color: 'var(--green)' }} />}
              </div>
              <span className="text-sm" style={{ color: d.done ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{d.label}</span>
            </div>
          ))}

          {/* Learning objectives */}
          <div className="section-heading">Learning Objectives</div>
          {phase.learningObjectives.map((lo, i) => (
            <div key={i} className="flex gap-2 items-center text-sm mb-1">
              <span style={{ color: 'var(--accent-text)' }}>→</span>
              <span style={{ color: 'var(--text-secondary)' }}>{lo}</span>
            </div>
          ))}

          {/* Phase 2 gate */}
          {phase.num === 1 && (
            <div className="gap-box info" style={{ marginTop: 16 }}>
              <div className="gap-box-title">Phase 2 Approval Gate</div>
              <ul>
                {phase.phaseTwo_requirements.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
