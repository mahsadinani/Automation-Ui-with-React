export default function KpiCards({ items = [] }) {
  return (
    <div className="grid grid-3">
      {items.map((it, idx) => (
        <div key={idx} className="card">
          <div className="card-body">
            <div className="value" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{it.value}</div>
            <div className="label" style={{ color: '#94a3b8' }}>{it.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
