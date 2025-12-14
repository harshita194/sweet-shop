import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app.js";

describe("Inventory API", () => {
  let token;

  beforeAll(() => {
    token = jwt.sign(
      { id: "test-user-id" },
      process.env.JWT_SECRET
    );
  });

  it("should return inventory list", async () => {
    const res = await request(app)
      .get("/api/inventory")
      .set("Authorization", `Bearer ${token}`);
     
    expect(res.statusCode).toBe(200);
  });

  it("should create a new inventory item", async () => {
  const res = await request(app)
    .post("/api/inventory")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Sugar",
      quantity: 10,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Sugar");
    expect(res.body.quantity).toBe(10);
  });
});

