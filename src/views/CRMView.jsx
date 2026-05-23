import { useState, useEffect } from 'react'
import { Plus, Search, Users } from 'lucide-react'
import ProspectList from '../components/crm/ProspectList.jsx'
import ProspectDetail from '../components/crm/ProspectDetail.jsx'
import ProspectForm from '../components/crm/ProspectForm.jsx'
import { getProspects } from '../utils/dataStore.js'

export default function CRMView({ onDataChange, refreshKey }) {
  const [prospects, setProspects] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editProspect, setEditProspect] = useState(null)

  useEffect(() => { load() }, [refreshKey])

  async function load() {
    const data = await getProspects()
    setProspects(data)
    if (data.length > 0 && !selectedId) setSelectedId(data[0].id)
  }

  function handleSaved() {
    setShowForm(false)
    setEditProspect(null)
    load()
    onDataChange()
  }

  function handleEdit(prospect) {
    setEditProspect(prospect)
    setShowForm(true)
  }

  const filtered = prospects.filter(p => {
    const matchesSearch = !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.includes(search) ||
      p.propertyAddress?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || p.status === filter
    return matchesSearch && matchesFilter
  })

  const selected = prospects.find(p => p.id === selectedId)

  return (
    <>
      <div className="topbar">
        <span className="topbar-title">CRM — Prospect Management</span>
        <div className="topbar-actions">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ width: 130 }}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="follow_up">Follow-up</option>
            <option value="cold">Cold</option>
            <option value="listed">Listed</option>
            <option value="closed">Closed</option>
            <option value="dead">Dead</option>
          </select>
          <button className="btn btn-primary" onClick={() => { setEditProspect(null); setShowForm(true) }}>
            <Plus /> New Prospect
          </button>
        </div>
      </div>

      <div className="content">
        <div className="panel-split">
          <div className="panel-left">
            <div className="panel-header">
              <span className="panel-header-title">Prospects ({filtered.length})</span>
            </div>
            <div style={{ padding: '8px 12px 0' }}>
              <div className="search-wrap">
                <Search />
                <input
                  type="text"
                  placeholder="Search name, address, phone..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="panel-body" style={{ paddingTop: 6 }}>
              {filtered.length === 0 ? (
                <div className="empty-state" style={{ height: 'auto', padding: '30px 10px' }}>
                  <Users />
                  <p>No prospects yet</p>
                  <span>Add your first prospect above</span>
                </div>
              ) : (
                <ProspectList
                  prospects={filtered}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              )}
            </div>
          </div>

          <div className="panel-right">
            {selected ? (
              <ProspectDetail
                prospect={selected}
                onEdit={handleEdit}
                onDataChange={() => { load(); onDataChange() }}
              />
            ) : (
              <div className="empty-state">
                <Users />
                <p>Select a prospect to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <ProspectForm
          prospect={editProspect}
          onSave={handleSaved}
          onClose={() => { setShowForm(false); setEditProspect(null) }}
        />
      )}
    </>
  )
}
