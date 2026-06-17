import { useState, useEffect } from 'react'

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>
  onCapture: () => void
}

export default function CameraCapture({ videoRef, onCapture }: Props) {
  const [cardDetected, setCardDetected] = useState(false)
  const [footDetected, setFootDetected] = useState(false)

  useEffect(() => {
    // Simulate card detection after 2s, foot detection after 4s
    const cardTimer = setTimeout(() => setCardDetected(true), 2000)
    const footTimer = setTimeout(() => setFootDetected(true), 4000)
    return () => {
      clearTimeout(cardTimer)
      clearTimeout(footTimer)
    }
  }, [])

  return (
    <div className="screen active">
      <div className="top-bar">
        <span className="logo">BURU UNIT</span>
        <span className="step-pill"><span>2</span>/4 — SCANNING</span>
      </div>
      <div className="content" style={{ paddingBottom: '14px' }}>
        <div className="camera-frame" id="cameraFrame">
          <div className="camera-grid"></div>
          <div className="corner corner-tl"></div>
          <div className="corner corner-tr"></div>
          <div className="corner corner-bl"></div>
          <div className="corner corner-br"></div>
          <div className="scan-line" id="scanLine"></div>

          {/* Real video stream */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
          />

          {/* Foot silhouette overlay (fallback if video unavailable) */}
          <svg
            className="foot-silhouette"
            viewBox="0 0 90 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'absolute', zIndex: 2 }}
          >
            <path
              d="M30 145 C10 145 8 120 10 100 C12 80 8 60 10 40 C12 20 20 10 32 10 C44 10 50 18 52 28 C56 20 64 16 70 20 C76 24 74 34 68 38 C74 38 78 44 76 50 C80 50 84 56 80 62 C84 64 84 72 78 74 C82 82 78 100 72 115 C66 130 54 145 30 145Z"
              fill="rgba(200,245,66,0.15)"
              stroke="#c8f542"
              strokeWidth="1.5"
            />
            <line x1="28" y1="10" x2="28" y2="145" stroke="rgba(200,245,66,0.2)" strokeWidth="1" strokeDasharray="4 4" />
          </svg>

          <div className="camera-label mono">FRAME CAPTURE — LIVE</div>
          <div
            id="cardDetect"
            style={{
              position: 'absolute',
              bottom: '32px',
              right: '10px',
              fontSize: '10px',
              fontFamily: "'Space Mono', monospace",
              color: cardDetected ? 'var(--buru-success)' : 'var(--buru-muted)',
              letterSpacing: '.06em',
            }}
          >
            CARD: {cardDetected ? 'DETECTED ✓' : 'SEARCHING...'}
          </div>
        </div>

        <div className={`status-tag ${footDetected ? 'locked' : 'scanning'}`} style={{ marginBottom: '12px' }}>
          <div className="dot-pulse"></div>
          {footDetected ? 'FOOT DETECTED — HOLD STILL' : 'DETECTING FOOT OUTLINE'}
        </div>

        <div className="section-sub" style={{ marginBottom: '12px' }}>Place your foot flat next to the Buru Card. Keep both in frame.</div>
        <div style={{ flex: 1 }}></div>
        <button
          className="btn btn-primary"
          onClick={onCapture}
          disabled={!footDetected}
          style={{ opacity: footDetected ? '1' : '0.4' }}
        >
          Capture frame
        </button>
      </div>
    </div>
  )
}
