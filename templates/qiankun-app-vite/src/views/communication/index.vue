<template>
  <div class="communication-page">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>发送消息到子应用</span>
            </div>
          </template>
          
          <el-form :model="messageForm" label-width="100px">
            <el-form-item label="消息类型">
              <el-select v-model="messageForm.type" placeholder="选择消息类型">
                <el-option label="文本消息" value="text" />
                <el-option label="数据更新" value="data" />
                <el-option label="事件通知" value="event" />
              </el-select>
            </el-form-item>
            <el-form-item label="消息内容">
              <el-input
                type="textarea"
                v-model="messageForm.content"
                :rows="4"
                placeholder="请输入消息内容"
              />
            </el-form-item>
            <el-form-item label="目标应用">
              <el-select v-model="messageForm.targetApp" placeholder="选择目标应用">
                <el-option
                  v-for="app in store.subApps"
                  :key="app.name"
                  :label="app.name"
                  :value="app.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="sendMessage">发送消息</el-button>
              <el-button @click="clearForm">清空</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>接收来自子应用的消息</span>
              <el-badge :value="receivedMessages.length" :hidden="receivedMessages.length === 0">
                <el-tag>新消息</el-tag>
              </el-badge>
            </div>
          </template>
          
          <div class="messages-container" ref="messagesContainer">
            <div v-if="receivedMessages.length === 0" class="no-messages">
              暂无收到子应用消息
            </div>
            <div
              v-for="(msg, index) in receivedMessages"
              :key="index"
              class="message-item"
              :class="{ 'is-self': msg.from === 'main' }"
            >
              <div class="message-header">
                <el-tag size="small">{{ msg.from }}</el-tag>
                <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
              </div>
              <div class="message-content">
                {{ msg.content }}
              </div>
            </div>
          </div>
          
          <div class="messages-actions">
            <el-button size="small" @click="clearMessages">清空消息</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-card class="global-state-card">
      <template #header>
        <div class="card-header">
          <span>全局状态管理</span>
          <el-button type="primary" size="small" @click="syncGlobalState">
            同步全局状态
          </el-button>
        </div>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="state-section">
            <h4>设置全局状态</h4>
            <el-form :model="globalStateForm" label-width="100px" size="small">
              <el-form-item label="键">
                <el-input v-model="globalStateForm.key" placeholder="状态键名" />
              </el-form-item>
              <el-form-item label="值">
                <el-input v-model="globalStateForm.value" placeholder="状态值" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="setGlobalState">设置状态</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="state-section">
            <h4>当前全局状态</h4>
            <el-input
              type="textarea"
              :rows="6"
              :value="currentGlobalState"
              readonly
              class="state-display"
            />
          </div>
        </el-col>
      </el-row>
    </el-card>
    
    <el-card class="actions-card">
      <template #header>
        <div class="card-header">
          <span>快捷操作</span>
        </div>
      </template>
      
      <el-space wrap>
        <el-button type="success" @click="broadcastMessage">
          广播消息到所有子应用
        </el-button>
        <el-button type="warning" @click="clearAllGlobalState">
          清空全局状态
        </el-button>
        <el-button type="info" @click="printAllState">
          打印所有状态
        </el-button>
      </el-space>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, nextTick } from 'vue'
import { useMainStore } from '@/store'
import { setMainState, onQiankunStateChange, qiankunActions } from '@/utils/qiankun'

interface ReceivedMessage {
  from: string
  content: string
  type: string
  timestamp: number
}

const store = useMainStore()

const messageForm = reactive({
  type: 'text',
  content: '',
  targetApp: ''
})

const globalStateForm = reactive({
  key: '',
  value: ''
})

const receivedMessages = ref<ReceivedMessage[]>([])
const messagesContainer = ref<HTMLElement | null>(null)

const currentGlobalState = computed(() => {
  return JSON.stringify(qiankunActions.getGlobalState(), null, 2)
})

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString()
}

const sendMessage = () => {
  if (!messageForm.content.trim()) {
    return
  }

  setMainState('message', {
    type: messageForm.type,
    content: messageForm.content,
    from: 'main',
    timestamp: Date.now()
  })

  receivedMessages.value.push({
    from: 'main',
    content: messageForm.content,
    type: messageForm.type,
    timestamp: Date.now()
  })

  scrollToBottom()
  clearForm()
}

const clearForm = () => {
  messageForm.content = ''
}

const setGlobalState = () => {
  if (!globalStateForm.key.trim()) {
    return
  }

  setMainState(globalStateForm.key, globalStateForm.value)
  globalStateForm.key = ''
  globalStateForm.value = ''
}

const syncGlobalState = () => {
  console.log('当前全局状态:', qiankunActions.getGlobalState())
}

const broadcastMessage = () => {
  setMainState('broadcast', {
    from: 'main',
    message: '这是一条广播消息',
    timestamp: Date.now()
  })
}

const clearAllGlobalState = () => {
  setMainState('globalData', {})
}

const clearMessages = () => {
  receivedMessages.value = []
}

const printAllState = () => {
  console.log('全局状态:', qiankunActions.getGlobalState())
  console.log('已接收消息:', receivedMessages.value)
  console.log('子应用列表:', store.subApps)
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

onMounted(() => {
  onQiankunStateChange((state) => {
    if (state.message && typeof state.message === 'object') {
      const msg = state.message as ReceivedMessage
      if (msg.from !== 'main') {
        receivedMessages.value.push(msg)
        scrollToBottom()
      }
    }
  })
})
</script>

<style lang="scss" scoped>
.communication-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .messages-container {
    max-height: 300px;
    overflow-y: auto;
    padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    margin-bottom: 10px;
    
    .no-messages {
      text-align: center;
      color: #909399;
      padding: 20px;
    }
    
    .message-item {
      margin-bottom: 15px;
      padding: 10px;
      background: #f5f7fa;
      border-radius: 4px;
      
      &.is-self {
        background: #ecf5ff;
      }
      
      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
        
        .message-time {
          color: #909399;
          font-size: 12px;
        }
      }
      
      .message-content {
        color: #606266;
      }
    }
  }
  
  .messages-actions {
    text-align: right;
  }
  
  .global-state-card {
    margin-top: 20px;
    
    .state-section {
      h4 {
        margin-bottom: 15px;
        color: #606266;
      }
      
      .state-display {
        font-family: monospace;
      }
    }
  }
  
  .actions-card {
    margin-top: 20px;
  }
}
</style>
