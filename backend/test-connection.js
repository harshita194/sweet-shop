import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const testConnection = async () => {
  console.log("Testing MongoDB Atlas connection...\n");
  console.log("Connection String (masked):", 
    process.env.MONGO_URI?.replace(/:[^:@]+@/, ":****@") || "Not found"
  );
  console.log("\n");

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log("✅ SUCCESS! MongoDB connected successfully!");
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Ready State: ${conn.connection.readyState}`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ CONNECTION FAILED!\n");
    console.error("Error:", error.message);
    console.error("\n📋 Troubleshooting Steps:\n");
    console.error("1. Check MongoDB Atlas Network Access:");
    console.error("   - Go to: https://cloud.mongodb.com/");
    console.error("   - Navigate to: Network Access");
    console.error("   - Click: 'Add IP Address'");
    console.error("   - Choose: 'Allow Access from Anywhere' (0.0.0.0/0) for development");
    console.error("   - OR: Add your current IP address");
    console.error("\n2. Verify your connection string in .env file");
    console.error("   - Check username and password");
    console.error("   - Ensure special characters in password are URL encoded");
    console.error("   - @ should be %40, # should be %23, etc.");
    console.error("\n3. Check your MongoDB Atlas cluster status");
    console.error("   - Ensure cluster is running");
    console.error("   - Check if there are any service alerts");
    console.error("\n4. Verify database user permissions");
    console.error("   - User should have read/write permissions");
    console.error("\n5. Test with MongoDB Compass or Atlas UI");
    console.error("   - Try connecting with MongoDB Compass using the same connection string");
    
    process.exit(1);
  }
};

testConnection();





