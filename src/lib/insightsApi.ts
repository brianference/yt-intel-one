export type LiveInsight = {
  id?: string
  insight?: string
  category?: string | null
  transcript_nugget?: string | null
  why_it_matters?: string | null
  rice_score?: { reach?: number; impact?: number; confidence?: number; effort?: number } | null
  video_id?: string
}

export type InsightsResponse = {
  source?: string
  insights?: LiveInsight[]
}

/** Fetch insights from Pages Function (Supabase-backed). */
export async function fetchInsights(): Promise<InsightsResponse> {
  const res = await fetch('/api/insights')
  return (await res.json()) as InsightsResponse
}
