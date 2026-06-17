interface Props {
  onGotIt: () => void
}

export default function CardInfo({ onGotIt }: Props) {
  return (
    <div className="screen active">
      <div className="top-bar">
        <span className="logo">BURU CARD</span>
        <span className="step-pill mono">CALIBRATION</span>
      </div>
      <div className="content">
        <div className="section-title">Your calibration anchor</div>
        <div className="section-sub">Place the Buru Card flat on the floor next to your foot before scanning. The scanner detects its known geometry to remove perspective distortion.</div>
        <div className="buru-card-demo">
          <div className="card-pattern">
            <div className="cp b"></div><div className="cp b"></div><div className="cp w"></div>
            <div className="cp b"></div><div className="cp w"></div><div className="cp b"></div>
            <div className="cp w"></div><div className="cp b"></div><div className="cp b"></div>
          </div>
          <div className="card-info">
            <div className="card-info-title">Buru Card v1</div>
            <div className="card-info-sub">85.6 × 54mm — standard credit card size. Print on matte paper or use digital on a second screen.</div>
            <div className="detected-tag" style={{ marginTop: '6px' }}>● MARKER PATTERN ACTIVE</div>
          </div>
        </div>
        <div className="note-row"><div className="note-dot"></div><div className="note-text">Keep the card flat — do not fold or bend. Place it beside the foot, fully visible in frame.</div></div>
        <div className="note-row"><div className="note-dot" style={{ background: 'var(--buru-muted)' }}></div><div className="note-text">The unique dot pattern allows the scanner to calculate homography and correct the viewing angle automatically.</div></div>
        <div style={{ flex: 1 }}></div>
        <button className="btn btn-primary" onClick={onGotIt}>Got it — start scanning</button>
      </div>
    </div>
  )
}
