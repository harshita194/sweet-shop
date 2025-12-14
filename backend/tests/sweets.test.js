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
   
  it("should update inventory when sweet quantity is increased", async () => {
    const createRes = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Barfi",
        price: 40,
        category: "Indian",
        quantity: 0,
      });

    const sweetId = createRes.body._id;

    await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 5 });

    const inventoryRes = await request(app)
      .get("/api/inventory")
      .set("Authorization", `Bearer ${token}`);

    expect(inventoryRes.body.length).toBeGreaterThan(0);
  });
  
  it("should delete inventory when sweet is deleted", async () => {
    // create sweet
    const createRes = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Rasgulla",
        price: 30,
        category: "Indian",
        quantity: 0,
      });

    const sweetId = createRes.body._id;

    // increase quantity → creates inventory
    await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ quantity: 5 });

    // delete sweet
    await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${token}`);

    // inventory should be empty
    const inventoryRes = await request(app)
      .get("/api/inventory")
      .set("Authorization", `Bearer ${token}`);

    expect(inventoryRes.body.length).toBe(0);
  });


});

