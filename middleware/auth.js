const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access Denied. not token provided.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;

    // pass to next middleware
    next();
  } catch (ex) {
    res.status(400).send("Invalid jwt token.");
  }
}

module.exports = auth;
