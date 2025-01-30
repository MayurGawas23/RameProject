const express = require('express');
const router = express.Router();
const { body } = require("express-validator")
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')
const { getAllReviewers } = require("../controllers/userController");




// router.get('/', userController.home);


router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('username').isLength({ min: 3 }).withMessage("must be min 8 characters"),
    body('password').isLength({ min: 3 }).withMessage('password must be min 8 chars'),
],
    userController.registerUser
)



router.post('/login', [
    body('username').isLength({ min: 3 }).withMessage('Invalid username'),
    body('password').isLength({ min: 3 }).withMessage('Invalid password'),
],
     userController.loginUser
)

router.get('/profile', authMiddleware.authUser, userController.getUserProfile)
router.get('/logout', authMiddleware.authUser, userController.logoutUser)

router.get("/reviewers", authMiddleware.authUser,  getAllReviewers);

module.exports = router