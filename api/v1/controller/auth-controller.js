const User = require('../model/user-model');
const Session = require('../model/session-model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const ForgotPassword = require('../model/forgot-password-model');
const sendEmail = require('../../../helpers/nodemailer');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const ACCESS_TOKEN_TTL = '15m'
const REFRESH_TOKEN_TTL = '14d'
//POST /api/v1/auth/register
module.exports.register = async (req, res) =>{
    try{
        const { username, fullName, email, password } = req.body;
        //KIỂM TRA TỒN TẠI
        const existingUser = await User.findOne({ username })
        if(existingUser){
            return res.status(400).json({ message: 'Username already exists' })
        }
        //MÃ HÓA MẬT KHẨU
        const hashedPassword = await bcrypt.hash(password, 10)
        //TẠO USER MỚI
        const newUser = new User({
            username: username,
            fullName: fullName,
            email: email,
            hashedPassword: hashedPassword
        })
        await newUser.save()
        res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message })
    }
}
//POST /api/v1/auth/login
module.exports.login = async (req, res) => {
    try{
        const { username, password } = req.body
        //KIỂM TRA TỒN TẠI
        const user = await User.findOne({ username: username })
        if(!user){
            return res.status(400).json({ message: 'Invalid username or password' })
        }
        //KIỂM TRA MẬT KHẨU
        const isMatch = await bcrypt.compare(password, user.hashedPassword)
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid username or password' })
        }
        //TẠO TOKEN
        const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL })
        const refreshToken = crypto.randomBytes(64).toString('hex')
        //LƯU TOKEN VÀO DB
        const session = new Session({
            userId: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        })
        await session.save()
        //RETURN KẾT QUẢ
        res.cookie('token', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 })
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 14 * 24 * 60 * 60 * 1000 })
        res.status(200).json({ message: 'Login successful' })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({ message: 'Error occurred while logging in' })
    }
}
//POST /api/v1/auth/refresh-token
module.exports.refreshToken = async (req, res) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;
        if (!oldRefreshToken) {
            res.status(401).json({ message: 'Refresh token not provided' });
            return;
        }
        //Tìm token trong DB
        const tokenRecord = await Session.findOne({ token: oldRefreshToken });
        if (!tokenRecord) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
        //Xoay vòng (Rotation): Xóa cái cũ, tạo cái mới
        await Session.deleteOne({ token: oldRefreshToken });
        const newAccessToken = jwt.sign({ userId: tokenRecord.userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
        const newRefreshToken = crypto.randomBytes(64).toString('hex');
        // Lưu mới vào DB
        await Session.create({
            userId: tokenRecord.userId,
            token: newRefreshToken,
            expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        });
        //Cập nhật Cookie
        res.cookie('token', newAccessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 14 * 24 * 60 * 60 * 1000 });
        return res.status(200).json({ message: 'Tokens refreshed successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Error occurred while refreshing tokens' });
    }
}
//POST /api/v1/auth/logout
module.exports.logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token not provided' });
        }
        //Xóa token khỏi DB
        await Session.deleteOne({ token: refreshToken });
        //Xóa cookie
        res.clearCookie('token');
        res.clearCookie('refreshToken');
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Error occurred while logging out' });
    }
}
//POST /api/v1/auth/password/forgot
module.exports.forgotPassword = async (req, res) => {
    try{
        const email = req.body.email;
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(400).json({ message: 'Email does not exist or account is inactive' });
        }
        const forgotPassword = new ForgotPassword({
            email: email,
            expireAt: Date.now()
        });
        await forgotPassword.save();
        res.status(200).json({ message: 'OTP has been sent to your email' });
        //Gửi email chứa mã OTP
        const subject = "Mã OTP đặt lại mật khẩu";
        const html = `<p>Mã OTP của bạn là: <b>${forgotPassword.otp}</b></p><p>Mã OTP có hiệu lực trong 3 phút.</p>`;
        sendEmail.send(email, subject, html);
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Error occurred while processing forgot password request' });
    }
}
//POST /api/v1/auth/password/check-otp
module.exports.checkOtp = async (req, res) => {
    try{
        const email = req.body.email;
        const otp = req.body.otp;
        const forgotPassword = await ForgotPassword.findOne({email: email, otp: otp});
        if(!forgotPassword){
            return res.status(400).json({ message: 'Invalid OTP or email' });
        }
        //Xóa bản ghi OTP sau khi xác thực thành công
        await ForgotPassword.deleteOne({ _id: forgotPassword._id });
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        await User.updateOne({ email: email }, {
            resetPasswordToken: hashedToken,
            resetPasswordExpires: Date.now() + 5 * 60 * 1000
        });
        res.cookie('resetToken', resetToken, { httpOnly: true, maxAge: 5 * 60 * 1000 });
        return res.status(200).json({ message: 'OTP verified successfully' });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Error occurred while checking OTP' });
    }
}
//POST /api/v1/auth/password/reset
module.exports.resetPassword = async (req, res) =>{
    const resetToken = req.cookies.resetToken;
    if(!resetToken){
        return res.status(400).json({ message: 'Reset token not provided' });
    }
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    try{
        const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });
        if(!user){
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }
        const newPassword = req.body.password;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.hashedPassword = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.clearCookie('resetToken');
        return res.status(200).json({ message: 'Password reset successfully' });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: 'Error occurred while resetting password' });
    }
}