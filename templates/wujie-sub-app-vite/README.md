# Wujie子应用模板

这是一个基于Vue 3 + TypeScript + Vite + Wujie的子应用模板。

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
├── assets/          # 静态资源
├── components/      # 公共组件
├── hooks/           # 组合式函数
├── router/          # 路由配置
├── store/           # Pinia状态管理
├── styles/          # 样式文件
├── types/           # TypeScript类型定义
├── utils/           # 工具函数
├── views/           # 页面组件
├── App.vue          # 根组件
├── main.ts          # 入口文件
└── env.d.ts         # 类型声明
```

## 与主应用通信

### 发送消息到主应用

```typescript
import { busEmit } from '@/utils/wujie-bus'

busEmit('messageType', { key: 'value' })
```

### 接收主应用消息

```typescript
import { setupBusListener } from '@/utils/wujie-bus'

const cleanup = setupBusListener((data) => {
  console.log('收到消息:', data)
})

// 清理监听器
cleanup()
```

## Wujie配置

在主应用中配置此子应用时，需要设置以下属性：

```javascript
{
  name: 'wujie-sub-app',
  url: 'http://localhost:3001',
  attrs: {
    // 子应用配置
  }
}
```

## 构建部署

```bash
# 生产环境构建
npm run build

# 构建产物在 dist 目录
```

## 依赖说明

- Vue 3.4 - 渐进式JavaScript框架
- TypeScript 5.3 - 类型安全的JavaScript超集
- Vite 5.0 - 下一代前端构建工具
- Pinia 2.1 - Vue状态管理
- Element Plus 2.4 - Vue 3 UI组件库
- Wujie-Vue3 1.0 - 微前端框架

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
| `npm run build:templates` | 构建所有模板项目 |
| `npm run test` | 运行测试用例 |
| `npm run test:unit` | 运行单元测试 |
| `npm run test:e2e` | 运行端到端测试 |
| `npm run lint` | 代码检查 |
| `npm run lint:fix` | 代码检查并自动修复 |

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

- `vitest.config.ts` - Vitest单元测试配置
- `playwright.config.ts` - Playwright端到端测试配置

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
npm publish --registry=https://your-private-registry.com
```

### 版本管理

本项目遵循语义化版本规范：

- **patch**: 修复bug
- **minor**: 新增功能（向后兼容）
- **major**: 破坏性变更

```bash
# 修复版本（1.0.0 -> 1.0.1）
npm version patch

# 次版本（1.0.0 -> 1.1.0）
npm version minor

# 主版本（1.0.0 -> 2.0.0）
npm version major
```

### 发布CI/CD配置

在项目根目录创建 `.github/workflows/publish.yml`：

```yaml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
      - run: npm run build:templates
      - run: npm run test
      
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 模板变量替换

脚手架在生成项目时会自动替换以下变量：

| 变量 | 说明 | 示例 |
|------|------|------|
| `{{name}}` | 项目名称 | my-wujie-app |
| `{{version}}` | 版本号 | 1.0.0 |
| `{{port}}` | 开发端口 | 3000 |
| `{{author}}` | 作者名称 | Your Name |
| `{{description}}` | 项目描述 | A Wujie sub app template |

## 常见问题

### 1. 子应用无法加载

确保子应用已正确配置CORS：

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

### 2. 通信消息丢失

检查消息通道是否正确：

```typescript
// 主应用
import { bus } from 'wujie-vue3'
bus.$emit('channel', data)

// 子应用
import { busEmit } from '@/utils/wujie-bus'
busEmit('channel', data)
```

### 3. 样式污染

为避免样式污染，建议使用唯一前缀或CSS模块：

```scss
// 使用唯一前缀
.wujie-sub-app {
  .my-component {
    // 样式定义
  }
}
```

### 4. 状态丢失

子应用刷新后状态会丢失，可通过以下方式持久化：

```typescript
import { useMainStore } from '@/store'

// 在路由守卫中恢复状态
router.beforeEach((to, from, next) => {
  const store = useMainStore()
  if (window.$wujie) {
    const { attributes } = window.$wujie
    if (attributes?.state) {
      store.restoreState(attributes.state)
    }
  }
  next()
})
```

## 许可证

MIT License
