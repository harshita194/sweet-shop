import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app.js";
import Sweet from "../src/modules/sweets/sweets.model.js";
import User from "../src/modules/auth/auth.model.js";

describe("Sweets API", () => {
  let userToken;
  let adminToken;
  let sweetId;

  beforeAll(async () => {
    await Sweet.deleteMany({});
    await User.deleteMany({});

    const user = await User.create({
      name: "User",
      email: "user@sweets.com",
      password: "hashed",
      role: "user",
    });

    const admin = await User.create({
      name: "Admin",
      email: "admin@sweets.com",
      password: "hashed",
      role: "admin",
    });

    userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
  });

  it("returns all sweets (public)", async () => {
    const res = await request(app).get("/api/sweets");
    expect(res.statusCode).toBe(200);
  });

  it("searches sweets by name", async () => {
    await Sweet.create({ name: "Ladoo", category: "Indian", price: 10, quantity: 5 });

    const res = await request(app).get("/api/sweets/search?name=Ladoo");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("creates sweet when authenticated", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Barfi", price: 20, category: "Indian", quantity: 10 });

    expect(res.statusCode).toBe(201);
    sweetId = res.body._id;
  });

  it("rejects sweet creation without auth", async () => {
    const res = await request(app).post("/api/sweets").send({
      name: "Fail",
      price: 10,
    });

    expect(res.statusCode).toBe(401);
  });

  it("deletes sweet only as admin", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("prevents deletion by non-admin", async () => {
    const sweet = await Sweet.create({
      name: "Cant Delete",
      price: 5,
      category: "Test",
      quantity: 1,
    });

    const res = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });
});
