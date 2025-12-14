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
});

