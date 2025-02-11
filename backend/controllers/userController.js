const UserModel = require('../models/UserModel');
const JournalModel = require('../models/JournalModel')
const userService = require('../utils/user.service')
const { validationResult } = require('express-validator')
// const blackListTokenModel = require('../models/blacklistToken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');





// module.exports.home = async (req, res) => {
//     const home = async (req, res) => {
//         try {

//             res.send('hello world from Home');
//         } catch (error) {
//             console.log(error);
//         }
//     }
// }

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, username, email, password , affiliation, mobno } = req.body;

    console.log("req body", req.body)

    const userExists = await UserModel.findOne({ email: email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await UserModel.hashPassword(password);

    const user = await userService.createUser({
        fullname: fullname || "null",
        username,
        email,
        password: hashedPassword,
        affiliation: affiliation || "null",
        mobno : mobno || "null"
    });

    const token = await user.generateAuthToken();

    // Set the token in an HTTP-only cookie
    res.cookie('auth_token', token, {
        httpOnly: true, // Prevents JavaScript access to the cookie (mitigates XSS attacks)
        secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
        sameSite: 'Strict', // Prevent CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days expiry
    });

    res.status(201).json({
        message: `User registered with username ${username}`,
        token
    });
}

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const user = await UserModel.findOne({ username }).select('+password');

    if (!user) {
        return res.status(404).json({ message: `Invalid Credentials` });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = await user.generateAuthToken();

    // Set the token in the cookie (same as in /register route)
    res.cookie('auth_token', token, {
        httpOnly: true, // Prevents JavaScript access to the cookie (XSS protection)
        secure: process.env.NODE_ENV === 'production', // Send cookie over HTTPS in production
        sameSite: 'Strict', // CSRF protection
        maxAge: 30 * 24 * 60 * 60 * 1000, // Set the cookie expiry to 30 days
    });

    res.status(200).json({
        userId: user._id.toString(),
        message: `User logged in with username ${username}`,
        token
    });
}
module.exports.getUserProfile = async (req, res, next) => {
try{
    const userData = req.user;
    console.log(userData)
    return res.status(200).json({userData});
}catch (error){
    console.log(`error from the user route ${error}`);
}
}

module.exports.logoutUser = async (req, res, next) => {
    // Clear the auth_token cookie
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });

    res.status(200).json({ message: 'Logged out' });
}


module.exports.submitJournal = async (req, res, next) =>{

}

// Fetch all users with the role of "reviewer"
module.exports.getAllReviewers = async (req, res) => {
    try {
      const reviewers = await UserModel.find({ role: "reviewer" }, { password: 0 }); // Exclude password field
  
      if (reviewers.length === 0) {
        return res.status(200).json({ message: "No reviewers found" });
      }
  
      res.status(200).json(reviewers);
    } catch (err) {
      console.error("Error fetching reviewers:", err);
      res.status(500).json({ error: "Failed to fetch reviewers" });
    }
  };
