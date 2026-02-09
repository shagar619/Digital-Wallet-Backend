/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { envVars } from "../app/config/env";
import app from "../app";

// Prevent re-connecting on every function execution
let isConnected = false;

export default async function handler(req: any, res: any) {
  try {
    if (!isConnected) {
      await mongoose.connect(envVars.DB_URL);
      isConnected = true;
      console.log("Connected to MongoDB (Vercel Function)");
    }

    return app(req, res);
  } catch (error: any) {
    console.error("API Function Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
