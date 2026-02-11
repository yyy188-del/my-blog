<template>
  <div>
    <el-card class="box">
      <div class="row">
        <el-input v-model="q" placeholder="搜标题关键词..." clearable @keyup.enter="load" />
        <el-button type="primary" @click="load">搜索</el-button>
      </div>
    </el-card>

    <div v-if="list.length === 0" class="empty">暂无文章</div>

    <el-card v-for="item in list" :key="item.id" class="post" @click="go(item.id)">
      <div class="title">{{ item.title }}</div>
      <div class="info">
        <span>作者：{{ item.User?.username }}</span>
        <span>点赞：{{ item.likeCount }}</span>
        <span>{{ formatTime(item.createdAt) }}</span>
      </div>
      <div class="preview">{{ cut(item.content) }}</div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import http from "../api/http";
import { useRouter } from "vue-router";

const router = useRouter();
const q = ref("");
const list = ref([]);

function cut(s) {
  if (!s) return "";
  return s.length > 120 ? s.slice(0, 120) + "..." : s;
}
function formatTime(t) {
  return new Date(t).toLocaleString();
}
function go(id) {
  router.push("/post/" + id);
}

async function load() {
  const res = await http.get("/posts", { params: { q: q.value } });
  list.value = res.data;
}

onMounted(load);
</script>

<style scoped>
.box { margin-bottom: 14px; }
.row { display: flex; gap: 10px; }
.post { margin-bottom: 12px; cursor: pointer; }
.title { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
.info { color: #888; font-size: 12px; display: flex; gap: 12px; margin-bottom: 8px; }
.preview { color: #444; line-height: 1.6; }
.empty { text-align: center; color: #888; margin-top: 40px; }
</style>