const UserModel = require('../models/UserModel');


module.exports.createUser = async ({
    username,email,password
}) => {
    if(!username || !email || !password){
        throw new Error('All feilds are required')
    }
    const user = UserModel.create({
        username,
        email,
        password
    })

    return user;
}