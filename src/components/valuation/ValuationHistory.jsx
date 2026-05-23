import { useState } from 'react'
import { CheckCircle, Clock } from 'lucide-react'
import { formatCurrency, formatVariance } from '../../utils/valuationEngine.js'
import { updateValuationOutcome } from '../../utils/dataStore.js'

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const CONF_COLOR = {
  green: 'badge-green', yellow: 'badge-yellow', orange: 'badge-orange', red: 'badge-red',
}

export default function ValuationHistory({ valuations, onUpdate }) {
  const [expanded, setExpanded] = useState(null)
  const [outcomeForm, setOutcomeForm] = useState({})
  const [saving, setSaving] = useState(null)

  async function handleSaveOutcome(id) {
    setSaving(id)
    const f = outcomeForm[id] || {}
    await updateValuationOutcome(id, Number(f.price), f.date)
    setSaving(null)
    setOutcomeForm(o => ({ ...o, [id]: {} }))
    onUpdate()
  }

  function setOf(id, field, val) {
    setOutcomeForm(o => ({ ...o, [id]: { ...(o[id] || {}), [field]: val } }))
  }

  if (valuations.length === 0) {
    return (
      <div className="empty-state" style={{ flex: 1 }}>
        <Clock />
        <p>No valuations saved yet</p>
        <span>Run your first valuation using the New Valuation button above</span>
      </div>
    )
  }

  return (
    <div className="panel-body-padded">
      <div className="section-heading" style={{ marginTop: 0 }}>All Valuations ({valuations.length})</div>

      {/* Learning summary */}
      {valuations.filter(v => v.actualSalePrice).length > 0 && (
        <div className="card-sm mb-4" style={{ borderColor: 'var(--accent)' }}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle style={{ width: 14, height: 14, color: 'var(--green)' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
              {valuations.filter(v => v.actualSalePrice).length} outcomes tracked
            </span>
          </div>
          {(() => {
            const tracked = valuations.filter(v => v.variance != null)
            const avg = tracked.length ? tracked.reduce((s, v) => s + Math.abs(v.variance), 0) / tracked.length : null
            const accurate = tracked.filter(v => Math.abs(v.variance) < 3).length
            return (
              <div className="text-sm text-muted">
                Average variance: <strong className={avg && avg < 3 ? 'text-green' : 'text-yellow'}>{avg ? `±${avg.toFixed(1)}%` : '—'}</strong>
                {' · '}Within 3% accuracy: <strong>{accurate}/{tracked.length}</strong>
              </div>
            )
          })()}
        </div>
      )}

      {valuations.map(v => {
        const isExpanded = expanded === v.id
        const hasOutcome = !!v.actualSalePrice
        const of = outcomeForm[v.id] || {}

        return (
          <div key={v.id} className="card" style={{ marginBottom: 10, padding: 0, overflow: 'hidden' }}>
            {/* Header */}
            <div
              className="phase-card-header"
              style={{ background: 'var(--bg-elevated)', cursor: 'pointer' }}
              onClick={() => setExpanded(isExpanded ? null : v.id)}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontWeight: 600, fontSize: 14 }}>
                    {formatCurrency(v.result?.pointEstimate)}
                  </span>
                  {v.result?.confidence && (
                    <span className={`badge ${CONF_COLOR[v.result.confidence.color] || 'badge-grey'}`}>
                      {v.result.confidence.label}
                    </span>
                  )}
                  {hasOutcome && <span className="badge badge-green">Outcome recorded</span>}
                </div>
                <div className="text-sm text-muted mt-1 truncate">
                  {v.subject?.address || 'Address not recorded'} · {fmtDate(v.requestedAt)}
                </div>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>{isExpanded ? '−' : '+'}</span>
            </div>

            {/* Expanded detail */}
            {isExpanded && (
              <div style={{ padding: 16 }}>
                {/* Value range */}
                <div className="data-grid" style={{ marginBottom: 12 }}>
                  <div className="data-cell">
                    <div className="data-cell-label">Point Est.</div>
                    <div className="data-cell-value">{formatCurrency(v.result?.pointEstimate)}</div>
                  </div>
                  <div className="data-cell">
                    <div className="data-cell-label">Range</div>
                    <div className="data-cell-value" style={{ fontSize: 12 }}>
                      {formatCurrency(v.result?.rangeLow)} – {formatCurrency(v.result?.rangeHigh)}
                    </div>
                  </div>
                  <div className="data-cell">
                    <div className="data-cell-label">Comps</div>
                    <div className="data-cell-value">{v.comps?.length ?? 0}</div>
                  </div>
                  <div className="data-cell">
                    <div className="data-cell-label">Confidence</div>
                    <div className="data-cell-value" style={{ fontSize: 12 }}>{v.result?.confidence?.score ?? '—'}/100</div>
                  </div>
                </div>

                {/* Outcome comparison */}
                {hasOutcome ? (
                  <div className="card-sm" style={{ borderColor: 'var(--green)', marginBottom: 12 }}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-muted">Actual Sale Price</div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}>{formatCurrency(v.actualSalePrice)}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Sold {fmtDate(v.actualSaleDate)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="text-sm text-muted">Variance</div>
                        <div style={{ fontSize: 16, fontWeight: 700 }}
                          className={Math.abs(v.variance) < 3 ? 'text-green' : Math.abs(v.variance) < 6 ? 'text-yellow' : 'text-red'}>
                          {formatVariance(v.variance)}
                        </div>
                        <div className="text-sm text-muted">
                          {Math.abs(v.variance) < 3 ? 'Accurate' : Math.abs(v.variance) < 6 ? 'Acceptable' : 'Off — review methodology'}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Record outcome form */
                  <div className="card-sm" style={{ marginBottom: 12 }}>
                    <div className="section-heading" style={{ marginTop: 0, marginBottom: 8 }}>Record Actual Outcome</div>
                    <div className="form-row" style={{ marginBottom: 8 }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Actual Sale Price ($)</label>
                        <input type="number" value={of.price || ''} onChange={e => setOf(v.id, 'price', e.target.value)} placeholder="315,000" min="0" />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Close Date</label>
                        <input type="date" value={of.date || ''} onChange={e => setOf(v.id, 'date', e.target.value)} />
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleSaveOutcome(v.id)}
                      disabled={!of.price || saving === v.id}
                    >
                      {saving === v.id ? 'Saving...' : 'Save Outcome & Log Learning'}
                    </button>
                  </div>
                )}

                {/* Data gaps that were present */}
                {v.gaps?.critical?.length > 0 && (
                  <div className="gap-box">
                    <div className="gap-box-title">Critical gaps at time of valuation</div>
                    <ul>{v.gaps.critical.map((g, i) => <li key={i}>{g.field}</li>)}</ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
