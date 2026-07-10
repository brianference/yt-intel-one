import { PIPELINE } from '../../data/insights'

export function PipelineSteps() {
  return (
    <div className="pipeline" aria-label="Pipeline">
      {PIPELINE.map((step) => (
        <div key={step.step} className="pipe-step">
          <strong>Step {step.step}</strong>
          {step.title}
        </div>
      ))}
    </div>
  )
}
