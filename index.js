const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/logging")();
require("./startup/config")();
require("./startup/validation")();

// Getting Port from ENV
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}....`);
  // winstone.info(`Listening on port ${port}....`);
});

throw new Error("somethong fail..!");
