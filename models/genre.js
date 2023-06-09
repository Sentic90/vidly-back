const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
});
const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  // Joi Schema how your input should looks like
  const schema = {
    name: Joi.string().min(3).max(50).required(),
  };

  return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;
