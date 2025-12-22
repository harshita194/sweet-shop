import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/modules/auth/auth.model.js";
import Inventory from "../src/modules/inventory/inventory.model.js";

describe("Inventory API", () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    await User.deleteMany({});

    const admin = await User.create({
      name: "Admin",
      email: "admin@inventory.com",
      password: "hashed",
      role: "admin",
    });

    const user = await User.create({
      name: "User",
      email: "user@inventory.com",
      password: "hashed",
      role: "user",
    });

    adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  });

  it("allows admin to view inventory", async () => {
    const res = await request(app)
      .get("/api/inventory")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("blocks inventory access without token", async () => {
    const res = await request(app).get("/api/inventory");
    expect(res.statusCode).toBe(401);
  });

  it("blocks inventory access for non-admin", async () => {
    const res = await request(app)
      .get("/api/inventory")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("creates inventory item as admin", async () => {
    const res = await request(app)
      .post("/api/inventory")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        sweetId: new mongoose.Types.ObjectId(),
        quantity: 10,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.quantity).toBe(10);
  });

  it("rejects inventory creation with missing fields", async () => {
    const res = await request(app)
      .post("/api/inventory")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(res.statusCode).toBe(400);
  });

  it("updates inventory item as admin", async () => {
    const sweetId = new mongoose.Types.ObjectId();

    await Inventory.create({
    sweet: sweetId,
    quantity: 10,
    });

    const res = await request(app)
      .post("/api/inventory")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        sweetId,
        quantity: 20,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.quantity).toBe(20);
    expect(res.body.sweet.toString()).toBe(sweetId.toString());
  });
});
