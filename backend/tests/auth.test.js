import request from "supertest";
import app from "../src/app.js";
import User from "../src/modules/auth/auth.model.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../src/config/db.js";
import dotenv from "dotenv";

dotenv.config();

describe("Auth API", () => {
  let testUser;

  beforeAll(async () => {
    // Connect to test database
    try {
      await connectDB();
    } catch (error) {
      console.error("Database connection failed:", error);
    }
    // Clean up test database
    await User.deleteMany({});
  }, 30000);

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }, 30000);

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user.email).toBe("test@example.com");
      expect(res.body.user.role).toBe("user");
      testUser = res.body.user;
    });

    it("should not register user with missing fields", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test2@example.com",
      });

      expect(res.statusCode).toBe(400);
    });

    it("should not register duplicate email", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(409);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user.email).toBe("test@example.com");
    });

    it("should not login with invalid email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "wrong@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(401);
    });

    it("should not login with invalid password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
    });

    it("should not login with missing fields", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
      });

      expect(res.statusCode).toBe(400);
    });
  });
});





