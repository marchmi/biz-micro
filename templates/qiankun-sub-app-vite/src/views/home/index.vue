<template>
  <div class="sub-home">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="stat-card">
          <el-statistic title="消息数量" :value="store.messages.length" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <el-statistic title="全局数据键" :value="Object.keys(store.globalData).length" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <el-statistic title="应用版本" :value="store.version" />
        </el-card>
      </el-col>
    </el-row>

    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>接收来自主应用的消息</span>
        </div>
      </template>
      
      <div class="messages-list" v-if="receivedMessages.length > 0">
        <el-timeline>
          <el-timeline-item
            v-for="(msg, index) in receivedMessages"
            :key="index"
            :timestamp="formatTime(msg.timestamp)"
            placement="top"
            type="primary"
          >
            <el-card>
              <div class="message-from">{{ msg.from }}</div>
              <div class="message-content">{{ msg.content }}</div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <el-empty v-else description="暂无收到主应用消息" />
    </el-card>

    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>全局状态预览</span>
        </div>
      </template>
      
      <el-input
        type="textarea"
        :rows="6"
        :value="globalStatePreview"
        readonly
      />
    </el-card>

    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>快捷操作</span>
        </div>
      </template>
      
      <el-space wrap>
        <el-button type="primary" @click="sendMessageToMain">
          发送消息到主应用
        </el-button>
        <el-button type="success" @click="updateState">
          更新全局状态
        </el-button>
        <el-button type="info" @click="printState">
          打印状态到控制台
        </el-button>
      </el-space>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSubStore } from '@/store'
import { subActions, setMainState, onQiankunStateChange } from '@/utils/qiankun'

interface Message {
  from: string
  content: string
  timestamp: number
}

const store = useSubStore()

const receivedMessages = ref<Message[]>([])

const globalStatePreview = computed(() => {
  return JSON.stringify(subActions.getGlobalState(), null, 2)
})

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString()
}

const sendMessageToMain = () => {
  const content = `来自子应用的消息 - ${new Date().toLocaleString()}`
  
  setMainState('message', {
    from: store.appName,
    content,
    timestamp: Date.now()
  })
  
  store.addMessage({
    from: 'sub-app',
    content,
    timestamp: Date.now()
  })
}

const updateState = () => {
  setMainState('subData', {
    version: store.version,
    timestamp: Date.now(),
    appName: store.appName
  })
}

const printState = () => {
  console.log('当前全局状态:', subActions.getGlobalState())
  console.log('已发送消息:', store.messages)
  console.log('已接收消息:', receivedMessages.value)
}

onMounted(() => {
  onQiankunStateChange((state, prevState) => {
    console.log('[子应用] 状态变化:', { state, prevState })
    
    if (state.message && typeof state.message === 'object') {
      const msg = state.message as Message
      if (msg.from && msg.from !== store.appName) {
        receivedMessages.value.push(msg)
        store.addMessage(msg)
      }
    }
  })
})
</script>

<style lang="scss" scoped>
.sub-home {
  .stat-card {
    margin-bottom: 20px;
  }
  
  .info-card {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  
  .messages-list {
    max-height: 300px;
    overflow-y: auto;
    
    .message-from {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .message-content {
      color: #606266;
    }
  }
}
</style>
