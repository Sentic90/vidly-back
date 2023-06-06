const winston = require("winston");

module.exports = function (err, req, res, next) {
  // logging these exception
  winston.error(err.message, err);

  // error
  // warning
  // info
  // verbose
  // debug
  // silly
  res.status(500).send("Opps! something went wrong.");
};
