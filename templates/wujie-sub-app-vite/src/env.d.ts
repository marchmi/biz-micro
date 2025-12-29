/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_PORT: string
  readonly VITE_APP_BASE_URL: string
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  $wujie: {
    bus: {
      $emit: (event: string, data: unknown) => void
      $on: (event: string, callback: (data: unknown) => void) => void
      $off: (event: string, callback: (data: unknown) => void) => void
    }
    callMainFunction: (fnName: string, ...args: unknown[]) => void
    props: Record<string, unknown>
  }
}
