import { html } from "../dist/index.js";

export const style = html`<style nonce="{{NONCE}}">
  html,
  body {
    height: 100%;
    margin: 0;
    padding: 0;
    background: #181a20;
    color: #e5e5e5;
    font-family:
      "JetBrains Mono", "Fira Mono", "Menlo", "Monaco", "Consolas", monospace;
    font-size: 18px;
    letter-spacing: 0.01em;
    min-height: 100vh;
    box-sizing: border-box;
  }
  body {
    display: flex;
    padding: 3rem 0;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100vh;
    min-width: 300px;
    max-width: 800px;
    width: 70%;
    margin: 0 auto;
  }
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5em 0;
    letter-spacing: 0.03em;
    color: #7df9aa;
  }
  h2 {
    font-size: 1.2rem;
    font-weight: 400;
    margin: 0 0 1.5em 0;
    color: #a0a0a0;
    letter-spacing: 0.02em;
  }
  p {
    max-width: 500px;
    margin: 0 0 1em 0;
    line-height: 1.6;
    color: #c0c0c0;
  }
  a.link {
    color: #7df9aa;
    text-decoration: none;
    border-bottom: 1px dashed #7df9aa;
    transition: border 0.2s;
  }
  a.link:hover {
    border-bottom: 1px solid #7df9aa;
  }
  a.normal-link {
    color: inherit;
    text-decoration: none;
  }
  a.link-no-underline {
    color: #7df9aa;
    text-decoration: none;
  }
  ::selection {
    background: #7df9aa33;
  }
  .left-align {
    text-align: left;
    width: 100%;
  }
  .strong {
    font-weight: 700;
  }
  hr {
    width: 100%;
    border: 0;
    border-top: 1px solid #c0c0c0;
  }
  .cool-card {
    border-radius: 0.5rem;
    transition: 0.2s;
    padding: 0.5rem;
  }
  .cool-card:hover {
    scale: 1.01;
    background: rgba(255, 255, 255, 0.05);
  }
  .cool-card:active {
    scale: 0.99;
  }
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>`;
