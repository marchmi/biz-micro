# Biz Micro - 微前端模板项目

一个完整的微前端模板项目，支持Qiankun和Wujie两大主流微前端框架，提供主应用和子应用的完整模板。

## 项目结构

```
biz-micro/
├── bin/                    # 脚手架工具
│   ├── biz-micro.ts       # TypeScript源码
│   └── biz-micro.js       # 编译后代码
├── templates/             # 模板目录
│   ├── qiankun-app-vite/  # Qiankun主应用模板
│   ├── qiankun-sub-app-vite/  # Qiankun子应用模板
│   ├── wujie-app-vite/    # Wujie主应用模板
│   └── wujie-sub-app-vite/    # Wujie子应用模板
├── package.json
└── tsconfig.json
```

## 模板预览

### Qiankun主应用模板

Qiankun主应用模板提供了完整的微前端管理界面：

| 功能 | 说明 |
|------|------|
| 子应用管理 | 添加、删除、加载子应用 |
| 仪表盘 | 展示系统运行状态和统计数据 |
| 通信管理 | 主应用与子应用之间的消息传递 |
| 系统设置 | 应用配置和主题设置 |

**技术栈**：
- Vue 3 + TypeScript
- Vite 5.0
- Pinia 2.1
- Element Plus - Qian2.4
kun 2.x

### Qiankun子应用模板

Qiankun子应用模板支持独立运行和作为子应用嵌入：

- 独立的路由配置
- 状态管理与主应用隔离
- Qiankun生命周期钩子
- 主应用通信支持

**技术栈**：
- Vue 3 + TypeScript
- Vite 5.0
- Pinia 2.1
- Element Plus 2.4

### Wujie主应用模板

Wujie主应用模板提供了完整的微前端管理功能：

| 功能 | 说明 |
|------|------|
| 子应用管理 | Wujie子应用配置和管理 |
| 仪表盘 | 系统运行状态和数据统计 |
| 通信管理 | 基于事件总线的通信机制 |
| 系统设置 | 应用配置和主题设置 |

**技术栈**：
- Vue 3 + TypeScript
- Vite 5.0
- Pinia 2.1
- Element Plus 2.4
- Wujie-Vue3 1.0

### Wujie子应用模板

Wujie子应用模板专门为Wujie微前端设计：

- 独立的运行能力
- Wujie通信总线封装
- 生命周期管理
- 与主应用无缝通信

**技术栈**：
- Vue 3 + TypeScript
- Vite 5.0
- Pinia 2.1
- Element Plus 2.4
- Wujie-Vue3 1.0

## 快速开始

### 方式一：使用脚手架生成项目

```bash
# 全局安装脚手架
npm install -g biz-micro

# 生成项目
biz-micro generate --template qiankun-app --name my-project
biz-micro generate --template wujie-app --name my-project
```

### 方式二：直接使用模板

```bash
# 克隆模板
git clone https://github.com/your-repo/qiankun-app-vite.git my-project
git clone https://github.com/your-repo/wujie-app-vite.git my-project

# 安装依赖
cd my-project
npm install

# 启动开发服务器
npm run dev
```

### 方式三：本地复制模板

```bash
# 复制模板到当前目录
cp -r templates/qiankun-app-vite ./my-qiankun-app
cp -r templates/wujie-app-vite ./my-wujie-app
cp -r templates/qiankun-sub-app-vite ./my-sub-app
cp -r templates/wujie-sub-app-vite ./my-sub-app
```

## 脚手架工具

### 安装

```bash
# 从源码安装
npm install
npm run build
npm link
```

### 使用命令

| 命令 | 说明 |
|------|------|
| `biz-micro list` | 列出所有可用模板 |
| `biz-micro generate -t <template> -n <name>` | 生成项目 |
| `biz-micro preview -t <template>` | 预览模板 |
| `biz-micro publish -t <template>` | 发布模板到NPM |

### 生成示例

```bash
# 生成Qiankun主应用
biz-micro generate --template qiankun-app --name my-qiankun-app

# 生成Qiankun子应用
biz-micro generate --template qiankun-sub-app --name my-sub-app

# 生成Wujie主应用
biz-micro generate --template wujie-app --name my-wujie-app

# 生成Wujie子应用
biz-micro generate --template wujie-sub-app --name my-sub-app
```

## 开发指南

### Qiankun主应用开发

```typescript
// 注册子应用
import { registerMicroApps, start } from 'qiankun'

registerMicroApps([
  {
    name: 'react-app',
    entry: '//localhost:3000',
    container: '#container',
    activeRule: '/react'
  },
  {
    name: 'vue-app',
    entry: '//localhost:3001',
    container: '#container',
    activeRule: '/vue'
  }
])

start()
```

### Wujie主应用开发

```vue
<template>
  <WujieVue3
    width="100%"
    height="100vh"
    name="my-sub-app"
    url="//localhost:3001"
    :sync="true"
  />
</template>

<script setup>
import WujieVue3 from 'wujie-vue3'
</script>
```

### 子应用通信

**Qiankun子应用**：

```typescript
import { initGlobalState } from 'qiankun'

const { onGlobalStateChange, setGlobalState } = initGlobalState({
  user: null
})

// 监听主应用状态变化
onGlobalStateChange((value, prev) => {
  console.log('状态变化:', value, prev)
})

// 设置状态
setGlobalState({
  user: { name: '子应用用户' }
})
```

**Wujie子应用**：

```typescript
import { busEmit, setupBusListener } from '@/utils/wujie-bus'

// 发送消息到主应用
busEmit('messageType', { key: 'value' })

// 接收主应用消息
const cleanup = setupBusListener((data) => {
  console.log('收到消息:', data)
})
```

## 测试

### 运行测试

```bash
# 运行所有测试
npm run test

# 单元测试
npm run test:unit

# 端到端测试
npm run test:e2e
```

### 测试覆盖

- 组件测试（Vitest）
- 集成测试
- E2E测试（Playwright）

## 构建部署

### 构建模板

```bash
# 构建所有模板
npm run build:templates

# 构建单个模板
cd templates/qiankun-app-vite
npm run build
```

### 生产部署

```bash
# 构建
npm run build

# 预览
npm run preview
```

## 模板对比

| 特性 | Qiankun | Wujie |
|------|---------|-------|
| 通信机制 | Global State + EventBus | EventBus |
| 沙箱机制 | Proxy + iframe | WebComponent + iframe |
| 样式隔离 | Scoped CSS + Shadow DOM | Shadow DOM |
| 预加载 | 自动预加载 | 手动配置 |
| 降级处理 | 自动降级 | 内置降级 |
| 通信延迟 | 较低 | 极低 |
| 浏览器兼容性 | 较好 | 依赖Proxy |

## 常见问题

### 1. 子应用无法加载

确保子应用已配置CORS：

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
})
```

### 2. 样式污染

为避免样式污染，建议：

- 使用Scoped CSS
- 使用CSS Modules
- 为子应用添加唯一前缀

### 3. 状态管理

主应用和子应用状态应隔离：

- 主应用状态管理全局配置
- 子应用管理自身业务状态
- 通过通信机制同步必要数据

### 4. 路由冲突

处理路由前缀避免冲突：

```typescript
// 子应用设置base
const router = createRouter({
  history: createWebHistory('/sub-app/'),
  routes: [...]
})
```

## 贡献指南

1. Fork本项目
2. 创建分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -m 'Add xxx'`)
4. 推送到分支 (`git push origin feature/xxx`)
5. 创建Pull Request

## 版本历史

### v1.0.0 (2024-12)

- 初始版本发布
- 支持Qiankun主应用和子应用模板
- 支持Wujie主应用和子应用模板
- 集成脚手架工具
- 完整的文档和测试

## 许可证

MIT License

## 联系方式

- 项目地址：https://github.com/your-repo/biz-micro
- 问题反馈：https://github.com/your-repo/biz-micro/issues
