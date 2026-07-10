import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import './styles.css'
import { initTheme, toggleTheme, getTheme } from './theme'
import { ChatDock } from './ChatDock'
import { seedContext } from './seedContext'
import { PIPELINE, SAMPLE_INSIGHTS, INTEGRATIONS } from './data'

const FEATURES = [
  { t: 'Channel & video ingest', d: 'Pull metadata via YouTube Data API; filter Shorts automatically.' },
  { t: 'Transcript pipeline', d: 'Python workers + optional edge proxies when cloud IPs are blocked.' },
  { t: 'Grounded AI insights', d: 'Claude extracts PM frameworks with quotes from the transcript text.' },
  { t: 'RICE + actions', d: 'Priority, tools, example prompts, and week tie-ins per insight.' },
  { t: 'Export packs', d: 'Markdown exports for transcripts and insight libraries.' },
  { t: 'Full-stack TypeScript', d: 'React + Express + Drizzle/Postgres + Python orchestration.' },
]

const RECRUITER = [
  'Full-stack product: React, Express, Postgres, multi-language workers',
  'AI product design with structured outputs grounded in source text',
  'Production pragmatism: proxy fallbacks for blocked YouTube IPs',
  'UI craft: shadcn/Tailwind app shell with light/dark in the full app',
]

const QUICK = [
  'Deploy full app with DATABASE_URL + API keys on Railway/Render',
  'Demo mode with seeded DB when env missing',
  'Rate-limit Claude analysis per IP',
  'Public read-only demo of a real channel pack',
]

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
          YT Intel One
        </Link>
        <nav className="nav" aria-label="Primary">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/app">Demo</NavLink>
          <NavLink to="/features">Features</NavLink>
        </nav>
        <ThemeToggle />
      </header>
      <main>{children}</main>
      <ChatDock open={chatOpen} onOpenChange={setChatOpen} context={seedContext()} product="yt-intel-one" />
      <footer className="footer">
        <p>
          Public product face for{' '}
          <a href="https://github.com/brianference/youtube-intel-scan" target="_blank" rel="noreferrer">
            youtube-intel-scan
          </a>{' '}
          · full stack lives in that repo
        </p>
        <p className="fine">Demo insights below are illustrative shapes of the elite framework — production pulls from real transcripts.</p>
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
          Full-stack intelligence app: ingest channels, download transcripts, and run Claude analysis that cites the
          source text — RICE scores, actions, tools, and export packs for product builders.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" to="/app">
            Open demo
          </Link>
          <a className="btn btn-ghost" href="https://github.com/brianference/youtube-intel-scan" target="_blank" rel="noreferrer">
            Full source
          </a>
        </div>
        <ul className="hero-points">
          <li>Light & dark</li>
          <li>Grounded AI chat</li>
          <li>Public demo catalog</li>
          <li>Cloudflare Pages</li>
        </ul>
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
        <p className="lede">What the full youtube-intel-scan app ships — and what this public site demos.</p>
        <div className="grid-2">
          {FEATURES.map((f) => (
            <article key={f.t} className="card">
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="panel subtle">
        <h2>Engineering signals</h2>
        <ul className="check-list">
          {RECRUITER.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>
      <section className="panel">
        <h2>Quick wins next</h2>
        <ul className="check-list">
          {QUICK.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </section>
    </Shell>
  )
}

type LiveInsight = {
  id?: string
  insight?: string
  category?: string | null
  transcript_nugget?: string | null
  rice_score?: { reach?: number; impact?: number; confidence?: number; effort?: number } | null
  video_id?: string
}

function ProductApp() {
  const [live, setLive] = useState<LiveInsight[] | null>(null)
  const [source, setSource] = useState<string>('loading')

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

  const cards =
    live && live.length > 0
      ? live.map((i) => ({
          id: i.id || i.insight || 'row',
          category: i.category || 'Insight',
          priority: 'Live',
          title: i.insight || 'Insight',
          nugget: i.transcript_nugget || i.insight || '',
          rice: i.rice_score || {},
          source: i.video_id ? `video ${i.video_id}` : 'Supabase',
        }))
      : SAMPLE_INSIGHTS.map((i) => ({
          id: i.id,
          category: i.category,
          priority: i.priority,
          title: i.title,
          nugget: i.nugget,
          rice: i.rice,
          source: i.source,
        }))

  return (
    <section className="panel">
      <h1>Pipeline & insights</h1>
      <p className="lede">
        Data source: <strong>{source === 'supabase' ? 'Supabase (live)' : source === 'loading' ? 'loading…' : 'local demo fallback'}</strong>.
        Full ingest stack:{' '}
        <a href="https://github.com/brianference/youtube-intel-scan">youtube-intel-scan</a> · Cloudflare Pages + Supabase.
      </p>
      <h2>Pipeline</h2>
      <div className="grid-2">
        {PIPELINE.map((p) => (
          <article key={p.step} className="card">
            <h3>
              {p.step}. {p.title}
            </h3>
            <p>{p.detail}</p>
          </article>
        ))}
      </div>
      <h2>Insight cards</h2>
      <div className="list">
        {cards.map((i) => (
          <article key={i.id} className="card row-card">
            <div>
              <div className="chips">
                <span className="chip">{i.category}</span>
                <span className="chip">{i.priority}</span>
              </div>
              <h3>{i.title}</h3>
              <p>{i.nugget}</p>
              <p className="meta">
                RICE R{i.rice.reach ?? '—'}/I{i.rice.impact ?? '—'}/C{i.rice.confidence ?? '—'}/E{i.rice.effort ?? '—'} · {i.source}
              </p>
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
