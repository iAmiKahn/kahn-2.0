const STATUS_BADGE = {
  active:     { cls: 'badge-green',  label: 'Active'    },
  follow_up:  { cls: 'badge-yellow', label: 'Follow-up' },
  cold:       { cls: 'badge-grey',   label: 'Cold'      },
  listed:     { cls: 'badge-purple', label: 'Listed'    },
  closed:     { cls: 'badge-green',  label: 'Closed'    },
  dead:       { cls: 'badge-red',    label: 'Dead'      },
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function ProspectList({ prospects, selectedId, onSelect }) {
  return (
    <>
      {prospects.map(p => {
        const badge = STATUS_BADGE[p.status] || { cls: 'badge-grey', label: p.status }
        return (
          <div
            key={p.id}
            className={`prospect-item${p.id === selectedId ? ' selected' : ''}`}
            onClick={() => onSelect(p.id)}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="prospect-item-name truncate">{p.name || 'Unnamed'}</span>
              <span className={`badge ${badge.cls}`}>{badge.label}</span>
            </div>
            <div className="prospect-item-sub">
              {p.propertyAddress || p.phone || p.email || 'No contact info'}
            </div>
            {p.createdAt && (
              <div className="text-sm text-muted mt-1">Added {formatDate(p.createdAt)}</div>
            )}
          </div>
        )
      })}
    </>
  )
}
