<template>
  <div v-if="post">
    <el-card>
      <div class="title">{{ post.title }}</div>
      <div class="info">
        <span>作者：{{ post.User?.username }}</span>
        <span>点赞：{{ likeCount }}</span>
        <span>{{ new Date(post.createdAt).toLocaleString() }}</span>
      </div>

      <el-button type="danger" plain @click="toggleLike">👍 点赞/取消</el-button>

      <div class="content">{{ post.content }}</div>
    </el-card>

    <el-card class="cbox">
      <div class="ctitle">评论</div>

      <div class="send">
        <el-input v-model="msg" placeholder="写点评论..." />
        <el-button type="primary" @click="sendComment">发送</el-button>
      </div>

      <div v-if="post.Comments?.length === 0" class="empty">还没有评论</div>

      <div v-for="c in post.Comments" :key="c.id" class="one">
        <div class="who">{{ c.User?.username }} <span class="t">{{ new Date(c.createdAt).toLocaleString() }}</span></div>
        <div class="txt">{{ c.content }}</div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import http from "../api/http";
import { useUserStore } from "../stores/userStore";
import { ElMessage } from "element-plus";

const route = useRoute();
const store = useUserStore();

const post = ref(null);
const msg = ref("");
const likeCount = ref(0);

async function load() {
  const res = await http.get("/posts/" + route.params.id);
  post.value = res.data;
  likeCount.value = res.data.likeCount || 0;
}

async function sendComment() {
  if (!store.token) return ElMessage.warning("请先登录");
  if (!msg.value) return ElMessage.warning("评论不能为空");

  await http.post(`/posts/${route.params.id}/comments`, { content: msg.value });
  msg.value = "";
  await load();
}

async function toggleLike() {
  if (!store.token) return ElMessage.warning("请先登录");
  const res = await http.post(`/posts/${route.params.id}/like`);
  likeCount.value = res.data.likeCount;
}

onMounted(load);
</script>

<style scoped>
.title { font-size: 22px; font-weight: 800; margin-bottom: 8px; }
.info { color: #888; font-size: 12px; display: flex; gap: 12px; margin-bottom: 12px; }
.content { margin-top: 16px; white-space: pre-wrap; line-height: 1.8; color: #333; }
.cbox { margin-top: 14px; }
.ctitle { font-weight: 700; margin-bottom: 10px; }
.send { display: flex; gap: 10px; margin-bottom: 12px; }
.one { padding: 10px 0; border-bottom: 1px solid #eee; }
.who { font-size: 13px; font-weight: 600; }
.t { font-weight: 400; color: #999; margin-left: 8px; }
.txt { margin-top: 6px; color: #444; }
.empty { color: #888; text-align: center; padding: 18px 0; }
</style>