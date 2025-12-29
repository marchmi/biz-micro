<template>
  <div class="home-page">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>子应用数量</span>
              <el-icon><Grid /></el-icon>
            </div>
          </template>
          <div class="stat-value">{{ subAppCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>已加载应用</span>
              <el-icon><CircleCheck /></el-icon>
            </div>
          </template>
          <div class="stat-value">{{ loadedAppCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>总线数据</span>
              <el-icon><DataLine /></el-icon>
            </div>
          </template>
          <div class="stat-value">{{ busDataCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>框架版本</span>
              <el-icon><InfoFilled /></el-icon>
            </div>
          </template>
          <div class="stat-value">WuJie 1.0.22</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>快速开始</span>
        </div>
      </template>
      <el-collapse>
        <el-collapse-item title="1. 添加子应用" name="1">
          <p>在主应用中添加子应用配置：</p>
          <el-code-block
            language="typescript"
            code="const apps = [
  {
    name: 'sub-app1',
    url: '//localhost:3001'
  }
]"
          />
        </el-collapse-item>
        <el-collapse-item title="2. 使用 WujieVue3 组件" name="2">
          <p>在主应用中使用 WujieVue3 组件加载子应用：</p>
          <el-code-block
            language="vue"
            code="<template>
  <WujieVue3
    width="100%"
    height="100%"
    name="sub-app1"
    url="//localhost:3001"
    :sync="true"
  />
</template>"
          />
        </el-collapse-item>
        <el-collapse-item title="3. 父子通讯" name="3">
          <p>使用 bus 进行通讯：</p>
          <el-code-block
            language="typescript"
            code="// 主应用发送
import { busEmit, busOn } from '@/utils/bus'

busEmit('message', { from: 'main', content: 'Hello!' })

// 监听
busOn('message', (data) => {
  console.log('Received:', data)
})"
          />
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>总线状态预览</span>
        </div>
      </template>
      <el-button type="primary" @click="sendMessageToSub">发送消息到子应用</el-button>
      <el-button type="success" @click="updateBusData">更新总线数据</el-button>
      <div class="state-preview">
        <el-input
          type="textarea"
          :rows="5"
          :value="busPreview"
          readonly
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Grid, CircleCheck, DataLine, InfoFilled } from '@element-plus/icons-vue'
import { useMainStore } from '@/store'
import { busEmit, busOn, getBusData } from '@/utils/bus'

const store = useMainStore()

const busPreview = ref('')

const subAppCount = computed(() => store.subApps.length)
const loadedAppCount = computed(() => store.subApps.filter(a => a.status === 'loaded').length)
const busDataCount = computed(() => Object.keys(store.bus).length)

const updateBusPreview = () => {
  busPreview.value = JSON.stringify(getBusData(), null, 2)
}

const sendMessageToSub = () => {
  busEmit('message', {
    from: 'main',
    content: `Hello from main app! Time: ${new Date().toLocaleString()}`,
    timestamp: Date.now()
  })
  updateBusPreview()
}

const updateBusData = () => {
  store.updateBus('globalData', {
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    from: 'main'
  })
  updateBusPreview()
}

onMounted(() => {
  busOn('update', updateBusPreview)
  updateBusPreview()
})

onUnmounted(() => {
  busOff('update')
})
</script>

<style lang="scss" scoped>
.home-page {
  .stat-card {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .stat-value {
      font-size: 28px;
      font-weight: bold;
      color: #409eff;
    }
  }
  
  .info-card {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  
  .state-preview {
    margin-top: 15px;
  }
}
</style>
