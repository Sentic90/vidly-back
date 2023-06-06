// admin role permission
// Authorization middleware

module.exports = function (req, res, next) {
  console.log(req.user);
  console.log("checking_is admin_.....");
  if (!req.user.isAdmin) return res.status(403).send("Forbidden");

  next();
};
