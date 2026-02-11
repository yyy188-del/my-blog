const router = require("express").Router();
const { Op } = require("sequelize");
const auth = require("../middlewares/auth");
const { User, Post, Comment, Like } = require("../models");

// 列表+搜索
router.get("/", async (req, res) => {
  try {
    const q = req.query.q || "";
    const where = q
      ? { title: { [Op.like]: `%${q}%` } }
      : {};

    const list = await Post.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [{ model: User, attributes: ["id", "username"] }]
    });

    const result = [];
    for (const p of list) {
      const likeCount = await Like.count({ where: { PostId: p.id } });
      result.push({ ...p.toJSON(), likeCount });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: "list err" });
  }
});

// 详情
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findByPk(id, {
      include: [
        { model: User, attributes: ["id", "username"] },
        {
          model: Comment,
          include: [{ model: User, attributes: ["id", "username"] }]
        }
      ],
      order: [[Comment, "createdAt", "DESC"]]
    });
    if (!post) return res.status(404).json({ msg: "not found" });

    const likeCount = await Like.count({ where: { PostId: id } });
    res.json({ ...post.toJSON(), likeCount });
  } catch (err) {
    res.status(500).json({ msg: "detail err" });
  }
});

// 发文
router.post("/", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content)
      return res.status(400).json({ msg: "need data" });

    const post = await Post.create({
      title,
      content,
      UserId: req.userId
    });

    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: "create err" });
  }
});

// 评论
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    if (!content) return res.status(400).json({ msg: "need content" });

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ msg: "post not found" });

    const c = await Comment.create({
      content,
      UserId: req.userId,
      PostId: postId
    });

    res.json(c);
  } catch (err) {
    res.status(500).json({ msg: "comment err" });
  }
});

// 点赞/取消点赞
router.post("/:id/like", auth, async (req, res) => {
  try {
    const postId = req.params.id;

    const old = await Like.findOne({
      where: { UserId: req.userId, PostId: postId }
    });
    if (old) {
      await old.destroy();
      const likeCount = await Like.count({ where: { PostId: postId } });
      return res.json({ liked: false, likeCount });
    } else {
      await Like.create({ UserId: req.userId, PostId: postId });
      const likeCount = await Like.count({ where: { PostId: postId } });
      return res.json({ liked: true, likeCount });
    }
  } catch (err) {
    res.status(500).json({ msg: "like err" });
  }
});

module.exports = router;