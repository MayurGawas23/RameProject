const express = require('express');
const router = express.Router();
const { authUser, isAdmin } = require('../middlewares/authMiddleware');
const journalController = require('../controllers/journalController')
const {upload} = require('../utils/fileUpload')


// Route to submit a journal (Logged-in users)

router.post('/submit', authUser, journalController.submitJournal);

// Route to get all journals of the logged-in user
router.get('/my-journals', authUser, journalController.getMyJournals);

// Route to get all journals (Admin only)
router.get('/all-journals', authUser, journalController.getAllJournals);

// Route to update a journal by ID (Logged-in users)
router.put('/update/:id', authUser, journalController.updateJournal);

// Route to delete a journal by ID (Admin only)
router.delete('/delete/:id', authUser, isAdmin, journalController.deleteJournal);

router.post('/upload-image', upload.single('my_file'), journalController.handleImageUpload)









router.post('/fetch-dois', journalController.fetchAndSaveDOIs);

router.get('/journals', journalController.getAllJournals);
router.get('/journals/:issn', journalController.getJournalByISSN);
router.get('/journals/:issn/volumes', journalController.getVolumesByISSN);
router.get('/journals/:issn/volumes/:volumeNumber/issues', journalController.getIssuesByVolume);
router.get('/journals/:issn/volumes/:volumeNumber/issues/:issueNumber/papers', journalController.getPapersByIssue);


// router.post()
// router.get('/journals/:issn/editorialboard', journalController.getEditors)






module.exports = router;
