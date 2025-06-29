import crypto from "crypto";
import cookieParser from "cookie-parser";

/**
 * Simple session middleware using cookies
 */
export const sessionMiddleware = (req, res, next) => {
  let sessionId = req.cookies.session;
  const isNewUser = !sessionId;

  if (isNewUser) {
    sessionId = crypto.randomBytes(16).toString("hex");
    res.cookie("session", sessionId, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 1000 * 60 * 60, // 1 hour
    });
  }

  req.session = { id: sessionId, isNewUser };
  next();
};

/**
 * Set up all middleware
 */
export const setupMiddleware = (app) => {
  app.use(cookieParser());
  app.use(sessionMiddleware);
};
