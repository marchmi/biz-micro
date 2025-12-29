import { defineStore } from 'pinia'
import { ref } from 'vue'

interface UserInfo {
  name: string
  avatar: string
  token: string
}

interface AppState {
  isCollapsed: boolean
  subApps: SubApp[]
  bus: Record<string, unknown>
}

interface SubApp {
  name: string
  url: string
  status: 'loading' | 'loaded' | 'error' | 'notloaded'
}

export const useMainStore = defineStore('main', () => {
  const isCollapsed = ref(false)
  const subApps = ref<SubApp[]>([])
  const bus = ref<Record<string, unknown>>({})
  const userInfo = ref<UserInfo | null>(null)

  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
  }

  const setSubApps = (apps: SubApp[]) => {
    subApps.value = apps
  }

  const updateSubAppStatus = (name: string, status: SubApp['status']) => {
    const app = subApps.value.find(a => a.name === name)
    if (app) {
      app.status = status
    }
  }

  const setBus = (data: Record<string, unknown>) => {
    bus.value = data
  }

  const updateBus = (key: string, value: unknown) => {
    bus.value[key] = value
  }

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
  }

  return {
    isCollapsed,
    subApps,
    bus,
    userInfo,
    toggleCollapse,
    setSubApps,
    updateSubAppStatus,
    setBus,
    updateBus,
    setUserInfo
  }
})
