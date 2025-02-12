const express = require('express');
const router = express.Router();
const { authUser, isAdmin } = require('../middlewares/authMiddleware');
const journalController = require('../controllers/journalController')
const {upload} = require('../utils/fileUpload')
const JournalModel = require('../models/JournalModel')


// Route to submit a journal (Logged-in users)

router.post('/journals/submit', authUser, journalController.submitJournal);

// Route to get all journals of the logged-in user
router.get('/my-journals', authUser, journalController.getMyJournals);

// Route to get all journals (Admin only)
router.get('/all-journals', authUser, journalController.getAllJournals);

// Route to update a journal by ID (Logged-in users)
// router.put('/update/:id', authUser, journalController.updateJournal);

// Route to delete a journal by ID (Admin only)
router.delete('/delete/:id', authUser, isAdmin, journalController.deleteJournal);

router.post('/upload-file', upload.single('file'), journalController.handleFileUpload)









router.post('/fetch-dois', journalController.fetchAndSaveDOIs);

router.get('/journals', journalController.getAllJournals);
router.get('/journals/:short_title', journalController.getJournalByISSN);
router.get('/journals/:short_title/volumes', journalController.getVolumesByISSN);
router.get('/journals/:short_title/volumes/:volumeNumber/issues', journalController.getIssuesByVolume);
router.get('/journals/:short_title/volumes/:volumeNumber/issues/:issueNumber/papers', journalController.getPapersByIssue);
router.get('/journals/:short_title/volumes/:volumeNumber/issues/:issueNumber/papers/:paperNumber', journalController.getPaper)

router.post('/journals/:short_title/volumes/:volumeNumber/issues/:issueNumber/papers', journalController.submitPaper);
router.post('/journals/:short_title/volumes/:volumeNumber/issues', journalController.createIssue);
router.post('/journals/:short_title/volumes', journalController.createVolume);

router.put('/journals/:short_title', journalController.updateJournal)




// router.post()
// router.get('/journals/:issn/editorialboard', journalController.getEditors)

// Fetch all journals
// router.get('/api/journals', async (req, res) => {
//     const journals = await Journal.find();
//     res.json(journals);
// });

// // Fetch volumes for a journal
// router.get('/api/volumes/:journalId', async (req, res) => {
//     const volumes = await Volume.find({ journal: req.params.journalId });
//     res.json(volumes);
// });

// // Fetch issues for a volume
// router.get('/api/issues/:volumeId', async (req, res) => {
//     const issues = await Issue.find({ volume: req.params.volumeId });
//     res.json(issues);
// });

// Submit a paper
// router.post('/api/papers', async (req, res) => {
//     const { journalId, volumeId, issueId, title, author, file } = req.body;
    
//     let volume = volumeId;
//     if (!volumeId) {
//         // Create new volume if not selected
//         const newVolume = new Volume({ journal: journalId });
//         await newVolume.save();
//         volume = newVolume._id;
//     }

//     let issue = issueId;
//     if (!issueId) {
//         // Create new issue if not selected
//         const newIssue = new Issue({ volume });
//         await newIssue.save();
//         issue = newIssue._id;
//     }

//     const newPaper = new Paper({ journal: journalId, volume, issue, title, author, file });
//     await newPaper.save();
//     res.json({ success: true, paper: newPaper });
// });

// Submit a paper
// router.post('/api/papers', async (req, res) => {
//     const { journalId, volumeId, issueId, title, author, file } = req.body;
    
//     let volume = volumeId;
//     if (!volumeId) {
//         // Create new volume if not selected
//         const newVolume = new Volume({ journal: journalId });
//         await newVolume.save();
//         volume = newVolume._id;
//     }

//     let issue = issueId;
//     if (!issueId) {
//         // Create new issue if not selected
//         const newIssue = new Issue({ volume });
//         await newIssue.save();
//         issue = newIssue._id;
//     }

//     const newPaper = new Paper({ journal: journalId, volume, issue, title, author, file });
//     await newPaper.save();
//     res.json({ success: true, paper: newPaper });
// });

router.get('/api/journals/:short_title/volumes/:volumeNumber/issues/:issueNumber/papers/:paperNumber', async (req, res) => {
    try {
      const { short_title, volumeNumber, issueNumber, paperNumber } = req.params;
  
      const journal = await Journal.findOne({ short_title });
      if (!journal) return res.status(404).json({ error: 'Journal not found' });
  
      const volume = journal.volumes.find(v => v.volumeNumber === parseInt(volumeNumber));
      if (!volume) return res.status(404).json({ error: 'Volume not found' });
  
      const issue = volume.issues.find(i => i.issueNumber === parseInt(issueNumber));
      if (!issue) return res.status(404).json({ error: 'Issue not found' });
  
      const paper = issue.papers.find(p => p.paperNumber === parseInt(paperNumber));
      if (!paper) return res.status(404).json({ error: 'Paper not found' });
  
      res.json(paper);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/latest-issues', async (req, res) => {
    try {
        // Fetch journals that have volumes
        const journals = await JournalModel.find({ volumes: { $exists: true, $ne: [] } }).lean();

        let latestIssues = [];

        journals.forEach((journal) => {
            if (!journal.journalTitle) return; // Skip if journalTitle is missing

            console.log(`Processing Journal: ${journal.journalTitle}`);

            // Sort volumes in descending order
            const sortedVolumes = [...journal.volumes].sort((a, b) => b.volumeNumber - a.volumeNumber);
            const latestVolume = sortedVolumes[0];

            if (!latestVolume || !latestVolume.issues || latestVolume.issues.length === 0) return;

            console.log(`Latest Volume: ${latestVolume.volumeNumber}`);

            // Sort issues in descending order
            const sortedIssues = [...latestVolume.issues].sort((a, b) => b.issueNumber - a.issueNumber);
            const latestIssue = sortedIssues[0];

            console.log(`Latest Issue: ${latestIssue.issueNumber}`);

            // Sort papers in descending order by `publicationDate`
            const sortedPapers = [...latestIssue.papers].sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate));
            const latestPaperTitle = sortedPapers.length > 0 ? sortedPapers[0].paperTitle : "No papers available";

            console.log(`Sorted Papers: ${sortedPapers.length}`);

            latestIssues.push({
                journalTitle: journal.journalTitle,
                journalCover: journal.coverImg || "default-cover.jpg",
                volumeNumber: latestVolume.volumeNumber,
                issueNumber: latestIssue.issueNumber,
                dateRange: latestVolume.fromToDate || "Unknown Date",
                coverImage: latestIssue.coverImage || "default-cover.jpg",
                latestPaperTitle: latestPaperTitle
            });
        });

        // Sort latestIssues by date range (descending)
        latestIssues.sort((a, b) => {
            if (a.dateRange === "Unknown Date" || b.dateRange === "Unknown Date") return 0;
            return new Date(b.dateRange.split(" - ")[1]) - new Date(a.dateRange.split(" - ")[1]);
        });

        console.log("Final Latest Issues Array:", latestIssues);

        res.json(latestIssues.slice(0, 2)); // Return only the latest 2 issues
    } catch (error) {
        console.error("Error fetching latest issues:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



  






module.exports = router;
