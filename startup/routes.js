const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const returns = require("../routes/returns");
const users = require("../routes/users");
const auth = require("../routes/auth");
const home = require("../routes/home");
const error = require("../middleware/error");
const cors = require("cors")
const express = require("express");

// middleware Routes
module.exports = function (app) {
  // middleware of JSON
  app.use(cors());
  app.use(express.json());
  app.use("", home);
  app.use("/api/users", users);
  app.use("/api/customers", customers);
  app.use("/api/genres", genres);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/returns", returns);
  app.use("/api/auth", auth);

  // middleware Error handling
  app.use(error);
};
