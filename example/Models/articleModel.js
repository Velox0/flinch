import mongoose from "mongoose";

export const articleModel = mongoose.model(
  "Article",
  new mongoose.Schema({
    title: String,
    content: String,
    author: String,
  })
);
