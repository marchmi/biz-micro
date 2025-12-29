# 子应用注册指南

本文档详细介绍如何将子应用注册到 qiankun 和 wujie 两种主流微前端框架的主应用中。通过阅读本指南，开发者可以理解微前端架构中主应用与子应用的交互机制，掌握在不同框架下注册子应用的具体方法，并能够处理实际开发中常见的集成问题。

## 一、微前端子应用注册概述

### 1.1 子应用注册的本质

在微前端架构中，子应用注册是将独立的前端应用纳入主应用管理体系的关键步骤。这个过程涉及两个核心层面：运行时生命周期管理和资源加载控制。从运行时生命周期的角度看，主应用需要知道如何加载子应用、何时启动子应用、以及在什么条件下卸载子应用。从资源加载控制的角度看，主应用需要协调子应用与主应用之间的资源隔离，避免样式冲突和全局变量污染。

子应用注册的本质是建立一套主应用与子应用之间的契约协议。主应用通过注册表（Registry）记录子应用的基本信息，包括子应用的入口地址、激活规则、加载策略等。子应用则需要按照契约导出标准的生命周期钩子函数，使得主应用能够在适当的时机调用这些函数。这种设计模式使得主应用与子应用之间保持松耦合关系，主应用不需要了解子应用的内部实现细节，只需要按照契约进行调用即可。

不同的微前端框架对这套契约协议有着不同的实现方式。qiankun 定义了 bootstrap、mount、unmount 三个核心生命周期函数，子应用需要在入口文件中导出这些函数供主应用调用。wujie 则采用了组件化的方式，通过 WujieVue3 组件直接在模板中声明式地引入子应用，同时也支持类 iframe 的通信机制。理解这些差异对于选择合适的框架和正确实现子应用注册至关重要。

### 1.2 注册流程的通用步骤

无论是使用 qiankun 还是 wujie，子应用注册都遵循一套通用的流程模式。首先是子应用开发阶段，开发者需要按照微前端框架的要求改造现有应用或创建新的子应用模板。其次是配置阶段，需要在子应用中设置正确的入口地址、路由基准路径等参数。然后是注册阶段，在主应用中配置子应用的基本信息。最后是运行验证阶段，启动主应用并检查子应用是否能够正确加载和交互。

在子应用开发阶段，开发者需要关注几个关键点。路由配置需要支持子应用独立运行和被主应用加载两种模式，通常通过环境变量或 base 路径配置来实现。状态管理需要考虑是否需要与主应用共享状态，以及如何在子应用销毁时清理状态。样式隔离是另一个重要议题，需要确保子应用的样式不会影响主应用和其他子应用。

配置阶段的核心任务是确保子应用能够被主应用正确访问。这包括配置子应用的开发服务器允许跨域访问、设置正确的资源发布路径、以及配置主应用访问子应用时的地址格式。对于生产环境，还需要考虑静态资源的部署路径和 CDN 配置。注册阶段的主要工作是在主应用中定义子应用的元数据，包括名称、入口地址、激活条件等。运行验证阶段需要检查子应用的加载性能、交互正确性以及资源隔离效果。

### 1.3 主应用与子应用的关系

主应用在微前端架构中扮演着管理者的角色，它负责协调多个子应用的加载、卸载和通信。主应用本身也是一个完整的 Vue 应用，它拥有自己的路由、状态管理和业务逻辑。子应用则是被主应用管理的功能单元，每个子应用专注于实现特定的业务功能。从用户的视角看，所有子应用似乎运行在同一个页面中，但从技术实现上看，每个子应用都有自己独立的运行环境和生命周期。

主应用与子应用之间存在几种典型的交互模式。第一种是路由转发模式，主应用通过路由匹配决定加载哪个子应用，子应用的路由与主应用路由保持某种对应关系。第二种是组件嵌入模式，子应用作为一个组件被主应用直接渲染，wujie 框架主要采用这种方式。第三种是并行运行模式，主应用和子应用分别渲染在页面的不同区域，通过特定的通信机制进行数据交换。

理解主应用与子应用的关系对于正确实现子应用注册非常重要。开发者需要明确子应用在整体应用中的定位，是作为功能模块存在还是作为独立系统存在。不同的定位会影响子应用的架构设计和注册方式。同时，还需要考虑子应用之间的隔离级别，对于安全性要求较高的场景，需要采用更强的隔离策略来防止数据泄露和越权访问。

## 二、Qiankun 框架子应用注册

### 2.1 Qiankun 框架架构简介

qiankun 是蚂蚁金服开源的微前端解决方案，它基于 single-spa 发展而来，提供了更完善的功能和更好的开发体验。qiankun 的核心设计理念是通过沙箱隔离和生命周期管理来实现子应用的独立运行和统一调度。框架使用了基于 proxy 的沙箱技术，能够有效地隔离子应用对全局变量的修改，防止样式冲突，并支持子应用之间的状态共享。

qiankun 的架构由主应用和子应用两部分组成。主应用负责管理所有子应用的注册、加载和卸载，提供统一的导航和布局框架，以及处理应用间的通信。子应用则是独立的 Vue、React 或其他框架的应用，它们按照 qiankun 定义的契约导出生命周期函数。这种架构使得子应用可以独立开发和部署，同时也支持渐进式地将单体应用拆分为多个子应用。

qiankun 提供了三种子应用加载模式：手动加载、预加载和按需加载。手动加载模式下，主应用通过代码显式调用 registerMicroApp 和 loadMicroApp 方法来注册和加载子应用。预加载模式下，主应用在空闲时间预先加载子应用的资源，减少用户访问时的等待时间。按需加载模式下，只有当路由匹配到子应用的激活规则时才加载子应用，适合子应用较多但用户只会访问部分子应用的场景。

### 2.2 子应用的生命周期实现

子应用需要正确实现并导出 qiankun 规定的生命周期函数，这是子应用能够被主应用正确管理的基础。生命周期函数包括 bootstrap、mount、unmount 三个核心函数，以及可选的 update 函数。这些函数在子应用的不同阶段被主应用调用，开发者需要在这些函数中执行相应的初始化或清理操作。

bootstrap 函数在子应用首次加载时调用，只会被调用一次，用于执行子应用的初始化操作。在这个函数中，应该创建 Vue 应用实例、初始化 Pinia 状态、注册全局组件等只执行一次的操作。mount 函数在子应用需要渲染时调用，每次子应用从隐藏切换到显示时都会触发这个函数。在这个函数中，应该将子应用挂载到指定的 DOM 节点，渲染页面内容。unmount 函数在子应用需要卸载时调用，每次子应用从显示切换到隐藏时会触发这个函数。在这个函数中，应该执行子应用的清理操作，如取消事件监听、清空定时器、卸载 Vue 应用实例等。

在 Vue 3 应用中，子应用的生命周期实现通常放在 src/main.ts 文件中。以下是典型的实现方式：

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

async function mount() {
  console.log('[子应用] qiankun mount')

  app = createApp(App)
  app.use(createPinia())
  app.use(router)
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

这段代码展示了子应用生命周期的标准实现。需要特别注意以下几点：首先，app 实例需要在模块级别声明，以便在 unmount 函数中能够访问并进行卸载操作。其次，如果子应用使用 webpack 构建，需要根据 window.__POWERED_BY_QIANKUN__ 动态设置 public path，这是为了确保子应用能够正确加载自身及其依赖资源。最后，mount 函数中使用 #sub-app 作为挂载点，这是为了避免与主应用的挂载点冲突。

### 2.3 子应用路由配置

子应用的路由配置需要同时支持独立运行和被主应用加载两种模式。当子应用独立运行时，它应该使用完整的根路径作为路由基础。当子应用被主应用加载时，它的路由基础路径应该是主应用分配给它的路径前缀。正确配置路由基础路径对于确保子应用在两种模式下都能正常工作至关重要。

在 Vue Router 4 中，可以通过 createWebHistory 函数的 basename 参数来设置路由基础路径。这个值通常通过环境变量导入，以便在不同环境下使用不同的值。以下是推荐的路由配置方式：

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
  document.title = (to.meta.title as string) || import.meta.env.VITE_APP_TITLE || '子应用'
  next()
})

export default router
```

环境变量 VITE_APP_BASE_URL 应该在 .env.development 和 .env.production 文件中分别配置。在独立运行模式下，这个值可以是空字符串或 '/'。在被主应用加载模式下，这个值应该设置为子应用在主应用中的路由前缀，例如 '/child-app'。这种配置方式使得同一套代码能够在两种模式下无缝切换。

路由配置中还需要注意避免使用主应用已有的路由路径。虽然 qiankun 提供了路由隔离机制，但最好还是通过规划来避免路由冲突。建议为每个子应用分配独立的路由命名空间，并在文档中记录这些分配情况。如果确实存在路由冲突，可以通过重写子应用的路由路径或在主应用层面进行路由重定向来解决。

### 2.4 主应用的子应用注册

主应用通过 registerMicroApp 方法注册子应用。这个方法接受两个参数：子应用配置数组和全局生命周期钩子。子应用配置包括 name（子应用唯一标识）、entry（子应用入口地址）、container（子应用挂载容器选择器）、activeRule（子应用激活规则）等属性。激活规则决定了在什么条件下加载子应用，通常使用路由前缀匹配。

以下是在主应用中注册 qiankun 子应用的完整示例：

```typescript
import { registerMicroApps, start } from 'qiankun'
import { ref } from 'vue'

const DEFAULT_VERSION = '1.0.0'

export const qiankunState: Record<string, unknown> = {}

export function initMainState(initialState?: Record<string, unknown>) {
  if (initialState) {
    qiankunActions.setGlobalState({
      ...initialState,
      _timestamp: Date.now()
    })
  }
}

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
    beforeLoad: [
      (app) => {
        console.log('[qiankun] before load', app.name)
        return Promise.resolve()
      }
    ],
    beforeMount: [
      (app) => {
        console.log('[qiankun] before mount', app.name)
        return Promise.resolve()
      }
    ],
    afterMount: [
      (app) => {
        console.log('[qiankun] after mount', app.name)
        return Promise.resolve()
      }
    ],
    afterUnmount: [
      (app) => {
        console.log('[qiankun] after unmount', app.name)
        return Promise.resolve()
      }
    ]
  }
)

start({
  prefetch: true,
  sandbox: {
    strictStyleIsolation: true,
    experimentalStyleIsolation: true
  },
  getPublicPath: () => '/',
  getTemplate: (tpl: string) => tpl
})
```

配置项中，name 应该是子应用的唯一标识符，不能与其他子应用重复。entry 是子应用的入口地址，开发环境使用 localhost 地址，生产环境需要替换为实际的部署地址。container 是子应用在主应用页面中的挂载点，通常是一个 div 元素的 id 选择器。activeRule 是路由激活规则，当主应用的路由匹配这个规则时，对应的子应用会被加载。props 用于向子应用传递初始化数据，子应用可以在 mount 函数的参数中接收这些数据。

start 函数用于启动 qiankun 的沙箱环境。prefetch 参数控制是否预加载子应用资源，启用后会在空闲时间预先加载子应用的入口脚本。sandbox 参数配置沙箱的行为，strictStyleIsolation 开启严格样式隔离，experimentalStyleIsolation 启用实验性的样式隔离方案。getPublicPath 函数返回子应用的资源基础路径，getTemplate 函数可以用于修改子应用的 HTML 模板。

### 2.5 运行时添加子应用

除了在应用启动时静态注册子应用，qiankun 还支持在运行时动态添加子应用。这种能力对于实现用户自定义子应用配置、插件化扩展等功能非常重要。运行时添加子应用需要使用 loadMicroApp 方法，它能够手动加载和卸载指定的子应用。

loadMicroApp 方法返回子应用实例，通过这个实例可以获取子应用的状态、触发子应用卸载等操作。以下是运行时添加子应用的示例：

```typescript
import { loadMicroApp, MicroApp } from 'qiankun'

interface SubAppConfig {
  name: string
  entry: string
  container: string
  props?: Record<string, unknown>
}

const subApps: Map<string, MicroApp> = new Map()

function addSubApp(config: SubAppConfig) {
  const { name, entry, container, props } = config

  if (subApps.has(name)) {
    console.warn(`子应用 ${name} 已存在`)
    return
  }

  const app = loadMicroApp({
    name,
    entry,
    container,
    props
  })

  subApps.set(name, app)
  console.log(`子应用 ${name} 已添加`)
}

function removeSubApp(name: string) {
  const app = subApps.get(name)
  if (app) {
    app.unmount()
    subApps.delete(name)
    console.log(`子应用 ${name} 已移除`)
  }
}

function updateSubApp(name: string, config: Partial<SubAppConfig>) {
  const app = subApps.get(name)
  if (app) {
    app.unmount()
    subApps.delete(name)
    addSubApp({ ...config, name } as SubAppConfig)
  }
}
```

这段代码展示了运行时管理子应用的完整模式。使用 Map 数据结构来存储子应用实例，便于根据名称快速查找和操作。addSubApp 函数用于添加新的子应用，它首先检查子应用是否已存在，避免重复添加。然后调用 loadMicroApp 方法加载子应用，并将实例存入 Map 中。removeSubApp 函数用于移除子应用，它调用子应用实例的 unmount 方法来卸载子应用，然后从 Map 中删除该记录。updateSubApp 函数组合了移除和添加操作，用于更新子应用配置。

在实际应用中，这些函数可以与 UI 组件绑定，实现用户界面中的子应用管理功能。例如，在 Element Plus 中可以创建一个对话框，让用户输入子应用名称和入口地址，然后调用 addSubApp 函数来添加子应用。同时需要在主应用中预留子应用的挂载点容器，并在路由中配置对应的激活规则。

## 三、Wujie 框架子应用注册

### 3.1 Wujie 框架架构简介

wujie 是腾讯开源的微前端解决方案，它采用轻量级的类 iframe 方案，实现了主应用与子应用之间的无缝集成。与 qiankun 基于 proxy 沙箱的实现方式不同，wujie 使用 Web Component 技术来封装子应用，提供了更好的兼容性和更低的侵入性。wujie 的设计理念是让子应用无需修改即可接入，降低了现有应用迁移到微前端架构的成本。

wujie 的核心组件是 WujieVue3，它是一个 Vue 3 组件，用于在主应用中渲染子应用。通过这个组件，可以像使用普通组件一样使用子应用，大大简化了子应用集成的复杂度。wujie 还提供了 wujie-vue3 子应用适配库，子应用可以使用这个适配库来感知自身是否运行在 wujie 环境中，从而进行相应的处理。

wujie 的通信机制与 qiankun 有很大不同。wujie 使用 location 或者 window.postMessage 进行通信，这种方式更加直观和易于调试。wujie 还提供了数据同步功能，主应用可以将数据同步到子应用，子应用修改数据后也可以同步回主应用。这种双向同步机制使得主应用与子应用之间的数据交互变得非常简单。

### 3.2 子应用的配置要求

wujie 对子应用的要求相对宽松，大多数情况下子应用无需修改即可直接使用。但为了获得更好的集成效果和用户体验，子应用开发者仍然需要注意一些配置要点。这些配置要点包括路由基础路径设置、资源跨域访问配置、以及可选的通信机制实现。

路由配置方面，wujie 子应用的路由应该使用带 basename 的 history 模式。basename 的值可以通过环境变量配置，使得子应用能够在独立运行和被加载两种模式之间切换。以下是推荐的路由配置方式：

```typescript
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
      keepAlive: true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/about/index.vue'),
    meta: {
      title: '关于',
      keepAlive: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL || '/'),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) || import.meta.env.VITE_APP_TITLE || '子应用'
  next()
})

export default router
```

环境变量 VITE_APP_BASE_URL 用于配置子应用的路由基础路径。当子应用独立运行时，这个值应该设置为空字符串或 '/'。当子应用被 wujie 主应用加载时，这个值应该设置为子应用在主应用中的路由前缀。例如，如果子应用在主应用中通过 /apps/child-one 访问，那么 VITE_APP_BASE_URL 应该设置为 '/apps/child-one'。

跨域配置是另一个重要的注意点。wujie 使用 iframe 来加载子应用，因此子应用的开发服务器必须正确配置 CORS 头，以允许来自主应用域名的跨域请求。在 Vite 项目中，可以通过配置 server.proxy 或者安装 vite-plugin-cors-middleware 插件来解决跨域问题。以下是一个简单的 Vite 代理配置示例：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
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

### 3.3 主应用集成子应用

主应用通过 WujieVue3 组件来集成子应用。这个组件提供了丰富的属性和事件，用于控制子应用的行为和获取子应用的状态。以下是主应用集成 wujie 子应用的完整示例：

```vue
<template>
  <div class="sub-app-view">
    <el-page-header @back="goBack" class="page-header">
      <template #content>
        <span class="page-title">{{ appName }} - 子应用预览</span>
      </template>
      <template #extra>
        <el-button @click="refreshApp">刷新</el-button>
        <el-button type="primary" @click="openNewTab">新窗口打开</el-button>
      </template>
    </el-page-header>

    <div class="app-container">
      <WujieVue3
        v-if="appUrl"
        width="100%"
        height="600px"
        :name="appName"
        :url="appUrl"
        :sync="true"
        @beforeLoad="handleBeforeLoad"
        @beforeMount="handleBeforeMount"
        @afterMount="handleAfterMount"
        @beforeUnmount="handleBeforeUnmount"
        @afterUnmount="handleAfterUnmount"
      />
      <div v-else class="no-app">
        <el-empty description="请先配置子应用" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/store'
import WujieVue3 from 'wujie-vue3'

const route = useRoute()
const router = useRouter()
const store = useMainStore()

const appName = computed(() => route.params.name as string)

const appUrl = computed(() => {
  const app = store.subApps.find(a => a.name === appName.value)
  return app?.url || ''
})

const goBack = () => {
  router.push('/apps')
}

const refreshApp = () => {
  window.location.reload()
}

const openNewTab = () => {
  if (appUrl.value) {
    window.open(appUrl.value, '_blank')
  }
}

const handleBeforeLoad = () => {
  console.log('[主应用] 子应用加载前:', appName.value)
  store.updateSubAppStatus(appName.value, 'loading')
}

const handleBeforeMount = () => {
  console.log('[主应用] 子应用挂载前:', appName.value)
}

const handleAfterMount = () => {
  console.log('[主应用] 子应用挂载后:', appName.value)
  store.updateSubAppStatus(appName.value, 'loaded')
}

const handleBeforeUnmount = () => {
  console.log('[主应用] 子应用卸载前:', appName.value)
}

const handleAfterUnmount = () => {
  console.log('[主应用] 子应用卸载后:', appName.value)
  store.updateSubAppStatus(appName.value, 'notloaded')
}
</script>
```

WujieVue3 组件的核心属性包括 name（子应用名称，用于标识和缓存）、url（子应用地址）、width 和 height（容器尺寸）、sync（是否开启数据同步）。通过路由参数获取子应用名称，然后从 store 中查找对应的子应用 URL，这是实现子应用列表管理功能的常用模式。

组件的事件钩子与 qiankun 类似，包括 beforeLoad、beforeMount、afterMount、beforeUnmount、afterUnmount。这些事件可以用来更新子应用状态、记录日志、执行清理操作等。在示例代码中，事件处理函数调用 store.updateSubAppStatus 来更新子应用的加载状态，这种状态管理方式使得 UI 组件能够根据子应用状态显示不同的内容。

### 3.4 子应用列表管理

在主应用中，通常需要提供一个子应用列表管理页面，让用户能够查看已添加的子应用、添加新的子应用、以及对子应用进行其他操作。这个管理页面需要与 store 配合，实现子应用数据的持久化和状态更新。

```vue
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
        <el-form-item label="应用地址">
          <el-input v-model="newApp.url" placeholder="如：//localhost:3001" />
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

interface SubApp {
  name: string
  url: string
  status: 'loading' | 'loaded' | 'error' | 'notloaded'
}

const router = useRouter()
const store = useMainStore()

const showAddDialog = ref(false)
const newApp = reactive({
  name: '',
  url: ''
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
    url: newApp.url,
    status: 'notloaded'
  }
  
  store.subApps.push(app)
  store.updateSubAppStatus(app.name, 'loading')
  
  setTimeout(() => {
    store.updateSubAppStatus(app.name, 'loaded')
  }, 500)
  
  showAddDialog.value = false
  Object.assign(newApp, { name: '', url: '' })
}
</script>
```

这个管理页面使用了 Element Plus 的组件来构建用户界面，包括表格（el-table）、对话框（el-dialog）、按钮（el-button）等。页面的核心数据存储在 Pinia store 中，通过 useMainStore 获取和操作。添加子应用的功能通过对话框收集用户输入，然后将新子应用添加到 store 中。移除子应用的功能从 store 中删除对应的子应用记录。访问子应用通过路由导航到子应用详情页实现。

### 3.5 Wujie 的通信机制

wujie 提供了多种通信方式，最常用的是通过 props 传递数据和利用 wujie-vue3 适配库进行状态同步。以下是几种常见的通信模式及其实现方式。

第一种是通过 props 传递静态数据。在 WujieVue3 组件上可以通过 attrs 或 props 属性向子应用传递数据，子应用通过适配库提供的 API 来获取这些数据。这种方式适合传递简单的配置数据或初始化参数。

第二种是利用 wujie 的数据同步功能。通过设置 :sync="true" 属性，wujie 会自动同步主应用 window 对象上的属性到子应用。子应用可以通过 window.parent 获取主应用的 window 对象，然后访问同步的数据。这种方式适合需要频繁更新的数据。

第三种是使用 window.postMessage 进行通信。主应用和子应用都可以监听 message 事件，并通过 postMessage 方法发送消息。这种方式提供了最大的灵活性，适合实现复杂的通信需求。

以下是在子应用中接收主应用数据的示例：

```typescript
import { ref, onMounted, onUnmounted } from 'vue'

const messageFromMain = ref('')

const handleMessage = (event: MessageEvent) => {
  if (event.data && event.data.type === 'FROM_MAIN') {
    messageFromMain.value = event.data.payload
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})

function sendToMain() {
  if (window.parent !== window) {
    window.parent.postMessage({
      type: 'FROM_CHILD',
      payload: '来自子应用的消息'
    }, '*')
  }
}
```

这段代码展示了子应用如何接收和发送消息。在 onMounted 钩子中注册 message 事件监听器，用于接收来自主应用的消息。在 onUnmounted 钩子中移除事件监听器，避免内存泄漏。sendToMain 函数使用 window.parent.postMessage 向主应用发送消息，第二个参数 '*' 表示允许发送到任何来源，实际应用中应该根据安全需求限制目标来源。

## 四、子应用通信机制

### 4.1 通信模式概述

主应用与子应用之间的通信是微前端架构中的核心能力之一。根据通信方向和同步方式的不同，可以将通信模式分为以下几类：主应用向子应用单向推送数据、子应用向主应用单向推送数据、双向同步数据、以及基于事件的异步通信。不同的微前端框架提供了不同的通信 API，开发者需要根据实际需求选择合适的通信模式。

在选择通信模式时，需要考虑以下几个因素：数据更新的频率和实时性要求、数据的安全性敏感程度、通信的复杂度和可维护性、以及框架本身对通信的支持程度。对于配置数据等低频更新场景，单向推送模式即可满足需求。对于用户操作等需要实时同步的场景，双向同步模式更加合适。对于复杂的业务交互，基于事件的异步通信模式提供了最大的灵活性。

### 4.2 Qiankun 状态共享

qiankun 提供了基于 GlobalState 的状态共享机制，主应用可以初始化全局状态，子应用可以读取和修改这些状态。这种机制通过 qiankunActions 对象实现，提供了 setGlobalState、onGlobalStateChange、offGlobalStateChange 等 API。以下是状态共享的完整实现示例。

主应用初始化和设置状态：

```typescript
import { initGlobalState, setGlobalState, onQiankunStateChange } from 'qiankun'

const DEFAULT_VERSION = '1.0.0'

export const qiankunState: Record<string, unknown> = {}

export const qiankunActions = initGlobalState(qiankunState)

export function initMainState(initialState?: Record<string, unknown>) {
  if (initialState) {
    qiankunActions.setGlobalState({
      ...initialState,
      _timestamp: Date.now()
    })
  }
}

export function setMainState(key: string, value: unknown) {
  qiankunActions.setGlobalState({
    ...qiankunState,
    [key]: value,
    _timestamp: Date.now()
  })
}

initMainState({
  version: DEFAULT_VERSION,
  theme: 'light'
})

onQiankunStateChange((state, prevState) => {
  console.log('[主应用] 状态变化', state, prevState)
})
```

子应用读取和修改状态：

```typescript
import { initGlobalState, onQiankunStateChange } from 'qiankun'

const qiankunState: Record<string, unknown> = {}

export const qiankunActions = initGlobalState(qiankunState)

export function onChildStateChange(
  callback: (state: Record<string, unknown>, prevState: Record<string, unknown>) => void
) {
  qiankunActions.onGlobalStateChange(callback, true)
}

export function setChildState(key: string, value: unknown) {
  qiankunActions.setGlobalState({
    ...qiankunState,
    [key]: value,
    _timestamp: Date.now()
  })
}
```

状态共享机制的实现原理是基于观察者模式。主应用通过 setGlobalState 方法修改状态时，所有订阅了状态变化的子应用都会收到通知。子应用通过 onGlobalStateChange 方法注册状态变化回调，当状态发生变化时，回调函数会被调用。状态对象中包含一个 _timestamp 字段，用于标识状态变更的时间点，子应用可以通过比较时间戳来判断状态的新旧。

### 4.3 事件总线通信

除了基于状态的通信方式，还可以通过事件总线实现更加灵活的通信模式。事件总线不依赖于具体的框架 API，适用于任何需要在主应用与子应用之间传递消息的场景。以下是一个简单的事件总线实现：

```typescript
import { ref } from 'vue'

interface EventPayload {
  type: string
  payload?: unknown
  timestamp: number
}

type EventHandler = (payload: EventPayload) => void

class EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map()

  on(event: string, handler: EventHandler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    this.handlers.get(event)?.add(handler)
  }

  off(event: string, handler: EventHandler) {
    this.handlers.get(event)?.delete(handler)
  }

  emit(event: string, payload?: unknown) {
    const eventPayload: EventPayload = {
      type: event,
      payload,
      timestamp: Date.now()
    }
    this.handlers.get(event)?.forEach(handler => {
      handler(eventPayload)
    })
  }

  clear(event?: string) {
    if (event) {
      this.handlers.delete(event)
    } else {
      this.handlers.clear()
    }
  }
}

export const mainEventBus = new EventBus()
export const childEventBus = new EventBus()

export function setupCrossAppCommunication() {
  if (window.parent !== window) {
    mainEventBus.on('*', (payload) => {
      window.parent.postMessage({
        source: 'child-event-bus',
        ...payload
      }, '*')
    })

    window.addEventListener('message', (event) => {
      if (event.data?.source === 'child-event-bus') {
        childEventBus.emit(event.data.type, event.data.payload)
      }
    })
  } else {
    window.addEventListener('message', (event) => {
      if (event.data?.source === 'child-event-bus') {
        mainEventBus.emit(event.data.type, event.data.payload)
      }
    })
  }
}
```

这个事件总线实现支持事件的订阅、发布和取消。跨应用通信通过 window.postMessage 实现，主应用和子应用分别监听 message 事件，将接收到的消息转发到本地的 EventBus 实例。这种设计实现了事件总线在主应用与子应用之间的穿透，使得开发者可以像使用本地事件总线一样使用跨应用事件通信。

## 五、常见问题与解决方案

### 5.1 样式隔离问题

样式隔离是微前端架构中最常见的问题之一。当多个子应用同时运行时，它们的全局样式可能会相互污染，导致页面显示异常。qiankun 和 wujie 都提供了样式隔离机制，但实际开发中仍然需要注意一些细节。

qiankun 提供了两种样式隔离策略：严格样式隔离（strictStyleIsolation）和实验性样式隔离（experimentalStyleIsolation）。严格样式隔离通过给每个子应用容器添加唯一的属性选择器来防止样式泄漏，但可能会影响依赖 :empty、:first-child 等伪类的样式。实验性样式隔离使用 Shadow DOM 来封装子应用容器，提供了更强的隔离能力，但可能会影响一些需要穿透 Shadow DOM 的样式。

在使用 qiankun 时，子应用开发者应该避免使用全局选择器定义样式，尽量使用组件级别的 scoped 样式。如果必须定义全局样式，应该使用唯一的类名或 id 作为前缀，以降低样式冲突的风险。以下是一些最佳实践：

```scss
/* 不推荐的写法 */
body {
  margin: 0;
  padding: 0;
}

/* 推荐的做法 */
.my-sub-app-body {
  margin: 0;
  padding: 0;
}
```

wujie 使用 Web Component 技术实现样式隔离，子应用的样式默认被封装在 shadow root 中。这种方式提供了很好的样式隔离效果，但也有一个常见的问题：如果子应用的样式使用了 :global() 或者其他穿透 shadow DOM 的方式，可能会导致样式泄漏。为了避免这个问题，子应用开发者应该检查样式配置，确保样式被正确封装。

### 5.2 资源加载路径问题

子应用的资源加载路径问题通常发生在子应用部署到生产环境后。在开发环境中，子应用通常通过 localhost 地址访问，资源路径相对简单。但在生产环境中，子应用可能被部署在 CDN 或不同的子路径下，资源路径需要相应调整。

qiankun 通过 getPublicPath 配置项来解决这个问题。getPublicPath 函数应该返回子应用资源的基础路径，qiankun 会根据这个路径来加载子应用的入口脚本和静态资源。以下是配置示例：

```typescript
start({
  getPublicPath: () => '/child-app/'
})
```

对于使用 webpack 构建的子应用，还需要动态设置 __webpack_public_path__。在子应用的入口文件中，应该检测是否运行在 qiankun 环境下，如果是则设置正确的 public path：

```typescript
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}
```

对于使用 Vite 构建的子应用，Vite 的 import.meta.url 提供了动态获取资源路径的能力。子应用可以使用以下模式来确保资源路径正确：

```typescript
function getPublicPath() {
  if (window.__POWERED_BY_QIANKUN__) {
    return window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
  }
  return new URL('.', import.meta.url).href
}
```

### 5.3 跨域与通信问题

子应用与主应用之间的跨域通信是一个需要特别关注的问题。浏览器出于安全考虑，限制了跨域的资源访问和脚本执行。微前端框架需要通过特定的技术手段来解决或绕过这些限制。

对于 XHR 和 Fetch 请求，子应用的后端服务器需要正确配置 CORS 头。如果子应用与主应用部署在不同的域名下，那么子应用的接口必须返回适当的 Access-Control-Allow-Origin 头。在开发环境中，可以通过配置 Vite 代理来避免跨域问题：

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

对于 postMessage 通信，需要注意目标来源的限制。虽然 '*' 可以匹配任何来源，但在生产环境中应该指定具体的目标来源，以防止恶意网站发送消息。接收消息时也应该验证消息的来源和格式，防止注入攻击。

### 5.4 路由冲突问题

当多个子应用同时存在时，路由冲突是一个需要预防的问题。主应用的路由系统需要为每个子应用分配独立的路由空间，子应用的路由配置需要与这个空间相匹配。

解决路由冲突的一种方案是为每个子应用分配唯一的前缀。例如，主应用的路由结构可以是 /main、/app/child-one、/app/child-two。子应用在配置路由时，将这个前缀设置为 basename：

```typescript
const router = createRouter({
  history: createWebHistory('/app/child-one'),
  routes: [...]
})
```

另一种方案是使用命名空间路由，通过路由元信息（meta）来标识子应用路由。主应用可以根据路由的元信息决定是否加载子应用：

```typescript
router.beforeEach((to, from, next) => {
  if (to.meta.belongsTo === 'child-one') {
    // 加载 child-one 子应用
  }
  next()
})
```

### 5.5 状态管理与清理

子应用在卸载时需要正确清理状态管理器的数据和监听器，否则可能会导致内存泄漏和状态不一致。Pinia 提供了 reset 方法来重置状态，但在子应用卸载时需要显式调用：

```typescript
import { createPinia } from 'pinia'

let app: ReturnType<typeof createApp> | null = null
let pinia: ReturnType<typeof createPinia> | null = null

async function mount() {
  app = createApp(App)
  pinia = createPinia()
  
  app.use(pinia)
  app.use(router)
  app.mount('#sub-app')
}

async function unmount() {
  if (app && pinia) {
    pinia.state.value = {}
    app.unmount()
    app = null
    pinia = null
  }
}
```

除了 Pinia 状态，还需要清理其他可能产生副作用的资源，包括 window 事件监听器、setTimeout/setInterval 定时器、WebSocket 连接等。建议在子应用中创建一个统一的清理函数，在 unmount 生命周期中调用：

```typescript
const cleanupTasks: (() => void)[] = []

export function registerCleanup(task: () => void) {
  cleanupTasks.push(task)
}

export function performCleanup() {
  cleanupTasks.forEach(task => task())
  cleanupTasks.length = 0
}

async function unmount() {
  performCleanup()
  if (app) {
    app.unmount()
    app = null
  }
}
```

## 六、最佳实践

### 6.1 子应用设计原则

在设计子应用时，应该遵循以下原则以确保系统的可维护性和可扩展性。首先是职责单一原则，每个子应用应该专注于实现一个业务领域的功能，避免将不相关的功能放在同一个子应用中。这样可以降低子应用之间的耦合度，使得单个子应用的修改不会影响到其他子应用。

其次是接口稳定原则，子应用对外暴露的接口应该保持稳定，避免频繁变更。当子应用需要与主应用或其他子应用交互时，应该定义清晰的接口契约，并通过版本控制来管理接口的演进。如果接口需要变更，应该提供向后兼容的迁移方案。

第三是独立部署原则，子应用应该能够独立开发、测试和部署，不依赖于主应用的发布周期。这要求子应用的所有依赖都打包在子应用内部，而不是依赖主应用提供的共享库。同时，子应用的部署应该是非阻塞的，多个子应用可以同时进行部署而不互相影响。

第四是渐进式加载原则，子应用的资源应该按需加载，避免一次性加载所有子应用造成首屏性能问题。qiankun 的 prefetch 和按需加载机制可以帮助实现这一点。对于不常用的子应用，可以采用动态导入的方式，在用户实际访问时才加载子应用资源。

### 6.2 开发流程规范

建立规范的开发流程对于保证微前端项目的质量非常重要。在开始开发新的子应用之前，应该先在主应用中完成子应用注册的配置，包括挂载点容器、路由激活规则、以及必要的通信配置。这些配置应该记录在文档中，并与团队成员共享。

子应用的开发应该遵循独立运行和集成测试两个阶段。在独立运行阶段，子应用作为一个独立的 Vue 应用开发和调试，开发者可以使用完整的功能和页面。在集成测试阶段，将子应用注册到主应用中进行测试，检查子应用在主应用环境下的表现是否正常，包括样式隔离、路由跳转、状态管理等方面。

代码审查应该关注子应用与主应用交互的部分，包括生命周期函数的实现、路由配置的兼容性、以及通信机制的规范使用。审查者应该检查子应用是否存在可能影响其他应用的全局副作用，以及子应用是否正确处理了加载和卸载的生命周期。

### 6.3 性能优化建议

微前端架构会带来额外的运行时开销，因此性能优化尤为重要。以下是一些性能优化的建议：

资源预加载可以显著减少子应用的加载时间。qiankun 的 prefetch 功能会在空闲时间预先加载子应用的入口脚本，但不会加载子应用的全部资源。对于关键子应用，可以在适当的时机主动触发资源预加载：

```typescript
function preloadSubApp(name: string) {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = `${subAppConfig[name].entry}/index.js`
  document.head.appendChild(link)
}
```

懒加载子应用的路由可以减少主应用的初始加载体积。通过 Vue Router 的动态导入功能，只有当用户访问特定路由时才会加载对应的组件：

```typescript
{
  path: '/detail',
  name: 'Detail',
  component: () => import('@/views/detail/index.vue')
}
```

缓存子应用的实例可以避免重复的加载和初始化开销。当用户在子应用之间频繁切换时，保持子应用的挂载状态而不是每次都卸载和重新挂载，可以提供更好的用户体验。这需要权衡内存占用和用户体验之间的取舍，对于不经常切换的子应用，可以采用卸载策略以节省内存。

### 6.4 安全注意事项

微前端架构带来了额外的安全考虑。首先是子应用来源的可信度问题，主应用应该只加载经过验证的子应用，避免加载来自不可信来源的子应用。可以通过内容安全策略（CSP）来限制能够加载的资源来源：

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' https://trusted-child.com;">
```

其次是通信安全的问题。主应用与子应用之间的通信应该使用具体的来源限制（而非 '*'），并验证消息的格式和内容，防止注入攻击。对于敏感数据，应该使用加密传输，并考虑使用 WebSocket 的安全协议（WSS）而非不安全的 WS 协议。

第三是权限控制的问题。主应用应该控制子应用的权限范围，避免子应用获得超出其职责范围的访问能力。可以通过限制 window.parent 的访问、禁用特定的 API、或使用沙箱选项来减少子应用的权限。对于安全性要求较高的场景，可以考虑使用 iframe 的 sandbox 属性来进一步限制子应用的能力。

## 七、总结

本指南详细介绍了如何将子应用注册到 qiankun 和 wujie 两种主流微前端框架的主应用中。通过理解主应用与子应用的关系、掌握不同框架的注册机制、实现有效的通信方案，开发者可以构建出稳定、高效、安全的微前端系统。

qiankun 采用基于生命周期的管理方式，子应用需要导出标准的生命周期函数，主应用通过 registerMicroApp 和 loadMicroApp 来管理子应用。这种方式的优点是架构清晰、行为可预测，缺点是子应用需要按照框架规范进行改造。wujie 采用组件化的集成方式，子应用无需修改即可直接使用，主应用通过 WujieVue3 组件来渲染子应用。这种方式的优点是集成简单、兼容性好，缺点是对子应用的控制相对有限。

在实际项目中选择微前端框架时，应该根据团队的技术栈、现有系统的架构、以及具体的功能需求来进行评估。如果团队已经熟悉 qiankun 或有使用 single-spa 的经验，qiankun 可能是更好的选择。如果希望快速集成现有系统或对兼容性有较高要求，wujie 可能更加适合。

无论选择哪种框架，都应该重视子应用的规范化开发、建立完善的测试流程、并持续关注性能和安全方面的优化。微前端架构能够带来团队协作效率和系统可维护性的提升，但这需要正确的方法和持续的投入。
