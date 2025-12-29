<template>
  <div class="sub-app-view">
    <el-page-header @back="goBack" class="page-header">
      <template #content>
        <span class="page-title">{{ appName }} - 子应用预览</span>
      </template>
      <template #extra>
        <el-button @click="refreshApp">刷新</el-button>
        <el-button type="primary" @click="openNewTab">新窗口打开</el-button>
      </template>
    </el-page-header>

    <div class="app-container">
      <WujieVue3
        v-if="appUrl"
        width="100%"
        height="600px"
        :name="appName"
        :url="appUrl"
        :sync="true"
        @beforeLoad="handleBeforeLoad"
        @beforeMount="handleBeforeMount"
        @afterMount="handleAfterMount"
        @beforeUnmount="handleBeforeUnmount"
        @afterUnmount="handleAfterUnmount"
      />
      <div v-else class="no-app">
        <el-empty description="请先配置子应用" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/store'
import WujieVue3 from 'wujie-vue3'

const route = useRoute()
const router = useRouter()
const store = useMainStore()

const appName = computed(() => route.params.name as string)

const appUrl = computed(() => {
  const app = store.subApps.find(a => a.name === appName.value)
  return app?.url || ''
})

const goBack = () => {
  router.push('/apps')
}

const refreshApp = () => {
  window.location.reload()
}

const openNewTab = () => {
  if (appUrl.value) {
    window.open(appUrl.value, '_blank')
  }
}

const handleBeforeLoad = () => {
  console.log('[主应用] 子应用加载前:', appName.value)
  store.updateSubAppStatus(appName.value, 'loading')
}

const handleBeforeMount = () => {
  console.log('[主应用] 子应用挂载前:', appName.value)
}

const handleAfterMount = () => {
  console.log('[主应用] 子应用挂载后:', appName.value)
  store.updateSubAppStatus(appName.value, 'loaded')
}

const handleBeforeUnmount = () => {
  console.log('[主应用] 子应用卸载前:', appName.value)
}

const handleAfterUnmount = () => {
  console.log('[主应用] 子应用卸载后:', appName.value)
  store.updateSubAppStatus(appName.value, 'notloaded')
}
</script>

<style lang="scss" scoped>
.sub-app-view {
  .page-header {
    margin-bottom: 20px;
    
    .page-title {
      font-size: 18px;
      font-weight: 500;
    }
  }
  
  .app-container {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
    
    .no-app {
      height: 600px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
