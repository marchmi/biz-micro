import { defineStore } from 'pinia'
import { ref } from 'vue'

interface SubAppState {
  appName: string
  version: string
  messages: Message[]
  globalData: Record<string, unknown>
}

interface Message {
  from: string
  content: string
  timestamp: number
}

export const useSubStore = defineStore('sub', () => {
  const appName = ref('qiankun-sub-app')
  const version = ref('1.0.0')
  const messages = ref<Message[]>([])
  const globalData = ref<Record<string, unknown>>({})

  const addMessage = (msg: Message) => {
    messages.value.push(msg)
  }

  const setGlobalData = (data: Record<string, unknown>) => {
    globalData.value = data
  }

  return {
    appName,
    version,
    messages,
    globalData,
    addMessage,
    setGlobalData
  }
})
