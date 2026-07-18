const User = require('../model/user-model');
const Session = require('../model/session-model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
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