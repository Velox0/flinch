import mongoose from "mongoose";

export const commentModel = mongoose.model(
  "Comment",
  new mongoose.Schema({
    article: mongoose.Schema.Types.ObjectId,
    content: String,
    author: String,
  })
);
