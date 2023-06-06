const express = require("express");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const { Movie } = require("../models/movie");
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const auth = require("../middleware/auth");
const router = express.Router();

// Initialize fawn
Fawn.init(mongoose);
// list rentals
router.get("/", async (req, res) => {
  try {
    // get all rentals
    const rentals = await Rental.find();
    res.send(rentals);
  } catch (ex) {
    res.send("Opps! Could not fetch rentals from DB.").status(500);
  }
});

// Create new Rental
router.post("/", auth, async (req, res) => {
  // check customerId
  // const customerId = mongoose.Types.ObjectId.isValid(req.body.customerId);
  // if (!customerId) {
  //   return res.status(400).send("Invalid customer ID.");
  // }

  // Joi validation
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check Customer exists ?
  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res.status(404).send("Sorry! customer with given ID was not found.");

  // check movieId
  // const movieId = mongoose.Types.ObjectId.isValid(req.body.movieId);
  // if (!movieId) {
  //   return res.status(400).send("Invalid movie ID.");
  // }

  // Check movie exists ?
  const movie = await Movie.findById(req.body.movieId);
  if (!movie)
    return res.status(404).send("Sorry! movie with given ID was not found.");

  // is stock available ?
  if (movie.numberInStock === 0) return res.send("out of stock!!..");

  // Rental Model assinging ..
  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold,
    },
    movie: {
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
    rentalFee: movie.dailyRentalRate * 10,
  });

  // Two phase commit --> a transaction
  try {
    new Fawn.Task()
      .save("rentals", rental) // new rental object
      .update(
        //update movie stocks
        "movies",
        { _id: movie._id },
        {
          $inc: {
            numberInStock: -1,
          },
        }
      )
      .run(); // execute the transaction all in one

    res.send(rental);
  } catch (ex) {
    res.send("internal error").status(500);
  }
});

module.exports = router;
