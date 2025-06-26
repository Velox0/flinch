/*
  $ npm install
  $ npm run build
  $ node example/sample.js
*/

import { html } from "../dist/index.js";
import express from "express";
import crypto from "crypto";
import { style } from "./style.js";

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
        <h2>
          What is
          <a class="link" href="https://github.com/velox0/flinch">Flinch</a>
        </h2>
        <p>
          Flinch is a lightweight, component-like UI library for generating HTML
          using template literals. It's designed to be simple, minimal, and easy
          to integrate into modern JavaScript applications — especially on the
          server side.
          <br /><br />
          Flinch is currently under active development and is evolving rapidly.
          The goal is to provide a flexible and framework-agnostic way to
          structure HTML content without the complexity of full frontend
          frameworks. It encourages direct control over markup while offering
          tools like chunk manipulation, iteration, and rendering helpers.
          <br /><br />
          If you're looking for a straightforward way to build dynamic HTML in
          your backend or full-stack apps without committing to a full frontend
          framework, Flinch might be for you.
        </p>
        <p>
          <a href="https://github.com/velox0/flinch">
            <img
              style="vertical-align: middle"
              src="https://img.shields.io/npm/v/@velox0/flinch.svg?style=flat-square&color=7df9aa"
              alt="npm version"
            />
          </a>
        </p>
        ${scr}
      </body>
    </html>`;
};

app.get("/", (req, res) => {
  res.redirect("/Flinch%20User");
});

app.get("/:name", (req, res) => {
  const nonce = crypto.randomBytes(16).toString("hex");

  const name = req.params.name;
  let rendered = page(name);

  rendered.updateMatches(/{{NONCE}}/, nonce, true);

  res.send(rendered.toString());
});

app.listen(3000, () =>
  console.log(`Server is running on port 3000
  Try: http://localhost:3000/Flinch%20User
  Try: http://localhost:3000/John%20Doe
  `)
);
