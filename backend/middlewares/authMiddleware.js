const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const blackListTokenModel = require('../models/blacklistToken');

module.exports.authUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    console.log("Authorization Header:", req.headers.authorization);
    console.log("Extracted Token:", token);

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        const isVerified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Payload:", isVerified);

        const userData = await UserModel.findOne({ email: isVerified.email });
        console.log("User Data from DB:", userData);

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = userData;
        req.token = token;
        req.userID = userData._id;
        // const userId = req.user._id;

        console.log("User ID:", userData._id);

        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({ message: 'Unauthorized 3', error: err.message });
    }
};



module.exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admin only' });
    }
};


