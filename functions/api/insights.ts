/**
 * GET /api/insights — list PM insights from Supabase (server-side service role).
 */
export async function onRequestGet({ env }: { env: Record<string, string | undefined> }) {
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=30' },
    })

  const url = env.SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    return json({ source: 'fallback', insights: [], error: 'Supabase not configured' }, 200)
  }

  try {
    const res = await fetch(
      `${url}/rest/v1/yt_insights?select=id,video_id,insight,category,transcript_nugget,why_it_matters,actionable_steps,rice_score,tools_needed,example_prompt,week_tie_in,created_at&order=created_at.desc&limit=50`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      },
    )
    if (!res.ok) {
      return json({ source: 'fallback', insights: [], error: `supabase ${res.status}` }, 200)
    }
    const insights = await res.json()
    return json({ source: 'supabase', insights })
  } catch {
    return json({ source: 'fallback', insights: [], error: 'fetch failed' }, 200)
  }
}
