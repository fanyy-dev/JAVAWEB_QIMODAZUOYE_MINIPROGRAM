<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">饭店管理系统</h2>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            @keyup.enter="handleLogin"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="width: 100%"
            :loading="loading"
            @click="handleLogin"
          >登 录</el-button>
        </el-form-item>
      </el-form>
      <div class="login-tip">
        <p>默认账号: admin</p>
        <p>默认密码: 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import request from '@/utils/request'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref(null)

const loginForm = reactive({
  username: 'admin',
  password: '123456'
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const loading = ref(false)

const handleLogin = () => {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 清除旧的token
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      
      request.post('/auth/login', loginForm)
        .then(data => {
          console.log('登录返回数据:', data)
          userStore.login(data)
          ElMessage.success('登录成功')
          router.push('/dashboard')
        })
        .catch((err) => {
          console.error('登录失败:', err)
          loading.value = false
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(20px, 10px); }
  50% { transform: translate(-20px, 20px); }
  75% { transform: translate(10px, -20px); }
}

.login-box {
  width: 420px;
  padding: 50px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3),
              0 0 1px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 32px;
  font-weight: 700;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-form {
  margin-top: 20px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 24px;
}

.login-form :deep(.el-input__inner) {
  height: 44px;
  border-radius: 8px;
  border: 1px solid #dcdfe6;
  transition: all 0.3s ease;
  font-size: 14px;
}

.login-form :deep(.el-input__inner:focus),
.login-form :deep(.el-input__inner:hover) {
  border-color: #667eea;
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.2);
}

.login-form :deep(.el-input__prefix) {
  color: #667eea;
}

.login-form :deep(.el-button--primary) {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
}

.login-form :deep(.el-button--primary:hover) {
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  transform: translateY(-2px);
}

.login-form :deep(.el-button--primary:active) {
  transform: translateY(0);
}

.login-tip {
  margin-top: 28px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 8px;
  border-left: 4px solid #667eea;
  text-align: left;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

.login-tip p {
  margin: 6px 0;
  padding-left: 8px;
}

.login-tip p::before {
  content: '✓';
  color: #67c23a;
  margin-right: 6px;
  font-weight: bold;
}
</style>
