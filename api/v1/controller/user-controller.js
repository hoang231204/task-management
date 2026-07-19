const User = require('../model/user-model');
//GET /api/v1/users
module.exports.index = async (req, res) => {
    try{
        const users = await User.find().select("username fullName avatarUrl").lean();
        return res.status(200).json(users);
    }
    catch(err){
        return res.status(500).json({ message: 'Internal server error' });
    }
}
//GET /api/v1/users/detail/:id
module.exports.detail = async (req, res) =>{
    try{
        const userId = req.params.id;
        const user = await User.findOne({ _id: userId }).select("username fullName avatarUrl bio email phone").lean();
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    }
    catch(err){
        return res.status(500).json({ message: 'Internal server error' });
    }
}
//GET /api/v1/users/profile
module.exports.profile = async (req, res) =>{
    try{
        const userId = req.user._id;
        const user = await User.findOne({ _id: userId }).select("username fullName avatarUrl bio email phone").lean();
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    }
    catch(err){
        return res.status(500).json({ message: 'Internal server error' });
    }
}