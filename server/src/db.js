const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,//数据库服务器地址
    dialect: "mysql",
    logging: false
  }
);

module.exports = { sequelize };