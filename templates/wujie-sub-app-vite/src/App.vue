<template>
  <div class="app-container">
    <el-config-provider :locale="locale">
      <router-view />
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const locale = ref(zhCn)
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
}
</style>
