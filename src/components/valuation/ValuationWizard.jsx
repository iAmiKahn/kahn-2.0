import { useState } from 'react'
import { Plus, Trash2, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { calculateValuation, analyzeDataGaps, IMP_ROI } from '../../utils/valuationEngine.js'
import { saveValuation, getProspects, saveProperty } from '../../utils/dataStore.js'
import ValuationResult from './ValuationResult.jsx'

const STEPS = ['Property', 'Market', 'Comps', 'Result']

const EMPTY_SUBJECT = {
  address: '', propertyType: 'sfr', beds: '', bathsFull: '', bathsHalf: '',
  sqft: '', basementFinishedSqft: '', garageSpaces: '', lotSqft: '',
  yearBuilt: '', condition: 'average', pool: false, deck: false,
  improvements: [],
}

const EMPTY_MARKET = {
  condition: 'balanced', monthlyAppreciation: '', listToSaleRatio: '', avgDom: '',
  notes: '',
}

const EMPTY_COMP = () => ({
  address: '', salePrice: '', saleDate: '', sqft: '', bathsFull: '',
  bathsHalf: '', garageSpaces: '', condition: 'average',
  basementFinishedSqft: '', distanceMiles: '', pool: false, dom: '',
})

export default function ValuationWizard({ onComplete }) {
  const [step, setStep] = useState(0)
  const [subject, setSubject] = useState({ ...EMPTY_SUBJECT })
  const [market, setMarket] = useState({ ...EMPTY_MARKET })
  const [comps, setComps] = useState([EMPTY_COMP()])
  const [result, setResult] = useState(null)
  const [gaps, setGaps] = useState(null)
  const [prospectId, setProspectId] = useState('')
  const [prospects, setProspects] = useState(null)
  const [saving, setSaving] = useState(false)

  // Lazy-load prospects when wizard first opens
  async function ensureProspects() {
    if (prospects === null) {
      const data = await getProspects()
      setProspects(data)
    }
  }

  function setSub(field, val) { setSubject(s => ({ ...s, [field]: val })) }
  function setMkt(field, val) { setMarket(m => ({ ...m, [field]: val })) }

  function setComp(i, field, val) {
    setComps(cs => cs.map((c, idx) => idx === i ? { ...c, [field]: val } : c))
  }

  function addComp() {
    if (comps.length < 6) setComps(cs => [...cs, EMPTY_COMP()])
  }

  function removeComp(i) {
    if (comps.length > 1) setComps(cs => cs.filter((_, idx) => idx !== i))
  }

  function addImprovement() {
    setSub('improvements', [...subject.improvements, { type: 'other', year: '', estimatedCost: '' }])
  }

  function setImp(i, field, val) {
    const imps = subject.improvements.map((imp, idx) => idx === i ? { ...imp, [field]: val } : imp)
    setSub('improvements', imps)
  }

  function removeImp(i) {
    setSub('improvements', subject.improvements.filter((_, idx) => idx !== i))
  }

  function numericComps() {
    return comps
      .filter(c => c.address && c.salePrice && c.sqft)
      .map(c => ({
        ...c,
        salePrice: Number(c.salePrice),
        sqft: Number(c.sqft),
        bathsFull: Number(c.bathsFull) || 0,
        bathsHalf: Number(c.bathsHalf) || 0,
        garageSpaces: Number(c.garageSpaces) || 0,
        basementFinishedSqft: Number(c.basementFinishedSqft) || 0,
        distanceMiles: Number(c.distanceMiles) || 0.5,
        dom: Number(c.dom) || null,
      }))
  }

  function numericSubject() {
    return {
      ...subject,
      sqft: Number(subject.sqft) || 0,
      bathsFull: Number(subject.bathsFull) || 0,
      bathsHalf: Number(subject.bathsHalf) || 0,
      garageSpaces: Number(subject.garageSpaces) || 0,
      basementFinishedSqft: Number(subject.basementFinishedSqft) || 0,
      beds: Number(subject.beds) || 0,
      improvements: subject.improvements.map(i => ({ ...i, estimatedCost: Number(i.estimatedCost) || 0 })),
    }
  }

  function numericMarket() {
    return {
      ...market,
      monthlyAppreciation: market.monthlyAppreciation !== '' ? Number(market.monthlyAppreciation) / 100 : null,
      listToSaleRatio: market.listToSaleRatio !== '' ? Number(market.listToSaleRatio) / 100 : null,
      avgDom: market.avgDom !== '' ? Number(market.avgDom) : null,
    }
  }

  function handleNext() {
    if (step === 2) runCalc()
    else setStep(s => s + 1)
  }

  function runCalc() {
    const sub = numericSubject()
    const mkt = numericMarket()
    const cs  = numericComps()
    const calc = calculateValuation(sub, cs, mkt)
    const gapsResult = analyzeDataGaps(sub, cs, mkt)
    setResult(calc)
    setGaps(gapsResult)
    setStep(3)
    ensureProspects()
  }

  async function handleSave() {
    setSaving(true)
    try {
      let propertyId = null
      if (prospectId) {
        const props = await saveProperty({
          prospectId,
          address: subject.address,
          ...numericSubject(),
        })
        propertyId = props[props.length - 1]?.id
      }
      await saveValuation({
        prospectId: prospectId || null,
        propertyId,
        subject: numericSubject(),
        market: numericMarket(),
        comps: numericComps(),
        result,
        gaps,
      })
      onComplete()
      resetWizard()
    } finally {
      setSaving(false)
    }
  }

  function resetWizard() {
    setStep(0)
    setSubject({ ...EMPTY_SUBJECT })
    setMarket({ ...EMPTY_MARKET })
    setComps([EMPTY_COMP()])
    setResult(null)
    setGaps(null)
    setProspectId('')
  }

  const canProceedStep0 = subject.address.trim().length > 0
  const canProceedStep1 = true
  const canProceedStep2 = comps.some(c => c.address && c.salePrice && c.sqft)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Stepper */}
      <div style={{ padding: '14px 24px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div className="stepper" style={{ padding: 0 }}>
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center" style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div className={`step ${i < step ? 'complete' : i === step ? 'active' : ''}`} style={{ flex: 'none' }}>
                <div className="step-dot">
                  {i < step ? <Check style={{ width: 12, height: 12 }} /> : i + 1}
                </div>
                <span className="step-label">{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`step-line${i < step ? ' complete' : ''}`} style={{ flex: 1, margin: '0 8px' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
        {step === 0 && <StepProperty subject={subject} setSub={setSub} addImp={addImprovement} setImp={setImp} removeImp={removeImp} />}
        {step === 1 && <StepMarket market={market} setMkt={setMkt} />}
        {step === 2 && <StepComps comps={comps} setComp={setComp} addComp={addComp} removeComp={removeComp} subjectSqft={subject.sqft} />}
        {step === 3 && result && (
          <ValuationResult
            result={result}
            gaps={gaps}
            subject={numericSubject()}
            prospects={prospects || []}
            prospectId={prospectId}
            onProspectChange={setProspectId}
            onSave={handleSave}
            onRunNew={resetWizard}
            saving={saving}
          />
        )}
      </div>

      {/* Nav buttons */}
      {step < 3 && (
        <div style={{ padding: '12px 28px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
          <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
            <ChevronLeft /> Back
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={
              (step === 0 && !canProceedStep0) ||
              (step === 2 && !canProceedStep2)
            }
          >
            {step === 2 ? 'Calculate Valuation' : 'Continue'}
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Step 1: Property ───────────────────────────────────────────────────────
function StepProperty({ subject, setSub, addImp, setImp, removeImp }) {
  return (
    <div style={{ maxWidth: 680 }}>
      <div className="section-heading" style={{ marginTop: 0 }}>Subject Property</div>

      <div className="form-group">
        <label className="label-required">Property Address</label>
        <input type="text" value={subject.address} onChange={e => setSub('address', e.target.value)}
          placeholder="123 Oak Lane, Lake in the Hills, IL 60156" autoFocus />
        <span className="input-hint">Full address including city and ZIP</span>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Property Type</label>
          <select value={subject.propertyType} onChange={e => setSub('propertyType', e.target.value)}>
            <option value="sfr">Single Family (SFR)</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
            <option value="multi_family">Multi-family</option>
          </select>
        </div>
        <div className="form-group">
          <label>Condition</label>
          <select value={subject.condition} onChange={e => setSub('condition', e.target.value)}>
            <option value="excellent">Excellent — updated, move-in ready</option>
            <option value="good">Good — well maintained, minor wear</option>
            <option value="average">Average — functional, some updates needed</option>
            <option value="fair">Fair — dated, several repairs needed</option>
            <option value="poor">Poor — significant deferred maintenance</option>
          </select>
        </div>
      </div>

      <div className="form-row-3">
        <div className="form-group">
          <label>Beds</label>
          <input type="number" value={subject.beds} onChange={e => setSub('beds', e.target.value)} placeholder="3" min="0" max="20" />
        </div>
        <div className="form-group">
          <label>Full Baths</label>
          <input type="number" value={subject.bathsFull} onChange={e => setSub('bathsFull', e.target.value)} placeholder="2" min="0" max="20" />
        </div>
        <div className="form-group">
          <label>Half Baths</label>
          <input type="number" value={subject.bathsHalf} onChange={e => setSub('bathsHalf', e.target.value)} placeholder="1" min="0" max="20" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Above-Grade Sqft (GLA)</label>
          <input type="number" value={subject.sqft} onChange={e => setSub('sqft', e.target.value)} placeholder="1,850" min="0" />
          <span className="input-hint">Above-grade living area only</span>
        </div>
        <div className="form-group">
          <label>Basement Finished Sqft</label>
          <input type="number" value={subject.basementFinishedSqft} onChange={e => setSub('basementFinishedSqft', e.target.value)} placeholder="0" min="0" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Garage Spaces</label>
          <input type="number" value={subject.garageSpaces} onChange={e => setSub('garageSpaces', e.target.value)} placeholder="2" min="0" max="10" />
        </div>
        <div className="form-group">
          <label>Lot Size (sqft)</label>
          <input type="number" value={subject.lotSqft} onChange={e => setSub('lotSqft', e.target.value)} placeholder="8,500" min="0" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Year Built</label>
          <input type="number" value={subject.yearBuilt} onChange={e => setSub('yearBuilt', e.target.value)} placeholder="1998" min="1800" max="2026" />
        </div>
        <div className="form-group">
          <label>Features</label>
          <div className="flex gap-2 mt-1">
            <label style={{ display: 'flex', alignItems: 'center', gap: 5, textTransform: 'none', fontWeight: 400, fontSize: 13 }}>
              <input type="checkbox" checked={subject.pool} onChange={e => setSub('pool', e.target.checked)} /> Pool
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 5, textTransform: 'none', fontWeight: 400, fontSize: 13 }}>
              <input type="checkbox" checked={subject.deck} onChange={e => setSub('deck', e.target.checked)} /> Deck
            </label>
          </div>
        </div>
      </div>

      {/* Improvements */}
      <div className="section-heading">Recent Improvements (Optional)</div>
      <span className="input-hint" style={{ display: 'block', marginBottom: 8 }}>
        List significant improvements in the last 5 years — kitchen remodel, new roof, etc. These inform condition adjustment.
      </span>

      {subject.improvements.map((imp, i) => (
        <div key={i} className="imp-row">
          <select value={imp.type} onChange={e => setImp(i, 'type', e.target.value)} style={{ flex: 2 }}>
            {Object.keys(IMP_ROI).map(k => <option key={k} value={k}>{k.replace(/_/g, ' ')}</option>)}
          </select>
          <input type="number" value={imp.year} onChange={e => setImp(i, 'year', e.target.value)} placeholder="Year" style={{ flex: '0 0 90px' }} min="2000" max="2026" />
          <input type="number" value={imp.estimatedCost} onChange={e => setImp(i, 'estimatedCost', e.target.value)} placeholder="$ cost" style={{ flex: '0 0 120px' }} min="0" />
          <button className="btn-icon btn-sm" onClick={() => removeImp(i)} style={{ flex: 'none' }}>
            <Trash2 />
          </button>
        </div>
      ))}
      <button className="btn btn-ghost btn-sm" onClick={addImp}>
        <Plus /> Add Improvement
      </button>
    </div>
  )
}

// ─── Step 2: Market Context ─────────────────────────────────────────────────
function StepMarket({ market, setMkt }) {
  return (
    <div style={{ maxWidth: 560 }}>
      <div className="section-heading" style={{ marginTop: 0 }}>Market Context</div>
      <div className="gap-box info" style={{ marginBottom: 16 }}>
        <div className="gap-box-title">Why this matters</div>
        <ul>
          <li>Market condition applies a ±1.5% overlay to the comp-based estimate</li>
          <li>Monthly appreciation adjusts comp prices forward in time — critical for aging comps</li>
          <li>If unknown, leave fields blank — gaps will be flagged in results</li>
        </ul>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Market Condition</label>
          <select value={market.condition} onChange={e => setMkt('condition', e.target.value)}>
            <option value="seller">Seller's market — low inventory, above list</option>
            <option value="balanced">Balanced — roughly at list price</option>
            <option value="buyer">Buyer's market — high inventory, below list</option>
          </select>
        </div>
        <div className="form-group">
          <label>Monthly Appreciation Rate (%)</label>
          <input type="number" value={market.monthlyAppreciation} onChange={e => setMkt('monthlyAppreciation', e.target.value)}
            placeholder="e.g. 0.3" step="0.1" />
          <span className="input-hint">Enter 0 if flat. Typical IL suburban: 0.2–0.5%/mo in active markets</span>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>List-to-Sale Ratio (%)</label>
          <input type="number" value={market.listToSaleRatio} onChange={e => setMkt('listToSaleRatio', e.target.value)}
            placeholder="e.g. 101.5" step="0.1" min="85" max="115" />
          <span className="input-hint">Percent of list price homes are selling at</span>
        </div>
        <div className="form-group">
          <label>Average DOM (days)</label>
          <input type="number" value={market.avgDom} onChange={e => setMkt('avgDom', e.target.value)}
            placeholder="e.g. 18" min="0" />
          <span className="input-hint">Average days on market in the area</span>
        </div>
      </div>

      <div className="form-group">
        <label>Market Notes</label>
        <textarea value={market.notes} onChange={e => setMkt('notes', e.target.value)}
          placeholder="Any local knowledge — new development, school rating changes, upcoming infrastructure, seasonal factors..."
          rows={3} />
      </div>
    </div>
  )
}

// ─── Step 3: Comparable Sales ───────────────────────────────────────────────
function StepComps({ comps, setComp, addComp, removeComp, subjectSqft }) {
  return (
    <div style={{ maxWidth: 760 }}>
      <div className="section-heading" style={{ marginTop: 0 }}>Comparable Sales</div>
      <div className="gap-box info" style={{ marginBottom: 14 }}>
        <div className="gap-box-title">Best practice</div>
        <ul>
          <li>3–5 comps sold within the last 90 days, within 1 mile, similar size (±20%)</li>
          <li>Address and Sale Price + Sqft are the minimum — all other fields improve accuracy</li>
          <li>Pull from MLS, Zillow, Redfin, or county records</li>
        </ul>
      </div>

      {comps.map((comp, i) => (
        <div key={i} className="comp-row">
          <div className="comp-row-num">COMP {i + 1}</div>
          {comps.length > 1 && (
            <button
              className="btn-icon btn-sm"
              style={{ position: 'absolute', top: 6, right: 8, border: 'none', background: 'transparent' }}
              onClick={() => removeComp(i)}
            >
              <Trash2 style={{ width: 13, height: 13 }} />
            </button>
          )}
          <div className="comp-row-body">
            <div className="form-row" style={{ marginBottom: 8 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label-required">Address</label>
                <input type="text" value={comp.address} onChange={e => setComp(i, 'address', e.target.value)} placeholder="456 Elm St, City, IL" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label-required">Sale Price ($)</label>
                <input type="number" value={comp.salePrice} onChange={e => setComp(i, 'salePrice', e.target.value)} placeholder="325,000" min="0" />
              </div>
            </div>
            <div className="form-row" style={{ marginBottom: 8 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Sale Date</label>
                <input type="date" value={comp.saleDate} onChange={e => setComp(i, 'saleDate', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label-required">GLA Sqft</label>
                <input type="number" value={comp.sqft} onChange={e => setComp(i, 'sqft', e.target.value)} placeholder="1,750"
                  min="0"
                  style={{ borderColor: comp.sqft && subjectSqft && Math.abs(Number(comp.sqft) - Number(subjectSqft)) / Number(subjectSqft) > 0.25 ? 'var(--yellow)' : undefined }}
                />
                {comp.sqft && subjectSqft && Math.abs(Number(comp.sqft) - Number(subjectSqft)) / Number(subjectSqft) > 0.25 && (
                  <span className="input-hint text-yellow">±{Math.round(Math.abs(Number(comp.sqft) - Number(subjectSqft)) / Number(subjectSqft) * 100)}% size difference — large adjustment will be applied</span>
                )}
              </div>
            </div>
            <div className="form-row-3" style={{ marginBottom: 0 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Full Baths</label>
                <input type="number" value={comp.bathsFull} onChange={e => setComp(i, 'bathsFull', e.target.value)} placeholder="2" min="0" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Garage Spaces</label>
                <input type="number" value={comp.garageSpaces} onChange={e => setComp(i, 'garageSpaces', e.target.value)} placeholder="2" min="0" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Condition</label>
                <select value={comp.condition} onChange={e => setComp(i, 'condition', e.target.value)}>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>
            <div className="form-row" style={{ marginTop: 8, marginBottom: 0 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Distance (miles)</label>
                <input type="number" value={comp.distanceMiles} onChange={e => setComp(i, 'distanceMiles', e.target.value)} placeholder="0.4" min="0" step="0.1" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Basement Finished Sqft</label>
                <input type="number" value={comp.basementFinishedSqft} onChange={e => setComp(i, 'basementFinishedSqft', e.target.value)} placeholder="0" min="0" />
              </div>
            </div>
          </div>
        </div>
      ))}

      {comps.length < 6 && (
        <button className="btn btn-ghost" onClick={addComp}>
          <Plus /> Add Comparable
        </button>
      )}
    </div>
  )
}
