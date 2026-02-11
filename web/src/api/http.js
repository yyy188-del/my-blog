import axios from "axios";
import { useUserStore } from "../stores/userStore";

const http = axios.create({
  baseURL: "http://localhost:3001/api"
});

http.interceptors.request.use((config) => {
  const store = useUserStore();
  if (store.token) {
    config.headers.Authorization = "Bearer " + store.token;
  }
  return config;
});

export default http;