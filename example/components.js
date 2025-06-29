import { html, LiveElement } from "../dist/index.js";
import { createHead, createNavigation } from "./utils.js";

/**
 * Main homepage component
 */
export const createHomePage = (name, isNewUser = false) => {
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
 * Live elements demo page for /live
 */
export const createLivePage = async () => {
  // Data handler function - processes the API response
  const handleData = async (data) => {
    const comments = JSON.parse(data);
    const randomComment = comments[Math.floor(Math.random() * comments.length)];
    el.innerHTML = `<div class="cool-card truncate">
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
