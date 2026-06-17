import { useState, useEffect } from 'react'

interface Props {
  measurements: { length: number; width: number; instep: number; confidence: number } | null
}

interface Step {
  id: string
  label: string
  pct: number
}

const STEPS: Step[] = [
  { id: 'ps1', label: 'Buru Card marker detection', pct: 20 },
  { id: 'ps2', label: 'Perspective homography correction', pct: 40 },
  { id: 'ps3', label: 'Foot outline segmentation', pct: 60 },
  { id: 'ps4', label: 'Landmark extraction (heel · toe · instep)', pct: 80 },
  { id: 'ps5', label: 'Buru ID generation', pct: 100 },
]

export default function Processing({ measurements }: Props) {
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (activeStep >= STEPS.length) return

    const step = STEPS[activeStep]
    setProgress(step.pct)

    const timer = setTimeout(() => {
      setActiveStep(activeStep + 1)
    }, 900)

    return () => clearTimeout(timer)
  }, [activeStep])

  return (
    <div className="screen active">
      <div className="top-bar">
        <span className="logo">BURU UNIT</span>
        <span className="step-pill"><span>3</span>/4 — AI PROCESSING</span>
      </div>
      <div className="content">
        <div className="section-title">Analyzing foot geometry</div>
        <div className="section-sub">Running landmark detection, homography correction, and measurement extraction.</div>
        <div className="proc-bar">
          <div className="proc-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-steps">
          {STEPS.map((step, idx) => {
            let status = ''
            if (idx < activeStep) status = 'done'
            else if (idx === activeStep) status = 'active'

            return (
              <div key={step.id} className={`proc-step ${status}`}>
                <div className="proc-icon">{idx + 1}</div>
                <div className="proc-text">{step.label}</div>
              </div>
            )
          })}
        </div>
        <div style={{ flex: 1 }}></div>
      </div>
    </div>
  )
}
