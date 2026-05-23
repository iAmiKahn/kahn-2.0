import { useState, useEffect } from 'react'
import { Edit2, Calculator, Phone, Mail, Calendar } from 'lucide-react'
import InteractionLog from './InteractionLog.jsx'
import {
  getInteractionsForProspect,
  getValuationsForProperty,
  getPropertiesForProspect,
  deleteProspect,
} from '../../utils/dataStore.js'
import { formatCurrency, formatVariance } from '../../utils/valuationEngine.js'

const STATUS_BADGE = {
  active:    { cls: 'badge-green',  label: 'Active'    },
  follow_up: { cls: 'badge-yellow', label: 'Follow-up' },
  cold:      { cls: 'badge-grey',   label: 'Cold'      },
  listed:    { cls: 'badge-purple', label: 'Listed'    },
  closed:    { cls: 'badge-green',  label: 'Closed'    },
  dead:      { cls: 'badge-red',    label: 'Dead'      },
}

const MOTIVATION_LABELS = {
  downsizing: 'Downsizing', upsizing: 'Upsizing', relocation: 'Relocation/Job',
  divorce: 'Divorce', estate: 'Estate/Inherited', financial: 'Financial Pressure',
  retirement: 'Retirement', investment: 'Investment/Flip', unknown: 'Unknown',
}

const TIMELINE_LABELS = {
  asap: 'ASAP (<30 days)', '1_3mo': '1–3 months', '3_6mo': '3–6 months',
  '6_12mo': '6–12 months', '1yr_plus': '1+ year', unknown: 'Unknown',
}

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ProspectDetail({ prospect, onEdit, onDataChange }) {
  const [interactions, setInteractions] = useState([])
  const [valuations, setValuations] = useState([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (prospect?.id) loadRelated()
  }, [prospect?.id])

  async function loadRelated() {
    const [ints, props] = await Promise.all([
      getInteractionsForProspect(prospect.id),
      getPropertiesForProspect(prospect.id),
    ])
    setInteractions(ints)
    if (props.length > 0) {
      const vals = await getValuationsForProperty(props[0].id)
      setValuations(vals)
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete ${prospect.name}? This cannot be undone.`)) return
    await deleteProspect(prospect.id)
    onDataChange()
  }

  const badge = STATUS_BADGE[prospect.status] || { cls: 'badge-grey', label: prospect.status }
  const latestVal = valuations[valuations.length - 1]
  const hasExpectationGap = prospect.estimatedValue && latestVal?.result?.pointEstimate
  const expectationGap = hasExpectationGap
    ? ((latestVal.result.pointEstimate - Number(prospect.estimatedValue)) / Number(prospect.estimatedValue) * 100).toFixed(1)
    : null

  return (
    <>
      <div className="topbar" style={{ WebkitAppRegion: 'no-drag' }}>
        <div className="flex items-center gap-2">
          <span className="topbar-title">{prospect.name}</span>
          <span className={`badge ${badge.cls}`}>{badge.label}</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => onEdit(prospect)}>
            <Edit2 /> Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      <div className="tabs">
        {['overview', 'interactions', 'valuations'].map(t => (
          <div key={t} className={`tab${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === 'interactions' && interactions.length > 0 && ` (${interactions.length})`}
            {t === 'valuations'   && valuations.length > 0   && ` (${valuations.length})`}
          </div>
        ))}
      </div>

      <div className="panel-body-padded">
        {activeTab === 'overview' && (
          <>
            {/* Contact info */}
            <div className="section-heading">Contact</div>
            <div className="data-grid">
              {prospect.phone && (
                <div className="data-cell">
                  <div className="data-cell-label">Phone</div>
                  <div className="data-cell-value" style={{ fontSize: 13 }}>{prospect.phone}</div>
                </div>
              )}
              {prospect.email && (
                <div className="data-cell">
                  <div className="data-cell-label">Email</div>
                  <div className="data-cell-value" style={{ fontSize: 12 }}>{prospect.email}</div>
                </div>
              )}
              {prospect.source && (
                <div className="data-cell">
                  <div className="data-cell-label">Lead Source</div>
                  <div className="data-cell-value" style={{ fontSize: 13 }}>{prospect.source.replace('_', ' ')}</div>
                </div>
              )}
              <div className="data-cell">
                <div className="data-cell-label">Added</div>
                <div className="data-cell-value" style={{ fontSize: 13 }}>{fmtDate(prospect.createdAt)}</div>
              </div>
            </div>

            {/* Property */}
            {prospect.propertyAddress && (
              <>
                <div className="section-heading">Property</div>
                <div className="detail-field">
                  <span className="detail-field-label">Address</span>
                  <span className="detail-field-value">{prospect.propertyAddress}</span>
                </div>
                <div className="data-grid">
                  {prospect.propertyType && <div className="data-cell"><div className="data-cell-label">Type</div><div className="data-cell-value" style={{ fontSize: 13 }}>{prospect.propertyType.toUpperCase()}</div></div>}
                  {prospect.beds && <div className="data-cell"><div className="data-cell-label">Beds</div><div className="data-cell-value">{prospect.beds}</div></div>}
                  {prospect.baths && <div className="data-cell"><div className="data-cell-label">Baths</div><div className="data-cell-value">{prospect.baths}</div></div>}
                  {prospect.sqft && <div className="data-cell"><div className="data-cell-label">Sqft</div><div className="data-cell-value">{Number(prospect.sqft).toLocaleString()}</div></div>}
                  {prospect.yearBuilt && <div className="data-cell"><div className="data-cell-label">Year Built</div><div className="data-cell-value">{prospect.yearBuilt}</div></div>}
                </div>
              </>
            )}

            {/* Seller context */}
            {(prospect.motivation || prospect.timeline || prospect.estimatedValue) && (
              <>
                <div className="section-heading">Seller Context</div>
                <div className="data-grid">
                  {prospect.motivation && <div className="data-cell"><div className="data-cell-label">Motivation</div><div className="data-cell-value" style={{ fontSize: 12 }}>{MOTIVATION_LABELS[prospect.motivation] || prospect.motivation}</div></div>}
                  {prospect.timeline && <div className="data-cell"><div className="data-cell-label">Timeline</div><div className="data-cell-value" style={{ fontSize: 12 }}>{TIMELINE_LABELS[prospect.timeline] || prospect.timeline}</div></div>}
                  {prospect.estimatedValue && (
                    <div className="data-cell">
                      <div className="data-cell-label">Seller Expects</div>
                      <div className="data-cell-value">{formatCurrency(Number(prospect.estimatedValue))}</div>
                    </div>
                  )}
                  {latestVal?.result?.pointEstimate && (
                    <div className="data-cell">
                      <div className="data-cell-label">Our Estimate</div>
                      <div className="data-cell-value">{formatCurrency(latestVal.result.pointEstimate)}</div>
                    </div>
                  )}
                </div>
                {expectationGap !== null && (
                  <div className={`card-sm mt-2 ${Number(expectationGap) < -5 ? 'gap-box' : Number(expectationGap) > 5 ? 'gap-box info' : ''}`}
                    style={{ background: Math.abs(Number(expectationGap)) < 5 ? 'var(--bg-elevated)' : undefined }}>
                    <span className="text-sm">
                      <strong>Expectation gap: </strong>
                      <span className={Number(expectationGap) < -5 ? 'text-red' : Number(expectationGap) > 5 ? 'text-green' : 'text-accent'}>
                        {expectationGap > 0 ? '+' : ''}{expectationGap}%
                      </span>
                      {' '}{Number(expectationGap) < -5 ? '— Seller expects MORE than market value. Manage expectations early.' : Number(expectationGap) > 5 ? '— Seller is underpricing. Opportunity.' : '— Aligned with market.'}
                    </span>
                  </div>
                )}
              </>
            )}

            {/* Notes */}
            {prospect.notes && (
              <>
                <div className="section-heading">Notes</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                  {prospect.notes}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'interactions' && (
          <InteractionLog
            prospectId={prospect.id}
            interactions={interactions}
            onRefresh={() => { loadRelated(); onDataChange() }}
          />
        )}

        {activeTab === 'valuations' && (
          <>
            <div className="section-heading">Valuation History</div>
            {valuations.length === 0 ? (
              <div className="text-sm text-muted">No valuations run for this property yet. Use the Valuation Engine tab.</div>
            ) : (
              valuations.map(v => (
                <div key={v.id} className="card-sm mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{formatCurrency(v.result?.pointEstimate)}</span>
                    <span className={`badge badge-${v.result?.confidence?.color === 'green' ? 'green' : v.result?.confidence?.color === 'yellow' ? 'yellow' : 'orange'}`}>
                      {v.result?.confidence?.label}
                    </span>
                  </div>
                  <div className="text-sm text-muted">{fmtDate(v.requestedAt)}</div>
                  {v.actualSalePrice && (
                    <div className="text-sm mt-1">
                      Actual: <strong>{formatCurrency(v.actualSalePrice)}</strong>
                      {' '}<span className={v.variance && Math.abs(v.variance) < 3 ? 'text-green' : 'text-yellow'}>
                        ({formatVariance(v.variance)})
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </>
  )
}
