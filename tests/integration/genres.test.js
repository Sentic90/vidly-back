const request = require("supertest");
const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");
const mongoose = require("mongoose");
let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Genre.remove({});
  });
  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.insertMany([{ name: "genre1" }, { name: "genre2" }]);
      const res = await request(server).get("/api/genres");
      // console.log(res);
      expect(res.status).toBe(200);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return status 200 & genre if valid Id passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get(`/api/genres/${genre._id}`);
      // console.log(res);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 400 if Invalid genre Id.", async () => {
      const res = await request(server).get(`/api/genres/1`);
      expect(res.status).toBe(400);
    });
    it("should return 404 if valid ID but not found", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get(`/api/genres/${id}`);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    // Mosh methods for refactoing ..!!
    // First we have to define the HappyPath & then start to
    //  Define the other BadPath
    let token;
    let name;

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });
    const exec = async () => {
      return await request(server)
        .post(`/api/genres`)
        .set("x-auth-token", token)
        .send({ name });
    };

    it("should return status 401 if client not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return status 400 if genre less than 5 characters", async () => {
      name = "1234";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return status 400 if genre more than 50 characters.", async () => {
      name = new Array(52).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save genre to databse.", async () => {
      await exec();

      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });

    it("should return genre in body", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("name", "genre1");
      expect(res.body).toHaveProperty("_id");
    });
  });

  describe("PUT /:id", () => {
    let newName;
    let token;
    let genre;
    let id;

    beforeEach(async () => {
      token = new User().generateAuthToken();
      newName = "genre1";
      genre = new Genre({ name: newName });
      id = genre._id;
      await genre.save();
    });

    const exec = () => {
      return request(server)
        .put(`/api/genres/${id}`)
        .set("x-auth-token", token)
        .send({ name: newName });
    };

    it("should return status 401 UN-AUTHORIZED if no token passed.", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return status 400 BAD_REQUEST if genre name less than 5 chars.", async () => {
      newName = "a";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return status 400 BAD_REQUEST if genre more than 50 chars.", async () => {
      newName = new Array(52).join("a");
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return the updated genre if it is valid & status 200 SUCCESS", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", newName);
    });

    it("should return status 400 BAD_REQUEST if genre Id invalid.", async () => {
      id = 1;
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return status 404 NOT_FOUND if genre Id not found.", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /:id", () => {
    let token;
    let genre;
    let id;

    beforeEach(async () => {
      token = new User({ isAdmin: true }).generateAuthToken();
      genre = new Genre({ name: "genreToDelete" });
      id = genre._id;
      await genre.save();
    });

    const exec = () => {
      return request(server)
        .delete(`/api/genres/${id}`)
        .set("x-auth-token", token);
    };

    it("should return 400 BAD REQUEST if invalid id passed.", async () => {
      id = "1";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 401 UNAUTHORIZED if no token provided.", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 403 if permission denied.", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();
      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("should return 404 if no genre with given id.", async () => {
      token = new User({ isAdmin: true }).generateAuthToken();
      id = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the genre if input is valid", async () => {
      await exec();

      const genreInDb = await Genre.findById(id);

      expect(genreInDb).toBeNull();
    });

    it("should return the removed genre", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id", genre._id.toHexString());
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });
});
