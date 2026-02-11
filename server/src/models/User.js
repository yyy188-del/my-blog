const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
});

module.exports = User;