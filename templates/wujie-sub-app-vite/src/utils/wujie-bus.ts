import { bus, Bus } from 'wujie-vue3'

export interface BusMessage {
  type: string
  payload: unknown
  timestamp: number
  source: string
}

const BUS_CHANNEL = 'sub-app-bus'
const SOURCE_NAME = import.meta.env.VITE_APP_NAME || 'wujie-sub-app'

export function busEmit(type: string, payload: unknown) {
  if (window.$wujie) {
    window.$wujie?.bus.$emit(BUS_CHANNEL, {
      type,
      payload,
      timestamp: Date.now(),
      source: SOURCE_NAME
    })
  } else {
    bus.$emit(BUS_CHANNEL, {
      type,
      payload,
      timestamp: Date.now(),
      source: SOURCE_NAME
    })
  }
}

export function busOn(callback: (data: BusMessage) => void) {
  if (window.$wujie) {
    window.$wujie?.bus.$on(BUS_CHANNEL, callback)
  } else {
    bus.$on(BUS_CHANNEL, callback)
  }
}

export function busOff(callback: (data: BusMessage) => void) {
  if (window.$wujie) {
    window.$wujie?.bus.$off(BUS_CHANNEL, callback)
  } else {
    bus.$off(BUS_CHANNEL, callback)
  }
}

export function getBusData(): Record<string, unknown> {
  if (window.$wujie) {
    return window.$wujie?.bus || {}
  }
  return {}
}

export function callMainFunction(fnName: string, ...args: unknown[]) {
  if (window.$wujie) {
    window.$wujie?.callMainFunction(fnName, ...args)
  }
}

export function setupBusListener(callback: (data: BusMessage) => void) {
  busOn(callback)
  return () => {
    busOff(callback)
  }
}

export function postMessageToMain(action: string, data: unknown) {
  busEmit(action, data)
}
