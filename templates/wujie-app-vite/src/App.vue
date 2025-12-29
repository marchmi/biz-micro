<template>
  <el-config-provider :locale="locale">
    <el-container class="app-container">
      <el-aside width="220px" class="app-aside" :class="{ 'is-collapsed': isCollapsed }">
        <div class="logo">
          <img src="/vite.svg" alt="logo" />
          <span v-show="!isCollapsed">主应用(WuJie)</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapsed"
          router
          class="app-menu"
        >
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/apps">
            <el-icon><Grid /></el-icon>
            <span>应用管理</span>
          </el-menu-item>
          <el-menu-item index="/communication">
            <el-icon><ChatDotRound /></el-icon>
            <span>应用通讯</span>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <el-container>
        <el-header class="app-header">
          <div class="header-left">
            <el-icon class="collapse-btn" @click="toggleCollapse">
              <Fold v-if="!isCollapsed" />
              <Expand v-else />
            </el-icon>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ currentRoute?.meta?.title || '' }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-dropdown trigger="click">
              <span class="user-info">
                <el-avatar :size="32" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
                <span class="username">管理员</span>
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        
        <el-main class="app-main">
          <div class="main-content">
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <keep-alive>
                  <component :is="Component" />
                </keep-alive>
              </transition>
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { HomeFilled, Grid, ChatDotRound, Setting, Fold, Expand, ArrowDown } from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const locale = zhCn
const route = useRoute()
const isCollapsed = ref(false)

const activeMenu = computed(() => route.path)
const currentRoute = computed(() => route)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style lang="scss" scoped>
.app-container {
  height: 100vh;
  
  .app-aside {
    background-color: #304156;
    transition: width 0.3s;
    overflow: hidden;
    
    &.is-collapsed {
      width: 64px !important;
    }
    
    .logo {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background-color: #263445;
      
      img {
        width: 32px;
        height: 32px;
      }
      
      span {
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        white-space: nowrap;
      }
    }
    
    .app-menu {
      border-right: none;
      background-color: #304156;
      
      :deep(.el-menu-item),
      :deep(.el-sub-menu__title) {
        color: #bfcbd9;
        
        &:hover {
          background-color: #263445;
        }
      }
      
      :deep(.el-menu-item.is-active) {
        color: #409eff;
      }
    }
  }
  
  .app-header {
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 15px;
      
      .collapse-btn {
        font-size: 20px;
        cursor: pointer;
        color: #606266;
        
        &:hover {
          color: #409eff;
        }
      }
    }
    
    .header-right {
      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        
        .username {
          color: #606266;
        }
      }
    }
  }
  
  .app-main {
    background-color: #f0f2f5;
    padding: 20px;
    
    .main-content {
      background: #fff;
      border-radius: 4px;
      padding: 20px;
      min-height: calc(100vh - 140px);
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
