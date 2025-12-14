import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app.js";

describe("Sweets API", () => {
  let token;

  beforeAll(() => {
    token = jwt.sign(
      { id: "test-user-id" },
      process.env.JWT_SECRET
    );
  });

  it("should create a sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Ladoo",
        price: 50,
        category: "Indian",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Ladoo");
  });
});

