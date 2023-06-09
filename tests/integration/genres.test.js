const request = require("supertest");
const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");
let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
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

    it("should return 404 if Invalid ID or not found", async () => {
      const res = await request(server).get(`/api/genres/1`);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    it("should return status 401 if client not logged in", async () => {
      const res = await request(server)
        .post(`/api/genres`)
        .send({ name: "genre1" });
      // console.log(res);
      expect(res.status).toBe(401);
    });

    it("should return status 400 if genre less than 5 characters", async () => {
      let token = new User().generateAuthToken();

      const res = await request(server)
        .post(`/api/genres`)
        .set("x-auth-token", token)
        .send({ name: "a" });

      expect(res.status).toBe(400);
    });

    it("should return status 400 if genre more than 50 characters.", async () => {
      let token = new User().generateAuthToken();
      const name = new Array(52).join("a");
      const res = await request(server)
        .post(`/api/genres`)
        .set("x-auth-token", token)
        .send({ name: name });

      expect(res.status).toBe(400);
    });

    it("should save genre to databse.", async () => {
      let token = new User().generateAuthToken();

      const res = await request(server)
        .post(`/api/genres`)
        .set("x-auth-token", token)
        .send({ name: "genre1" });

      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });

    it("should return genre in body", async () => {
      let token = new User().generateAuthToken();
      const res = await request(server)
        .post(`/api/genres`)
        .set("x-auth-token", token)
        .send({ name: "genre1" });

      expect(res.body).toHaveProperty("name", "genre1");
      expect(res.body).toHaveProperty("_id");
    });
  });
});
