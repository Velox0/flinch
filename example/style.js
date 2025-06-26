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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 0 1.5rem;
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
  a {
    color: #7df9aa;
    text-decoration: none;
    border-bottom: 1px dashed #7df9aa;
    transition: border 0.2s;
  }
  a:hover {
    border-bottom: 1px solid #7df9aa;
  }
  ::selection {
    background: #7df9aa33;
  }
</style>`;
