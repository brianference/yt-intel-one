import { useEffect, useMemo, useState } from 'react'
import type { SiteConfig } from '../config/site'
import { Shell } from '../components/Shell'
import { SAMPLE_INSIGHTS } from '../data/insights'
import { fetchInsights, type LiveInsight } from '../lib/insightsApi'
import { PipelineSteps } from '../features/insights/PipelineSteps'
import { InsightCard, type InsightCardModel } from '../features/insights/InsightCard'

export type ProductPageProps = { config: SiteConfig }

/** Insights workspace — data via lib/insightsApi, UI via features/insights. */
export function ProductPage({ config }: ProductPageProps) {
  const [live, setLive] = useState<LiveInsight[] | null>(null)
  const [source, setSource] = useState('loading')
  const [category, setCategory] = useState('all')
  const [selected, setSelected] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchInsights()
      .then((body) => {
        if (cancelled) return
        const rows = Array.isArray(body.insights) ? body.insights : []
        setLive(rows)
        setSource(body.source === 'supabase' && rows.length > 0 ? 'supabase' : 'local')
      })
      .catch(() => {
        if (!cancelled) {
          setLive([])
          setSource('local')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const cards: InsightCardModel[] = useMemo(() => {
    if (live && live.length > 0) {
      return live.map((item) => ({
        id: item.id || item.insight || 'row',
        category: item.category || 'Insight',
        priority: 'Live',
        title: item.insight || 'Insight',
        nugget: item.transcript_nugget || item.insight || '',
        rice: item.rice_score || {},
        source: item.video_id ? `video ${item.video_id}` : 'Supabase',
      }))
    }
    return SAMPLE_INSIGHTS.map((item) => ({
      id: item.id,
      category: item.category,
      priority: item.priority,
      title: item.title,
      nugget: item.nugget,
      rice: item.rice,
      source: item.source,
    }))
  }, [live])

  const categories = useMemo(() => ['all', ...Array.from(new Set(cards.map((card) => card.category)))], [cards])
  const filtered = cards.filter((card) => category === 'all' || card.category === category)
  const selectedCard = filtered.find((card) => card.id === selected) ?? null

  async function exportSelected() {
    if (!selectedCard) return
    const markdown = `# ${selectedCard.title}\n\n**Category:** ${selectedCard.category}\n\n> ${selectedCard.nugget}\n\n**Source:** ${selectedCard.source}\n`
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <Shell config={config}>
      <section className="panel">
        <div className="chips">
          <span className="badge-live">
            {source === 'supabase' ? '● Supabase live' : source === 'loading' ? '… loading' : '○ Local demo'}
          </span>
        </div>
        <h1>Pipeline & insights</h1>
        <p className="lede">
          Product: <strong>YouTube Intel Scan</strong>. Full ingest in{' '}
          <a href="https://github.com/brianference/youtube-intel-scan">youtube-intel-scan</a>.
        </p>
        <PipelineSteps />
        <div className="filters">
          <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Category">
            {categories.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <button type="button" className="btn btn-primary" disabled={!selectedCard} onClick={() => void exportSelected()}>
            {copied ? 'Copied markdown' : 'Export selected'}
          </button>
        </div>
        <div className="list">
          {filtered.map((item) => (
            <InsightCard key={item.id} item={item} selected={selected === item.id} onSelect={() => setSelected(item.id)} />
          ))}
        </div>
      </section>
    </Shell>
  )
}
