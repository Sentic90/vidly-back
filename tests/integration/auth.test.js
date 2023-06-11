const request = require("supertest");
const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");
let server;

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.remove({});
  });

  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  let token;
  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if no token provided.", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if invalid token provided.", async () => {
    token = "a";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if valid token provided.", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
