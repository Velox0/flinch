import { html } from "../dist/index.js";
import { style } from "./style.js";

/**
 * Create the HTML head section
 */
export const createHead = (title) => html`
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    ${style}
  </head>
`;

/**
 * Create a badge with a link
 */
export const createBadge = (href, badge, text) =>
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

/**
 * Error page
 */
export const createErrorPage = (error, message) =>
  html`
    <!DOCTYPE html>
    <html lang="en">
      ${createHead("Error")}
      <body>
        <p class="left-align">
          <a class="link-no-underline left-align" href="/">← Back to Home</a>
        </p>
        <h1>${error}</h1>
        <h3>${message}</h3>
      </body>
    </html>
  `.toString();

export const createNavigation = html`
  ${createBadge("/blogs", "/", "blogs")} ${createBadge("/live", "/", "live")}
  ${createBadge("/f1", "/", "f1")}
  <a href="https://github.com/velox0/flinch">
    <img
      style="vertical-align: middle"
      src="https://img.shields.io/npm/v/@velox0/flinch.svg?style=flat-square&color=7df9aa"
      alt="npm version"
    />
  </a>
`;
