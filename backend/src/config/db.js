import mongoose from "mongoose";

const connectDB = async (retries = 5, delay = 5000) => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in .env file");
  }

  // If already connected, return the connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        // Connection options for better error handling
        serverSelectionTimeoutMS: 30000, // Timeout after 30s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        // Retry options
        retryWrites: true,
        w: 'majority',
      });
      console.log(`✅ MongoDB connected Successfully: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      const attempt = i + 1;
      console.error(`\n❌ MongoDB connection attempt ${attempt}/${retries} failed:`, err.message);
      
      if (i < retries - 1) {
        console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error("\n⚠️  Common fixes:");
        console.error("1. Whitelist your IP address in MongoDB Atlas");
        console.error("   → Go to: https://cloud.mongodb.com/ → Network Access");
        console.error("   → Click 'Add IP Address' → Choose 'Allow Access from Anywhere' (0.0.0.0/0)");
        console.error("2. Check your connection string in .env file");
        console.error("3. Verify your MongoDB Atlas username and password");
        console.error("4. Ensure your network allows MongoDB Atlas connections");
        console.error("5. Try updating Node.js to the latest LTS version");
        console.error("\n💡 Run 'node test-connection.js' for detailed diagnostics\n");
        throw err;
      }
    }
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected. Attempting to reconnect...');
  connectDB().catch(err => {
    console.error('Failed to reconnect to MongoDB:', err.message);
  });
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

export default connectDB;

