import { createHomePage, createLivePage } from "./components.js";
import { createF1Page, initializeF1Data } from "./f1Data.js";
import { createErrorPage } from "./utils.js";
import { article, getArticles } from "./article.js";

/**
 * Set up all routes
 */
export const setupRoutes = (app) => {
  // Redirect root to home page
  app.get("/", (req, res) => {
    res.redirect("/home/Flinch%20User");
  });

  // Home page with dynamic content
  app.get("/home/:name", (req, res) => {
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
      res
        .status(500)
        .send(
          createErrorPage(
            "Error loading blogs",
            "Possible MongoDB URI missing<br>Email me at veloxzerror@gmail.com and I'll give you a URI"
          )
        );
    }
  });

  // Individual blog post
  app.get("/blogs/:id", async (req, res) => {
    try {
      const articleContent = await article(req.params.id);
      res.send(articleContent.toString());
    } catch (error) {
      res.status(404).send(createErrorPage("Blog post not found", "404"));
    }
  });

  // Live elements demo
  app.get("/live", async (req, res) => {
    try {
      const page = await createLivePage();
      res.send(page.toString());
    } catch (error) {
      console.error(error);
      res.status(500).send(createErrorPage("Error loading live demo", "500"));
    }
  });

  // F1 live positions
  app.get("/f1", async (req, res) => {
    try {
      const page = await createF1Page();
      res.send(page.toString());
    } catch (error) {
      console.error(error);
      res.status(500).send(createErrorPage("Error loading F1 data", "500"));
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
};
