import { useState } from 'react'
import { Check, Droplets, Dumbbell, Moon, Heart, AlertTriangle, Shield } from 'lucide-react'
import { MEAL_STRUCTURE } from '../../utils/healthEngine.js'

const NUTRITION_ITEMS = MEAL_STRUCTURE.map(m => ({
  key: m.id,
  label: m.label,
  time: m.time,
  detail: `${m.proteinTarget}g protein target`,
}))

NUTRITION_ITEMS.push({ key: 'hydration', label: 'Hydration Target Met', time: 'All day', detail: null })

const TRAINING_ITEMS = [
  { key: 'workout', label: 'Workout Completed as Prescribed' },
  { key: 'cardio', label: 'Cardio Completed (Walk)' },
  { key: 'logged_performance', label: 'Logged Weights / Reps / Times' },
]

const SLEEP_ITEMS = [
  { key: 'bedtime', label: 'Hit Bedtime Target (21:30)' },
  { key: 'waketime', label: 'Hit Wake Time Target (06:00)' },
]

const SLEEP_QUALITY_OPTIONS = ['good', 'okay', 'poor']
const ENERGY_OPTIONS = ['high', 'moderate', 'low']

export default function ComplianceChecklist({ dayEntry, onToggle, onUpdate, onBadDay }) {
  const isRestDay = !dayEntry.isTrainingDay

  return (
    <div className="compliance-checklist">
      {/* Bad Day Protocol */}
      {dayEntry.badDayProtocol && (
        <div className="gap-box warn" style={{ marginBottom: 16 }}>
          <div className="gap-box-title">Bad Day Protocol Active</div>
          <ul>
            <li>Reduce training volume by 50% — compound lifts only, skip accessories</li>
            <li>Maintain nutrition targets — your body still needs fuel</li>
            <li>Goal: keep the streak alive, not break records</li>
          </ul>
        </div>
      )}

      {/* Nutrition */}
      <div className="compliance-section">
        <div className="compliance-section-header">
          <Droplets style={{ width: 14, height: 14 }} />
          <span>Nutrition</span>
          <span className="compliance-count">
            {Object.values(dayEntry.nutrition).filter(Boolean).length}/{Object.keys(dayEntry.nutrition).length}
          </span>
        </div>
        {NUTRITION_ITEMS.map(item => (
          <CheckboxRow
            key={item.key}
            checked={dayEntry.nutrition[item.key]}
            label={item.label}
            sublabel={item.time !== 'All day' ? item.time : item.detail}
            onChange={() => onToggle('nutrition', item.key)}
          />
        ))}
      </div>

      {/* Training */}
      <div className="compliance-section">
        <div className="compliance-section-header">
          <Dumbbell style={{ width: 14, height: 14 }} />
          <span>Training</span>
          {isRestDay && <span className="badge badge-grey">Rest Day</span>}
          <span className="compliance-count">
            {Object.values(dayEntry.training).filter(Boolean).length}/{Object.keys(dayEntry.training).length}
          </span>
        </div>
        {TRAINING_ITEMS.map(item => (
          <CheckboxRow
            key={item.key}
            checked={dayEntry.training[item.key]}
            label={item.label}
            disabled={isRestDay && item.key === 'workout'}
            onChange={() => onToggle('training', item.key)}
          />
        ))}
      </div>

      {/* Sleep */}
      <div className="compliance-section">
        <div className="compliance-section-header">
          <Moon style={{ width: 14, height: 14 }} />
          <span>Sleep</span>
          <span className="compliance-count">
            {[dayEntry.sleep.bedtime, dayEntry.sleep.waketime].filter(Boolean).length + (dayEntry.sleep.sleep_quality ? 1 : 0)}/3
          </span>
        </div>
        {SLEEP_ITEMS.map(item => (
          <CheckboxRow
            key={item.key}
            checked={dayEntry.sleep[item.key]}
            label={item.label}
            onChange={() => onToggle('sleep', item.key)}
          />
        ))}
        <div className="compliance-select-row">
          <span className="compliance-select-label">Sleep Quality</span>
          <div className="compliance-pill-group">
            {SLEEP_QUALITY_OPTIONS.map(opt => (
              <button
                key={opt}
                className={`compliance-pill${dayEntry.sleep.sleep_quality === opt ? ` active ${opt}` : ''}`}
                onClick={() => onUpdate('sleep', 'sleep_quality', dayEntry.sleep.sleep_quality === opt ? null : opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recovery */}
      <div className="compliance-section">
        <div className="compliance-section-header">
          <Heart style={{ width: 14, height: 14 }} />
          <span>Recovery</span>
        </div>
        <CheckboxRow
          checked={dayEntry.recovery.discomfort_check}
          label={dayEntry.recovery.discomfort_location ? `Joint Discomfort: ${dayEntry.recovery.discomfort_location}` : 'Joint Discomfort Check (none)'}
          onChange={() => onToggle('recovery', 'discomfort_check')}
        />
        <div className="compliance-select-row">
          <span className="compliance-select-label">Energy Level</span>
          <div className="compliance-pill-group">
            {ENERGY_OPTIONS.map(opt => (
              <button
                key={opt}
                className={`compliance-pill${dayEntry.recovery.energy_level === opt ? ` active ${opt === 'high' ? 'good' : opt === 'moderate' ? 'okay' : 'poor'}` : ''}`}
                onClick={() => onUpdate('recovery', 'energy_level', dayEntry.recovery.energy_level === opt ? null : opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div className="compliance-select-row">
          <span className="compliance-select-label">Workout RPE</span>
          <div className="compliance-rpe-row">
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <button
                key={n}
                className={`compliance-rpe${dayEntry.recovery.rpe === n ? ' active' : ''}${n >= 9 ? ' high' : n >= 7 ? ' moderate' : ''}`}
                onClick={() => onUpdate('recovery', 'rpe', dayEntry.recovery.rpe === n ? null : n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bad Day Protocol Toggle */}
      <button className="btn btn-ghost w-full" style={{ marginTop: 12, justifyContent: 'center' }} onClick={onBadDay}>
        <Shield style={{ width: 13, height: 13 }} />
        {dayEntry.badDayProtocol ? 'Deactivate Bad Day Protocol' : 'Activate Bad Day Protocol'}
      </button>
    </div>
  )
}

function CheckboxRow({ checked, label, sublabel, disabled, onChange }) {
  return (
    <div
      className={`compliance-row${checked ? ' checked' : ''}${disabled ? ' disabled' : ''}`}
      onClick={disabled ? undefined : onChange}
    >
      <div className={`compliance-checkbox${checked ? ' checked' : ''}`}>
        {checked && <Check style={{ width: 10, height: 10 }} />}
      </div>
      <div className="compliance-row-text">
        <span className="compliance-row-label">{label}</span>
        {sublabel && <span className="compliance-row-sub">{sublabel}</span>}
      </div>
    </div>
  )
}
