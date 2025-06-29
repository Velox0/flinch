/*
  Flinch Demo Application
  =======================

  This example demonstrates the key features of Flinch:
  - HTML template literals with the `html` function
  - Live elements that update automatically
  - Server-side rendering with Express

  To run:
  $ npm install
  $ npm run build
  $ node example/sample.js

  Then visit: http://localhost:3000
*/

import express from "express";
import { setupMiddleware } from "./middleware.js";
import { setupRoutes } from "./routes.js";
import { initializeF1Data } from "./f1Data.js";

const app = express();
const PORT = 3000;

// ============================================================================
// SERVER SETUP
// ============================================================================

// Initialize F1 data
await initializeF1Data();

// Set up middleware
setupMiddleware(app);

// Set up routes
setupRoutes(app);

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`
🚀 Flinch Demo Server Running!

📍 Local: http://localhost:${PORT}
🌐 Network: http://localhost:${PORT}/home/Your%20Name

📚 Available Routes:
   • /home/:name - Dynamic homepage
   • /blogs - Blog listing
   • /live - Live elements demo
   • /f1 - F1 live positions
   • /api/data - Test API endpoint

💡 Try visiting: http://localhost:${PORT}/home/John%20Doe
  `);
});
