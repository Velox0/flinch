# Flinch 🚀

[![npm version](https://img.shields.io/npm/v/@velox0/flinch.svg?style=flat-square&color=7df9aa)](https://www.npmjs.com/package/@velox0/flinch)
[![npm downloads](https://img.shields.io/npm/dm/@velox0/flinch.svg?style=flat-square)](https://www.npmjs.com/package/@velox0/flinch)
[![bundle size](https://img.shields.io/bundlephobia/min/@velox0/flinch?style=flat-square)](https://bundlephobia.com/package/@velox0/flinch)
[![license](https://img.shields.io/npm/l/@velox0/flinch.svg?style=flat-square)](https://github.com/velox0/flinch/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

A **lightweight, streaming-first component-based UI library** for building modern web applications with template literals. Perfect for server-side rendering, live updates, and creating dynamic HTML components.

## ✨ Features

- 🎯 **Template Literals**: Write HTML naturally with JavaScript
- ⚡ **Live Elements**: Auto-updating components with real-time data
- 🔄 **Streaming Support**: Server-side streaming for better performance
- 🏗️ **Component-Based**: Modular and reusable UI components
- 🚀 **Framework Agnostic**: Works with Express, Fastify, or any Node.js server
- 📦 **Tiny Bundle**: Only ~2.5KB minified and gzipped
- 🔧 **TypeScript Ready**: Full TypeScript support with type definitions

## 📦 Installation

```bash
npm install @velox0/flinch
```

## 🚀 Quick Start

### Basic HTML Template

```javascript
import { html } from "@velox0/flinch";

const user = { name: "John", age: 25 };

const template = html`
  <div class="user-card">
    <h2>Hello, ${user.name}!</h2>
    <p>You are ${user.age} years old.</p>
  </div>
`;

console.log(template.toString());
// Output: <div class="user-card"><h2>Hello, John!</h2><p>You are 25 years old.</p></div>
```

### Live Elements (Auto-updating)

```javascript
import { html, LiveElement } from "@velox0/flinch";

// Create a live element that updates every 2 seconds
const liveCounter = new LiveElement(
  "div",
  { class: "counter", id: "live-counter" },
  { initial: "Loading..." },
  "/api/counter",
  2000,
  (data) => `Count: ${JSON.parse(data).count}`,
  false,
  true,
  "text"
);

const page = html`
  <!DOCTYPE html>
  <html>
    <head>
      <title>Live Counter</title>
    </head>
    <body>
      <h1>Live Counter Demo</h1>
      ${liveCounter.render()}
    </body>
  </html>
`;
```

### Server-Side Streaming

```javascript
import { html, renderToStream } from "@velox0/flinch";
import express from "express";

const app = express();

app.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/html");

  const component = () => html`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Streaming Page</title>
      </head>
      <body>
        <h1>Streaming Content</h1>
        <p>This content is streamed to the client!</p>
        <div>${new Date().toISOString()}</div>
      </body>
    </html>
  `;

  renderToStream(component).pipe(res);
});

app.listen(3000);
```

## 📚 API Reference

### `html(strings, ...values)`

Creates an HTML template result with powerful manipulation methods.

```javascript
const result = html`<div>Hello ${name}</div>`;

// Methods available:
result.toString(); // Convert to string
result.updateStringAt(0, "<span>"); // Update specific string
result.updateValueAt(0, "World"); // Update specific value
result.updateMatches(/Hello/g, "Hi"); // Replace patterns
result.apply((str) => str.toUpperCase()); // Apply function to all strings
```

### `LiveElement`

Creates auto-updating HTML elements that fetch data from APIs.

```javascript
const liveElement = new LiveElement(
  tag, // HTML tag name
  props, // HTML attributes object
  state, // Initial state object
  requestUrl, // API endpoint URL
  interval, // Update interval in milliseconds
  renderData, // Data processing function
  innerHTML, // Use innerHTML instead of innerText
  makeInitialRequest, // Make initial request on load
  resType // Response type ('text', 'json', etc.)
);
```

### `renderToStream(component)`

Converts a component function to a Node.js readable stream.

```javascript
const stream = renderToStream(() => html`<div>Content</div>`);
stream.pipe(response);
```

## 🎯 Use Cases

### 1. **Server-Side Rendering**

Perfect for Express.js applications that need to serve dynamic HTML:

```javascript
app.get("/dashboard", async (req, res) => {
  const user = await getUser(req.userId);
  const template = html`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Dashboard</title>
      </head>
      <body>
        <h1>Welcome, ${user.name}!</h1>
        <div class="stats">
          <p>Posts: ${user.postCount}</p>
          <p>Followers: ${user.followerCount}</p>
        </div>
      </body>
    </html>
  `;

  res.send(template.toString());
});
```

### 2. **Real-time Dashboards**

Create live-updating dashboards with minimal JavaScript:

```javascript
const liveStats = new LiveElement(
  "div",
  { class: "stats-container" },
  { initial: "Loading stats..." },
  "/api/stats",
  5000,
  (data) => {
    const stats = JSON.parse(data);
    return `
      <div class="stat">
        <h3>Active Users</h3>
        <p>${stats.activeUsers}</p>
      </div>
    `;
  },
  true
);
```

### 3. **API Response Templates**

Generate consistent API responses:

```javascript
app.get("/api/users", async (req, res) => {
  const users = await getUsers();

  const response = html`
    <users>
      ${users.map(
        (user) => html`
          <user id="${user.id}">
            <name>${user.name}</name>
            <email>${user.email}</email>
          </user>
        `
      )}
    </users>
  `;

  res.setHeader("Content-Type", "application/xml");
  res.send(response.toString());
});
```

## 🔧 Advanced Features

### Template Manipulation

```javascript
const template = html`<div>Hello ${name}</div>`;

// Update specific parts
template.updateStringAt(0, '<span class="greeting">');
template.updateValueAt(0, "World");

// Apply transformations
template.apply((str) => str.replace(/div/g, "span"));

// Pattern matching
template.updateMatches(/Hello/g, "Hi", true);
```

### Component Composition

```javascript
const Button = (text, onClick) => html`
  <button onclick="${onClick}" class="btn">${text}</button>
`;

const Card = (title, content) => html`
  <div class="card">
    <h3>${title}</h3>
    <div class="content">${content}</div>
  </div>
`;

const page = html`
  <div class="app">
    ${Card("Welcome", "Hello World")} ${Button("Click me", 'alert("Hello!")')}
  </div>
`;
```

## 📊 Performance

- **Bundle Size**: ~2.5KB minified + gzipped
- **Zero Dependencies**: No external runtime dependencies
- **Streaming Ready**: Built-in support for Node.js streams
- **Memory Efficient**: Minimal memory footprint

## 🛠️ Development

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Running Examples

```bash
npm run example
```

Then visit: http://localhost:3000

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
