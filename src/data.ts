/** Sample insight shapes matching the full youtube-intel-scan elite framework (demo catalog). */
export const PIPELINE = [
  { step: 1, title: "Ingest channel or video", detail: "YouTube Data API metadata; Shorts filtered out" },
  { step: 2, title: "Fetch transcript", detail: "Python youtube-transcript-api + optional edge proxies" },
  { step: 3, title: "Claude analysis", detail: "Structured PM fields grounded in transcript quotes" },
  { step: 4, title: "Browse & export", detail: "Insights library, RICE priority, markdown packs" },
] as const

export const SAMPLE_INSIGHTS = [
  {
    id: "i1",
    category: "Product Strategy",
    priority: "High",
    title: "Ship the wedge, not the platform",
    nugget: "Focus on one undeniable job-to-be-done before expanding the surface area.",
    rice: { reach: 8, impact: 9, confidence: 7, effort: 4 },
    source: "Sample PM talk transcript (demo)",
  },
  {
    id: "i2",
    category: "Metrics & KPIs",
    priority: "Critical",
    title: "North-star with a guardrail pair",
    nugget: "Pair growth metric with a quality guardrail so optimizers cannot game the system.",
    rice: { reach: 9, impact: 8, confidence: 8, effort: 3 },
    source: "Sample metrics workshop transcript (demo)",
  },
  {
    id: "i3",
    category: "User Research",
    priority: "Medium",
    title: "Interview for jobs, not features",
    nugget: "Ask what they hired the product to do last week — not what features they want next.",
    rice: { reach: 6, impact: 8, confidence: 7, effort: 5 },
    source: "Sample research panel transcript (demo)",
  },
  {
    id: "i4",
    category: "AI / Technical Skills",
    priority: "High",
    title: "Ground generation in primary sources",
    nugget: "When AI summarizes content, require citations into the source text so bad model days degrade safely.",
    rice: { reach: 7, impact: 9, confidence: 8, effort: 4 },
    source: "youtube-intel-scan product principle",
  },
] as const

export const INTEGRATIONS = [
  { t: "YouTube Data API v3", d: "Channel and video metadata" },
  { t: "Anthropic Claude", d: "Elite PM insight extraction from transcripts" },
  { t: "PostgreSQL + Drizzle", d: "Channels → videos → transcripts → insights" },
  { t: "Cloudflare Worker proxy", d: "Transcript fetch when cloud IPs are blocked" },
] as const
