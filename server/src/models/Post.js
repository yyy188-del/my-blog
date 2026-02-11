const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Post = sequelize.define("Post", {
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT("long"),
    allowNull: false
  }
});

module.exports = Post;