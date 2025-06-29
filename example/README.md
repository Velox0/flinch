# Flinch Demo Application - Modular Structure

This directory contains a refactored demo application showcasing Flinch's capabilities with a clean, modular architecture.

## File Structure

```
example/
├── main.js            # Main application entry point
├── middleware.js      # Express middleware setup
├── routes.js          # Route handlers
├── components.js      # UI components (pages)
├── utils.js           # Utility functions
├── f1Data.js          # F1 racing data functionality
├── article.js         # Blog/article functionality
├── style.js           # CSS styles
├── db.js              # Database connection
└── Models/            # Database models
    ├── articleModel.js
    └── commentModel.js
```

## Module Descriptions

### `main.js` - Main Application

- Entry point for the Express server
- Initializes F1 data
- Sets up middleware and routes
- Starts the server

### `middleware.js` - Express Middleware

- Session management with cookies
- Cookie parser setup
- Centralized middleware configuration

### `routes.js` - Route Handlers

- All Express route definitions
- Error handling for each route
- Organized by functionality (home, blogs, live, F1, API)

### `components.js` - UI Components

- `createHomePage()` - Main homepage component
- `createLivePage()` - Live elements demo page
- Reusable page components using Flinch's `html` function

### `utils.js` - Utility Functions

- `createHead()` - HTML head section generator
- `createBadge()` - Navigation badge component
- `createErrorPage()` - Error page template
- `createNavigation()` - Navigation component

### `f1Data.js` - F1 Racing Data

- F1 driver data initialization and caching
- Live F1 positions element
- F1 page component
- Color calculation utilities

### `article.js` - Blog Functionality

- Blog listing and individual post pages
- MongoDB integration
- Article data management

## Benefits of This Structure

1. **Separation of Concerns**: Each module has a specific responsibility
2. **Maintainability**: Easier to find and modify specific functionality
3. **Reusability**: Components can be easily reused across different routes
4. **Testability**: Individual modules can be tested in isolation
5. **Scalability**: Easy to add new features by creating new modules

## Running the Application

```bash
npm install
npm run build
node example/sample.js
```

Then visit: http://localhost:3000

## Available Routes

- `/` - Redirects to home page
- `/home/:name` - Dynamic homepage with personalized greeting
- `/blogs` - Blog listing page
- `/blogs/:id` - Individual blog post
- `/live` - Live elements demo
- `/f1` - F1 live positions
- `/api/data` - Test API endpoint
