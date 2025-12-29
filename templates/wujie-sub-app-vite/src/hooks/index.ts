import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

export function useWujieBus() {
  const isConnected = ref(false)
  const messageQueue = ref<Array<{ type: string; data: unknown; time: string }>>([])

  function checkConnection() {
    isConnected.value = !!(window as unknown as { $wujie?: { bus: unknown } }).$wujie
    return isConnected.value
  }

  function addToQueue(type: string, data: unknown) {
    messageQueue.value.push({
      type,
      data,
      time: new Date().toLocaleTimeString('zh-CN')
    })
    if (messageQueue.value.length > 50) {
      messageQueue.value.shift()
    }
  }

  function clearQueue() {
    messageQueue.value = []
  }

  return {
    isConnected,
    messageQueue,
    checkConnection,
    addToQueue,
    clearQueue
  }
}

export function usePageTitle(title: string) {
  onMounted(() => {
    document.title = title
  })
}

export function useRequest<T>(
  requestFn: () => Promise<T>,
  options: { immediate?: boolean; onSuccess?: (data: T) => void; onError?: (error: Error) => void } = {}
) {
  const { immediate = true, onSuccess, onError } = options
  const loading = ref(false)
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)

  async function execute() {
    loading.value = true
    error.value = null
    try {
      const result = await requestFn()
      data.value = result
      onSuccess?.(result)
      return result
    } catch (e) {
      error.value = e as Error
      onError?.(e as Error)
      throw e
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    execute()
  }

  return {
    loading: readonly(loading),
    data: readonly(data),
    error: readonly(error),
    execute
  }
}

export function useClipboard() {
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      ElMessage.success('已复制到剪贴板')
      return true
    } catch {
      ElMessage.error('复制失败')
      return false
    }
  }

  return { copy }
}
