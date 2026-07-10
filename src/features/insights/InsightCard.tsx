import { RiceBars, type Rice } from './RiceBars'

export type InsightCardModel = {
  id: string
  category: string
  priority: string
  title: string
  nugget: string
  rice: Rice
  source: string
}

export type InsightCardProps = {
  item: InsightCardModel
  selected: boolean
  onSelect: () => void
}

export function InsightCard({ item, selected, onSelect }: InsightCardProps) {
  return (
    <article
      className={`card row-card fleet-card${selected ? ' is-active' : ''}`}
      onClick={onSelect}
      onKeyDown={(event) => event.key === 'Enter' && onSelect()}
      role="button"
      tabIndex={0}
    >
      <div className="grow">
        <div className="chips">
          <span className="chip">{item.category}</span>
          <span className="chip">{item.priority}</span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.nugget}</p>
        <RiceBars rice={item.rice} />
        <p className="meta">{item.source}</p>
      </div>
    </article>
  )
}
