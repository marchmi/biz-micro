<template>
  <div class="apps-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>子应用管理</span>
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            添加子应用
          </el-button>
        </div>
      </template>

      <el-table :data="store.subApps" style="width: 100%">
        <el-table-column prop="name" label="应用名称" width="180" />
        <el-table-column prop="entry" label="入口地址" width="250">
          <template #default="{ row }">
            <el-link type="primary" :href="row.entry" target="_blank">
              {{ row.entry }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="activeRule" label="激活规则" width="180" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="navigateToApp(row)">
              访问
            </el-button>
            <el-button type="warning" link @click="reloadApp(row)">
              重新加载
            </el-button>
            <el-button type="danger" link @click="removeApp(row)">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="showAddDialog" title="添加子应用" width="500px">
      <el-form :model="newApp" label-width="100px">
        <el-form-item label="应用名称">
          <el-input v-model="newApp.name" placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="入口地址">
          <el-input v-model="newApp.entry" placeholder="如：//localhost:3001" />
        </el-form-item>
        <el-form-item label="容器ID">
          <el-input v-model="newApp.container" placeholder="如：#sub-app-container" />
        </el-form-item>
        <el-form-item label="激活规则">
          <el-input v-model="newApp.activeRule" placeholder="如：/sub-app" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addApp">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/store'
import { Plus } from '@element-plus/icons-vue'
import { registerMicroApps, loadMicroApp } from 'qiankun'

interface SubApp {
  name: string
  entry: string
  container: string
  activeRule: string
  status: 'loading' | 'loaded' | 'error' | 'notloaded'
}

const router = useRouter()
const store = useMainStore()

const showAddDialog = ref(false)
const newApp = reactive({
  name: '',
  entry: '',
  container: '#sub-app-container',
  activeRule: ''
})

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    loading: 'info',
    loaded: 'success',
    error: 'danger',
    notloaded: 'warning'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    loading: '加载中',
    loaded: '已加载',
    error: '错误',
    notloaded: '未加载'
  }
  return map[status] || '未知'
}

const navigateToApp = (app: SubApp) => {
  router.push(`/apps/${app.name}`)
}

const reloadApp = (app: SubApp) => {
  store.updateSubAppStatus(app.name, 'loading')
  setTimeout(() => {
    store.updateSubAppStatus(app.name, 'loaded')
  }, 1000)
}

const removeApp = (app: SubApp) => {
  const index = store.subApps.findIndex(a => a.name === app.name)
  if (index > -1) {
    store.subApps.splice(index, 1)
  }
}

const addApp = () => {
  const app: SubApp = {
    name: newApp.name,
    entry: newApp.entry,
    container: newApp.container,
    activeRule: newApp.activeRule,
    status: 'notloaded'
  }
  
  store.subApps.push(app)
  
  try {
    registerMicroApps([{
      name: app.name,
      entry: new AppEntry(),
      container: app.container,
      activeRule: app.activeRule
    }])
    
    const microApp = loadMicroApp({
      name: app.name,
      entry: newApp.entry,
      container: app.container
    })
    
    microApp.mountPromise.then(() => {
      store.updateSubAppStatus(app.name, 'loaded')
    }).catch(() => {
      store.updateSubAppStatus(app.name, 'error')
    })
  } catch (error) {
    console.error('注册子应用失败:', error)
  }
  
  showAddDialog.value = false
  Object.assign(newApp, {
    name: '',
    entry: '',
    container: '#sub-app-container',
    activeRule: ''
  })
}
</script>

<style lang="scss" scoped>
.apps-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
