const express = require("express");
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const router = express.Router();

// list movies
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort("name");
    res.send(movies);
  } catch (ex) {
    res.send("Opps! Could not fetch Movies from DB.").status(500);
  }
});

// Create new Movie
router.post("/", auth, async (req, res) => {
  // you should never ever trust what client send

  // validate Movie
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let movie = new Movie({
    title: req.body.title,
    genre: {
      // hyprid approach
      _id: genre._id,
      name: genre.name,
    },
    dailyRentalRate: req.body.dailyRentalRate,
    numberInStock: req.body.numberInStock,
  });
  try {
    await movie.save();
    res.send(movie);
  } catch (ex) {
    res.send(ex.message).status(400);
  }
});

// get a single movie
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie)
      return res.status(404).send("The movie with given ID was not found.");
    res.send(movie);
  } catch (ex) {
    res.send(ex.message);
  }
});

// update a movie
router.put("/:id", auth, async (req, res) => {
  // validate Genre
  if (req.body.genre) {
    try {
      const genre = await Genre.findById(req.body.genreId);
      if (!genre)
        return res.status(404).send("there's no genre with given ID...");
    } catch (ex) {
      res.send("Invalid genre ID").status(400);
    }
  } else {
  }

  // validate movie
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    // Update movie with given ID
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: {
          // hyprid approach
          _id: genre._id,
          name: genre.name,
        },
        dailyRentalRate: req.body.dailyRentalRate,
        numberInStock: req.body.numberInStock,
      },
      {
        new: true,
      }
    );
    if (!movie)
      return res.status(404).send("The movie with movie ID was not found.");
    res.send(movie);
  } catch (ex) {
    res.send(ex.message);
  }
});

// Delete Movie
router.delete("/:id", auth, async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie)
    return res.status(404).send("The movie with given ID was not found.");
  res.send(movie).status(204);
});

module.exports = router;
