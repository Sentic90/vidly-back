const { validate, Rental } = require("../models/rental");
const auth = require("../middleware/auth");
const express = require("express");
const { Movie } = require("../models/movie");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  if (!req.body.customerId)
    return res.status(400).send("customerId not provided.");

  if (!req.body.movieId) return res.status(400).send("movieId not provided.");

  const { customerId, movieId } = req.body;
  const rental = await Rental.findOne({
    "customer._id": customerId,
    "movie._id": movieId,
  });
  if (!rental) return res.status(404).send("not-found");

  if (rental.dateReturned)
    return res.status(400).send("Rental already proccessed.");

  rental.dateReturned = new Date();

  // Calculate RentalFee
  let daysOut = rental.dateReturned - rental.dateOut;
  daysOut = Math.round(daysOut / 1000 / 60 / 60 / 24);
  rental.rentalFee = daysOut * rental.movie.dailyRentalRate;
  await rental.save();

  // + number in Stock
  await Movie.findByIdAndUpdate(movieId, {
    $inc: {
      numberInStock: 1,
    },
  });

  return res.status(200).send(rental);
});

module.exports = router;
