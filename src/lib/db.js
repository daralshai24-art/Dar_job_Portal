// lib/db.js
import mongoose from "mongoose";

// Global variable to cache the database connection
// This prevents creating multiple connections in serverless environments
let isConnected = false;

/**
 * Connects to MongoDB database
 * Uses connection caching to avoid multiple connections
 */
export const connectDB = async () => {
  // If already connected, don't connect again
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    // Connect to MongoDB using the URI from environment variables
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      // These options help with connection stability
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Set connection status
    isConnected = db.connections[0].readyState === 1;
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to database");
  }
};

/**
 * Disconnects from MongoDB (useful for testing or cleanup)
 */
export const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log("Disconnected from MongoDB");
  }
};



