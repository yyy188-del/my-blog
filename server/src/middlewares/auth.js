const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ msg: "no token" });

  const token = header.replace("Bearer ", "");
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = data.userId;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "token bad" });
  }
}

module.exports = auth;