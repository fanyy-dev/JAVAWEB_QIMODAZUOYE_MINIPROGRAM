<template>
  <div class="layout-container">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" class="aside">
        <div class="logo">
          <el-icon style="margin-right: 10px;"><Management /></el-icon>
          <span>饭店管理系统</span>
        </div>
        <el-menu
          :default-active="route.path"
          router
          background-color="#001a33"
          text-color="#bfcbd9"
          active-text-color="#00d4ff"
          class="sidebar-menu"
        >
          <el-menu-item index="/dashboard">
            <el-icon><DataLine /></el-icon>
            <span>数据总览</span>
          </el-menu-item>
          <el-menu-item index="/store/list">
            <el-icon><OfficeBuilding /></el-icon>
            <span>门店管理</span>
          </el-menu-item>
          <el-menu-item index="/dish/list">
            <el-icon><Food /></el-icon>
            <span>菜品管理</span>
          </el-menu-item>
          <el-menu-item index="/order/list">
            <el-icon><Document /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
          <el-menu-item index="/user/list">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/category/list">
            <el-icon><Menu /></el-icon>
            <span>分类管理</span>
          </el-menu-item>
          <el-menu-item index="/coupon/list">
            <el-icon><Ticket /></el-icon>
            <span>优惠券管理</span>
          </el-menu-item>
          <el-menu-item index="/banner/list">
            <el-icon><Picture /></el-icon>
            <span>广告管理</span>
          </el-menu-item>
          <el-menu-item index="/review/list">
            <el-icon><ChatDotSquare /></el-icon>
            <span>评价管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主体区域 -->
      <el-container>
        <!-- 头部 -->
        <el-header class="header">
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <el-icon><UserFilled /></el-icon>
                {{ userStore.userInfo.nickname || userStore.userInfo.username }}
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 内容区 -->
        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { Management, DataLine, OfficeBuilding, Food, Document, User, UserFilled, ArrowDown, Menu, Ticket, Picture, ChatDotSquare } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      userStore.logout()
      router.push('/login')
      ElMessage.success('已退出登录')
    }).catch(() => {})
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.aside {
  background: linear-gradient(180deg, #001a33 0%, #0d1b2a 100%);
  height: 100vh;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
}

.logo {
  height: 60px;
  line-height: 60px;
  padding: 0 15px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(90deg, #00d4ff 0%, #0084ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 212, 255, 0.3);
  letter-spacing: 1px;
}

.logo .el-icon {
  font-size: 22px;
}

.sidebar-menu {
  border-right: none !important;
  padding-top: 10px;
}

.sidebar-menu :deep(.el-menu-item) {
  color: #a6b1bf;
  transition: all 0.3s ease;
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background-color: rgba(0, 212, 255, 0.1) !important;
  color: #00d4ff;
  padding-left: 25px;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.2), transparent) !important;
  border-left: 3px solid #00d4ff;
  color: #00d4ff !important;
}

.header {
  background: linear-gradient(90deg, #fff 0%, #f8f9fa 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 30px;
  border-bottom: 1px solid #ebeef5;
  height: 60px;
}

.user-info {
  cursor: pointer;
  color: #606266;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.user-info:hover {
  background-color: #f0f0f0;
  color: #00d4ff;
}

.main {
  background: #f0f2f5;
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}
</style>
