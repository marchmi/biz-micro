<template>
  <div class="settings-page">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>应用配置</span>
            </div>
          </template>
          
          <el-form :model="appConfig" label-width="120px">
            <el-form-item label="应用名称">
              <el-input v-model="appConfig.name" />
            </el-form-item>
            <el-form-item label="应用端口">
              <el-input-number v-model="appConfig.port" :min="1" :max="65535" />
            </el-form-item>
            <el-form-item label="基础路径">
              <el-input v-model="appConfig.baseUrl" placeholder="/" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveAppConfig">保存配置</el-button>
              <el-button @click="resetAppConfig">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>主题设置</span>
            </div>
          </template>
          
          <el-form label-width="120px">
            <el-form-item label="主题颜色">
              <el-color-picker v-model="themeColor" @change="changeTheme" />
            </el-form-item>
            <el-form-item label="菜单模式">
              <el-radio-group v-model="menuMode" @change="changeMenuMode">
                <el-radio-button label="vertical">垂直</el-radio-button>
                <el-radio-button label="horizontal">水平</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveTheme">保存主题</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    
    <el-card class="sub-apps-config">
      <template #header>
        <div class="card-header">
          <span>子应用默认配置</span>
        </div>
      </template>
      
      <el-form :model="subAppConfig" label-width="120px">
        <el-form-item label="同步模式">
          <el-switch v-model="subAppConfig.sync" />
        </el-form-item>
        <el-form-item label="生命周期">
          <el-switch v-model="subAppConfig.lifecycle" />
        </el-form-item>
        <el-form-item label="降级处理">
          <el-switch v-model="subAppConfig.degrade" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveSubAppConfig">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <el-card class="about-card">
      <template #header>
        <div class="card-header">
          <span>关于</span>
        </div>
      </template>
      
      <el-descriptions :column="2" border>
        <el-descriptions-item label="版本">
          1.0.0
        </el-descriptions-item>
        <el-descriptions-item label="框架">
          WuJie 1.0.22
        </el-descriptions-item>
        <el-descriptions-item label="前端框架">
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
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const appConfig = reactive({
  name: 'wujie-main-app',
  port: 3000,
  baseUrl: '/'
})

const themeColor = ref('#409eff')
const menuMode = ref('vertical')

const subAppConfig = reactive({
  sync: true,
  lifecycle: true,
  degrade: false
})

const saveAppConfig = () => {
  localStorage.setItem('appConfig', JSON.stringify(appConfig))
  ElMessage.success('应用配置已保存')
}

const resetAppConfig = () => {
  Object.assign(appConfig, {
    name: 'wujie-main-app',
    port: 3000,
    baseUrl: '/'
  })
}

const changeTheme = (color: string) => {
  document.documentElement.style.setProperty('--el-color-primary', color)
}

const changeMenuMode = (mode: string) => {
  console.log('菜单模式:', mode)
}

const saveTheme = () => {
  localStorage.setItem('theme', JSON.stringify({
    color: themeColor.value,
    menuMode: menuMode.value
  }))
  ElMessage.success('主题配置已保存')
}

const saveSubAppConfig = () => {
  localStorage.setItem('subAppConfig', JSON.stringify(subAppConfig))
  ElMessage.success('子应用配置已保存')
}
</script>

<style lang="scss" scoped>
.settings-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .sub-apps-config,
  .about-card {
    margin-top: 20px;
  }
}
</style>
