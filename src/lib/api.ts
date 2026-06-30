import type { ScanRequest, ScanResponse } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

/**
 * Fetch wrapper with error handling
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API ${response.status}: ${response.statusText}`)
    }

    return response.json() as Promise<T>
  } catch (error) {
    console.error(`Fetch error at ${url}:`, error)
    throw error
  }
}

/**
 * Submit foot measurements and get Buru ID
 */
export async function submitScan(measurements: ScanRequest): Promise<ScanResponse> {
  return fetchAPI<ScanResponse>('/scan', {
    method: 'POST',
    body: JSON.stringify(measurements),
  })
}

/**
 * Health check endpoint (verify backend is running)
 */
export async function checkHealth(): Promise<{ status: string }> {
  return fetchAPI('/healthcheck')
}

/**
 * Get user profile by Buru ID
 */
export async function getProfile(buruId: string): Promise<any> {
  return fetchAPI(`/profile/${buruId}`)
}
