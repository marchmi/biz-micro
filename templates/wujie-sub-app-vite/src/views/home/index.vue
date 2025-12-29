<template>
  <div class="home-page">
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>访问量</span>
              <el-icon><View /></el-icon>
            </div>
          </template>
          <div class="stat-value">{{ visitCount }}</div>
          <div class="stat-label">今日访问</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>用户数</span>
              <el-icon><User /></el-icon>
            </div>
          </template>
          <div class="stat-value">{{ userCount }}</div>
          <div class="stat-label">注册用户</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>订单数</span>
              <el-icon><ShoppingCart /></el-icon>
            </div>
          </template>
          <div class="stat-value">{{ orderCount }}</div>
          <div class="stat-label">今日订单</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>收入</span>
              <el-icon><Money /></el-icon>
            </div>
          </template>
          <div class="stat-value">¥{{ revenue }}</div>
          <div class="stat-label">今日收入</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>数据概览</span>
              <el-radio-group v-model="chartRange" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-placeholder">
            <el-empty description="图表区域" :image-size="120" />
          </div>
        </el-card>

        <el-card class="recent-orders">
          <template #header>
            <div class="card-header">
              <span>最近订单</span>
              <el-button link type="primary">查看更多</el-button>
            </div>
          </template>
          <el-table :data="recentOrders" style="width: 100%">
            <el-table-column prop="orderId" label="订单编号" width="180" />
            <el-table-column prop="customer" label="客户" width="150" />
            <el-table-column prop="amount" label="金额">
              <template #default="{ row }">
                <span>¥{{ row.amount }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="quick-actions">
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <div class="action-list">
            <div class="action-item" @click="handleAction('newOrder')">
              <el-icon><Plus /></el-icon>
              <span>新建订单</span>
            </div>
            <div class="action-item" @click="handleAction('addUser')">
              <el-icon><UserFilled /></el-icon>
              <span>添加用户</span>
            </div>
            <div class="action-item" @click="handleAction('exportData')">
              <el-icon><Download /></el-icon>
              <span>导出数据</span>
            </div>
            <div class="action-item" @click="handleAction('refresh')">
              <el-icon><Refresh /></el-icon>
              <span>刷新数据</span>
            </div>
          </div>
        </el-card>

        <el-card class="system-status">
          <template #header>
            <div class="card-header">
              <span>系统状态</span>
            </div>
          </template>
          <div class="status-list">
            <div class="status-item">
              <span>服务状态</span>
              <el-tag type="success" size="small">运行中</el-tag>
            </div>
            <div class="status-item">
              <span>数据库</span>
              <el-tag type="success" size="small">正常</el-tag>
            </div>
            <div class="status-item">
              <span>缓存服务</span>
              <el-tag type="success" size="small">正常</el-tag>
            </div>
            <div class="status-item">
              <span>消息队列</span>
              <el-tag type="success" size="small">正常</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { View, User, ShoppingCart, Money, Plus, UserFilled, Download, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { setupBusListener, busEmit, BusMessage } from '@/utils/wujie-bus'

const chartRange = ref('week')

const visitCount = ref(1234)
const userCount = ref(567)
const orderCount = ref(89)
const revenue = ref(12580)

const recentOrders = ref([
  { orderId: 'ORD2024122901', customer: '张三', amount: 299, status: '已完成' },
  { orderId: 'ORD2024122902', customer: '李四', amount: 599, status: '处理中' },
  { orderId: 'ORD2024122903', customer: '王五', amount: 1299, status: '待付款' },
  { orderId: 'ORD2024122904', customer: '赵六', amount: 399, status: '已完成' },
  { orderId: 'ORD2024122905', customer: '钱七', amount: 899, status: '已取消' }
])

function getStatusType(status: string): string {
  const statusMap: Record<string, string> = {
    '已完成': 'success',
    '处理中': 'warning',
    '待付款': 'info',
    '已取消': 'danger'
  }
  return statusMap[status] || 'info'
}

function handleAction(action: string) {
  ElMessage.info(`执行操作：${action}`)
  busEmit('action', { action, timestamp: Date.now() })
}

let cleanup: (() => void) | null = null

onMounted(() => {
  cleanup = setupBusListener((data: BusMessage) => {
    if (data.type === 'updateData') {
      visitCount.value = (data.payload as Record<string, number>).visitCount || visitCount.value
      userCount.value = (data.payload as Record<string, number>).userCount || userCount.value
    }
  })
})

onUnmounted(() => {
  if (cleanup) {
    cleanup()
  }
})
</script>

<style lang="scss" scoped>
.home-page {
  padding: 0;
}

.stat-row {
  margin-bottom: 20px;
}

.stat-card {
  .stat-value {
    font-size: 28px;
    font-weight: bold;
    color: #303133;
    text-align: center;
    padding: 10px 0 5px;
  }

  .stat-label {
    font-size: 13px;
    color: #909399;
    text-align: center;
  }
}

.chart-card {
  margin-bottom: 20px;

  .chart-placeholder {
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.recent-orders {
  margin-bottom: 20px;
}

.quick-actions {
  margin-bottom: 20px;

  .action-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background: #f5f7fa;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: #ecf5ff;
      color: #409eff;
    }

    .el-icon {
      font-size: 24px;
      margin-bottom: 8px;
    }

    span {
      font-size: 13px;
    }
  }
}

.system-status {
  .status-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
