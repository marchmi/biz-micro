# Wujie主应用模板

这是一个基于Vue 3 + TypeScript + Vite + Wujie的主应用模板，用于管理和加载多个wujie子应用。Wujie采用轻量级的类iframe方案，提供了良好的兼容性和较低的侵入性，子应用无需修改即可直接接入。本模板提供了完整的子应用管理、通信同步、状态共享等功能实现。

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

## 目录结构

```
src/
├── assets/          # 静态资源，如图片、字体等
├── components/      # 公共组件，可被主应用使用
├── hooks/           # 组合式函数，封装可复用的逻辑
├── router/          # 路由配置，主应用自身的路由管理
├── store/           # Pinia状态管理，主应用全局状态
├── styles/          # 样式文件，包括全局样式和变量
├── types/           # TypeScript类型定义
├── utils/           # 工具函数，包括通信总线等
├── views/           # 页面组件
│   ├── apps/        # 子应用管理页面和子应用预览组件
│   ├── communication/  # 通信示例页面
│   ├── home/        # 首页
│   └── settings/    # 设置页面
├── App.vue          # 根组件
├── main.ts          # 入口文件
└── env.d.ts         # 类型声明
```

## 子应用集成

### 使用WujieVue3组件

Wujie通过WujieVue3组件来集成子应用，这个组件提供了丰富的属性和事件控制。以下是基本用法：

```vue
<template>
  <div class="sub-app-container">
    <WujieVue3
      width="100%"
      height="100%"
      :name="appName"
      :url="appUrl"
      :sync="true"
      @beforeLoad="handleBeforeLoad"
      @beforeMount="handleBeforeMount"
      @afterMount="handleAfterMount"
      @beforeUnmount="handleBeforeUnmount"
      @afterUnmount="handleAfterUnmount"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMainStore } from '@/store'
import WujieVue3 from 'wujie-vue3'

const route = useRoute()
const store = useMainStore()

const appName = computed(() => route.params.name as string)

const appUrl = computed(() => {
  const app = store.subApps.find(a => a.name === appName.value)
  return app?.url || ''
})

const handleBeforeLoad = () => {
  console.log('[主应用] 子应用加载前:', appName.value)
}

const handleBeforeMount = () => {
  console.log('[主应用] 子应用挂载前:', appName.value)
}

const handleAfterMount = () => {
  console.log('[主应用] 子应用挂载后:', appName.value)
}

const handleBeforeUnmount = () => {
  console.log('[主应用] 子应用卸载前:', appName.value)
}

const handleAfterUnmount = () => {
  console.log('[主应用] 子应用卸载后:', appName.value)
}
</script>
```

### WujieVue3组件属性

| 属性 | 类型 | 说明 |
|------|------|------|
| name | string | 子应用名称，用于标识和缓存 |
| url | string | 子应用地址 |
| width | string | 容器宽度 |
| height | string | 容器高度 |
| sync | boolean | 是否开启数据同步 |
| alive | boolean | 是否保持子应用存活 |

### WujieVue3组件事件

| 事件 | 说明 |
|------|------|
| beforeLoad | 子应用加载前触发 |
| beforeMount | 子应用挂载前触发 |
| afterMount | 子应用挂载后触发 |
| beforeUnmount | 子应用卸载前触发 |
| afterUnmount | 子应用卸载后触发 |

## 子应用管理

### 添加子应用

在子应用管理页面（/apps），点击"添加子应用"按钮，填写子应用信息：

```vue
<template>
  <el-dialog v-model="showAddDialog" title="添加子应用" width="500px">
    <el-form :model="newApp" label-width="100px">
      <el-form-item label="应用名称">
        <el-input v-model="newApp.name" placeholder="请输入应用名称" />
      </el-form-item>
      <el-form-item label="应用地址">
        <el-input v-model="newApp.url" placeholder="如：//localhost:3001" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showAddDialog = false">取消</el-button>
      <el-button type="primary" @click="addApp">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useMainStore } from '@/store'

interface SubApp {
  name: string
  url: string
  status: 'loading' | 'loaded' | 'error' | 'notloaded'
}

const store = useMainStore()
const showAddDialog = ref(false)
const newApp = reactive({ name: '', url: '' })

const addApp = () => {
  const app: SubApp = {
    name: newApp.name,
    url: newApp.url,
    status: 'notloaded'
  }
  store.subApps.push(app)
  showAddDialog.value = false
  Object.assign(newApp, { name: '', url: '' })
}
</script>
```

### 子应用列表

子应用列表展示已添加的所有子应用：

```vue
<template>
  <el-table :data="store.subApps" style="width: 100%">
    <el-table-column prop="name" label="应用名称" width="180" />
    <el-table-column prop="url" label="应用地址" width="250">
      <template #default="{ row }">
        <el-link type="primary" :href="row.url" target="_blank">
          {{ row.url }}
        </el-link>
      </template>
    </el-table-column>
    <el-table-column prop="status" label="状态" width="120">
      <template #default="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="200">
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
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useMainStore } from '@/store'

const router = useRouter()
const store = useMainStore()

const navigateToApp = (app: { name: string }) => {
  router.push(`/apps/${app.name}`)
}

const reloadApp = (app: { name: string }) => {
  store.updateSubAppStatus(app.name, 'loading')
  setTimeout(() => {
    store.updateSubAppStatus(app.name, 'loaded')
  }, 1000)
}

const removeApp = (app: { name: string }) => {
  const index = store.subApps.findIndex(a => a.name === app.name)
  if (index > -1) {
    store.subApps.splice(index, 1)
  }
}

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
</script>
```

### 访问子应用

在子应用列表中点击"访问"按钮，可以进入子应用预览页面。子应用将以WujieVue3组件的形式嵌入到主应用中，用户可以在主应用界面中体验子应用的功能。

预览页面提供了刷新和新窗口打开两个额外操作：

```vue
<template>
  <el-page-header @back="goBack">
    <template #content>
      <span class="page-title">{{ appName }} - 子应用预览</span>
    </template>
    <template #extra>
      <el-button @click="refreshApp">刷新</el-button>
      <el-button type="primary" @click="openNewTab">新窗口打开</el-button>
    </template>
  </el-page-header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/store'

const route = useRoute()
const router = useRouter()
const store = useMainStore()

const appName = computed(() => route.params.name as string)
const appUrl = computed(() => {
  const app = store.subApps.find(a => a.name === appName.value)
  return app?.url || ''
})

const goBack = () => router.push('/apps')

const refreshApp = () => window.location.reload()

const openNewTab = () => {
  if (appUrl.value) {
    window.open(appUrl.value, '_blank')
  }
}
</script>
```

## 通信机制

### 数据同步

Wujie支持主应用与子应用之间的数据同步，通过设置sync属性启用：

```vue
<WujieVue3 :sync="true" ... />
```

启用后，主应用window对象上的属性会自动同步到子应用。子应用可以通过以下方式访问主应用数据：

```typescript
// 子应用访问主应用数据
const mainAppData = window.parent.someData

// 子应用修改数据同步到主应用
window.parent.someData = { key: 'value' }
```

### 事件通信

使用window.postMessage进行消息传递：

主应用发送消息：

```typescript
function sendMessageToChild(payload: unknown) {
  window.parent.postMessage({
    type: 'FROM_MAIN',
    payload
  }, '*')
}
```

子应用接收消息：

```typescript
// 子应用监听主应用消息
window.addEventListener('message', (event) => {
  if (event.data?.type === 'FROM_MAIN') {
    console.log('收到主应用消息:', event.data.payload)
  }
})

// 子应用发送消息到主应用
window.parent.postMessage({
  type: 'FROM_CHILD',
  payload: '来自子应用的消息'
}, '*')
```

### 通信总线

本模板提供了通信总线工具，简化主应用与子应用的通信：

```typescript
import { mainEventBus, childEventBus } from '@/utils/bus'

// 主应用监听子应用消息
mainEventBus.on('childMessage', (payload) => {
  console.log('收到子应用消息:', payload)
})

// 主应用发送消息到子应用
mainEventBus.emit('mainMessage', { data: '来自主应用' })
```

子应用使用方式类似，通过本地的childEventBus进行通信。

## 状态管理

### 主应用状态

主应用使用Pinia进行状态管理，子应用列表和状态信息存储在store中：

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface SubApp {
  name: string
  url: string
  status: 'loading' | 'loaded' | 'error' | 'notloaded'
}

export const useMainStore = defineStore('main', () => {
  const subApps = ref<SubApp[]>([])

  function addSubApp(app: SubApp) {
    subApps.value.push(app)
  }

  function removeSubApp(name: string) {
    const index = subApps.value.findIndex(a => a.name === name)
    if (index > -1) {
      subApps.value.splice(index, 1)
    }
  }

  function updateSubAppStatus(name: string, status: SubApp['status']) {
    const app = subApps.value.find(a => a.name === name)
    if (app) {
      app.status = status
    }
  }

  return { subApps, addSubApp, removeSubApp, updateSubAppStatus }
})
```

### 跨应用状态共享

Wujie支持通过多种方式进行状态共享：

```typescript
// 方法一：利用sync属性同步window对象
// 在主应用设置
window.sharedData = { theme: 'dark' }

// 在子应用读取
const data = window.parent.sharedData

// 方法二：利用props传递初始化数据
<WujieVue3 :props="{ initialData }" ... />

// 方法三：利用通信机制传递状态
mainEventBus.emit('stateChange', newState)
```

## 路由配置

### 主应用路由

主应用自身的路由配置：

```typescript
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/apps',
    name: 'Apps',
    component: () => import('@/views/apps/index.vue'),
    meta: { title: '子应用管理' }
  },
  {
    path: '/apps/:name',
    name: 'SubApp',
    component: () => import('@/views/apps/SubApp.vue'),
    meta: { title: '子应用预览' }
  },
  {
    path: '/communication',
    name: 'Communication',
    component: () => import('@/views/communication/index.vue'),
    meta: { title: '通信示例' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/settings/index.vue'),
    meta: { title: '设置' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

export default router
```

### 子应用路由

子应用需要配置带basename的路由，basename为子应用在主应用中的访问路径前缀。

## 环境配置

### 开发环境变量

在.env.development文件中配置：

```env
VITE_APP_TITLE=Wujie主应用
VITE_APP_BASE_URL=/
VITE_APP_PORT=3000
```

### 生产环境变量

在.env.production文件中配置：

```env
VITE_APP_TITLE=Wujie主应用
VITE_APP_BASE_URL=/
```

### 配置说明

- VITE_APP_TITLE：应用标题
- VITE_APP_BASE_URL：路由基础路径
- VITE_APP_PORT：开发服务器端口

## 构建部署

```bash
# 生产环境构建
npm run build

# 构建产物在 dist 目录
```

### 构建优化

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => {
  return {
    build: {
      target: 'es2015',
      rollupOptions: {
        output: {
          manualChunks: {
            'element-plus': ['element-plus'],
            'vue': ['vue', 'vue-router', 'pinia'],
            'wujie': ['wujie-vue3']
          }
        }
      }
    }
  }
})
```

## 依赖说明

- Vue 3.4 - 渐进式JavaScript框架
- TypeScript 5.3 - 类型安全的JavaScript超集
- Vite 5.0 - 下一代前端构建工具
- Pinia 2.1 - Vue状态管理
- Element Plus 2.4 - Vue 3 UI组件库
- Vue Router 4.2 - Vue官方路由
- Wujie-Vue3 1.0.x - 微前端框架

## 子应用要求

### 基本要求

Wujie对子应用的要求相对宽松，大多数情况下子应用无需修改即可直接使用。但需要注意以下几点：

子应用的开发服务器必须正确配置CORS头，允许来自主应用域名的跨域请求：

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    port: 3001,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  }
})
```

### 路由配置

子应用路由应该使用带basename的history模式：

```typescript
import { createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL || '/'),
  routes: [...]
})
```

### 挂载点

子应用使用默认的#app作为挂载点：

```typescript
app.mount('#app')
```

## 常见问题

### 子应用加载失败

检查以下几点：

- 子应用开发服务器是否正常运行
- 子应用的URL是否正确
- 是否存在跨域问题（CORS配置）
- WujieVue3组件的name和url属性是否正确设置

### 样式隔离

Wujie使用Web Component技术实现样式隔离，子应用样式默认被封装在shadow root中。如果需要子应用样式影响主应用，可以使用:host选择器或配置透传。

### 通信问题

如果主应用与子应用通信失败：

- 检查sync属性是否启用
- 验证postMessage的目标来源
- 确认消息格式正确

### 状态不同步

确保正确配置了状态同步机制：

- sync属性设置为true
- 使用正确的通信API
- 验证数据格式兼容性

## 脚手架工具使用

本项目支持使用脚手架工具进行模板生成、测试和发布。

### 初始化脚手架

```bash
# 在项目根目录安装依赖
npm install

# 构建所有模板
npm run build:templates

# 运行测试
npm run test
```

### 生成新模板项目

```bash
# 生成qiankun主应用
npm run generate -- --template qiankun-app --name my-qiankun-app

# 生成qiankun子应用
npm run generate -- --template qiankun-sub-app --name my-sub-app

# 生成wujie主应用
npm run generate -- --template wujie-app --name my-wujie-app

# 生成wujie子应用
npm run generate -- --template wujie-sub-app --name my-sub-app
```

### 脚手架命令说明

| 命令 | 说明 |
|------|------|
| npm run build:templates | 构建所有模板项目 |
| npm run test | 运行测试用例 |
| npm run test:unit | 运行单元测试 |
| npm run test:e2e | 运行端到端测试 |
| npm run lint | 代码检查 |
| npm run lint:fix | 代码检查并自动修复 |

## 测试

### 单元测试

```bash
# 运行所有单元测试
npm run test:unit

# 运行指定测试文件
npm run test:unit -- tests/example.spec.ts

# 生成测试覆盖率报告
npm run test:unit -- --coverage
```

### 端到端测试

```bash
# 安装Playwright浏览器
npm run test:install

# 运行端到端测试
npm run test:e2e

# 运行指定测试
npm run test:e2e -- tests/app.spec.ts
```

### 测试配置

测试配置文件位于项目根目录：

- vitest.config.ts - Vitest单元测试配置
- playwright.config.ts - Playwright端到端测试配置

## NPM发布

### 发布前准备

```bash
# 1. 更新版本号
npm version patch|minor|major

# 2. 运行测试
npm run test

# 3. 运行代码检查
npm run lint

# 4. 构建模板
npm run build:templates
```

### 发布到NPM

```bash
# 登录NPM
npm login

# 发布包
npm publish

# 发布到私有仓库
npm publish --registry=https://registry.npmjs.org/
```

## 许可证

本项目基于MIT许可证开源。
