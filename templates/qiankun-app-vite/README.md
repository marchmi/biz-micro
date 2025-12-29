# Qiankun主应用模板

这是一个基于Vue 3 + TypeScript + Vite + Qiankun的主应用模板，用于管理多个qiankun子应用。本模板提供了完整的微前端架构实现，包括子应用注册、路由集成、状态通信等功能。

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
├── components/      # 公共组件，可被主应用和子应用共享使用
├── hooks/           # 组合式函数，封装可复用的逻辑
├── router/          # 路由配置，主应用自身的路由管理
├── store/           # Pinia状态管理，主应用全局状态
├── styles/          # 样式文件，包括全局样式和变量
├── types/           # TypeScript类型定义
├── utils/           # 工具函数，包括qiankun相关工具
├── views/           # 页面组件
│   ├── apps/        # 子应用管理页面
│   ├── communication/  # 通信示例页面
│   ├── home/        # 首页
│   └── settings/    # 设置页面
├── App.vue          # 根组件
├── main.ts          # 入口文件
└── env.d.ts         # 类型声明
```

## 子应用注册

### 静态注册

在应用启动时注册子应用，编辑src/main.ts文件：

```typescript
import { registerMicroApps, start } from 'qiankun'

registerMicroApps(
  [
    {
      name: 'child-app-one',
      entry: '//localhost:3001',
      container: '#sub-app-container',
      activeRule: '/app/child-app-one',
      props: {
        msg: '来自主应用的数据'
      }
    },
    {
      name: 'child-app-two',
      entry: '//localhost:3002',
      container: '#sub-app-container',
      activeRule: '/app/child-app-two'
    }
  ],
  {
    beforeLoad: (app) => {
      console.log('[qiankun] before load', app.name)
      return Promise.resolve()
    },
    beforeMount: (app) => {
      console.log('[qiankun] before mount', app.name)
      return Promise.resolve()
    },
    afterMount: (app) => {
      console.log('[qiankun] after mount', app.name)
      return Promise.resolve()
    },
    afterUnmount: (app) => {
      console.log('[qiankun] after unmount', app.name)
      return Promise.resolve()
    }
  }
)

start({
  prefetch: true,
  sandbox: {
    strictStyleIsolation: true,
    experimentalStyleIsolation: true
  }
})
```

### 运行时添加子应用

使用loadMicroApp方法动态添加子应用：

```typescript
import { loadMicroApp } from 'qiankun'

const app = loadMicroApp({
  name: 'dynamic-app',
  entry: '//localhost:3003',
  container: '#sub-app-container',
  props: {
    initialData: '动态传入的数据'
  }
})

// 卸载子应用
app.unmount()
```

### 运行时移除子应用

```typescript
import { loadMicroApp } from 'qiankun'

const subApps = new Map()

function addSubApp(name, entry) {
  const app = loadMicroApp({
    name,
    entry,
    container: '#sub-app-container'
  })
  subApps.set(name, app)
}

function removeSubApp(name) {
  const app = subApps.get(name)
  if (app) {
    app.unmount()
    subApps.delete(name)
  }
}
```

## 子应用管理

### 添加子应用

在子应用管理页面（/apps），点击"添加子应用"按钮，填写子应用名称和URL：

- 应用名称：子应用的唯一标识
- 应用地址：子应用的访问地址，如//localhost:3001

### 访问子应用

在子应用列表中，点击"访问"按钮可进入子应用预览页面。子应用将以iframe形式嵌入到主应用中，用户可以在同一个页面中体验子应用的功能。

### 移除子应用

在子应用列表中，点击"移除"按钮可删除该子应用的配置。移除操作不会影响子应用本身，只会删除主应用中的注册信息。

## 状态通信

### 主应用设置状态

```typescript
import { qiankunActions, setMainState } from '@/utils/qiankun'

// 设置单个状态
setMainState('user', { name: '张三', id: 1 })

// 设置多个状态
qiankunActions.setGlobalState({
  theme: 'dark',
  language: 'zh-CN',
  _timestamp: Date.now()
})
```

### 主应用监听状态变化

```typescript
import { onQiankunStateChange } from '@/utils/qiankun'

onQiankunStateChange((state, prevState) => {
  console.log('新状态:', state)
  console.log('之前状态:', prevState)
})
```

### 向子应用传递数据

通过props属性向子应用传递初始化数据：

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

子应用在mount函数中接收props参数：

```typescript
export async function mount(props) {
  const app = createApp(App)
  app.provide('mainAppData', props)
  app.mount('#sub-app')
}
```

## 路由配置

### 主应用路由

主应用自身的路由用于管理主应用的页面，如首页、设置页等。子应用的路由通过activeRule配置在qiankun中管理。

```typescript
const routes = [
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
```

### 子应用激活规则

activeRule用于指定子应用的激活条件，支持以下几种格式：

- 前缀匹配：'/app/child'，当路由以/app/child开头时激活
- 函数匹配：(location) => location.pathname.startsWith('/app/child')
- 数组规则：['/app/child1', '/app/child2']

```typescript
// 前缀匹配
{ activeRule: '/app/child' }

// 函数匹配
{ activeRule: (location) => location.pathname.startsWith('/app/child') }

// 多路径匹配
{ activeRule: ['/app/child1', '/app/child2'] }
```

## 环境配置

### 开发环境变量

在.env.development文件中配置开发环境参数：

```env
VITE_APP_TITLE=Qiankun主应用
VITE_APP_BASE_URL=/
VITE_APP_NAME=main-app
VITE_APP_ENTRY=/
VITE_APP_PORT=3000
```

### 生产环境变量

在.env.production文件中配置生产环境参数：

```env
VITE_APP_TITLE=Qiankun主应用
VITE_APP_BASE_URL=/
VITE_APP_NAME=main-app
VITE_APP_ENTRY=/
```

### 配置说明

- VITE_APP_TITLE：应用标题，显示在浏览器标签页
- VITE_APP_BASE_URL：应用基础路径
- VITE_APP_NAME：应用名称，qiankun用于标识应用
- VITE_APP_ENTRY：入口路径
- VITE_APP_PORT：开发服务器端口号

## 构建部署

```bash
# 生产环境构建
npm run build

# 构建产物在 dist 目录
# 部署时需要确保主应用和子应用能够正确通信
```

## 依赖说明

- Vue 3.4 - 渐进式JavaScript框架
- TypeScript 5.3 - 类型安全的JavaScript超集
- Vite 5.0 - 下一代前端构建工具
- Pinia 2.1 - Vue状态管理
- Element Plus 2.4 - Vue 3 UI组件库
- Vue Router 4.2 - Vue官方路由
- Qiankun 2.x - 微前端框架

## 子应用要求

### 生命周期函数

qiankun子应用需要导出以下生命周期函数：

```typescript
export async function bootstrap() {
  // 初始化逻辑，只执行一次
}

export async function mount(props) {
  // 挂载逻辑，每次加载都会执行
  renderApp(props)
}

export async function unmount() {
  // 卸载逻辑
  unmountApp()
}
```

### 路由配置

子应用需要支持带basename的路由模式：

```typescript
import { createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/child-app'),
  routes: [...]
})
```

### 样式隔离

qiankun提供了两种样式隔离策略：

```typescript
start({
  sandbox: {
    strictStyleIsolation: true,    // 严格样式隔离
    experimentalStyleIsolation: true  // 实验性样式隔离
  }
})
```

## 常见问题

### 子应用加载失败

检查以下几点：

- 子应用开发服务器是否正常运行
- 子应用的入口地址是否正确
- 是否存在跨域问题（CORS配置）
- 浏览器控制台是否有错误信息

### 样式冲突

如果发现样式污染问题：

- 开启严格样式隔离
- 子应用使用scoped样式
- 避免使用全局选择器

### 状态不同步

确保正确实现了状态通信：

- 主应用使用setMainState设置状态
- 子应用使用onQiankunStateChange监听状态变化
- 检查_timestamp字段是否正确更新

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
