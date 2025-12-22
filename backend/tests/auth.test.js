import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../src/app.js";
import User from "../src/modules/auth/auth.model.js";

describe("Auth API", () => {
  beforeAll(async () => {
    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash("password123", 10);
    await User.create({
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
      role: "user",
    });
  });

  describe("POST /api/auth/register", () => {
    it("registers a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "New User",
        email: "new@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.user.email).toBe("new@example.com");
    });

    it("rejects duplicate email", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Duplicate",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(409);
    });

    it("rejects missing fields", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "missing@example.com",
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("logs in with valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("rejects invalid password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrong",
      });

      expect(res.statusCode).toBe(401);
    });

    it("rejects missing fields", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
      });

      expect(res.statusCode).toBe(400);
    });
  });
});
