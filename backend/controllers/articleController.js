const ArticleModel = require("../models/ArticleModel");

module.exports.submitArticle = async (req, res) => {
    const { title, content } = req.body;
  
    // Assuming req.user is populated by an authentication middleware
    const { username, email } = req.user;
  
    if ( !username || !email) {
      return res.status(400).json({ error: "User information is missing" });
    }
  
    try {
      const newArticle = new ArticleModel({
        title,
        content,
        author: {
       
          username,  // User's username from token
          email, // User's email from token
        },
      });
  
      await newArticle.save();
      res.status(201).json({ message: "Article submitted successfully", article: newArticle });
    } catch (err) {
      console.error("Error submitting article:", err);
      res.status(500).json({ error: "Failed to submit article" });
    }
  };

// Fetch articles submitted by the logged-in user
module.exports.getUserArticles = async (req, res) => {
    const userEmail = req.user?.email;
  
    if (!userEmail) {
      return res.status(400).json({ error: "User email is missing" });
    }
  
    console.log("Fetching articles for email:", userEmail);  // Log the email
  
    try {
      // Query articles based on email
      const articles = await ArticleModel.find({ "author.email": userEmail });
  
      console.log("Fetched articles:", articles); // Log the fetched articles
  
      if (articles.length === 0) {
        return res.status(200).json({ message: "No articles found" });
      }
  
      res.status(200).json(articles);
    } catch (err) {
      console.error("Error fetching articles:", err);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  };
  
  

  module.exports.assignReviewers = async (req, res) => {
    try {
      const { articletitle, reviewers } = req.body;
      console.log(articletitle)
      console.log(reviewers)
      
      // Find the article by ID
      const article = await ArticleModel.findOne({title : articletitle});
  
      // If article not found
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
  
      // Assign reviewers and change article status
      article.reviewers = reviewers; // directly store reviewer IDs in the article
      article.status = "under_review";  // set article status to 'under_review'
  
      // Save the updated article
      await article.save();
  
      // Send success response
      res.json({ message: "Reviewers assigned successfully", article });
    } catch (error) {
      // Handle any errors and send response
      res.status(400).json({ error: error.message });
    }
  };




// Fetch all articles
module.exports.getAllArticles = async (req, res) => {
  try {
    const articles = await ArticleModel.find();

    if (articles.length === 0) {
      return res.status(200).json({ message: "No articles found" });
    }

    res.status(200).json(articles);
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};



