<template>
  <div class="wrap">
    <el-header class="top">
      <div class="logo" @click="$router.push('/')">MyBlog</div>
      <div class="right">
        <el-button v-if="!store.token" type="primary" plain @click="$router.push('/login')">登录</el-button>
        <el-button v-if="!store.token" @click="$router.push('/register')">注册</el-button>

        <el-button v-if="store.token" type="primary" @click="$router.push('/new')">写文章</el-button>
        <span v-if="store.token" class="name">Hi, {{ store.username }}</span>
        <el-button v-if="store.token" @click="doLogout">退出</el-button>
      </div>
    </el-header>

    <el-main class="main">
      <router-view />
    </el-main>
  </div>
</template>

<script setup>
import { useUserStore } from "./stores/userStore";
const store = useUserStore();

function doLogout() {
  store.logout();
  location.href = "/";
}
</script>

<style scoped>
.wrap { min-height: 100vh; background: #f5f7fb; }
.top {
  display: flex; align-items: center; justify-content: space-between;
  background: white; border-bottom: 1px solid #eee;
}
.logo { font-weight: 700; cursor: pointer; }
.right { display: flex; gap: 10px; align-items: center; }
.name { color: #666; }
.main { max-width: 980px; margin: 0 auto; padding: 18px; }
</style>