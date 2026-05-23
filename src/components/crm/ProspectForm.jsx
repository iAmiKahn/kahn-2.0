import { useState } from 'react'
import { X } from 'lucide-react'
import { saveProspect } from '../../utils/dataStore.js'

const EMPTY = {
  name: '', phone: '', email: '', source: '', status: 'active',
  propertyAddress: '', propertyType: '', beds: '', baths: '', sqft: '', yearBuilt: '',
  estimatedValue: '', motivation: '', timeline: '', notes: '',
}

export default function ProspectForm({ prospect, onSave, onClose }) {
  const [form, setForm] = useState(prospect ? { ...EMPTY, ...prospect } : EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required'); return }
    setSaving(true)
    try {
      await saveProspect(form)
      onSave()
    } catch (err) {
      setError('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{prospect?.id ? 'Edit Prospect' : 'New Prospect'}</span>
          <button className="btn-icon" onClick={onClose}><X /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">

            {/* Contact */}
            <div className="section-heading">Contact Information</div>
            <div className="form-group">
              <label className="label-required">Full Name</label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" autoFocus />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 000-0000" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@email.com" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Lead Source</label>
                <select value={form.source} onChange={e => set('source', e.target.value)}>
                  <option value="">— Select —</option>
                  <option value="referral">Referral</option>
                  <option value="cold_call">Cold Call</option>
                  <option value="door_knock">Door Knock</option>
                  <option value="social_media">Social Media</option>
                  <option value="online_lead">Online Lead</option>
                  <option value="past_client">Past Client</option>
                  <option value="open_house">Open House</option>
                  <option value="expired">Expired Listing</option>
                  <option value="fsbo">FSBO</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="active">Active</option>
                  <option value="follow_up">Follow-up</option>
                  <option value="cold">Cold</option>
                  <option value="listed">Listed</option>
                  <option value="closed">Closed</option>
                  <option value="dead">Dead</option>
                </select>
              </div>
            </div>

            {/* Property */}
            <div className="section-heading">Property Information</div>
            <div className="form-group">
              <label>Property Address</label>
              <input type="text" value={form.propertyAddress} onChange={e => set('propertyAddress', e.target.value)} placeholder="123 Main St, City, IL 60000" />
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label>Property Type</label>
                <select value={form.propertyType} onChange={e => set('propertyType', e.target.value)}>
                  <option value="">— Type —</option>
                  <option value="sfr">SFR</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="multi_family">Multi-family</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <div className="form-group">
                <label>Beds</label>
                <input type="number" value={form.beds} onChange={e => set('beds', e.target.value)} placeholder="3" min="0" />
              </div>
              <div className="form-group">
                <label>Baths</label>
                <input type="number" value={form.baths} onChange={e => set('baths', e.target.value)} placeholder="2" min="0" step="0.5" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Sqft (approx)</label>
                <input type="number" value={form.sqft} onChange={e => set('sqft', e.target.value)} placeholder="1800" min="0" />
              </div>
              <div className="form-group">
                <label>Year Built</label>
                <input type="number" value={form.yearBuilt} onChange={e => set('yearBuilt', e.target.value)} placeholder="1998" min="1800" max="2026" />
              </div>
            </div>
            <div className="form-group">
              <label>Seller's Price Expectation ($)</label>
              <input type="number" value={form.estimatedValue} onChange={e => set('estimatedValue', e.target.value)} placeholder="Leave blank if unknown" min="0" />
              <span className="input-hint">What the seller thinks it's worth — useful for expectation gap analysis</span>
            </div>

            {/* Seller context */}
            <div className="section-heading">Seller Context</div>
            <div className="form-row">
              <div className="form-group">
                <label>Motivation</label>
                <select value={form.motivation} onChange={e => set('motivation', e.target.value)}>
                  <option value="">— Select —</option>
                  <option value="downsizing">Downsizing</option>
                  <option value="upsizing">Upsizing</option>
                  <option value="relocation">Relocation / Job</option>
                  <option value="divorce">Divorce</option>
                  <option value="estate">Estate / Inherited</option>
                  <option value="financial">Financial pressure</option>
                  <option value="retirement">Retirement</option>
                  <option value="investment">Investment / Flip</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
              <div className="form-group">
                <label>Timeline</label>
                <select value={form.timeline} onChange={e => set('timeline', e.target.value)}>
                  <option value="">— Select —</option>
                  <option value="asap">ASAP (&lt;30 days)</option>
                  <option value="1_3mo">1–3 months</option>
                  <option value="3_6mo">3–6 months</option>
                  <option value="6_12mo">6–12 months</option>
                  <option value="1yr_plus">1+ year</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Anything relevant from the initial conversation..." rows={3} />
            </div>

            {error && (
              <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 4 }}>{error}</div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : prospect?.id ? 'Save Changes' : 'Add Prospect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
