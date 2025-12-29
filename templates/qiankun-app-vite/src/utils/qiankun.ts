import { start as qiankunStart, setGlobalState, initGlobalState } from 'qiankun'
import { ref } from 'vue'

const DEFAULT_VERSION = '1.0.0'

export const qiankunState: Record<string, unknown> = {}

export const qiankunActions = initGlobalState(qiankunState)

export function qiankunStart() {
  qiankunStart({
    prefetch: true,
    sandbox: {
      strictStyleIsolation: true,
      experimentalStyleIsolation: true
    },
    getPublicPath: () => '/',
    getTemplate: (tpl: string) => tpl,
    beforeLoad: [
      (app) => {
        console.log('[qiankun] before load', app.name)
        return Promise.resolve()
      }
    ],
    beforeMount: [
      (app) => {
        console.log('[qiankun] before mount', app.name)
        return Promise.resolve()
      }
    ],
    afterMount: [
      (app) => {
        console.log('[qiankun] after mount', app.name)
        return Promise.resolve()
      }
    ],
    afterUnmount: [
      (app) => {
        console.log('[qiankun] after unmount', app.name)
        return Promise.resolve()
      }
    ]
  })
}

export function setMainState(key: string, value: unknown) {
  qiankunActions.setGlobalState({
    ...qiankunState,
    [key]: value,
    _timestamp: Date.now()
  })
}

export function onQiankunStateChange(
  callback: (state: Record<string, unknown>, prevState: Record<string, unknown>) => void
) {
  qiankunActions.onGlobalStateChange(callback, true)
}

export function initMainState(initialState?: Record<string, unknown>) {
  if (initialState) {
    qiankunActions.setGlobalState({
      ...initialState,
      _timestamp: Date.now()
    })
  }
}
