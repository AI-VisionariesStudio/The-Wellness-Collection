const ITEMS = [
  'Trauma-Informed',
  'Attachment-Based',
  'Evidence-Grounded',
  'Clinically Responsible',
  'Reflectively Designed',
  'Research-Grounded',
]

const DOUBLED = [...ITEMS, ...ITEMS]

export default function TickerBanner() {
  return (
    <div
      style={{
        borderBottom: '1px solid var(--border-light)',
        background: 'var(--cream)',
        overflow: 'hidden',
        height: '38px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
      }}
    >
<div className="twc-ticker-track" aria-hidden="true">
        {DOUBLED.map((item, i) => (
          <span key={i} className="twc-ticker-item">
            <span className="twc-ticker-dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
