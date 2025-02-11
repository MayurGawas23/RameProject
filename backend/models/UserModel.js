const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
     
    fullname:{
        type: String,
        // required: true,
    },

    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String,
        required: true,
        select: false,
    },

    affiliation:{
        type:String,
        
    },
    
    mobno:{
        type:String
    },

    role: {
        type: String,
        enum: ['author', 'admin', 'reviewer'],
        default: 'author'
    },


})

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({
        userId: this._id.toString(),
        email: this.email,
        role: this.role,
    }, process.env.JWT_SECRET, { expiresIn: '30d' });
    console.log("token from model", token);
    return token;

}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;