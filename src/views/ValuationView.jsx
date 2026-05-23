import { useState, useEffect } from 'react'
import { Calculator, History } from 'lucide-react'
import ValuationWizard from '../components/valuation/ValuationWizard.jsx'
import ValuationHistory from '../components/valuation/ValuationHistory.jsx'
import { getValuations } from '../utils/dataStore.js'

export default function ValuationView({ onDataChange, refreshKey }) {
  const [mode, setMode] = useState('new')   // 'new' | 'history'
  const [valuations, setValuations] = useState([])

  useEffect(() => { loadHistory() }, [refreshKey])

  async function loadHistory() {
    const data = await getValuations()
    setValuations(data.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)))
  }

  function handleValuationComplete() {
    loadHistory()
    onDataChange()
  }

  return (
    <>
      <div className="topbar">
        <span className="topbar-title">Valuation Engine — Comparative Market Analysis</span>
        <div className="topbar-actions">
          <button className={`btn ${mode === 'new' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMode('new')}>
            <Calculator /> New Valuation
          </button>
          <button className={`btn ${mode === 'history' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMode('history')}>
            <History /> History ({valuations.length})
          </button>
        </div>
      </div>

      <div className="content">
        {mode === 'new' && (
          <ValuationWizard onComplete={handleValuationComplete} />
        )}
        {mode === 'history' && (
          <ValuationHistory valuations={valuations} onUpdate={loadHistory} />
        )}
      </div>
    </>
  )
}
