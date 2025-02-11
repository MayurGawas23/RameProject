const UserModel = require('../models/UserModel');


module.exports.createUser = async ({
    username,email,password, fullname, mobno, affiliation
}) => {
    if(!username || !email || !password){
        throw new Error('All feilds are required')
    }
    const user = UserModel.create({
        fullname,
        mobno,
        affiliation,
        username,
        email,
        password,

    })

    return user;
}