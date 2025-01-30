const express = require('express');
const router = express.Router();
const { authUser, isAdmin } = require('../middlewares/authMiddleware');
const { getAllUsers, manageJournalSubmissions } = require('../controllers/editorController');

router.use(authUser);
router.use(isAdmin);

router.get('/users', getAllUsers);
router.get('/journals', manageJournalSubmissions);

module.exports = router;
