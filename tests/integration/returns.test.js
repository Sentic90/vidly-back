const request = require("supertest");
const { Rental } = require("../../models/rental");
const mongoose = require("mongoose");
const { User } = require("../../models/user");
const { Movie } = require("../../models/movie");

describe("/api/returns ", () => {
  let server;
  let token;
  let rental;
  let movie;
  let customerId;
  let movieId;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index");
    token = new User().generateAuthToken();
    customerId = mongoose.Types.ObjectId();

    // Movie Object
    movie = new Movie({
      title: "12345",
      dailyRentalRate: 2,
      numberInStock: 10,
      genre: { name: "genre1" },
    });
    await movie.save();
    movieId = movie._id;
    // Rental Object
    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.remove({});
    await Movie.remove({});
  });

  it("should return 401 UNAUTHORIZED if not logged in", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 BAD_REQUEST customerId  not provided", async () => {
    customerId = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 BAD_REQUEST movieId  not provided", async () => {
    movieId = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 404 NOT_FOUND if no rental founded.", async () => {
    await Rental.remove({});
    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("should return 400 BAD_REQUEST return already proccessed.", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 SUCESS if returned proccessed.", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should set the returnedDate if input is valid.", async () => {
    await exec();
    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;

    // different less than 10 seconds;
    expect(diff).toBeLessThan(10 * 1000);
  });

  it("should calculate the the rentalFee .", async () => {
    (rental.dateOut = new Date("2023", "5", "5")), await rental.save();
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);

    const diff = rentalInDb.dateReturned - rentalInDb.dateOut;
    const rentalFee =
      Math.round(diff / 1000 / 60 / 60 / 24) * rental.movie.dailyRentalRate;
    expect(res.body.rentalFee).toBe(rentalFee);
  });
  it("should increase the stock of returned movie.", async () => {
    await exec();
    const movieInDb = await Movie.findById(movieId);

    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });
});
