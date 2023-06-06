fetch("http://localhost:8000/store/products/")
  .then((res) => console.log(res.data))
  .catch((err) => console.log(err));

// const mongoose = require("mongoose");
// const id = mongoose.Types.ObjectId();
// console.log(id.getTimestamp());
// const isValid = mongoose.Types.ObjectId.isValid("647626d383a0d6d4cd903160");
