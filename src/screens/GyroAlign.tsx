import { useState, useEffect } from 'react'

interface Props {
  locked: boolean
  onLock: () => void
}

export default function GyroAlign({ locked, onLock }: Props) {
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [isAligned, setIsAligned] = useState(false)

  useEffect(() => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      // alpha (Z), beta (X), gamma (Y)
      // For foot scanning, we care about beta (pitch) and gamma (roll)
      const beta = event.beta ?? 0  // -180 to 180, tilting forward/backward
      const gamma = event.gamma ?? 0 // -90 to 90, tilting left/right
      const alpha = event.alpha ?? 0

      setRotation({
        x: beta,
        y: gamma,
        z: alpha,
      })

      // Level = within ±1° on both beta and gamma
      const aligned = Math.abs(beta) < 1 && Math.abs(gamma) < 1
      setIsAligned(aligned)
    }

    // Request permission (iOS 13+)
    if (typeof DeviceOrientationEvent !== 'undefined' && 'requestPermission' in DeviceOrientationEvent) {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation)
          }
        })
        .catch(console.error)
    } else {
      // Non-iOS devices
      window.addEventListener('deviceorientation', handleDeviceOrientation)
    }

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation)
    }
  }, [])

  const dotX = (rotation.y / 5) * 12
  const dotY = (rotation.x / 5) * 12

  return (
    <div className="screen active">
      <div className="top-bar">
        <span className="logo">BURU UNIT</span>
        <span className="step-pill"><span>1</span>/4 — LEVEL CHECK</span>
      </div>
      <div className="content">
        <div className="section-title">Hold phone level</div>
        <div className="section-sub">Keep your phone steady and pointed straight down toward the floor for accurate measurements.</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0 18px' }}>
          <div className={`gyro-ring ${isAligned ? 'good' : ''}`}>
            <div className="gyro-ring-inner">
              <div className={`gyro-dot ${isAligned ? 'locked' : ''}`} style={{ transform: `translate(${dotX}px, ${dotY}px)` }}></div>
            </div>
          </div>
          <div className="axis-row" style={{ width: '100%' }}>
            <div className="axis-card">
              <div className="axis-label">PITCH X</div>
              <div className={`axis-val mono ${Math.abs(rotation.x) < 1 ? 'ok' : 'warn'}`}>{(rotation.x > 0 ? '+' : '')}{rotation.x.toFixed(1)}°</div>
            </div>
            <div className="axis-card">
              <div className="axis-label">ROLL Y</div>
              <div className={`axis-val mono ${Math.abs(rotation.y) < 1 ? 'ok' : 'warn'}`}>{(rotation.y > 0 ? '+' : '')}{rotation.y.toFixed(1)}°</div>
            </div>
            <div className="axis-card">
              <div className="axis-label">YAW Z</div>
              <div className={`axis-val mono ok`}>{(rotation.z > 0 ? '+' : '')}{rotation.z.toFixed(1)}°</div>
            </div>
          </div>
        </div>
        <div className={`status-tag ${isAligned ? 'locked' : 'scanning'}`}>
          <div className="dot-pulse"></div>
          {isAligned ? 'LEVEL LOCKED' : 'ALIGNING...'}
        </div>
        <div style={{ flex: 1 }}></div>
        <button
          className="btn btn-primary"
          onClick={onLock}
          disabled={!isAligned}
          style={{ opacity: isAligned ? '1' : '0.4' }}
        >
          Confirm alignment
        </button>
      </div>
    </div>
  )
}
