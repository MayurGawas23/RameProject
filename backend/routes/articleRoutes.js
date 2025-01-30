const express = require("express");
const { submitArticle, getUserArticles, assignReviewers, getAllArticles  } = require("../controllers/articleController");
const authMiddleware = require("../middlewares/authMiddleware")

const router = express.Router();

router.post("/submit", authMiddleware.authUser, submitArticle);
router.post("/assign-reviewers", assignReviewers);
router.get("/user-articles", authMiddleware.authUser, getUserArticles);
router.get("/articles", getAllArticles)

module.exports = router;
