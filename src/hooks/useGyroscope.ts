import { useState, useEffect } from 'react'
import type { RotationAngles } from '../types'

/**
 * Hook to track device orientation (gyroscope)
 * Returns rotation angles and alignment status
 */
export function useGyroscope() {
  const [rotation, setRotation] = useState<RotationAngles>({ x: 0, y: 0, z: 0 })
  const [isAligned, setIsAligned] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta ?? 0  // X pitch (forward/backward)
      const gamma = event.gamma ?? 0 // Y roll (left/right)
      const alpha = event.alpha ?? 0 // Z yaw

      setRotation({ x: beta, y: gamma, z: alpha })

      // Phone is "level" when beta and gamma are both < 1°
      const aligned = Math.abs(beta) < 1 && Math.abs(gamma) < 1
      setIsAligned(aligned)
    }

    // Request permission for iOS 13+
    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && 'requestPermission' in DeviceOrientationEvent) {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission()
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation)
          }
        } catch (err) {
          setError('Device orientation permission denied')
          console.error(err)
        }
      } else {
        // Non-iOS or older devices
        window.addEventListener('deviceorientation', handleDeviceOrientation)
      }
    }

    requestPermission()

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation)
    }
  }, [])

  return { rotation, isAligned, error }
}
