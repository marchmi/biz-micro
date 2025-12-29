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
    meta: { title: '应用管理' }
  },
  {
    path: '/apps/:name',
    name: 'SubApp',
    component: () => import('@/views/apps/SubApp.vue'),
    meta: { title: '子应用' }
  },
  {
    path: '/communication',
    name: 'Communication',
    component: () => import('@/views/communication/index.vue'),
    meta: { title: '应用通讯' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/settings/index.vue'),
    meta: { title: '系统设置' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
