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
        quantity: 0,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Ladoo");
  });
  
  it("should return all sweets", async () => {
  const res = await request(app).get("/api/sweets");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});

