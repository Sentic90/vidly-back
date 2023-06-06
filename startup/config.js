const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    console.error("FATAL ERROR: jwtPrivateKey not defined.");
    throw new Error("FATAL ERROR: jwtPrivateKey not defined.");
  }
};
