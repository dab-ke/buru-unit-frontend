// Measurement data from camera/mock
export interface MeasurementData {
  length: number
  width: number
  instep: number
  confidence: number
}

// Complete result after backend processing
export interface ResultData extends MeasurementData {
  buruId: string
  euSize: number
}

// API request payload
export interface ScanRequest {
  length_mm: number
  width_mm: number
  instep_mm: number
  confidence: number
}

// API response from /api/scan
export interface ScanResponse {
  buru_id: string
  user_id: string
  created: boolean
}

// Gyroscope rotation angles
export interface RotationAngles {
  x: number  // pitch (beta)
  y: number  // roll (gamma)
  z: number  // yaw (alpha)
}

// App-level screen state
export type ScreenState = 'welcome' | 'card' | 'gyro' | 'scan' | 'process' | 'result'
