import dotenv from "dotenv";
import mongoose from "mongoose";
import Sweet from "./src/modules/sweets/sweets.model.js";
import connectDB from "./src/config/db.js";

dotenv.config();

// Using Unsplash and other free image sources for product images
// Note: Replace these with actual product images for production
const sampleProducts = [
  // SWEETS (15 items)
  {
    name: "Gulab Jamun",
    category: "Sweets",
    price: 45,
    quantity: 50,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop&q=80"
  },
  {
    name: "Rasgulla",
    category: "Sweets",
    price: 40,
    quantity: 60,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop&q=80"
  },
  {
    name: "Barfi",
    category: "Sweets",
    price: 50,
    quantity: 45,
    image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=400&fit=crop&q=80"
  },
  {
    name: "Ladoo",
    category: "Sweets",
    price: 35,
    quantity: 70,
    image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=400&fit=crop&q=80"
  },
  {
    name: "Jalebi",
    category: "Sweets",
    price: 55,
    quantity: 40,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop&q=80"
  },
  {
    name: "Kaju Katli",
    category: "Sweets",
    price: 80,
    quantity: 30,
    image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=400&fit=crop&q=80"
  },
  {
    name: "Besan Ladoo",
    category: "Sweets",
    price: 42,
    quantity: 55,
    image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=400&fit=crop"
  },
  {
    name: "Rasmalai",
    category: "Sweets",
    price: 65,
    quantity: 35,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop"
  },
  {
    name: "Kheer",
    category: "Sweets",
    price: 60,
    quantity: 25,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop"
  },
  {
    name: "Gajar Halwa",
    category: "Sweets",
    price: 70,
    quantity: 30,
    image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=400&fit=crop"
  },
  {
    name: "Soan Papdi",
    category: "Sweets",
    price: 38,
    quantity: 65,
    image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=400&fit=crop"
  },
  {
    name: "Peda",
    category: "Sweets",
    price: 48,
    quantity: 50,
    image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=400&fit=crop"
  },
  {
    name: "Motichoor Ladoo",
    category: "Sweets",
    price: 40,
    quantity: 60,
    image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=400&fit=crop"
  },
  {
    name: "Mysore Pak",
    category: "Sweets",
    price: 55,
    quantity: 40,
    image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=400&fit=crop"
  },
  {
    name: "Badam Halwa",
    category: "Sweets",
    price: 85,
    quantity: 25,
    image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=400&fit=crop"
  },

  // CHOCOLATES (12 items)
  {
    name: "Cadbury Dairy Milk",
    category: "Chocolates",
    price: 50,
    quantity: 100,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4bdc9c2a?w=400&h=400&fit=crop"
  },
  {
    name: "Amul Dark Chocolate",
    category: "Chocolates",
    price: 60,
    quantity: 80,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4bdc9c2a?w=400&h=400&fit=crop"
  },
  {
    name: "Ferrero Rocher",
    category: "Chocolates",
    price: 350,
    quantity: 25,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4bdc9c2a?w=400&h=400&fit=crop"
  },
  {
    name: "KitKat",
    category: "Chocolates",
    price: 20,
    quantity: 150,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4bdc9c2a?w=400&h=400&fit=crop"
  },
  {
    name: "Snickers",
    category: "Chocolates",
    price: 45,
    quantity: 90,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4bdc9c2a?w=400&h=400&fit=crop"
  },
  {
    name: "Twix",
    category: "Chocolates",
    price: 40,
    quantity: 85,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4bdc9c2a?w=400&h=400&fit=crop"
  },
  {
    name: "Mars",
    category: "Chocolates",
    price: 42,
    quantity: 80,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4bdc9c2a?w=400&h=400&fit=crop"
  },
  {
    name: "5 Star",
    category: "Chocolates",
    price: 35,
    quantity: 95,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4bdc9c2a?w=400&h=400&fit=crop"
  },
  {
    name: "Perk",
    category: "Chocolates",
    price: 30,
    quantity: 100,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4bdc9c2a?w=400&h=400&fit=crop"
  },
  {
    name: "Milky Bar",
    category: "Chocolates",
    price: 25,
    quantity: 110,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4bdc9c2a?w=400&h=400&fit=crop"
  },
  {
    name: "Toblerone",
    category: "Chocolates",
    price: 280,
    quantity: 30,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4bdc9c2a?w=400&h=400&fit=crop"
  },
  {
    name: "Lindt Chocolate",
    category: "Chocolates",
    price: 320,
    quantity: 20,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4bdc9c2a?w=400&h=400&fit=crop"
  },

  // ICE CREAMS (10 items)
  {
    name: "Kulfi",
    category: "Ice Creams",
    price: 30,
    quantity: 60,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop"
  },
  {
    name: "Vanilla Ice Cream",
    category: "Ice Creams",
    price: 80,
    quantity: 40,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop"
  },
  {
    name: "Chocolate Ice Cream",
    category: "Ice Creams",
    price: 85,
    quantity: 45,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop"
  },
  {
    name: "Strawberry Ice Cream",
    category: "Ice Creams",
    price: 90,
    quantity: 35,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop"
  },
  {
    name: "Butterscotch Ice Cream",
    category: "Ice Creams",
    price: 95,
    quantity: 30,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop"
  },
  {
    name: "Mango Ice Cream",
    category: "Ice Creams",
    price: 88,
    quantity: 38,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop"
  },
  {
    name: "Pista Ice Cream",
    category: "Ice Creams",
    price: 92,
    quantity: 32,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop"
  },
  {
    name: "Black Currant Ice Cream",
    category: "Ice Creams",
    price: 87,
    quantity: 40,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop"
  },
  {
    name: "Tutti Frutti Ice Cream",
    category: "Ice Creams",
    price: 90,
    quantity: 35,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop"
  },
  {
    name: "Cookies & Cream",
    category: "Ice Creams",
    price: 100,
    quantity: 28,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop"
  },

  // SHAKES (8 items)
  {
    name: "Chocolate Shake",
    category: "Shakes",
    price: 120,
    quantity: 50,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop"
  },
  {
    name: "Vanilla Shake",
    category: "Shakes",
    price: 110,
    quantity: 55,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop"
  },
  {
    name: "Strawberry Shake",
    category: "Shakes",
    price: 125,
    quantity: 45,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop"
  },
  {
    name: "Mango Shake",
    category: "Shakes",
    price: 115,
    quantity: 50,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop"
  },
  {
    name: "Banana Shake",
    category: "Shakes",
    price: 105,
    quantity: 60,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop"
  },
  {
    name: "Oreo Shake",
    category: "Shakes",
    price: 130,
    quantity: 40,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop"
  },
  {
    name: "Butterscotch Shake",
    category: "Shakes",
    price: 120,
    quantity: 48,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop"
  },
  {
    name: "Pista Shake",
    category: "Shakes",
    price: 135,
    quantity: 35,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop"
  },

  // CAKES (10 items)
  {
    name: "Chocolate Cake",
    category: "Cakes",
    price: 450,
    quantity: 15,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop"
  },
  {
    name: "Vanilla Cake",
    category: "Cakes",
    price: 420,
    quantity: 18,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop"
  },
  {
    name: "Strawberry Cake",
    category: "Cakes",
    price: 480,
    quantity: 12,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop"
  },
  {
    name: "Red Velvet Cake",
    category: "Cakes",
    price: 550,
    quantity: 10,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop"
  },
  {
    name: "Black Forest Cake",
    category: "Cakes",
    price: 520,
    quantity: 12,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop"
  },
  {
    name: "Butterscotch Cake",
    category: "Cakes",
    price: 460,
    quantity: 14,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop"
  },
  {
    name: "Pineapple Cake",
    category: "Cakes",
    price: 440,
    quantity: 16,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop"
  },
  {
    name: "Fruit Cake",
    category: "Cakes",
    price: 500,
    quantity: 13,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop"
  },
  {
    name: "Coffee Cake",
    category: "Cakes",
    price: 480,
    quantity: 11,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop"
  },
  {
    name: "Truffle Cake",
    category: "Cakes",
    price: 600,
    quantity: 8,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop"
  },

  // COOKIES (5 items)
  {
    name: "Chocolate Chip Cookies",
    category: "Cookies",
    price: 180,
    quantity: 40,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop"
  },
  {
    name: "Butter Cookies",
    category: "Cookies",
    price: 150,
    quantity: 50,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop"
  },
  {
    name: "Oreo Cookies",
    category: "Cookies",
    price: 200,
    quantity: 45,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop"
  },
  {
    name: "Almond Cookies",
    category: "Cookies",
    price: 220,
    quantity: 35,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop"
  },
  {
    name: "Coconut Cookies",
    category: "Cookies",
    price: 160,
    quantity: 42,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop"
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    // Wait a moment for connection to stabilize
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Clear existing products
    await Sweet.deleteMany({});
    console.log("Cleared existing products");

    // Insert sample products
    await Sweet.insertMany(sampleProducts);
    console.log(`✅ Successfully seeded ${sampleProducts.length} products!`);
    console.log("\nProducts by category:");
    const categories = {};
    sampleProducts.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product.name);
    });
    Object.keys(categories).forEach(cat => {
      console.log(`\n${cat} (${categories[cat].length} items):`);
      categories[cat].forEach((name, idx) => {
        const product = sampleProducts.find(p => p.name === name);
        console.log(`  ${idx + 1}. ${name} - ₹${product.price}`);
      });
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error.message);
    if (error.message.includes("SSL") || error.message.includes("TLS")) {
      console.error("\n⚠️  SSL/TLS Error detected. This might be due to:");
      console.error("1. Network/firewall blocking SSL connections");
      console.error("2. Node.js version compatibility issues");
      console.error("3. MongoDB Atlas cluster configuration");
      console.error("\nTry:");
      console.error("- Update Node.js to latest LTS version");
      console.error("- Check your network/firewall settings");
      console.error("- Verify MongoDB Atlas cluster is running");
    }
    process.exit(1);
  }
};

seedDatabase();
