import { useEffect, useRef } from 'react'

/**
 * Hook to manage camera stream lifecycle
 * Handles getUserMedia() + cleanup
 */
export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      return stream
    } catch (error) {
      console.error('Camera access denied:', error)
      throw error
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera()
  }, [])

  return { videoRef, startCamera, stopCamera }
}
