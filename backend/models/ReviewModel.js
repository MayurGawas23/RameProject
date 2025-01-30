const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  article: { type: String, ref: "Article", required: true },
  reviewer: { type:String, ref: "User", required: true },
  comments: { type: String },
  decision: { type: String, enum: ["accept", "reject", "revise"], required: true },
});

ReviewModel = mongoose.model("Review", reviewSchema);
module.exports = ReviewModel
