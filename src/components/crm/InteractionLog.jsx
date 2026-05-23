import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { saveInteraction, deleteInteraction, getInteractionsForProspect } from '../../utils/dataStore.js'

const TYPE_OPTIONS = ['call', 'text', 'email', 'meeting', 'showing', 'offer', 'follow_up', 'note']
const TYPE_COLORS = {
  call: 'var(--accent-text)', text: 'var(--green)', email: 'var(--yellow)',
  meeting: 'var(--orange)', showing: 'var(--accent)', offer: 'var(--green)',
  follow_up: 'var(--yellow)', note: 'var(--text-secondary)',
}

function fmtDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const EMPTY_INTERACTION = {
  type: 'call', date: new Date().toISOString().split('T')[0],
  notes: '', nextAction: '', nextActionDate: '',
}

export default function InteractionLog({ prospectId, interactions, onRefresh }) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ...EMPTY_INTERACTION })
  const [saving, setSaving] = useState(false)

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.notes.trim()) return
    setSaving(true)
    await saveInteraction({ ...form, prospectId })
    setForm({ ...EMPTY_INTERACTION })
    setShowForm(false)
    setSaving(false)
    onRefresh()
  }

  async function handleDelete(id) {
    await deleteInteraction(id)
    onRefresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="section-heading" style={{ margin: 0, border: 'none', paddingBottom: 0 }}>Interaction Log</span>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(v => !v)}>
          <Plus /> Log Interaction
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} style={{ marginBottom: 10 }}>
          <div className="card-sm" style={{ marginBottom: 8 }}>
            <div className="form-row" style={{ marginBottom: 8 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Type</label>
                <select value={form.type} onChange={e => set('type', e.target.value)}>
                  {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Date</label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 8 }}>
              <label>Notes</label>
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="What happened? Key points from the conversation..."
                rows={2}
                autoFocus
              />
            </div>
            <div className="form-row" style={{ marginBottom: 0 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Next Action</label>
                <input type="text" value={form.nextAction} onChange={e => set('nextAction', e.target.value)} placeholder="e.g. Send CMA, Schedule showing" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Follow-up Date</label>
                <input type="date" value={form.nextActionDate} onChange={e => set('nextActionDate', e.target.value)} />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving || !form.notes.trim()}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {interactions.length === 0 && !showForm && (
        <div className="text-sm text-muted" style={{ padding: '8px 0' }}>No interactions logged yet.</div>
      )}

      {interactions.map(i => (
        <div key={i.id} className="interaction-item">
          <div className="interaction-header">
            <span className="interaction-type" style={{ color: TYPE_COLORS[i.type] || 'var(--accent-text)' }}>
              {i.type?.replace('_', ' ') || 'note'}
            </span>
            <div className="flex items-center gap-2">
              <span className="interaction-date">{fmtDate(i.date)}</span>
              <button
                className="btn-icon btn-sm"
                style={{ width: 20, height: 20, border: 'none', background: 'transparent' }}
                onClick={() => handleDelete(i.id)}
                title="Delete"
              >
                <Trash2 style={{ width: 11, height: 11, color: 'var(--text-muted)' }} />
              </button>
            </div>
          </div>
          <div className="interaction-notes">{i.notes}</div>
          {i.nextAction && (
            <div className="interaction-next">
              → {i.nextAction}{i.nextActionDate ? ` by ${fmtDate(i.nextActionDate)}` : ''}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
