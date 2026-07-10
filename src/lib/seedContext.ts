import { PIPELINE, SAMPLE_INSIGHTS, INTEGRATIONS } from '../data/insights'

export function buildChatContext(): string {
  return JSON.stringify({ pipeline: PIPELINE, insights: SAMPLE_INSIGHTS, integrations: INTEGRATIONS }, null, 0)
}
