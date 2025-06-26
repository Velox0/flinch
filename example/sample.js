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
        <h2>What is Flinch</h2>
        <p>
          Flinch is a library for rendering HTML templates with a nonce. It is a
          simple library that allows you to render HTML templates with a nonce.
        </p>
        <p>
          It is a simple library that allows you to render HTML templates with a
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
