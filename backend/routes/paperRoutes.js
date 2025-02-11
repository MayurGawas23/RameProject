const PaperModel = require('../models/PaperModel')
const express = require("express");
const {
    submitPaper,
    getUserPapers,
    assignReviewers,
    getAllPapers,
    getReviewerPapers,
    submitReview,
    setFinalDecision
} = require("../controllers/paperController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Author submits an Paper
router.post("/submit", authMiddleware.authUser, submitPaper);

// Editor assigns reviewers
router.post("/assign-reviewers", authMiddleware.authUser, assignReviewers);

// Author fetches their submitted Paper
router.get("/user-papers", authMiddleware.authUser, getUserPapers);

// Reviewer fetches only assigned Paper
router.get("/reviewer-papers", authMiddleware.authUser, getReviewerPapers);

// Fetch all Paper (for admin or editor)
router.get("/papers", authMiddleware.authUser, getAllPapers);

// Reviewer submits a review
router.post("/submit-review", authMiddleware.authUser, submitReview);

router.post("/set-final-decision", authMiddleware.authUser, authMiddleware.checkEditor, setFinalDecision);  // Editor-only route for final decision


router.get("/assigned-papers", authMiddleware.authUser, async (req, res) => {
    try {
        const reviewer = req.user.username; // Or use email/ID depending on your auth

        // Fetch paper assigned to the logged-in reviewer
        const assignedPapers = await PaperModel.find({ reviewers: reviewer });

        if (!assignedPapers.length) {
            return res.status(404).json({ error: "No Paper assigned to you" });
        }

        res.status(200).json(assignedPapers);
    } catch (err) {
        console.error("Error fetching assigned Paper:", err);
        res.status(500).json({ error: "Failed to fetch assigned Paper" });
    }
});

router.get('/:paperId', async (req, res) => {
    const { paperId } = req.params;
  
    try {
      const paper = await PaperModel.findById(paperId); // Example for MongoDB
      if (!paper) {
        return res.status(404).json({ error: 'Paper not found' });
      }
      res.json(paper);
    } catch (err) {
        console.error('Error fetching Paper:', err);
        return res.status(500).json({ error: 'Failed to fetch Paper' });
      }
    })
  


module.exports = router;
