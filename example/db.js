import { config } from "dotenv";
import mongoose from "mongoose";

// load environment variables
config();

// connect to MongoDB
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
})();
