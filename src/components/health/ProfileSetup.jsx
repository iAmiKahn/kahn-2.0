import { useState } from 'react'
import { X, AlertCircle, CheckCircle } from 'lucide-react'

const OUTSTANDING_FIELDS = [
  { key: 'abilifyDosage',         label: 'Abilify Dosage',              type: 'text',   placeholder: 'e.g., 10mg' },
  { key: 'sleepAidName',          label: 'Sleep Aid Name',              type: 'text',   placeholder: 'e.g., Trazodone' },
  { key: 'sleepAidDosage',        label: 'Sleep Aid Dosage',            type: 'text',   placeholder: 'e.g., 50mg' },
  { key: 'testosterone_total',    label: 'Testosterone (Total)',        type: 'number', placeholder: 'ng/dL', unit: 'ng/dL' },
  { key: 'testosterone_free',     label: 'Testosterone (Free)',         type: 'number', placeholder: 'pg/mL', unit: 'pg/mL' },
  { key: 'baselineLifts',         label: 'Baseline Lifts',             type: 'textarea', placeholder: 'Bench: 135x8\nOHP: 95x8\nRow: 135x10\nCurl: 30x12' },
  { key: 'mileTime',              label: 'Current Mile Time',           type: 'text',   placeholder: 'e.g., 12:30' },
  { key: 'caloricIntakeEstimate', label: 'Est. Current Daily Calories', type: 'number', placeholder: 'e.g., 2200' },
  { key: 'waistCircumference',    label: 'Waist Circumference',         type: 'number', placeholder: 'inches', unit: 'in' },
  { key: 'neckCircumference',     label: 'Neck Circumference',          type: 'number', placeholder: 'inches', unit: 'in' },
  { key: 'kitchenEquipment',      label: 'Kitchen Equipment Available', type: 'textarea', placeholder: 'Oven, stovetop, blender...' },
  { key: 'weeklyFoodBudget',      label: 'Weekly Food Budget',          type: 'number', placeholder: '$', unit: '$' },
  { key: 'wearableDevice',        label: 'Wearable Device',             type: 'text',   placeholder: 'e.g., Apple Watch, Fitbit, None' },
  { key: 'currentSupplements',    label: 'Current Supplements',         type: 'textarea', placeholder: 'List any supplements currently taking' },
]

export default function ProfileSetup({ profile, onSave, onClose }) {
  const [form, setForm] = useState({ ...profile.outstanding })
  const [personalForm, setPersonalForm] = useState({ ...profile.personal })

  function handleFieldChange(key, value) {
    setForm(prev => ({ ...prev, [key]: value || null }))
  }

  function handlePersonalChange(key, value) {
    setPersonalForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    onSave({
      ...profile,
      personal: personalForm,
      outstanding: form,
      updatedAt: new Date().toISOString(),
    })
  }

  const filledCount = OUTSTANDING_FIELDS.filter(f => form[f.key] !== null && form[f.key] !== '').length
  const totalCount = OUTSTANDING_FIELDS.length

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 640, maxHeight: '90vh' }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Profile & Data Entry</div>
            <div className="text-sm text-muted" style={{ marginTop: 2 }}>
              {filledCount}/{totalCount} optional fields provided — system activates with more data
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}><X style={{ width: 14, height: 14 }} /></button>
        </div>

        <div className="modal-body">
          {/* Core metrics */}
          <div className="section-heading" style={{ marginTop: 0 }}>Core Metrics</div>
          <div className="form-row">
            <div className="form-group">
              <label>Weight (lbs)</label>
              <input type="number" value={personalForm.weight_lbs} onChange={e => handlePersonalChange('weight_lbs', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Est. Body Fat %</label>
              <input type="number" value={personalForm.bodyFat_pct} onChange={e => handlePersonalChange('bodyFat_pct', Number(e.target.value))} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Height (inches)</label>
              <input type="number" value={personalForm.height_in} onChange={e => handlePersonalChange('height_in', Number(e.target.value))} />
              <span className="input-hint">{Math.floor(personalForm.height_in / 12)}'{personalForm.height_in % 12}"</span>
            </div>
            <div className="form-group">
              <label>Age</label>
              <input type="number" value={personalForm.age} onChange={e => handlePersonalChange('age', Number(e.target.value))} />
            </div>
          </div>

          {/* Outstanding data */}
          <div className="section-heading">Outstanding Data</div>
          <div className="gap-box info" style={{ marginBottom: 14 }}>
            <div className="gap-box-title">Build with what you have</div>
            <ul>
              <li>The system works now with core metrics. These fields unlock deeper personalization.</li>
              <li>Provide data as it becomes available — each field makes the system smarter.</li>
            </ul>
          </div>

          {OUTSTANDING_FIELDS.map(field => (
            <div key={field.key} className="form-group">
              <label className="flex items-center gap-2">
                {form[field.key] !== null && form[field.key] !== ''
                  ? <CheckCircle style={{ width: 11, height: 11, color: 'var(--green)' }} />
                  : <AlertCircle style={{ width: 11, height: 11, color: 'var(--text-muted)' }} />
                }
                {field.label}
                {field.unit && <span className="text-muted">({field.unit})</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={form[field.key] || ''}
                  onChange={e => handleFieldChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                />
              ) : (
                <input
                  type={field.type}
                  value={form[field.key] || ''}
                  onChange={e => handleFieldChange(field.key, field.type === 'number' ? (e.target.value ? Number(e.target.value) : null) : e.target.value)}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Profile</button>
        </div>
      </div>
    </div>
  )
}
