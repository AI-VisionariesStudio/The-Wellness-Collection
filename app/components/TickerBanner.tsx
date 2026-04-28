const ITEMS = [
  'Trauma-Informed',
  'Attachment-Based',
  'Evidence-Grounded',
  'Clinically Responsible',
  'Reflectively Designed',
  'Research-Grounded',
]

const TRACK = Array.from({ length: 8 }, () => ITEMS).flat()

export default function TickerBanner({ bg }: { bg?: string }) {
  return (
    <div
      style={{
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
        background: bg ?? 'var(--cream)',
        overflow: 'hidden',
        height: '38px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="twc-ticker-track" aria-hidden="true">
        {TRACK.map((item, i) => (
          <span key={i} className="twc-ticker-item">
            <span className="twc-ticker-dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
