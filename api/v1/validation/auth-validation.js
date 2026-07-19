module.exports.register = (req,res,next) => {
    const { username, fullName, email, password } = req.body;
    if(!username || !fullName || !email || !password){
        return res.status(400).json({ message: 'Missing required fields' });
    }
    if(!/^[a-zA-Z0-9_]{3,30}$/.test(username)){
        return res.status(400).json({ message: 'Invalid username format' });
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if(password.length < 6){
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    next();
}
module.exports.login = (req,res,next) => {
    const { username, password } = req.body;
    if(!username || !password){
        return res.status(400).json({ message: 'Missing required fields' });
    }
    next();
}
module.exports.forgotPassword = (req,res,next) => {
    const { email } = req.body;
    if(!email){
        return res.status(400).json({ message: 'Missing required fields' });
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        return res.status(400).json({ message: 'Invalid email format' });
    }
    next();
}
module.exports.checkOtp = (req,res,next) => {
    const { email, otp } = req.body;
    if(!email || !otp){
        return res.status(400).json({ message: 'Missing required fields' });
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if(!/^\d{6}$/.test(otp)){
        return res.status(400).json({ message: 'Invalid OTP format' });
    }
    next();
}
module.exports.resetPassword = (req,res,next) => {
    const { password } = req.body;
    if(!password){
        return res.status(400).json({ message: 'Missing required fields' });
    }
    if(password.length < 6){
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    next();
}