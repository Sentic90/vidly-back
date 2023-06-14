const winstone = require("winston");
const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/logging")();
require("./startup/config")();
require("./startup/validation")();
// require("./startup/prod")();

// Getting Port from ENV
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  winstone.info(`Listening on port ${port}....`);
});

module.exports = server;
