import { PIPELINE, SAMPLE_INSIGHTS, INTEGRATIONS } from './data'

/** Context blob for grounded chat — model may only discuss this catalog. */
export function seedContext(): string {
  return JSON.stringify({ pipeline: PIPELINE, insights: SAMPLE_INSIGHTS, integrations: INTEGRATIONS })
}
