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
  globalData: Record<string, unknown>
}

interface SubApp {
  name: string
  entry: string
  container: string
  activeRule: string
  status: 'loading' | 'loaded' | 'error' | 'notloaded'
}

export const useMainStore = defineStore('main', () => {
  const isCollapsed = ref(false)
  const subApps = ref<SubApp[]>([])
  const globalData = ref<Record<string, unknown>>({})
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

  const setGlobalData = (data: Record<string, unknown>) => {
    globalData.value = data
  }

  const updateGlobalData = (key: string, value: unknown) => {
    globalData.value[key] = value
  }

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
  }

  return {
    isCollapsed,
    subApps,
    globalData,
    userInfo,
    toggleCollapse,
    setSubApps,
    updateSubAppStatus,
    setGlobalData,
    updateGlobalData,
    setUserInfo
  }
})
