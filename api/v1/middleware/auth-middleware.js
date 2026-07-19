const jwt = require('jsonwebtoken')
const User = require('../model/user-model')
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
module.exports.requireAuth = async (req, res, next) => {
    const token = req.cookies.token;
    if(token){
        try {
            const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.userId).select("-hashedPassword").lean();
            if(user){
                res.locals.user = user;
                next();
            }else{
                res.clearCookie('token');
                return res.status(401).json({ message: 'User not found' });
            }
        } catch (error) {
            res.clearCookie('token');
            return res.status(401).json({ message: 'Token invalid or expired' });
        }
    }else{
        if(req.cookies.refreshToken){
            return res.status(401).json({ message: 'Access token expired', code: 'TOKEN_EXPIRED' });
        }
        else{
            return res.status(401).json({ message: 'Authentication required' });
        }
    }
}