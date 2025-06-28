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

import { html, LiveElement } from "../dist/index.js";
import express from "express";
import crypto from "crypto";
import { style } from "./style.js";
import cookieParser from "cookie-parser";
import { article, getArticles } from "./article.js";

const app = express();
const PORT = 3000;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Simple session middleware using cookies
 */
const sessionMiddleware = (req, res, next) => {
  let sessionId = req.cookies.session;
  const isNewUser = !sessionId;

  if (isNewUser) {
    sessionId = crypto.randomBytes(16).toString("hex");
    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 1000 * 60 * 60, // 1 hour
    });
  }

  req.session = { id: sessionId, isNewUser };
  next();
};

/**
 * Create the HTML head section
 */
const createHead = (title) => html`
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    ${style}
  </head>
`;

const createBadge = (href, badge, text) =>
  html` <a href="${href}" class="normal-link">
    <span
      style="font-size: small; color: #666; background: #7df9aa;padding: 0.1rem 0.5rem; padding-left: 0;"
    >
      <span
        class="strong"
        style="background: #555; color: #fff; padding: 0.1rem 0.5rem;"
        >${badge}</span
      ><span style="padding-left: 0.5rem;">${text}</span></span
    >
  </a>`;

const createNavigation = html`
  ${createBadge("/blogs", "/", "blogs")} ${createBadge("/live", "/", "live")}
  <a href="https://github.com/velox0/flinch">
    <img
      style="vertical-align: middle"
      src="https://img.shields.io/npm/v/@velox0/flinch.svg?style=flat-square&color=7df9aa"
      alt="npm version"
    />
  </a>
`;

// ============================================================================
// PAGE COMPONENTS
// ============================================================================

/**
 * Main homepage component
 */
const createHomePage = (name, isNewUser = false) => {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      ${createHead("Flinch Demo - Home")}
      <body>
        <h1>Hello, ${name}! 👋</h1>
        ${isNewUser ? html`<p class="welcome">🎉 Welcome new user!</p>` : ""}

        <h2>
          What is
          <a class="link" href="https://github.com/velox0/flinch">Flinch</a>?
        </h2>
        <p>
          Flinch is a lightweight, component-like UI library for generating HTML
          using template literals. It's designed to be simple, minimal, and easy
          to integrate into modern JavaScript applications.
        </p>

        <h3>Key Features:</h3>
        <ul>
          <li>
            📝 <strong>Template Literals:</strong> Write HTML naturally with
            JavaScript
          </li>
          <li>⚡ <strong>Live Elements:</strong> Auto-updating components</li>
          <li>
            🔧 <strong>Server-Side Rendering:</strong> Perfect for Express apps
          </li>
          <li>
            🎯 <strong>Framework Agnostic:</strong> Works with any backend
          </li>
        </ul>

        <p>${createNavigation}</p>
      </body>
    </html>
  `;
};

/**
 * Live elements demo page
 */
const createLivePage = async () => {
  // Data handler function - processes the API response
  const handleData = async (data) => {
    const comments = JSON.parse(data);
    const randomComment = comments[Math.floor(Math.random() * comments.length)];
    return `<div class="cool-card truncate">
      <strong>${randomComment.name}</strong><br />
      <em>${randomComment.email}</em><br />
      ${randomComment.body}
    </div>`;
  };

  // Create a live element that fetches from JSONPlaceholder API
  const liveElement = new LiveElement(
    "div", // HTML tag
    {
      class: "live-container truncate",
      style: "height: 100px; margin: 10px; max-width: 100%;",
    }, // HTML attributes
    { initial: "<p class='cool-card'>🔄 Loading...</p>" }, // Initial state
    "https://jsonplaceholder.typicode.com/comments", // API URL
    2000, // Update interval (2 seconds)
    handleData, // Data processing function
    true, // Use innerHTML (allows HTML)
    false, // Don't make initial request
    "text" // Response type
  );

  return html`
    <!DOCTYPE html>
    <html lang="en">
      ${createHead("Flinch Demo - Live Elements")}
      <body>
        <p class="left-align">
          <a class="link-no-underline" href="/">← Back to Home</a>
        </p>

        <h1>⚡ Live Elements Demo</h1>
        <p>
          These elements automatically update every 2 seconds by fetching data
          from an API.
        </p>

        <h2>Live Comment Feed</h2>
        ${await liveElement.render()}

        <h2>Another Live Element (Cloned)</h2>
        ${await liveElement.clone().render()}

        <p>Check out <a class="link" href="/blogs">/blogs</a></p>
      </body>
    </html>
  `;
};

// ============================================================================
// ROUTES
// ============================================================================

// Set up middleware BEFORE routes
app.use(cookieParser());
app.use(sessionMiddleware);

// Redirect root to home page
app.get("/", (req, res) => {
  res.redirect("/home/Flinch%20User");
});

// Home page with dynamic content
app.get("/home/:name", (req, res) => {
  const nonce = crypto.randomBytes(16).toString("hex");
  const name = decodeURIComponent(req.params.name);

  let page = createHomePage(name, req.session.isNewUser);

  res.send(page.toString());
});

// Blog listing page
app.get("/blogs", async (req, res) => {
  try {
    const articles = await getArticles();
    res.send(articles.toString());
  } catch (error) {
    res.status(500).send("Error loading blogs");
  }
});

// Individual blog post
app.get("/blogs/:id", async (req, res) => {
  try {
    const articleContent = await article(req.params.id);
    res.send(articleContent.toString());
  } catch (error) {
    res.status(404).send("Blog post not found");
  }
});

// Live elements demo
app.get("/live", async (req, res) => {
  try {
    const page = await createLivePage();
    res.send(page.toString());
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading live demo");
  }
});

// API endpoint for testing
app.get("/api/data", async (req, res) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/comments/${Math.floor(Math.random() * 10) + 1}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

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
   • /api/data - Test API endpoint

💡 Try visiting: http://localhost:${PORT}/home/John%20Doe
  `);
});
