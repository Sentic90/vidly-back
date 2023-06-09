const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");
module.exports = function () {
  // Mongodb connection
  const db = config.get("db");
  mongoose.connect(db).then(() => winston.info(`Connected to ${db}...`));
};
