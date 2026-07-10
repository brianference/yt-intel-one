export type Rice = { reach?: number; impact?: number; confidence?: number; effort?: number }

export function RiceBars({ rice }: { rice: Rice }) {
  const rows = [
    { k: 'Reach', v: rice.reach },
    { k: 'Impact', v: rice.impact },
    { k: 'Conf.', v: rice.confidence },
    { k: 'Effort', v: rice.effort },
  ]
  return (
    <div className="rice-bars">
      {rows.map((row) => (
        <div key={row.k} className="row">
          <span>{row.k}</span>
          <div className="track">
            <div className="fill" style={{ width: `${Math.min(100, ((row.v ?? 0) / 10) * 100)}%` }} />
          </div>
          <span>{row.v ?? '—'}</span>
        </div>
      ))}
    </div>
  )
}
