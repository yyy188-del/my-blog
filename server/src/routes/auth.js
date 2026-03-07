const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const svgCaptcha = require("svg-captcha");
require("dotenv").config();

const { User } = require("../models");

router.get("/captcha", (req, res) => {
  const captcha = svgCaptcha.create({
    size: 4,
    ignoreChars: "0o1i5s",
    noise: 2, 
    color: true, 
    background: "#f0f0f0"
  });
  
  req.session.captcha = captcha.text.toLowerCase();
  
  res.type("svg");
  res.send(captcha.data);
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, captcha } = req.body;

    if (!captcha || captcha.toLowerCase() !== req.session.captcha) {
      return res.status(400).json({ msg: "验证码错误" });
    }

    if (!username || !password)
      return res.status(400).json({ msg: "need data" });

    const old = await User.findOne({ where: { username } });
    if (old) return res.status(400).json({ msg: "username used" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash });
    res.json({ id: user.id, username: user.username });
  } catch (err) {
    res.status(500).json({ msg: "register err" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password, captcha } = req.body;

    if (!captcha || captcha.toLowerCase() !== req.session.captcha) {
      return res.status(400).json({ msg: "验证码错误" });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ msg: "user not found" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ msg: "password wrong" });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ msg: "login err" });
  }
});

module.exports = router;