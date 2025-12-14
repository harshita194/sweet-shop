import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app.js";
import mongoose from "mongoose";
import connectDB from "../src/config/db.js";
import User from "../src/modules/auth/auth.model.js";
import dotenv from "dotenv";

dotenv.config();

describe("Inventory API", () => {
  let token;
  let testUserId;

  beforeAll(async () => {
    // Connect to test database
    try {
      await connectDB();
    } catch (error) {
      console.error("Database connection failed:", error);
    }
    
    // Create test user
    const user = await User.create({
      name: "Test User",
      email: "inventorytest@example.com",
      password: "hashedpassword",
      role: "user",
    });
    testUserId = user._id;
    
    token = jwt.sign(
      { id: testUserId },
      process.env.JWT_SECRET
    );
  }, 30000);
  
  afterAll(async () => {
    await User.deleteMany({});
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }, 30000);

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

