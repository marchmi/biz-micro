# Qiankun子应用模板

这是一个基于Vue 3 + TypeScript + Vite + Qiankun的子应用模板。本模板符合qiankun微前端框架的规范，可以被qiankun主应用加载和管理。模板提供了完整的生命周期实现、路由配置、状态管理等基础功能。

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
├── components/      # 公共组件
├── hooks/           # 组合式函数，封装可复用的逻辑
├── router/          # 路由配置
├── store/           # Pinia状态管理
├── styles/          # 样式文件，包括全局样式和变量
├── types/           # TypeScript类型定义
├── utils/           # 工具函数
├── views/           # 页面组件
│   ├── about/       # 关于页面
│   └── home/        # 首页
├── App.vue          # 根组件
├── main.ts          # 入口文件，导出qiankun生命周期
└── env.d.ts         # 类型声明
```

## 生命周期函数

子应用需要正确导出qiankun规定的生命周期函数，这是子应用能够被主应用正确管理的基础。以下是各生命周期的作用和实现方式。

### bootstrap函数

bootstrap函数在子应用首次加载时调用，只会被调用一次。在这个函数中，应该执行子应用的初始化操作，如创建Vue应用实例、初始化Pinia状态、注册全局组件等只执行一次的操作。

```typescript
export async function bootstrap() {
  console.log('[子应用] qiankun bootstrap')
}
```

### mount函数

mount函数在子应用需要渲染时调用，每次子应用从隐藏切换到显示时都会触发。在这个函数中，应该将子应用挂载到指定的DOM节点，渲染页面内容。props参数包含主应用传递过来的数据。

```typescript
export async function mount(props) {
  console.log('[子应用] qiankun mount', props)

  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#sub-app')
}
```

props可包含以下属性：

- container：子应用的挂载容器元素
- data：主应用传递的数据
- onGlobalStateChange：状态变化监听函数
- setGlobalState：设置全局状态函数

### unmount函数

unmount函数在子应用需要卸载时调用，每次子应用从显示切换到隐藏时会触发。在这个函数中，应该执行子应用的清理操作，如取消事件监听、清空定时器、卸载Vue应用实例等。

```typescript
export async function unmount() {
  console.log('[子应用] qiankun unmount')

  if (app) {
    app.unmount()
    app = null
  }
}
```

### 完整示例

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/index.scss'

let app: ReturnType<typeof createApp> | null = null

async function bootstrap() {
  console.log('[子应用] qiankun bootstrap')
}

async function mount(props: Record<string, unknown>) {
  console.log('[子应用] qiankun mount', props)

  app = createApp(App)
  app.use(createPinia())
  app.use(router)

  // 接收主应用传递的数据
  if (props.data) {
    console.log('[子应用] 收到主应用数据:', props.data)
  }

  app.mount('#sub-app')
}

async function unmount() {
  console.log('[子应用] qiankun unmount')

  if (app) {
    app.unmount()
    app = null
  }
}

if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}

export { bootstrap, mount, unmount }
```

## 路由配置

### 基础配置

子应用的路由需要支持两种运行模式：独立运行和被主应用加载。这通过配置basename来实现，basename的值通过环境变量导入。

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
    path: '/about',
    name: 'About',
    component: () => import('@/views/about/index.vue'),
    meta: { title: '关于' }
  }
]

const router = createRouter({
  history: createWebHistory(
    import.meta.env.VITE_APP_BASE_URL || '/'
  ),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) || 
    import.meta.env.VITE_APP_TITLE || 
    '子应用'
  next()
})

export default router
```

### 环境变量配置

在.env.development文件中配置独立运行时的路由基础路径：

```env
VITE_APP_TITLE=我的子应用
VITE_APP_BASE_URL=/
VITE_APP_PORT=3001
```

在.env.production文件中配置生产环境的路由基础路径：

```env
VITE_APP_TITLE=我的子应用
VITE_APP_BASE_URL=/child-app/
```

### 独立运行与加载运行

当子应用独立运行时，VITE_APP_BASE_URL设置为空或'/'，路由使用根路径。当子应用被主应用加载时，VITE_APP_BASE_URL需要设置为子应用在主应用中的路由前缀，例如'/child-app/'。

## 状态管理

### 独立状态管理

子应用可以使用Pinia进行独立的状态管理，子应用拥有自己独立的状态空间，与主应用和其他子应用隔离。

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSubStore = defineStore('sub', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

### 主应用状态通信

子应用可以与主应用进行状态通信，读取和修改主应用共享的状态。

```typescript
import { initGlobalState, onGlobalStateChange, setGlobalState } from 'qiankun'

const qiankunState: Record<string, unknown> = {}

export const qiankunActions = initGlobalState(qiankunState)

export function onMainStateChange(
  callback: (state: Record<string, unknown>, prevState: Record<string, unknown>) => void
) {
  qiankunActions.onGlobalStateChange(callback, true)
}

export function setMainState(key: string, value: unknown) {
  qiankunActions.setGlobalState({
    ...qiankunState,
    [key]: value,
    _timestamp: Date.now()
  })
}

// 使用示例
onMainStateChange((state, prevState) => {
  console.log('主应用状态变化:', state)
})
```

## 通信机制

### 接收主应用数据

主应用可以通过props向子应用传递初始化数据，子应用在mount函数中接收：

```typescript
async function mount(props: Record<string, unknown>) {
  console.log('[子应用] 收到主应用数据:', props.data)
}
```

主应用注册时配置props：

```typescript
registerMicroApps(
  [
    {
      name: 'child-app',
      entry: '//localhost:3001',
      container: '#sub-app-container',
      activeRule: '/app/child-app',
      props: {
        msg: '来自主应用的消息',
        userInfo: { name: '主应用用户' }
      }
    }
  ]
)
```

### 事件通信

使用qiankun的GlobalState机制进行状态同步，也可以通过window.postMessage进行消息传递。

主应用发送消息：

```typescript
import { setMainState } from '@/utils/qiankun'

setMainState('message', { type: 'greeting', content: '你好' })
```

子应用接收消息：

```typescript
import { onMainStateChange } from '@/utils/qiankun'

onMainStateChange((state, prevState) => {
  if (state.message) {
    console.log('收到消息:', state.message)
  }
})
```

## 环境配置

### 开发环境变量

在.env.development文件中配置：

```env
VITE_APP_TITLE=子应用名称
VITE_APP_BASE_URL=/           # 独立运行时的基础路径
VITE_APP_NAME=sub-app         # 子应用名称
VITE_APP_PORT=3001            # 开发服务器端口
```

### 生产环境变量

在.env.production文件中配置：

```env
VITE_APP_TITLE=子应用名称
VITE_APP_BASE_URL=/child-app/  # 被主应用加载时的基础路径
VITE_APP_NAME=sub-app
```

## 挂载点配置

子应用的挂载点应该与主应用配置的container选择器对应。默认使用#sub-app作为挂载点。

```typescript
// 子应用main.ts
app.mount('#sub-app')

// 主应用注册时的container
{
  container: '#sub-app-container'
}
```

在子应用的index.html中需要有这个挂载点元素：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>子应用</title>
  </head>
  <body>
    <div id="sub-app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

## 构建部署

### 生产环境构建

```bash
npm run build

# 构建产物在 dist 目录
```

### 构建配置

Vite构建配置已优化，支持按需打包：

```typescript
// vite.config.ts
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  return {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'element-plus': ['element-plus'],
            'vue': ['vue', 'vue-router', 'pinia']
          }
        }
      }
    }
  }
})
```

### 部署注意事项

- 确保子应用部署后能够被主应用访问
- 正确配置CORS头，允许主应用域名访问
- 如果使用CDN，需要正确设置资源路径

## 依赖说明

- Vue 3.4 - 渐进式JavaScript框架
- TypeScript 5.3 - 类型安全的JavaScript超集
- Vite 5.0 - 下一代前端构建工具
- Pinia 2.1 - Vue状态管理
- Element Plus 2.4 - Vue 3 UI组件库
- Vue Router 4.2 - Vue官方路由
- Qiankun 2.x - 微前端框架子应用适配

## 主应用注册配置

在主应用中注册此子应用时，需要配置以下参数：

```typescript
import { registerMicroApps } from 'qiankun'

registerMicroApps(
  [
    {
      name: 'my-sub-app',
      entry: '//localhost:3001',  // 子应用入口地址
      container: '#sub-app-container',  // 挂载容器
      activeRule: '/app/my-sub-app',  // 激活规则
      props: {
        msg: '来自主应用的数据'
      }
    }
  ]
)
```

### 参数说明

- name：子应用的唯一标识，不能与其他子应用重复
- entry：子应用的入口地址，开发环境使用localhost地址
- container：子应用在主应用中的挂载点选择器
- activeRule：子应用的激活规则，支持路由前缀匹配
- props：传递给子应用的初始化数据

## 独立运行

子应用可以独立运行进行开发和调试：

```bash
npm run dev
```

独立运行时，子应用将作为一个完整的Vue应用运行，路由使用根路径。可以通过调整环境变量VITE_APP_BASE_URL来测试不同的部署场景。

## 常见问题

### 样式冲突

如果子应用样式影响了主应用或其他子应用：

- 确保主应用开启了样式隔离
- 子应用使用scoped样式
- 避免使用全局CSS选择器

### 资源加载失败

如果子应用静态资源加载失败：

- 检查是否正确配置了public path
- 确保CORS配置正确
- 检查资源路径是否正确

### 状态不共享

如果需要与主应用共享状态：

- 使用qiankun的GlobalState机制
- 正确导出和使用生命周期函数
- 确保主应用已初始化共享状态

### 路由异常

如果路由跳转异常：

- 检查VITE_APP_BASE_URL配置
- 确认路由basename设置正确
- 验证activeRule与路由前缀匹配

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
