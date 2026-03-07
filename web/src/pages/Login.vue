<template>
  <div class="login">
    <el-card class="login-card">
      <template #header>
        <h2>登录</h2>
      </template>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <div class="captcha-container">
            <el-input v-model="loginForm.captcha" placeholder="请输入验证码" style="width: 60%" />
            <img :src="captchaUrl" @click="refreshCaptcha" class="captcha-image" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="goToRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { authApi } from '../api/authApi'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useUserStore()
const loginFormRef = ref(null)
const loginForm = ref({
  username: '',
  password: '',
  captcha: ''
})
const captchaUrl = ref('')
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

onMounted(() => {
  refreshCaptcha()
})

const refreshCaptcha = () => {
  // 直接使用 img 标签加载验证码，而不是通过 API
  captchaUrl.value = `http://localhost:3001/api/auth/captcha?t=${Date.now()}`
}

const login = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await authApi.login(loginForm.value)
        // 修复方法名
        authStore.setLogin(response.data.token, response.data.username)
        router.push('/')
      } catch (error) {
        ElMessage.error('登录失败，请检查用户名和密码')
        refreshCaptcha() // 登录失败时刷新验证码
      }
    }
  })
}


const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 100px auto;
}

.login-card {
  padding: 20px;
}

.captcha-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.captcha-image {
  width: 120px;
  height: 40px;
  cursor: pointer;
}
</style>
