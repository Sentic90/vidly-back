const mongoose = require("mongoose");
const winston = require("winston");
module.exports = function () {
  // Mongodb connection
  mongoose
    .connect("mongodb://localhost/vidly")
    .then(() => winston.info("Connected to DB..."));
  // .then(() => console.log("Connected to DB..."));
  // .catch((err) => console.log("FATAL ERROR: Faliled to connect Mongodb "));
};
