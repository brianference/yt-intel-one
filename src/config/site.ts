import type { SiteConfig } from './types'
export type { SiteConfig, FeatureItem, NavItem } from './types'

export const siteConfig: SiteConfig = {
  productId: 'yt-intel-one',
  productName: 'YouTube Intel Scan',
  kicker: 'YouTube Intel Scan · grounded PM learning from video',
  tagline: 'Transcripts in. Structured PM insights out.',
  lede: 'Public product face for the full-stack transcript → Claude pipeline. Live insight cards can load from Supabase when configured.',
  githubUrl: 'https://github.com/brianference/youtube-intel-scan',
  footerLine: 'Canonical repo: youtube-intel-scan ·',
  stackStrip: 'Stack: TypeScript · React · Vite · Cloudflare Pages · Supabase · GitHub',
  finePrint: 'Full ingest stack lives in the youtube-intel-scan repo.',
  nav: [
    { to: '/', label: 'Home', end: true },
    { to: '/app', label: 'Insights' },
    { to: '/features', label: 'Features' },
  ],
  features: [
    { title: 'Channel & video ingest', description: 'YouTube Data API metadata; Shorts filtered.' },
    { title: 'Transcript pipeline', description: 'Python workers + optional edge proxies.' },
    { title: 'Grounded AI insights', description: 'Claude extracts PM frameworks with transcript quotes.' },
    { title: 'RICE visualization', description: 'Reach, impact, confidence, effort as bars.' },
    { title: 'Category filters', description: 'Focus strategy, metrics, research, and more.' },
    { title: 'Modular public site', description: 'Pipeline, filters, cards, and export are separate modules.' },
  ],
  heroPoints: ['Pipeline', 'RICE bars', 'Supabase live', 'Light & dark'],
  ctaPrimary: { to: '/app', label: 'Open insights' },
  ctaSecondary: { to: '/features', label: 'Features' },
}
