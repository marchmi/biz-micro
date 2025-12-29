<template>
  <div class="about-page">
    <el-card class="about-card">
      <template #header>
        <div class="card-header">
          <span>关于应用</span>
        </div>
      </template>

      <div class="about-content">
        <div class="app-info">
          <el-avatar :size="80" src="https://element-plus.org/images/element-plus-logo.svg" />
          <h2 class="app-name">{{ appName }}</h2>
          <p class="app-version">版本号：v{{ appVersion }}</p>
        </div>

        <el-divider />

        <div class="info-section">
          <h3 class="section-title">技术栈</h3>
          <div class="tech-stack">
            <el-tag v-for="tech in techStack" :key="tech.name" type="info" effect="plain" class="tech-tag">
              {{ tech.name }} {{ tech.version }}
            </el-tag>
          </div>
        </div>

        <el-divider />

        <div class="info-section">
          <h3 class="section-title">功能特性</h3>
          <ul class="feature-list">
            <li>
              <el-icon><Check /></el-icon>
              <span>基于Vue 3和TypeScript的现代化开发体验</span>
            </li>
            <li>
              <el-icon><Check /></el-icon>
              <span>集成Wujie微前端框架，支持独立运行和嵌入运行</span>
            </li>
            <li>
              <el-icon><Check /></el-icon>
              <span>使用Vite作为构建工具，享受极速的开发体验</span>
            </li>
            <li>
              <el-icon><Check /></el-icon>
              <span>Pinia状态管理，简洁高效的状态管理方案</span>
            </li>
            <li>
              <el-icon><Check /></el-icon>
              <span>Element Plus组件库，提供丰富的UI组件</span>
            </li>
            <li>
              <el-icon><Check /></el-icon>
              <span>集成了wujie-vue3，支持主应用与子应用之间的通信</span>
            </li>
          </ul>
        </div>

        <el-divider />

        <div class="info-section">
          <h3 class="section-title">应用配置</h3>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="应用名称">{{ appName }}</el-descriptions-item>
            <el-descriptions-item label="应用版本">v{{ appVersion }}</el-descriptions-item>
            <el-descriptions-item label="运行环境">{{ environment }}</el-descriptions-item>
            <el-descriptions-item label="基础路径">{{ baseUrl }}</el-descriptions-item>
            <el-descriptions-item label="运行模式">
              <el-tag :type="isWujieMode ? 'success' : 'info'" size="small">
                {{ isWujieMode ? 'Wujie子应用模式' : '独立运行模式' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="构建时间">{{ buildTime }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <el-divider />

        <div class="info-section">
          <h3 class="section-title">通信状态</h3>
          <div class="communication-status">
            <div class="status-item">
              <span class="status-label">主应用通信</span>
              <el-tag :type="mainAppConnected ? 'success' : 'danger'" size="small">
                {{ mainAppConnected ? '已连接' : '未连接' }}
              </el-tag>
            </div>
            <div class="status-item">
              <span class="status-label">消息通道</span>
              <el-tag type="info" size="small">{{ busChannel }}</el-tag>
            </div>
            <div class="status-item">
              <span class="status-label">已接收消息</span>
              <span class="status-value">{{ messageCount }}</span>
            </div>
            <div class="status-item">
              <span class="status-label">已发送消息</span>
              <span class="status-value">{{ sentMessageCount }}</span>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="info-section">
          <h3 class="section-title">快捷操作</h3>
          <div class="quick-ops">
            <el-button type="primary" @click="refreshData">
              <el-icon><Refresh /></el-icon>
              刷新数据
            </el-button>
            <el-button @click="sendHeartbeat">
              <el-icon><Bell /></el-icon>
              发送心跳
            </el-button>
            <el-button type="warning" @click="simulateDataUpdate">
              <el-icon><DataLine /></el-icon>
              模拟数据更新
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Check, Refresh, Bell, DataLine } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { setupBusListener, busEmit, BusMessage } from '@/utils/wujie-bus'

const appName = import.meta.env.VITE_APP_NAME || 'wujie-sub-app'
const appVersion = '1.0.0'
const baseUrl = import.meta.env.VITE_APP_BASE_URL || '/'
const buildTime = new Date().toLocaleString('zh-CN')

const environment = import.meta.env.MODE
const isWujieMode = !!(window as unknown as { $wujie?: unknown }).$wujie
const busChannel = 'sub-app-bus'

const messageCount = ref(0)
const sentMessageCount = ref(0)
const mainAppConnected = ref(false)

const techStack = [
  { name: 'Vue', version: '3.4.0' },
  { name: 'TypeScript', version: '5.3.0' },
  { name: 'Vite', version: '5.0.10' },
  { name: 'Pinia', version: '2.1.7' },
  { name: 'Element Plus', version: '2.4.4' },
  { name: 'Wujie-Vue3', version: '1.0.22' }
]

function refreshData() {
  ElMessage.success('数据已刷新')
  busEmit('refresh', { timestamp: Date.now() })
}

function sendHeartbeat() {
  busEmit('heartbeat', { timestamp: Date.now(), from: appName })
  sentMessageCount.value++
  ElMessage.info('心跳信号已发送')
}

function simulateDataUpdate() {
  busEmit('simulateUpdate', {
    timestamp: Date.now(),
    data: {
      visitCount: Math.floor(Math.random() * 1000) + 1000,
      userCount: Math.floor(Math.random() * 100) + 500
    }
  })
  sentMessageCount.value++
  ElMessage.success('模拟数据更新已发送')
}

let cleanup: (() => void) | null = null

onMounted(() => {
  cleanup = setupBusListener((data: BusMessage) => {
    messageCount.value++
    if (data.type === 'ping' || data.type === 'heartbeat') {
      mainAppConnected.value = true
    }
  })

  busEmit('mounted', { timestamp: Date.now(), from: appName })
  sentMessageCount.value++
})

onUnmounted(() => {
  if (cleanup) {
    cleanup()
  }
  busEmit('unmounted', { timestamp: Date.now(), from: appName })
})
</script>

<style lang="scss" scoped>
.about-page {
  padding: 20px;
}

.about-card {
  max-width: 900px;
  margin: 0 auto;
}

.about-content {
  padding: 10px;
}

.app-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;

  .app-name {
    margin: 16px 0 8px;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }

  .app-version {
    font-size: 14px;
    color: #909399;
  }
}

.info-section {
  margin: 20px 0;

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 16px;
  }
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .tech-tag {
    font-size: 12px;
  }
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    color: #606266;

    .el-icon {
      color: #67c23a;
    }
  }
}

.communication-status {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  .status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f5f7fa;
    border-radius: 6px;

    .status-label {
      font-size: 14px;
      color: #606266;
    }

    .status-value {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }
  }
}

.quick-ops {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
