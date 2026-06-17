import { useEffect } from 'react'

interface Props {
  result: {
    buruId: string
    length: number
    width: number
    instep: number
    confidence: number
    euSize: number
  }
  onScanAgain: () => void
}

export default function Result({ result, onScanAgain }: Props) {
  useEffect(() => {
    // Copy Buru ID to clipboard on mount
    navigator.clipboard.writeText(result.buruId).catch(() => {})
  }, [result.buruId])

  return (
    <div className="screen active">
      <div className="top-bar">
        <span className="logo">BURU UNIT</span>
        <span className="step-pill"><span>4</span>/4 — BURU ID</span>
      </div>
      <div className="content">
        <div className="status-tag locked">
          <div className="dot-pulse"></div>
          SCAN COMPLETE
        </div>

        <div className="buru-id-card">
          <div className="buru-id-label">BURU ID</div>
          <div className="buru-id-hash">{result.buruId}</div>
          <div className="measures-grid">
            <div className="measure-cell">
              <div className="measure-val">{result.length}</div>
              <div className="measure-unit">mm</div>
              <div className="measure-key">Length</div>
            </div>
            <div className="measure-cell">
              <div className="measure-val">{result.width}</div>
              <div className="measure-unit">mm</div>
              <div className="measure-key">Width</div>
            </div>
            <div className="measure-cell">
              <div className="measure-val">{result.instep}</div>
              <div className="measure-unit">mm</div>
              <div className="measure-key">Instep</div>
            </div>
          </div>
          <div className="confidence-row">
            <div className="conf-label">CONFIDENCE</div>
            <div className="conf-bar-wrap">
              <div className="conf-bar-fill" style={{ width: `${result.confidence}%`, background: 'var(--buru-accent)' }}></div>
            </div>
            <div className="conf-pct">{result.confidence}%</div>
          </div>
        </div>

        <div className="rec-size">
          <div className="rec-size-num">{result.euSize}</div>
          <div className="rec-size-label">RECOMMENDED EU SIZE</div>
        </div>

        <div className="note-row">
          <div className="note-dot" style={{ background: 'var(--buru-muted)' }}></div>
          <div className="note-text">Measurements captured via mock AI pipeline. Real deployment uses TensorFlow Lite + OpenCV landmark model.</div>
        </div>

        <button className="btn btn-primary" onClick={onScanAgain} style={{ marginTop: '8px' }}>
          Scan again
        </button>
        <div className="restart-hint">Buru ID copied to clipboard on load ↑</div>
      </div>
    </div>
  )
}
