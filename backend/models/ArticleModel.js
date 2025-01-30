const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
//   author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// author:{type :String, require:true},
author:{
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
},
  status: { type: String, enum: ["submitted", "under_review", "accepted", "rejected"], default: "submitted" },
  reviewers: [{ type: String, ref: "User" }],
});

ArticleModel = mongoose.model("Article", articleSchema);
module.exports = ArticleModel
