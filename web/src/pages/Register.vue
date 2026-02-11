<template>
  <el-card class="box">
    <div class="title">注册</div>
    <el-input v-model="username" placeholder="用户名" />
    <el-input
      v-model="password"
      placeholder="密码"
      show-password
      style="margin-top:10px;"
    />
    <el-input
      v-model="password2"
      placeholder="确认密码"
      show-password
      style="margin-top:10px;"
    />
    <el-button
      type="primary"
      style="margin-top:12px; width:100%;"
      @click="register"
    >
      注册
    </el-button>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
import http from "../api/http";
import { ElMessage } from "element-plus";

const username = ref("");
const password = ref("");
const password2 = ref("");

async function register() {
  if (!username.value || !password.value || !password2.value) {
    return ElMessage.warning("请填写完整");
  }
  if (password.value !== password2.value) {
    return ElMessage.warning("两次密码不一致");
  }

  try {
    await http.post("/auth/register", {
      username: username.value,
      password: password.value
    });
    ElMessage.success("注册成功，请登录");
    location.href = "/login";
  } catch (e) {
    ElMessage.error(e.response?.data?.msg || "注册失败");
  }
}
</script>

<style scoped>
.box {
  max-width: 420px;
  margin: 60px auto;
}
.title {
  font-weight: 800;
  font-size: 18px;
  margin-bottom: 12px;
}
</style>