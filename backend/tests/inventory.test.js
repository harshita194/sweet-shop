import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app.js";
import mongoose from "mongoose";

describe("Inventory API", () => {
  let token;

  beforeAll(() => {
    token = jwt.sign(
      { id: "test-user-id" },
      process.env.JWT_SECRET
    );
  });
  
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should return inventory list", async () => {
    const res = await request(app)
      .get("/api/inventory")
      .set("Authorization", `Bearer ${token}`);
     
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should create a new inventory item", async () => {
    const fakeSweetId = new mongoose.Types.ObjectId(); 
    const res = await request(app)
      .post("/api/inventory")
      .set("Authorization", `Bearer ${token}`)
      .send({
        sweetId: fakeSweetId,
        quantity: 10,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.quantity).toBe(10);
    expect(res.body.sweet).toBe(fakeSweetId.toString());
  });

});

