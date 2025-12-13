import request from "supertest";
import app from "../src/app.js";

describe("Inventory API", () => {
  it("should return inventory list", async () => {
    const res = await request(app).get("/api/inventory");
    expect(res.statusCode).toBe(200);
  });
});

