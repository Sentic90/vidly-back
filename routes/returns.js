const { Rental } = require("../models/rental");
const validate = require("../middleware/validate");
const Joi = require("joi");
const auth = require("../middleware/auth");
const express = require("express");
const { Movie } = require("../models/movie");
const Fawn = require("fawn/lib/fawn");
const router = express.Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const { customerId, movieId } = req.body;
  const rental = await Rental.lookup(customerId, movieId);
  if (!rental) return res.status(404).send("not-found");

  if (rental.dateReturned)
    return res.status(400).send("Rental already proccessed.");

  // Calculate RentalFee

  rental.return();
  await rental.save();

  // + number in Stock
  await Movie.findByIdAndUpdate(movieId, {
    $inc: {
      numberInStock: 1,
    },
  });

  return res.send(rental);
});

function validateReturn(rental) {
  // Joi Schema how your input should looks like
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };

  return Joi.validate(rental, schema);
}

module.exports = router;
