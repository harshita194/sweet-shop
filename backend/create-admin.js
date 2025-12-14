import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/modules/auth/auth.model.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    // Wait a moment for connection to stabilize
    await new Promise(resolve => setTimeout(resolve, 1000));

    const args = process.argv.slice(2);
    if (args.length < 3) {
      console.log("Usage: node create-admin.js <name> <email> <password>");
      console.log("Example: node create-admin.js Admin admin@example.com admin123");
      process.exit(1);
    }

    const [name, email, password] = args;

    // Check if admin already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.role === "admin") {
        console.log("❌ Admin user with this email already exists!");
        process.exit(1);
      } else {
        // Update existing user to admin
        existingUser.role = "admin";
        existingUser.password = await bcrypt.hash(password, 10);
        await existingUser.save();
        console.log(`✅ Updated user ${email} to admin role`);
        process.exit(0);
      }
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();

