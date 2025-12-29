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
      <div :id="containerId" class="sub-app-wrapper">
        <div class="loading-placeholder">
          <el-skeleton :rows="5" animated />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/store'
import { loadMicroApp, MicroApp } from 'qiankun'

const route = useRoute()
const router = useRouter()
const store = useMainStore()

const appName = computed(() => route.params.name as string)
const containerId = computed(() => `sub-app-${appName.value}-container`)
let microApp: MicroApp | null = null

const goBack = () => {
  router.push('/apps')
}

const refreshApp = () => {
  if (microApp) {
    microApp.unmount()
  }
  loadSubApp()
}

const openNewTab = () => {
  const app = store.subApps.find(a => a.name === appName.value)
  if (app) {
    window.open(app.entry, '_blank')
  }
}

const loadSubApp = () => {
  const app = store.subApps.find(a => a.name === appName.value)
  if (!app) {
    return
  }

  try {
    microApp = loadMicroApp({
      name: appName.value,
      entry: app.entry,
      container: containerId.value
    })
  } catch (error) {
    console.error('加载子应用失败:', error)
  }
}

onMounted(() => {
  loadSubApp()
})
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
    min-height: 500px;
    
    .sub-app-wrapper {
      width: 100%;
      min-height: 500px;
      
      :deep(iframe) {
        width: 100%;
        height: 500px;
        border: none;
      }
      
      .loading-placeholder {
        padding: 20px;
      }
    }
  }
}
</style>
