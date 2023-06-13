// const asyncMiddleware = require("../middleware/async");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");
const { Genre, validateGenre } = require("../models/genre");

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

// Create new Genre
router.post("/", [auth, validate(validateGenre)], async (req, res) => {
  // you should never ever trust what client send
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let name = req.body.name;
  let genre = new Genre({ name: name });
  genre = await genre.save();

  res.send(genre);
});

// get a single genre
router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with given ID was not found.");
  res.send(genre);
});

// update a genre
router.put(
  "/:id",
  [validateObjectId, auth, validate(validateGenre)],
  async (req, res) => {
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      {
        new: true,
      }
    );
    if (!genre)
      return res.status(404).send("The genre with given ID was not found.");
    res.send(genre);
    // } catch (ex) {
    //   res.send(ex.message);
    // }
  }
);

// Delete genre for admin Only
router.delete("/:id", [validateObjectId, auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with given ID was not found.");
  res.send(genre).status(204);
});

module.exports = router;
