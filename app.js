const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("./models/user");

const userInstance = {
  name: "abcde",
  email: "abc@domain.com",
  password: "12345",
  isAdmin: true,
};
const user = new User({ isAdmin: true });
// console.log(user._doc);
let token = jwt.sign({ _id: "1234" }, "1234");
token += "1";
const payload = jwt.verify(token, "1234");
console.log(payload);
// const mongoose = require("mongoose");
// const id = mongoose.Types.ObjectId();
// console.log(id.getTimestamp());
// const isValid = mongoose.Types.ObjectId.isValid("647626d383a0d6d4cd903160");
