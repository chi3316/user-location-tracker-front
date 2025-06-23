export interface UserLocation {
    userId: string
    latitude: number
    longitude: number
    timestamp: string
    age: number
    gender: 'male' | 'female' | 'other'
    region: string
  }
  
  export interface UserInfo {
    userId: string
    age: number
    gender: 'male' | 'female' | 'other'
    currentLocation: {
      latitude: number
      longitude: number
      region: string
    }
    lastUpdateTime: string
  }
  
  export interface LocationHistory {
    userId: string
    locations: Array<{
      latitude: number
      longitude: number
      timestamp: string
      region: string
    }>
  }
  
  export interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
  }
