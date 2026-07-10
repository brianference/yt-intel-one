import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import './styles.css'
import { initTheme, toggleTheme, getTheme } from './theme'
import { ChatDock } from './ChatDock'
import { seedContext } from './seedContext'
import { PIPELINE, SAMPLE_INSIGHTS, INTEGRATIONS } from './data'

const FEATURES = [
  { t: 'Channel & video ingest', d: 'YouTube Data API metadata; Shorts filtered.' },
  { t: 'Transcript pipeline', d: 'Python workers + optional edge proxies.' },
  { t: 'Grounded AI insights', d: 'Claude extracts PM frameworks with transcript quotes.' },
  { t: 'RICE visualization', d: 'Reach, impact, confidence, effort as bars.' },
  { t: 'Category filters', d: 'Focus strategy, metrics, research, and more.' },
  { t: 'Markdown export', d: 'Copy a selected insight pack client-side.' },
]

type LiveInsight = {
  id?: string
  insight?: string
  category?: string | null
  transcript_nugget?: string | null
  why_it_matters?: string | null
  rice_score?: { reach?: number; impact?: number; confidence?: number; effort?: number } | null
  video_id?: string
}

function ThemeToggle() {
  const [theme, setTheme] = useState(getTheme())
  return (
    <button type="button" className="theme-toggle" aria-label="Toggle theme" onClick={() => setTheme(toggleTheme())}>
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  const [chatOpen, setChatOpen] = useState(false)
  return (
    <div className={`shell${chatOpen ? ' shell--chat' : ''}`}>
      <header className="topbar">
        <Link to="/" className="brand">
          YouTube Intel Scan
        </Link>
        <nav className="nav" aria-label="Primary">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/app">Insights</NavLink>
          <NavLink to="/features">Features</NavLink>
        </nav>
        <ThemeToggle />
      </header>
      <main>{children}</main>
      <ChatDock open={chatOpen} onOpenChange={setChatOpen} context={seedContext()} product="yt-intel-one" />
      <footer className="footer">
        <p>
          Canonical repo:{' '}
          <a href="https://github.com/brianference/youtube-intel-scan" target="_blank" rel="noreferrer">
            youtube-intel-scan
          </a>{' '}
          · public site yt-intel-one
        </p>
      </footer>
    </div>
  )
}

function Home() {
  return (
    <Shell>
      <section className="hero">
        <p className="kicker">YouTube Intel Scan · grounded PM learning from video</p>
        <h1>Transcripts in. Structured PM insights out.</h1>
        <p className="lede">
          Public product face for the full-stack transcript → Claude pipeline. Live insight cards can load from
          Supabase when configured.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" to="/app">
            Open insights
          </Link>
          <a className="btn btn-ghost" href="https://github.com/brianference/youtube-intel-scan" target="_blank" rel="noreferrer">
            Full source
          </a>
        </div>
      </section>
      <section className="grid-3">
        {FEATURES.slice(0, 3).map((f) => (
          <article key={f.t} className="card">
            <h3>{f.t}</h3>
            <p>{f.d}</p>
          </article>
        ))}
      </section>
      <section className="panel">
        <h2>Integrations</h2>
        <div className="grid-2">
          {INTEGRATIONS.map((i) => (
            <div key={i.t} className="card card-slim">
              <h3>{i.t}</h3>
              <p>{i.d}</p>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  )
}

function FeaturesPage() {
  return (
    <Shell>
      <section className="panel">
        <h1>Features</h1>
        <div className="grid-2">
          {FEATURES.map((f) => (
            <article key={f.t} className="card">
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </article>
          ))}
        </div>
      </section>
    </Shell>
  )
}

function RiceBars({ rice }: { rice: { reach?: number; impact?: number; confidence?: number; effort?: number } }) {
  const rows = [
    { k: 'Reach', v: rice.reach },
    { k: 'Impact', v: rice.impact },
    { k: 'Conf.', v: rice.confidence },
    { k: 'Effort', v: rice.effort },
  ]
  return (
    <div className="rice-bars">
      {rows.map((r) => (
        <div key={r.k} className="row">
          <span>{r.k}</span>
          <div className="track">
            <div className="fill" style={{ width: `${Math.min(100, ((r.v ?? 0) / 10) * 100)}%` }} />
          </div>
          <span>{r.v ?? '—'}</span>
        </div>
      ))}
    </div>
  )
}

function ProductApp() {
  const [live, setLive] = useState<LiveInsight[] | null>(null)
  const [source, setSource] = useState('loading')
  const [cat, setCat] = useState('all')
  const [selected, setSelected] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/insights')
      .then((r) => r.json())
      .then((body: { source?: string; insights?: LiveInsight[] }) => {
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

  const cards = useMemo(() => {
    if (live && live.length > 0) {
      return live.map((i) => ({
        id: i.id || i.insight || 'row',
        category: i.category || 'Insight',
        priority: 'Live',
        title: i.insight || 'Insight',
        nugget: i.transcript_nugget || i.insight || '',
        why: i.why_it_matters || '',
        rice: i.rice_score || {},
        source: i.video_id ? `video ${i.video_id}` : 'Supabase',
      }))
    }
    return SAMPLE_INSIGHTS.map((i) => ({
      id: i.id,
      category: i.category,
      priority: i.priority,
      title: i.title,
      nugget: i.nugget,
      why: '',
      rice: i.rice,
      source: i.source,
    }))
  }, [live])

  const categories = useMemo(() => ['all', ...Array.from(new Set(cards.map((c) => c.category)))], [cards])
  const filtered = cards.filter((c) => cat === 'all' || c.category === cat)
  const sel = filtered.find((c) => c.id === selected) || null

  async function exportMd() {
    if (!sel) return
    const md = `# ${sel.title}\n\n**Category:** ${sel.category}\n\n> ${sel.nugget}\n\n${sel.why ? `**Why it matters:** ${sel.why}\n\n` : ''}**Source:** ${sel.source}\n`
    try {
      await navigator.clipboard.writeText(md)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <section className="panel">
      <div className="chips">
        <span className={`badge-live`}>{source === 'supabase' ? '● Supabase live' : source === 'loading' ? '… loading' : '○ Local demo'}</span>
      </div>
      <h1>Pipeline & insights</h1>
      <p className="lede">
        Product: <strong>YouTube Intel Scan</strong>. Full ingest in{' '}
        <a href="https://github.com/brianference/youtube-intel-scan">youtube-intel-scan</a>.
      </p>

      <div className="pipeline" aria-label="Pipeline">
        {PIPELINE.map((p) => (
          <div key={p.step} className="pipe-step">
            <strong>Step {p.step}</strong>
            {p.title}
          </div>
        ))}
      </div>

      <div className="filters">
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn-primary" disabled={!sel} onClick={() => void exportMd()}>
          {copied ? 'Copied markdown' : 'Export selected'}
        </button>
      </div>

      <div className="list">
        {filtered.map((i) => (
          <article
            key={i.id}
            className={`card row-card fleet-card${selected === i.id ? ' is-active' : ''}`}
            onClick={() => setSelected(i.id)}
            onKeyDown={(e) => e.key === 'Enter' && setSelected(i.id)}
            role="button"
            tabIndex={0}
          >
            <div className="grow">
              <div className="chips">
                <span className="chip">{i.category}</span>
                <span className="chip">{i.priority}</span>
              </div>
              <h3>{i.title}</h3>
              <p>{i.nugget}</p>
              <RiceBars rice={i.rice} />
              <p className="meta">{i.source}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function AppPage() {
  return (
    <Shell>
      <ProductApp />
    </Shell>
  )
}

export default function App() {
  useEffect(() => {
    initTheme()
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="/features" element={<FeaturesPage />} />
      </Routes>
    </BrowserRouter>
  )
}
