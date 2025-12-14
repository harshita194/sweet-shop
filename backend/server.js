import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start server and connect to database
const startServer = async () => {
  try {
    // Try to connect to database first
    await connectDB();
    console.log("✅ Database connection established\n");
  } catch (err) {
    console.error("⚠️  Database connection failed, but server will continue running.");
    console.error("   Database operations will not work until connection is established.");
    console.error("   Run 'node test-connection.js' to diagnose connection issues.\n");
  }

  // Start the server regardless of database connection status
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}\n`);
  });
};

startServer();


