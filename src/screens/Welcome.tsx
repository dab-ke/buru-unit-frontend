interface Props {
  onStart: () => void
  onLearnCard: () => void
}

export default function Welcome({ onStart, onLearnCard }: Props) {
  return (
    <div className="screen active">
      <div className="top-bar">
        <span className="logo">BURU UNIT</span>
        <span className="step-pill mono">v0.1 PROTO</span>
      </div>
      <div className="content">
        <div className="welcome-icon">👟</div>
        <div className="section-title">Foot measurement,<br />reimagined.</div>
        <div className="section-sub">Point your phone camera at your foot + Buru Card. Get a precise Buru ID in seconds.</div>
        <div className="feature-list">
          <div className="feature-item"><div className="feat-dot"></div>Uses gyroscope for level calibration</div>
          <div className="feature-item"><div className="feat-dot"></div>Buru Card eliminates perspective distortion</div>
          <div className="feature-item"><div className="feat-dot"></div>Outputs length, width & instep as Buru ID</div>
          <div className="feature-item"><div className="feat-dot"></div>Works in any mobile browser — no app needed</div>
        </div>
        <div style={{ flex: 1 }}></div>
        <button className="btn btn-primary" onClick={onStart}>Start scanning</button>
        <button className="btn btn-ghost" onClick={onLearnCard}>Learn about Buru Card first</button>
      </div>
    </div>
  )
}
