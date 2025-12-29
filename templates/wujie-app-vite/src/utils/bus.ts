import { ref } from 'vue'

const bus = ref<Record<string, unknown>>({})

export function busEmit(event: string, data?: unknown) {
  bus.value[event] = data
}

export function busOn(event: string, callback: (data?: unknown) => void) {
  if (!bus.value[event]) {
    bus.value[event] = []
  }
  
  const handlers = bus.value[event] as Array<(data?: unknown) => void>
  handlers.push(callback)
}

export function busOff(event: string, callback?: (data?: unknown) => void) {
  if (!bus.value[event]) {
    return
  }
  
  if (callback) {
    const handlers = bus.value[event] as Array<(data?: unknown) => void>
    const index = handlers.indexOf(callback)
    if (index > -1) {
      handlers.splice(index, 1)
    }
  } else {
    bus.value[event] = []
  }
}

export function getBusData() {
  return bus.value
}
