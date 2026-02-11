const { sequelize } = require("./src/db");
const { User, Post } = require("./src/models");

async function addTest() {
  await sequelize.authenticate();
  // 确保有用户，或者先创建一个用户
  let user = await User.findOne();
  if (!user) {
    user = await User.create({ username: "testuser", passwordHash: "xxxx" });
  }
  await Post.create({ title: "测试文章1", content: "内容1", UserId: user.id });
  await Post.create({ title: "测试文章2", content: "内容2", UserId: user.id });
  console.log("测试文章添加完毕");
  process.exit();
}

addTest();