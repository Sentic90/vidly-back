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

router.get("/", async (req, res) => {
  const rentals = await Rental.find();
  res.send(rentals);
});

router.post("/", auth, async (req, res) => {
  // Joi validation
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check Customer exists ?
  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    return res.status(404).send("Sorry! customer with given ID was not found.");

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
