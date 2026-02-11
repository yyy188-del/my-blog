<template>
  <el-card class="box">
    <div class="title">登录</div>
    <el-input v-model="username" placeholder="用户名" />
    <el-input v-model="password" placeholder="密码" show-password style="margin-top:10px;" />
    <el-button type="primary" style="margin-top:12px; width:100%;" @click="login">登录</el-button>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
import http from "../api/http";
import { useUserStore } from "../stores/userStore";
import { ElMessage } from "element-plus";

const store = useUserStore();
const username = ref("");
const password = ref("");

async function login() {
  try {
    const res = await http.post("/auth/login", {
      username: username.value,
      password: password.value
    });
    store.setLogin(res.data.token, res.data.username);
    ElMessage.success("登录成功");
    location.href = "/";
  } catch (e) {
    ElMessage.error(e.response?.data?.msg || "登录失败");
  }
}
</script>

<style scoped>
.box { max-width: 420px; margin: 60px auto; }
.title { font-weight: 800; font-size: 18px; margin-bottom: 12px; }
</style>