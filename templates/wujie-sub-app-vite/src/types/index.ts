export interface SubApp {
  name: string
  url: string
  status: 'not_loaded' | 'loading' | 'loaded' | 'error'
  icon?: string
  description?: string
}

export interface AppState {
  subApps: SubApp[]
  currentApp: string | null
  isLoading: boolean
  error: string | null
}

export interface Message {
  id: number
  type: string
  content: string
  timestamp: number
  direction: 'send' | 'receive'
  status: 'success' | 'error' | 'pending'
}

export interface UserInfo {
  id: number
  name: string
  avatar: string
  email: string
}
