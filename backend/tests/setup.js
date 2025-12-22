// import dotenv from "dotenv";

// dotenv.config();

// import mongoose from "mongoose";

// afterAll(async () => {
//   await mongoose.connection.close();
// });


import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../src/config/db.js";

dotenv.config({ path: ".env.test" });

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});


