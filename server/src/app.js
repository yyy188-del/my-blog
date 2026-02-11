const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./db");
require("./models"); // 确保关系被初始化
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "server ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

const port = process.env.PORT || 3001;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("db connected");
    app.listen(port, () => console.log("server running:", port));
  } catch (err) {
    console.log("start error:", err);
  }
}

start();