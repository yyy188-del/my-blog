const express = require("express");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const { sequelize } = require("./db");
require("./models"); // 确保关系被初始化
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // 前端地址
  credentials: true // 允许携带 cookie
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET, // 会话密钥
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000 ,// 1分钟过期
    sameSite: 'lax'
  }
}));

app.get("/", (req, res) => {
  res.json({ msg: "server ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

const port = process.env.PORT || 3001;

async function start() {
  try {
    await sequelize.authenticate();//测试数据库连接是否成功
    await sequelize.sync();//自动创建数据库表结构（如果不存在）
    console.log("db connected");
    app.listen(port, () => console.log("server running:", port));
  } catch (err) {
    console.log("start error:", err);
  }
}

start();