const User = require('../models/UserModel');
const Journal = require('../models/JournalModel');

// Fetch all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Manage journal submissions
const manageJournalSubmissions = async (req, res) => {
    try {
        const journals = await Journal.find();
        res.status(200).json(journals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const Getuser = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
        console.log(error);
    }
}

const deleteUser = async (req, res) => { 
    try {
        const _id = req.params.id;
        const checkAdmin= await UserModel.findById(_id);
        if(checkAdmin.role == 'admin') {
            return res.status(409).json({ message: 'you cannot delete self' });
        }
        const user = await UserModel.findByIdAndDelete(_id);
        if (!user) return res.status(404).json({ message: 'user notot found' });
        res.status(200).json({ message: 'user deleted successfully', user });
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" });
        console.log(error);
    }
}

module.exports = { getAllUsers, manageJournalSubmissions , Getuser , deleteUser };
