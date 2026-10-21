import dns from "node:dns";
import mongoose from "mongoose";

// Fix Windows / local ISP DNS truncation on mongodb+srv SRV lookups
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore if restricted
}

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn("⚠️  MONGODB_URI is not defined in server/.env");
    return;
  }

  if (uri.includes("<db_password>")) {
    console.warn(
      "\n⚠️  [MongoDB Atlas Warning] Please replace '<db_password>' with your actual MongoDB Atlas password in 'server/.env' to connect successfully.\n"
    );
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} / ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error instanceof Error ? error.message : error);
    console.info("💡 Server is still running. You can update your MONGODB_URI in server/.env and restart.");
  }
}

