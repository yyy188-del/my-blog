<template>
  <el-card class="box">
    <div class="title">写文章</div>
    <el-input v-model="title" placeholder="标题" />
    <el-input
      v-model="content"
      type="textarea"
      :rows="12"
      placeholder="正文内容..."
      style="margin-top:10px;"
    />
    <el-button type="primary" style="margin-top:12px;" @click="send">发布</el-button>
  </el-card>
</template>

<script setup>
import { ref } from "vue";
import http from "../api/http";
import { useUserStore } from "../stores/userStore";
import { ElMessage } from "element-plus";

const store = useUserStore();
const title = ref("");
const content = ref("");

async function send() {
  if (!store.token) return ElMessage.warning("请先登录");
  if (!title.value || !content.value) return ElMessage.warning("标题和内容不能为空");

  await http.post("/posts", { title: title.value, content: content.value });
  ElMessage.success("发布成功");
  location.href = "/";
}
</script>

<style scoped>
.box { max-width: 780px; margin: 20px auto; }
.title { font-weight: 800; font-size: 18px; margin-bottom: 12px; }
</style>