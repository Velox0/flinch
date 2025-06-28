import { html } from "../dist/index.js";
import { marked } from "marked";
import { style } from "./style.js";
import "./db.js";
import { articleModel } from "./Models/articleModel.js";
import { commentModel } from "./Models/commentModel.js";

async function writeArticle(title, content, author) {
  const article = new articleModel({
    title,
    content,
    author,
  });
  // if article with same title and author already exists, update it
  const existingArticle = await articleModel.findOne({
    title,
    author,
  });
  if (existingArticle) {
    existingArticle.content = content;
    await existingArticle.save();
    return existingArticle._id;
  } else {
    await article.save();
    return article._id;
  }
}

export async function writeComment(articleId, content, author) {
  const comment = new commentModel({
    article: articleId,
    content,
    author,
  });
  await comment.save();
}

export async function getArticle(id) {
  return await articleModel.findById(id);
}

export async function getArticles() {
  const fetched_articles = await articleModel.find({});
  const articlesHtml = fetched_articles.map((article) => {
    return html`<a class="normal-link" href="/blogs/${article._id}"
      ><div
        style="display: flex; gap: 0.1rem; flex-direction: column; overflow: hidden;"
        class="left-align cool-card"
      >
        <span class="strong">${article.title}</span>
        <span style="font-size: small; color: #666;">~ ${article.author}</span>
        <div
          class="truncate"
          style="font-size: small; color: #666; width: 100%;"
        >
          ${article.content.slice(0, 128)}
        </div>
      </div></a
    >`;
  });
  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Blogs</title>
        ${style}
      </head>
      <body>
        <div style="margin-bottom: 1rem;" class="left-align">
          <a class="link-no-underline" href="/">/</a>
        </div>
        <h1 class="left-align strong" style="color: #7df9aa;">/blogs</h1>
        <div
          style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%;"
        >
          ${articlesHtml.join("")}
        </div>
      </body>
    </html>`;
}

export async function article(id) {
  const article = await articleModel.findById(id);
  if (!article) {
    return html`<h1>Article not found</h1>`;
  }

  const comments = await commentModel.find({ article: id });

  const commentsHtml = comments
    .map((comment) => {
      return html`<div
        style="display: flex; gap: 0.1rem; flex-direction: column;"
      >
        <span style="font-size: small; color: #666;">~ ${comment.author}</span>
        <span style="padding-left: 0.5rem;"
          >${marked.parse(comment.content)}</span
        >
      </div>`;
    })
    .join("");

  const articleContent = await marked.parse(
    article.content.replaceAll(/-{3,}/g, "")
  );

  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${article.title}</title>
        ${style}
      </head>
      <body>
        <div style="margin-bottom: 1rem;" class="left-align">
          <a class="link-no-underline" href="/blogs">/blogs</a
          ><a class="link-no-underline" href="#"
            >/${article.title.replaceAll(/[\s,^,_,-,+,\.]/g, "")}</a
          >
        </div>
        <h1>${article.title}</h1>
        <div class="strong left-align" style="font-size: small; color: #666;">
          Author: ${article.author}
        </div>
        <div class="left-align" style="display: block; margin-top: 2rem;">
          ${articleContent}
        </div>
        <hr style="width: 100%; margin: 5rem 0 1rem 0" />
        <h2 class="left-align strong" style="color: #7df9aa;">Comments</h2>
        <div class="left-align">${commentsHtml}</div>
        <p>
          <a class="link" href="/blogs">Back to blog</a>
        </p>
      </body>
    </html>`;
}

export default {
  article,
  writeArticle,
  writeComment,
  getArticle,
};
