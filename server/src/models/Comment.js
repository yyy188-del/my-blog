const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Comment = sequelize.define("Comment", {
  content: {
    type: DataTypes.STRING(500),
    allowNull: false
  }
});

module.exports = Comment;