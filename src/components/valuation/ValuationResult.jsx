import { Save, RotateCcw } from 'lucide-react'
import { formatCurrency } from '../../utils/valuationEngine.js'

const CONF_COLOR = {
  green:  'var(--green)',
  yellow: 'var(--yellow)',
  orange: 'var(--orange)',
  red:    'var(--red)',
}

function AdjSign({ val }) {
  if (!val || val === 0) return <span style={{ color: 'var(--text-muted)' }}>—</span>
  return <span className={val > 0 ? 'comp-adj-pos' : 'comp-adj-neg'}>
    {val > 0 ? '+' : ''}{formatCurrency(val)}
  </span>
}

export default function ValuationResult({
  result, gaps, subject, prospects, prospectId, onProspectChange, onSave, onRunNew, saving
}) {
  if (!result) return null

  const { pointEstimate, rangeLow, rangeHigh, confidence, adjustedComps, methodology } = result
  const hasResult = pointEstimate != null

  return (
    <div style={{ maxWidth: 820 }}>

      {/* Hero value */}
      <div className="val-result-hero">
        <div className="val-result-label">Estimated Market Value</div>
        {hasResult ? (
          <>
            <div className="val-result-value">{formatCurrency(pointEstimate)}</div>
            <div className="val-result-range">
              Range: {formatCurrency(rangeLow)} — {formatCurrency(rangeHigh)}
            </div>
          </>
        ) : (
          <div style={{ color: 'var(--red)', fontSize: 15, fontWeight: 600, marginTop: 8 }}>
            {result.error || 'Insufficient data to calculate'}
          </div>
        )}

        {/* Confidence */}
        <div className="val-result-confidence">
          <div className="flex items-center justify-between mb-1" style={{ maxWidth: 300, margin: '0 auto 4px' }}>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Confidence</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: CONF_COLOR[confidence?.color] || 'var(--text-secondary)' }}>
              {confidence?.label} ({confidence?.score}/100)
            </span>
          </div>
          <div className="confidence-bar-wrap" style={{ maxWidth: 300, margin: '0 auto' }}>
            <div
              className="confidence-bar-fill"
              style={{
                width: `${confidence?.score ?? 0}%`,
                background: CONF_COLOR[confidence?.color] || 'var(--text-muted)',
              }}
            />
          </div>
        </div>

        {/* Methodology */}
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 10 }}>{methodology}</div>
      </div>

      {/* Data gaps */}
      {gaps?.critical?.length > 0 && (
        <div className="gap-box" style={{ marginBottom: 8 }}>
          <div className="gap-box-title">Critical Gaps — accuracy limited</div>
          <ul>{gaps.critical.map((g, i) => <li key={i}><strong>{g.field}:</strong> {g.impact}</li>)}</ul>
        </div>
      )}
      {gaps?.recommended?.length > 0 && (
        <div className="gap-box warn" style={{ marginBottom: 8 }}>
          <div className="gap-box-title">Recommended — would improve accuracy</div>
          <ul>{gaps.recommended.map((g, i) => <li key={i}><strong>{g.field}:</strong> {g.impact}</li>)}</ul>
        </div>
      )}
      {gaps?.nice?.length > 0 && (
        <div className="gap-box info" style={{ marginBottom: 8 }}>
          <div className="gap-box-title">Optional — minor precision gain</div>
          <ul>{gaps.nice.map((g, i) => <li key={i}>{g.field}</li>)}</ul>
        </div>
      )}

      {/* Confidence reasons */}
      {confidence?.reasons?.length > 0 && (
        <div className="card-sm mb-4">
          <div className="section-heading" style={{ marginTop: 0, marginBottom: 6 }}>Confidence Factors</div>
          {confidence.reasons.map((r, i) => (
            <div key={i} className="flex gap-2 items-center text-sm" style={{ marginBottom: 3 }}>
              <span style={{ color: 'var(--green)' }}>✓</span>
              <span style={{ color: 'var(--text-secondary)' }}>{r}</span>
            </div>
          ))}
        </div>
      )}

      {/* Comp adjustment grid */}
      {adjustedComps?.length > 0 && (
        <>
          <div className="section-heading">Comparable Adjustments</div>
          <div style={{ overflowX: 'auto', marginBottom: 20 }}>
            <table className="comp-table">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Sale Price</th>
                  <th>Date</th>
                  <th>Sqft adj</th>
                  <th>Condition adj</th>
                  <th>Garage adj</th>
                  <th>Time adj</th>
                  <th>Net adj</th>
                  <th>Adjusted</th>
                  <th>Weight</th>
                </tr>
              </thead>
              <tbody>
                {adjustedComps.map((c, i) => (
                  <tr key={i}>
                    <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.address || `Comp ${i + 1}`}
                    </td>
                    <td>{formatCurrency(c.salePrice)}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 11 }}>
                      {c.saleDate ? new Date(c.saleDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) : `${c.monthsAgo}mo ago`}
                    </td>
                    <td><AdjSign val={c.adjustments?.sqft} /></td>
                    <td><AdjSign val={c.adjustments?.condition} /></td>
                    <td><AdjSign val={c.adjustments?.garage} /></td>
                    <td><AdjSign val={c.adjustments?.time} /></td>
                    <td>
                      <span className={c.totalNetAdj >= 0 ? 'comp-adj-pos' : 'comp-adj-neg'}>
                        {c.totalNetAdj >= 0 ? '+' : ''}{formatCurrency(c.totalNetAdj)}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(c.adjustedPrice)}</td>
                    <td style={{ color: 'var(--accent-text)', fontSize: 11 }}>{c.weight}×</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Subject summary */}
      <div className="section-heading">Subject Property Summary</div>
      <div className="data-grid" style={{ marginBottom: 20 }}>
        <div className="data-cell"><div className="data-cell-label">Address</div><div className="data-cell-value" style={{ fontSize: 11 }}>{subject.address || '—'}</div></div>
        <div className="data-cell"><div className="data-cell-label">Type</div><div className="data-cell-value" style={{ fontSize: 13 }}>{subject.propertyType?.toUpperCase() || '—'}</div></div>
        <div className="data-cell"><div className="data-cell-label">Beds</div><div className="data-cell-value">{subject.beds || '—'}</div></div>
        <div className="data-cell"><div className="data-cell-label">Full Baths</div><div className="data-cell-value">{subject.bathsFull || '—'}</div></div>
        <div className="data-cell"><div className="data-cell-label">Sqft (GLA)</div><div className="data-cell-value">{subject.sqft ? Number(subject.sqft).toLocaleString() : '—'}</div></div>
        <div className="data-cell"><div className="data-cell-label">Condition</div><div className="data-cell-value" style={{ fontSize: 12, textTransform: 'capitalize' }}>{subject.condition || '—'}</div></div>
        <div className="data-cell"><div className="data-cell-label">Garage</div><div className="data-cell-value">{subject.garageSpaces ?? '—'}</div></div>
        <div className="data-cell"><div className="data-cell-label">Year Built</div><div className="data-cell-value">{subject.yearBuilt || '—'}</div></div>
      </div>

      {/* Save to CRM */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-heading" style={{ marginTop: 0, marginBottom: 10 }}>Save to CRM</div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Attach to Prospect (optional)</label>
          <select value={prospectId} onChange={e => onProspectChange(e.target.value)}>
            <option value="">— Save without prospect —</option>
            {prospects.map(p => (
              <option key={p.id} value={p.id}>{p.name}{p.propertyAddress ? ` — ${p.propertyAddress}` : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="btn btn-primary" onClick={onSave} disabled={saving}>
          <Save /> {saving ? 'Saving...' : 'Save Valuation'}
        </button>
        <button className="btn btn-ghost" onClick={onRunNew}>
          <RotateCcw /> New Valuation
        </button>
      </div>
    </div>
  )
}
