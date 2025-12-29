<template>
  <div class="sub-app-container">
    <div class="app-header">
      <h2>{{ appName }}</h2>
      <div class="app-info">
        <el-tag size="small">子应用</el-tag>
        <el-tag size="small" type="success">qiankun</el-tag>
      </div>
    </div>
    
    <div class="app-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
    
    <div class="app-footer">
      <el-button type="primary" size="small" @click="sendToMain">
        发送消息到主应用
      </el-button>
      <el-button type="success" size="small" @click="updateGlobalState">
        更新全局状态
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { setMainState, onQiankunStateChange, qiankunActions } from '@/utils/qiankun'

const route = useRoute()

const appName = computed(() => {
  return route.meta?.title?.toString() || '子应用'
})

const sendToMain = () => {
  setMainState('message', {
    from: 'sub-app',
    content: `Hello from sub app! Time: ${new Date().toLocaleString()}`,
    timestamp: Date.now()
  })
}

const updateGlobalState = () => {
  setMainState('subAppData', {
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    from: 'sub-app'
  })
}

onMounted(() => {
  onQiankunStateChange((state) => {
    console.log('[子应用] 收到主应用消息:', state)
  })
  
  console.log('[子应用] 初始化完成，当前全局状态:', qiankunActions.getGlobalState())
})
</script>

<style lang="scss" scoped>
.sub-app-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  
  .app-header {
    padding: 15px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h2 {
      margin: 0;
      font-size: 20px;
    }
    
    .app-info {
      display: flex;
      gap: 10px;
    }
  }
  
  .app-content {
    flex: 1;
    padding: 20px;
    background-color: #f5f7fa;
  }
  
  .app-footer {
    padding: 15px 20px;
    background-color: #fff;
    border-top: 1px solid #e4e7ed;
    display: flex;
    gap: 10px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
