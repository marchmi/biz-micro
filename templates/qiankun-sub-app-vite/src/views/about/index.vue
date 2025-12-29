<template>
  <div class="sub-about">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>关于子应用</span>
        </div>
      </template>
      
      <el-descriptions :column="2" border>
        <el-descriptions-item label="应用名称">
          {{ store.appName }}
        </el-descriptions-item>
        <el-descriptions-item label="版本">
          {{ store.version }}
        </el-descriptions-item>
        <el-descriptions-item label="框架">
          Vue 3.3.8
        </el-descriptions-item>
        <el-descriptions-item label="构建工具">
          Vite 5.0.2
        </el-descriptions-item>
        <el-descriptions-item label="状态管理">
          Pinia 2.1.7
        </el-descriptions-item>
        <el-descriptions-item label="UI组件库">
          Element Plus 2.4.3
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>通讯示例</span>
        </div>
      </template>
      
      <el-collapse>
        <el-collapse-item title="发送消息到主应用" name="1">
          <el-code-block
            language="typescript"
            code="import { setMainState } from '@/utils/qiankun'

setMainState('message', {
  from: 'sub-app',
  content: 'Hello from sub app!',
  timestamp: Date.now()
})"
          />
        </el-collapse-item>
        <el-collapse-item title="监听主应用消息" name="2">
          <el-code-block
            language="typescript"
            code="import { onQiankunStateChange } from '@/utils/qiankun'

onQiankunStateChange((state) => {
  console.log('收到主应用消息:', state.message)
})"
          />
        </el-collapse-item>
        <el-collapse-item title="获取全局状态" name="3">
          <el-code-block
            language="typescript"
            code="import { subActions } from '@/utils/qiankun'

const globalState = subActions.getGlobalState()
console.log('当前全局状态:', globalState)"
          />
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useSubStore } from '@/store'

const store = useSubStore()
</script>

<style lang="scss" scoped>
.sub-about {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .info-card {
    margin-top: 20px;
  }
}
</style>
