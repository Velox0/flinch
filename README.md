# Flinch

A minimal, component-like UI library for generating HTML using template literals. Flinch is designed for simplicity, flexibility, and easy integration into modern JavaScript/TypeScript applications—especially on the server side.

## Features

- Write HTML with template literals and dynamic values
- Manipulate and update template chunks (strings and values)
- Replace matches in strings (and optionally values) using regular expressions
- Iterate over all parts (strings and values) in order
- Render to string or stream (Node.js)
- Easily integrate with frameworks like Express
- Supports external styles and CSP nonces

## Installation

```
npm install @velox0/flinch
```

## API

### `html(strings: TemplateStringsArray, ...values: any[]): HtmlResult`

Processes a template literal and returns an object with methods for manipulation and iteration.

#### `HtmlResult` Interface

```ts
export interface HtmlResult {
  strings: string[];
  values: any[];
  updateStringAt(index: number, str: string): void;
  updateValueAt(index: number, value: any): void;
  updateMatches(
    pattern: RegExp,
    replacement: string,
    updateValue?: boolean,
    flatten?: boolean
  ): void;
  toString(): string;
  apply(fn: (val: any) => any, onlyStrings?: boolean): void;
  [Symbol.iterator](): Generator<string | unknown, void, unknown>;
}
```

### `renderToStream(component: () => any): Readable`

Render a Flinch component to a Node.js stream (for SSR or chunked responses).

## Usage Example

```js
import { html } from "@velox0/flinch";
import express from "express";
import crypto from "crypto";
import { style } from "./style.js"; // see below for style.js example

const app = express();
const title = "Flinch Test";

const script = (name) =>
  html`<script nonce="{{NONCE}}">
    console.log("${name}");
  </script>`;

const head = () =>
  html`<head>
    <meta
      http-equiv="Content-Security-Policy"
      content="script-src 'nonce-{{NONCE}}'"
    />
    <title>${title}</title>
    ${style}
  </head>`;

const page = (name) => {
  const scr = script(name);
  return html`<!DOCTYPE html>
    <html lang="en">
      ${head()}
      <body>
        <h1>Hello, ${name}</h1>
        <h2>What is Flinch</h2>
        <p>
          Flinch is a lightweight, component-like UI library for generating HTML
          using template literals. It's designed to be simple, minimal, and easy
          to integrate into modern JavaScript applications — especially on the
          server side.<br /><br />
          Flinch is currently under active development and is evolving rapidly.
          The goal is to provide a flexible and framework-agnostic way to
          structure HTML content without the complexity of full frontend
          frameworks. It encourages direct control over markup while offering
          tools like chunk manipulation, iteration, and rendering helpers.<br /><br />
          If you're looking for a straightforward way to build dynamic HTML in
          your backend or full-stack apps without committing to a full frontend
          framework, Flinch might be for you.
        </p>
        ${scr}
      </body>
    </html>`;
};

app.get("/", (req, res) => {
  res.redirect("/Flinch%20User");
});

app.get(":/name", (req, res) => {
  const nonce = crypto.randomBytes(16).toString("hex");
  const name = req.params.name;
  let rendered = page(name);
  rendered.updateMatches(/{{NONCE}}/, nonce, true);
  res.send(rendered.toString());
});

app.listen(3000, () =>
  console.log(
    `Server is running on port 3000\nTry: http://localhost:3000/Flinch%20User`
  )
);
```

## Using External Styles

You can define styles as Flinch components and inject them into your head. For example:

```js
// style.js
import { html } from "flinch-html";
export const style = html`<style nonce="{{NONCE}}">
  body {
    font-family: monospace;
    background: #181a20;
    color: #e5e5e5;
  }
  /* ... more styles ... */
</style>`;
```

## License

MIT
