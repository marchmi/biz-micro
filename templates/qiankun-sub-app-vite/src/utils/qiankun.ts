import { initGlobalState } from 'qiankun'

const DEFAULT_STATE = {
  version: '1.0.0'
}

export const subState: Record<string, unknown> = { ...DEFAULT_STATE }

export const subActions = initGlobalState(subState)

export function setMainState(key: string, value: unknown) {
  subActions.setGlobalState({
    ...subState,
    [key]: value,
    _timestamp: Date.now()
  })
}

export function onQiankunStateChange(
  callback: (state: Record<string, unknown>, prevState: Record<string, unknown>) => void
) {
  subActions.onGlobalStateChange(callback, true)
}

export function initSubState(initialState?: Record<string, unknown>) {
  if (initialState) {
    subActions.setGlobalState({
      ...initialState,
      _timestamp: Date.now()
    })
  }
}
