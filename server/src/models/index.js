const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");
const Like = require("./Like");

// 用户-文章
User.hasMany(Post);
Post.belongsTo(User);

// 用户-评论-文章
User.hasMany(Comment);
Comment.belongsTo(User);

Post.hasMany(Comment);
Comment.belongsTo(Post);

// 点赞：用户-文章 多对多
User.belongsToMany(Post, { through: Like, as: "LikedPosts" });
Post.belongsToMany(User, { through: Like, as: "Likers" });

module.exports = { User, Post, Comment, Like };