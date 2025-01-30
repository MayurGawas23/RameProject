const Review = require("../models/ReviewModel");
const Article = require("../models/ArticleModel");

exports.submitReview = async (req, res) => {
  try {
    // console.log("dj", req.user)
    // console.log(req.body)
    const { articleId, comments, decision } = req.body;
    const reviewer = req.user.username
    const review = new ReviewModel({ 
      article: articleId, 
      reviewer,
      comments, 
      decision 
    });
    await review.save();

    const article = await Article.findOne({title : articleId});
    if (decision === "accept") {
      article.status = "accepted";
    } else if (decision === "reject") {
      article.status = "rejected";
    } else {
      article.status = "revise";
    }
    await article.save();

    res.json({ message: "Review submitted successfully", review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
