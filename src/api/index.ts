/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from 'mongoose';
import { envVars } from '../app/config/env';
import app from '../app';


// 1. Define a global cache to reuse the connection between requests
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  // If we have a connection, use it (Instant!)
  if (cached.conn) {
    return cached.conn;
  }

  // If we are already connecting, wait for that promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose buffering (fixes the timeout error)
      dbName: 'Digital-Wallet', // Force the correct DB name
    };

    console.log('⏳ [Vercel] Connecting to MongoDB...');
    
    cached.promise = mongoose.connect(envVars.DB_URL, opts).then((mongoose) => {
      console.log('✅ [Vercel] Connected to MongoDB');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// 2. The Main Handler
export default async function handler(req: any, res: any) {
  try {
    // FORCE the DB to connect before the app runs
    await connectToDatabase();
    
    // Once connected, run the Express app
    return app(req, res);
  } catch (error) {
    console.error("❌ [Vercel] DB Connection Error:", error);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error
    });
  }
}