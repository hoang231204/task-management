const User = require('../model/user-model');
module.exports.index = async (req, res) => {
    try{
        const users = await User.find().select("username email fullName avatarUrl").lean();
        return res.status(200).json(users);
    }
    catch(err){
        return res.status(500).json({ message: 'Internal server error' });
    }
}