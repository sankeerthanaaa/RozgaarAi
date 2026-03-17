const CATEGORY_STYLE = {
  Technical:   { bg: 'var(--color-info-bg)',    color: 'var(--color-info)'    },
  Behavioural: { bg: 'var(--color-success-bg)', color: 'var(--color-success)' },
  'Gap-based': { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)' },
}

export default function QuestionList({ questions, currentIndex, doneIndexes, onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      {questions.map((q, i) => {
        const isActive = i === currentIndex
        const isDone   = doneIndexes.includes(i)
        const style    = CATEGORY_STYLE[q.category]

        return (
          <button key={q.id}
            onClick={() => onSelect(i)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: 'var(--space-3) var(--space-4)',
              background: isActive ? 'var(--color-primary-subtle)' : 'var(--color-bg-surface)',
              border: isActive
                ? '2px solid var(--color-primary)'
                : '1px solid var(--color-border-surface)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer', textAlign: 'left', width: '100%',
              transition: 'border var(--transition-fast), background var(--transition-fast)',
            }}
          >
            {/* Number circle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1 }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                background: isActive ? 'var(--color-primary)' : 'var(--color-bg-surface-2)',
                border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
                color: isActive ? '#fff' : 'var(--color-text-tertiary)',
              }}>
                {i + 1}
              </span>
              <span style={{
                fontSize: 'var(--text-sm)',
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                fontWeight: isActive ? 'var(--weight-medium)' : 'var(--weight-regular)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                maxWidth: 180,
              }}>
                {q.text}
              </span>
            </div>

            {/* Status badge */}
            {isDone ? (
              <span style={{
                padding: '2px 8px', borderRadius: 'var(--radius-full)',
                fontSize: 10, background: 'var(--color-success-bg)',
                color: 'var(--color-success)', flexShrink: 0,
              }}>Done</span>
            ) : (
              <span style={{
                padding: '2px 8px', borderRadius: 'var(--radius-full)',
                fontSize: 10, background: style.bg, color: style.color, flexShrink: 0,
              }}>
                {q.category}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}