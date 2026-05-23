import { useState } from 'react'
import { Save, FileText } from 'lucide-react'

export default function DailyLog({ log, onSaveLog }) {
  const [text, setText] = useState(log || '')
  const [saved, setSaved] = useState(true)

  function handleChange(e) {
    setText(e.target.value)
    setSaved(false)
  }

  function handleSave() {
    onSaveLog(text)
    setSaved(true)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave()
    }
  }

  return (
    <div className="daily-log">
      <div className="section-label">
        <FileText size={14} />
        <span>DAILY LOG</span>
      </div>
      <textarea
        className="daily-log-input"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="What happened today? What did you learn? What needs to change?"
        rows={4}
      />
      <div className="daily-log-footer">
        <span className="daily-log-hint">Ctrl+Enter to save</span>
        <button
          className={`daily-log-save${saved ? ' saved' : ''}`}
          onClick={handleSave}
          disabled={saved}
        >
          <Save size={14} />
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  )
}
