import { config } from "dotenv";
import mongoose from "mongoose";

// load environment variables
config();

// connect to MongoDB
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("\x1b[37m\x1b[41mMISSING MONGODB URI\x1b[0m");
    console.log(
      "\x1b[32mEmail me at veloxzerror@gmail.com and I'll give you a URI\x1b[0m"
    );
  }
})();
