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
              <span>全局数据</span>
              <el-icon><DataLine /></el-icon>
            </div>
          </template>
          <div class="stat-value">{{ globalDataCount }}</div>
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
          <div class="stat-value">qiankun {{ qiankunVersion }}</div>
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
    entry: '//localhost:3001',
    container: '#sub-app1-container',
    activeRule: '/sub-app1'
  }
]"
          />
        </el-collapse-item>
        <el-collapse-item title="2. 配置路由" name="2">
          <p>在主应用路由中配置子应用路由：</p>
          <el-code-block
            language="typescript"
            code="{
  path: '/sub-app1',
  name: 'SubApp1',
  component: () => import('@/views/apps/SubApp.vue')
}"
          />
        </el-collapse-item>
        <el-collapse-item title="3. 父子通讯" name="3">
          <p>使用 qiankun 的全局状态进行通讯：</p>
          <el-code-block
            language="typescript"
            code="// 主应用发送
setMainState('message', 'Hello from main app!')

// 监听变化
onQiankunStateChange((state) => {
  console.log('Received:', state.message)
})"
          />
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>全局状态预览</span>
        </div>
      </template>
      <el-button type="primary" @click="sendMessageToSub">发送消息到子应用</el-button>
      <el-button type="success" @click="updateGlobalData">更新全局数据</el-button>
      <div class="state-preview">
        <el-input
          type="textarea"
          :rows="5"
          v-model="statePreview"
          readonly
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { Grid, CircleCheck, DataLine, InfoFilled } from '@element-plus/icons-vue'
import { useMainStore } from '@/store'
import { qiankunActions, setMainState, onQiankunStateChange } from '@/utils/qiankun'

const store = useMainStore()

const qiankunVersion = ref('2.10.1')
const statePreview = ref('')

const subAppCount = computed(() => store.subApps.length)
const loadedAppCount = computed(() => store.subApps.filter(a => a.status === 'loaded').length)
const globalDataCount = computed(() => Object.keys(store.globalData).length)

onMounted(() => {
  onQiankunStateChange((state) => {
    statePreview.value = JSON.stringify(state, null, 2)
  })
  statePreview.value = JSON.stringify(qiankunActions.getGlobalState(), null, 2)
})

const sendMessageToSub = () => {
  setMainState('message', {
    from: 'main',
    content: `Hello from main app! Time: ${new Date().toLocaleString()}`,
    timestamp: Date.now()
  })
}

const updateGlobalData = () => {
  setMainState('globalData', {
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    from: 'main'
  })
}
</script>

<style lang="scss" scoped>
.home-page {
  .stat-card {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between      align-items: center;
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
