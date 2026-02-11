import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import PostDetail from "../pages/PostDetail.vue";
import NewPost from "../pages/NewPost.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/post/:id", component: PostDetail },
  { path: "/new", component: NewPost }
];

export default createRouter({
  history: createWebHistory(),
  routes
});