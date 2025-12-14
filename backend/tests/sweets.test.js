import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app.js";
import Sweet from "../src/modules/sweets/sweets.model.js";
import User from "../src/modules/auth/auth.model.js";
import mongoose from "mongoose";
import connectDB from "../src/config/db.js";
import dotenv from "dotenv";

dotenv.config();

describe("Sweets API", () => {
  let token;
  let adminToken;
  let testSweetId;

  beforeAll(async () => {
    // Connect to test database
    try {
      await connectDB();
    } catch (error) {
      console.error("Database connection failed:", error);
    }

    // Clean up before tests
    await Sweet.deleteMany({});
    await User.deleteMany({});

    // Create test user
    const user = await User.create({
      name: "Test User",
      email: "testuser@example.com",
      password: "hashedpassword",
      role: "user",
    });

    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "hashedpassword",
      role: "admin",
    });

    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
  }, 30000); // Increase timeout to 30 seconds

  afterAll(async () => {
    await Sweet.deleteMany({});
    await User.deleteMany({});
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }, 30000);

  describe("GET /api/sweets", () => {
    it("should return all sweets (public)", async () => {
      const res = await request(app).get("/api/sweets");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/sweets/search", () => {
    beforeEach(async () => {
      await Sweet.deleteMany({});
      await Sweet.create([
        { name: "Ladoo", category: "Indian", price: 50, quantity: 10 },
        { name: "Barfi", category: "Indian", price: 40, quantity: 5 },
        { name: "Chocolate", category: "Western", price: 100, quantity: 20 },
      ]);
    });

    it("should search by name", async () => {
      const res = await request(app).get("/api/sweets/search?name=Ladoo");

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe("Ladoo");
    });

    it("should search by category", async () => {
      const res = await request(app).get("/api/sweets/search?category=Indian");

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it("should search by price range", async () => {
      const res = await request(app).get(
        "/api/sweets/search?minPrice=45&maxPrice=55"
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].price).toBe(50);
    });

    it("should combine multiple search parameters", async () => {
      const res = await request(app).get(
        "/api/sweets/search?category=Indian&minPrice=35&maxPrice=45"
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe("Barfi");
    });
  });

  describe("POST /api/sweets", () => {
    it("should create a sweet (authenticated)", async () => {
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Rasgulla",
          price: 30,
          category: "Indian",
          quantity: 15,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe("Rasgulla");
      testSweetId = res.body._id;
    });

    it("should not create sweet without authentication", async () => {
      const res = await request(app).post("/api/sweets").send({
        name: "Test Sweet",
        price: 20,
        category: "Test",
        quantity: 10,
      });

      expect(res.statusCode).toBe(401);
    });

    it("should not create sweet with missing fields", async () => {
      const res = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Incomplete Sweet",
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("PUT /api/sweets/:id", () => {
    it("should update a sweet (authenticated)", async () => {
      const res = await request(app)
        .put(`/api/sweets/${testSweetId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          price: 35,
          quantity: 20,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.price).toBe(35);
      expect(res.body.quantity).toBe(20);
    });

    it("should not update sweet without authentication", async () => {
      const res = await request(app)
        .put(`/api/sweets/${testSweetId}`)
        .send({
          price: 40,
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("DELETE /api/sweets/:id", () => {
    let deleteSweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: "To Delete",
        price: 10,
        category: "Test",
        quantity: 5,
      });
      deleteSweetId = sweet._id;
    });

    it("should delete a sweet (admin only)", async () => {
      const res = await request(app)
        .delete(`/api/sweets/${deleteSweetId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain("deleted");
    });

    it("should not delete sweet without admin role", async () => {
      const sweet = await Sweet.create({
        name: "To Delete 2",
        price: 10,
        category: "Test",
        quantity: 5,
      });

      const res = await request(app)
        .delete(`/api/sweets/${sweet._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(403);
    });

    it("should not delete sweet without authentication", async () => {
      const res = await request(app).delete(`/api/sweets/${deleteSweetId}`);

      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST /api/sweets/:id/purchase", () => {
    let purchaseSweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: "Purchase Test",
        price: 25,
        category: "Test",
        quantity: 10,
      });
      purchaseSweetId = sweet._id;
    });

    it("should purchase a sweet (decrease quantity)", async () => {
      const res = await request(app)
        .post(`/api/sweets/${purchaseSweetId}/purchase`)
        .set("Authorization", `Bearer ${token}`)
        .send({ quantity: 1 });

      expect(res.statusCode).toBe(200);
      expect(res.body.sweet.quantity).toBe(9);
    });

    it("should not purchase if insufficient stock", async () => {
      const sweet = await Sweet.create({
        name: "Low Stock",
        price: 25,
        category: "Test",
        quantity: 2,
      });

      const res = await request(app)
        .post(`/api/sweets/${sweet._id}/purchase`)
        .set("Authorization", `Bearer ${token}`)
        .send({ quantity: 5 });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain("Insufficient");
    });

    it("should not purchase without authentication", async () => {
      const res = await request(app)
        .post(`/api/sweets/${purchaseSweetId}/purchase`)
        .send({ quantity: 1 });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST /api/sweets/:id/restock", () => {
    let restockSweetId;

    beforeEach(async () => {
      const sweet = await Sweet.create({
        name: "Restock Test",
        price: 30,
        category: "Test",
        quantity: 5,
      });
      restockSweetId = sweet._id;
    });

    it("should restock a sweet (admin only)", async () => {
      const res = await request(app)
        .post(`/api/sweets/${restockSweetId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: 10 });

      expect(res.statusCode).toBe(200);
      expect(res.body.sweet.quantity).toBe(15);
    });

    it("should not restock without admin role", async () => {
      const res = await request(app)
        .post(`/api/sweets/${restockSweetId}/restock`)
        .set("Authorization", `Bearer ${token}`)
        .send({ quantity: 10 });

      expect(res.statusCode).toBe(403);
    });

    it("should not restock without authentication", async () => {
      const res = await request(app)
        .post(`/api/sweets/${restockSweetId}/restock`)
        .send({ quantity: 10 });

      expect(res.statusCode).toBe(401);
    });
  });
});
