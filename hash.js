const bcrypt = require("bcrypt");

async function run() {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash("1234", salt);
  console.log(salt);
  console.log(hashed);
}

// sold is a random string that used to encrypt a password or senetive string.
run();
